<script setup>
/** Vendor */
import { ref, computed, onMounted, watch } from "vue"
import { storeToRefs } from "pinia"
import BigNumber from "bignumber.js"

/** Constants */
import { ConnectionStatus } from "@/services/constants/wallets"

/** Components */
import TokenSelector from "@/components/TokenSelector.vue"
import Tooltip from "@/components/ui/Tooltip.vue"
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue";


/** Composables */
import { useTezos } from "@/composables/tezos.js"
import { useEtherlink } from "@/composables/etherlink.js"

/** Services */
import { amountToString, capitilize, prettyNumber, purgeNumber } from "@/services/utils"
import TokenBridgeService from "@/services/tokenBridge"
const { tokenBridge } = TokenBridgeService.instances

/** Stores */
import { useTransfersStore } from "@/stores/transfers.js"
import { useTokensStore } from "@/stores/tokens.js"
const tokensStore = useTokensStore()
const {
	tezosTokens,
	etherlinkTokens,
} = storeToRefs(tokensStore)
const { isPairedToken, isSameToken, getPairedToken } = tokensStore
const transfersStore = useTransfersStore()
const { recentTransfers } = storeToRefs(transfersStore)

const playRotateAnimation = ref(false)

// const FAKE_USD_PRICE = 3
const FAKE_TRANSFER_PRICE = 0.053
// const MAX_DIGITS = 4
// const FAKE_COMPUTED_TRANSFER_PRICE = computed(() => (!reverseDirection.value ? FAKE_TRANSFER_PRICE : 1 / FAKE_TRANSFER_PRICE))

const loadImage = (n) => new URL(`../assets/images/${n}.png`, import.meta.url).href

const normalizeAmount = (target, decimals) => {
	return prettyNumber(purgeNumber(target), decimals);
}

const { status: tezosStatus } = useTezos()
const { status: etherlinkStatus } = useEtherlink()
const isWalletsConnected = computed(() => tezosStatus.value === ConnectionStatus.CONNECTED && etherlinkStatus.value === ConnectionStatus.CONNECTED)

/** From Data */
const fromChain = ref({
	name: "tezos",
	logo: "tezos",
	tokens: tezosTokens,
	exchange: tokenBridge.deposit.bind(tokenBridge),
})
const fromInputEl = ref()
const fromToken = ref()

/** To Data */
const toChain = ref({
	name: "etherlink",
	logo: "etherlink",
	tokens: etherlinkTokens,
	exchange: tokenBridge.startWithdraw.bind(tokenBridge)
})
const toInputEl = ref()
const toToken = ref()

/** Common amounts */
const amount = ref("")
const bigIntAmount = ref(0n)
function calculateBigInt(stringAmount, decimals) {
	return  BigInt(
		BigNumber(purgeNumber(stringAmount)) *
		BigNumber(10 ** decimals)
	)
}
// const USDAmount = ref("0")
watch(
	() => [amount.value, fromToken?.value?.decimals, toToken?.value?.decimals],
	([newAmount = "", newFromDecimals = 12, newToDecimals = 12]) => {
		const newDecimals = Math.min(newFromDecimals, newToDecimals)
		if (!newAmount.length) {
			amount.value = ""
			bigIntAmount.value = 0n
			// USDAmount.value = "0"
		}
		else {
			amount.value = normalizeAmount(newAmount, newDecimals)
			bigIntAmount.value = calculateBigInt(amount.value, newDecimals)
			// USDAmount.value = prettyNumber(
			// 	(
			// 		BigNumber(bigIntAmount.value.toString()) *
			// 		BigNumber(FAKE_USD_PRICE) /
			// 		BigNumber(10 ** fromToken.value.decimals)
			// 	).toString(), 2)
		}
	})

const handleSwitch = () => {
	/** Rotate Animation */
	playRotateAnimation.value = true
	setTimeout(() => {
		playRotateAnimation.value = false
	}, 300)

	/** Reverse to/from chain */
	const savedChain = toChain.value
	toChain.value = fromChain.value
	fromChain.value = savedChain

	/** Reverse to/from token */
	const savedToken = toToken.value
	toToken.value = fromToken.value
	fromToken.value = savedToken
}

onMounted(() => {
	fromInputEl.value.focus()
})

const isLoading = ref(false)

async function testTransfer() {
	isLoading.value = true

	const _address = fromToken.value.address
	const _token = {
		type: fromToken.value.type,
		tokenId: fromToken.value.tokenId,
		...(_address && {address: _address})
	}

	fromChain.value.exchange(bigIntAmount.value, _token)
    .then(transfer => {
        if (transfer.tokenTransfer) {
            transfersStore.addTransfers([transfer.tokenTransfer], 'recent')
			tokensStore.mergeBalances()
        }
    })
    .catch(e => {
		if (e.title === 'Aborted') {
			console.log(e.description);
		} else {
			console.error(e);
		}
        // To do: catch for walletConnect abortions and unsupporting native token witdrawing
    })
    .finally(() => {
        isLoading.value = false
    });
}

watch(
	() => [fromToken.value, toToken.value],
	([newFromToken, newToToken], [oldFromToken, oldToToken]) => {
		if (!isPairedToken(newFromToken, newToToken)) {
			if (!isSameToken(newFromToken, oldFromToken)) {
				toToken.value = getPairedToken(newFromToken)
			} else if (!isSameToken(newToToken, oldToToken)) {
				fromToken.value = getPairedToken(newToToken)
			}
		}
	}
)

function setAmount(val) {
	amount.value = val
}
</script>

<template>
	<Flex align="center" justify="center" direction="column" gap="40" :class="$style.wrapper">
		<Flex direction="column" gap="20" :class="$style.operation_window">
			<Flex direction="column" gap="4" :class="$style.inputs">
				<Flex @click="fromInputEl.focus()" direction="column" gap="16" :class="$style.from">
					<Flex align="center" justify="between" :class="$style.top">
						<Text size="14" color="secondary">From</Text>

						<Flex align="center" gap="6">
							<img width="16" height="16" :src="loadImage(fromChain.logo)" :class="$style.logo" alt="" />
							<Text size="13" weight="semibold" color="primary">{{ capitilize(fromChain.name) }}</Text>
						</Flex>
					</Flex>

					<Flex justify="between">
						<input ref="fromInputEl" v-model="amount" placeholder="0.00" :class="$style.input" />

						<Flex direction="column" align="end" gap="8">
							<TokenSelector
								v-model="fromToken"
								:chain="fromChain.name"
							/>

							<Flex align="center" gap="4">
								<Icon name="banknote" size="14" color="tertiary" />
								<Tooltip delay="300">
									<Text
										size="12"
										weight="semibold"
										color="tertiary"
										:class="[$style.cursor_pointer]"
										@click="setAmount(amountToString(fromToken.balance, fromToken.decimals))"
									>
										{{ amountToString(fromToken.balance, fromToken.decimals, true) }}
									</Text>
									<template #content>
										<Text size="12" color="secondary">
											{{ amountToString(fromToken.balance, fromToken.decimals) }}
										</Text>
									</template>
								</Tooltip>
							</Flex>
						</Flex>
					</Flex>
				</Flex>

				<Flex @click="handleSwitch" :class="[$style.switcher, playRotateAnimation && $style.rotate]">
					<Icon name="logo" size="24" color="primary" />
				</Flex>

				<Flex @click="toInputEl.focus()" direction="column" gap="16" :class="$style.to">
					<Flex align="center" justify="between" :class="$style.top">
						<Text size="14" color="secondary">To</Text>

						<Flex align="center" gap="6">
							<img width="16" height="16" :src="loadImage(toChain.logo)" :class="$style.logo" alt="" />
							<Text size="13" weight="semibold" color="primary">{{ capitilize(toChain.name) }}</Text>
						</Flex>
					</Flex>

					<Flex justify="between">
						<input ref="toInputEl" v-model="amount" placeholder="0.00" :class="$style.input" />

						<Flex direction="column" align="end" gap="8">
							<TokenSelector
								v-model="toToken"
								:chain="toChain.name"
							/>

							<Flex align="center" gap="4">
								<Icon name="banknote" size="14" color="tertiary" />
								<Tooltip delay="300">
									<Text
										size="12"
										weight="semibold"
										color="tertiary"
										:class="[$style.cursor_pointer]"
										@click="setAmount(amountToString(toToken.balance, toToken.decimals))"
									>
										{{ amountToString(toToken.balance, toToken.decimals, true) }}
									</Text>
									<template #content>
										<Text size="12" color="secondary">
											{{ amountToString(toToken.balance, toToken.decimals) }}
										</Text>
									</template>
								</Tooltip>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Flex>
				<RouterLink v-if="!isWalletsConnected" to="/config" :class="[$style.button, $style.connect_wallets]">
					<Flex align="center" justify="center" :style="{height: '100%'}">
						<Text size="16" color="black">Connect Wallets</Text>
					</Flex>
				</RouterLink>

				<Flex v-else-if="fromChain.name === 'etherlink' && fromToken.type === 'native'" align="center" justify="center" :class="[$style.button, $style.disabled]">
					<Flex align="center" gap="6">
						<Text size="16" color="black">Native token withdrawal is not yet supported</Text>
					</Flex>
				</Flex>

				<Flex v-else-if="+fromToken.prettyBalance === 0" align="center" justify="center" :class="[$style.button, $style.disabled]">
					<Flex align="center" gap="6">
						<Text size="16" color="black">Not enough {{ fromToken.ticker }} for {{ fromChain.name === 'tezos' ? 'deposit' : 'withdraw' }} </Text>
					</Flex>
				</Flex>

				<Flex v-else @click="testTransfer" align="center" justify="center" :class="[$style.button, (!(bigIntAmount > 0n) || isLoading) && $style.disabled]">
					<Flex v-if="isLoading" align="center" gap="6">
						<Spinner size="14" />
						<Text size="16" color="black">Waiting for transfer creation..</Text>
					</Flex>

					<Text v-else-if="bigIntAmount > 0n" size="16" color="black"> {{ fromChain.name === 'tezos' ? 'Deposit' : 'Withdraw' }}</Text>

					<Text v-else size="16" color="black"> Enter amount to {{ fromChain.name === 'tezos' ? 'deposit' : 'withdraw' }} </Text>
				</Flex>
			</Flex>
		</Flex>
		
		<Flex v-if="recentTransfers.length > 0" direction="column" align="center" gap="4">
			<Flex :class="$style.transfers_header" align="center" flex="start">
				<Text size="16" color="tertiary">Recent transfers</Text>
			</Flex>
			<div :class="$style.divider" />
		</Flex>

		<TransfersList :transfers="recentTransfers" direction="row" />
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 100%;
}

.operation_window {
	max-width: 400px;
	width: 400px;

	border-radius: 16px;
	background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%));
	box-shadow: 0 0 0 2px var(--op-5);

	padding: 8px 8px 20px 8px;

	margin: 32px 16px 8px 16px;
}
.inputs {
	position: relative;
}

.from,
.to {
	height: 118px;

	background: #1a1919;
	border-radius: 8px;

	padding: 12px;
}

.switcher {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%) rotate(90deg);
	box-sizing: content-box;

	background: #121212;
	border-radius: 50%;
	box-shadow: 0 0 0 6px #1a1919;
	cursor: pointer;

	padding: 8px;

	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 0 0 6px #222222;
	}

	&:active {
		box-shadow: 0 0 0 6px #2d2d2d;
	}

	&.rotate {
		& svg {
			animation: rotate 0.3s ease;
		}
	}
}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(180deg);
	}
}

.top {
	border-bottom: 2px solid var(--op-5);

	padding-bottom: 10px;
}

.logo {
	width: 16px;
	height: 16px;
	border-radius: 5px;
}

.input {
	width: 100%;

	font-size: 28px;
	font-family: "ClashGrotesk", "sans-serif";
	color: var(--txt-primary);

	height: 28px;

	padding: 0;
}

.metadata {
	margin: 0 12px;
}

.button {
	width: 100%;
	height: 32px;

	border-radius: 8px;
	background: var(--green);
	opacity: 0.85;
	cursor: pointer;

	margin: 0 12px;

	transition: transform 0.1s ease;
}

.button:hover {
	box-shadow: 0 0 0 2px var(--op-5);
	opacity: 1;
}

.button:active {
	transform: scale(0.985);
}

.disabled {
	opacity: 0.4;
	cursor: auto;
	pointer-events: none;
}

.disabled:hover {
	opacity: 0.4;
}

.connect_wallets {
	background: var(--yellow);
}

.transfers_header {
	width: 500px;

	padding-left: 10px;
}

.divider {
	width: 520px;

	border-radius: 5px;
	border-bottom: 2px solid var(--op-5);

	margin-bottom: -30px;
}

.cursor_pointer {
	cursor: pointer;
}
</style>
