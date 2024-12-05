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
import { amountToString, capitalize, prettyNumber, purgeNumber, truncateDecimalPart } from "@/services/utils"
import TokenBridgeService from "@/services/tokenBridge"
const { tokenBridge } = TokenBridgeService.instances

/** Stores */
import { useTransfersStore } from "@/stores/transfers.js"
import { useTokensStore } from "@/stores/tokens.js"
import { useWalletsStore } from "@/stores/wallets"



const tokensStore = useTokensStore()
const {
	tezosTokens,
	etherlinkTokens,
} = storeToRefs(tokensStore)
const { isPairedToken, isSameToken, getPairedToken } = tokensStore
const transfersStore = useTransfersStore()
const { recentTransfers } = storeToRefs(transfersStore)

const tezosNetworkName = import.meta.env.VITE_TEZOS_NETWORK_NAME

const playRotateAnimation = ref(false)

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
	return BigInt(BigNumber(purgeNumber(stringAmount)).shiftedBy(decimals).toFixed(0))
}

/** Wallet display */
const {ethConnected, ethAddress, tezConnected, tezAddress, ethStatus} = useWalletsStore()
const tezAddressTruncated = tezConnected ? tezAddress.slice(0, 4) + '...' + tezAddress.slice(-4) : ''
const ethAddressTruncated = ethAddress ? ethAddress.slice(0, 4) + '...' + ethAddress.slice(-4) : ''
console.log({tezConnected, tezAddress, ethConnected, ethAddress, ethStatus})

watch(
	() => [amount.value, fromToken?.value?.decimals, toToken?.value?.decimals],
	([newAmount = "", decimalsFrom = 12, decimalsTo = 12]) => {
		let decimals = Math.min(decimalsFrom, decimalsTo)

		if (!newAmount.length) {
			amount.value = ""
			bigIntAmount.value = 0n
		}
		else {
			amount.value = normalizeAmount(newAmount, decimals)
			bigIntAmount.value = calculateBigInt(amount.value, decimalsFrom)
		}
	}
)

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

async function sendTransfer() {
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

const warningDisplayed = ref(true)
</script>

<template>
	<Flex align="center" justify="center" direction="column" gap="40" :class="$style.wrapper">
		<Flex v-if="tezosNetworkName !== 'mainnet' && warningDisplayed" align="start" gap="8" :class="$style.alert">
			<Icon name="info" size="22" :class="$style.alert_icon" />
			<Flex direction="column" gap="8" :class="$style.alert_message">
				<Text size="15" weight="semibold">Attention!</Text>

				<Text size="15" weight="500">You are on the <Text size="15" weight="semibold"> {{ capitalize(tezosNetworkName) }} </Text> test network.</Text>
			</Flex>
			<Icon @click="warningDisplayed = false" name="close" size="18" color="secondary" :class="$style.alert_close_icon" />
		</Flex>
		<Flex direction="column" gap="20" :class="$style.operation_window">
			<Flex direction="column" gap="4" :class="$style.inputs">
				<Flex @click="fromInputEl.focus()" direction="column" gap="16" :class="$style.from">
					<Flex align="center" justify="between" :class="$style.top">
						<Text size="14" color="secondary">From:
							<Text size="16" :style="{ color: fromChain.name === 'etherlink' ? 'var(--etherlink-green)' : '#4382fa' }">
								{{fromChain.name === 'etherlink' ? ethAddressTruncated : tezAddressTruncated}}
							</Text>
						</Text>
						<Flex align="center" gap="6">
							<img width="16" height="16" :src="loadImage(fromChain.logo)" :class="$style.logo" alt="" />
							<Text size="13" weight="semibold" color="primary">{{ capitalize(fromChain.name) }}</Text>
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
						<Text size="14" color="secondary">To:
							<Text size="16" :style="{ color: toChain.name === 'etherlink' ? 'var(--etherlink-green)' : '#0F61FF' }">
								{{toChain.name === 'etherlink' ? ethAddressTruncated : tezAddressTruncated}}
							</Text>
						</Text>

						<Flex align="center" gap="6">
							<img width="16" height="16" :src="loadImage(toChain.logo)" :class="$style.logo" alt="" />
							<Text size="13" weight="semibold" color="primary">{{ capitalize(toChain.name) }}</Text>
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

				<Flex v-else-if="fromToken.balance === 0n || bigIntAmount > fromToken.balance" align="center" justify="center" :class="[$style.button, $style.disabled]">
					<Flex align="center" gap="6">
						<Text size="16" color="black">Not enough {{ fromToken.ticker }} for {{ fromChain.name === 'tezos' ? 'deposit' : 'withdraw' }} </Text>
					</Flex>
				</Flex>

				<Flex v-else @click="sendTransfer" align="center" justify="center" :class="[$style.button, (!(bigIntAmount > 0n) || isLoading) && $style.disabled]">
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

.alert {
	max-width: 100%;
	width: 400px;

	border-radius: 12px;

	background-color: #f2c84c0a;
	color: var(--warning);
	border: 1px solid var(--warning);

	transition: all 0.2s ease;

	padding: 8px 8px 8px 8px;
	margin: 24px 16px -44px 16px;

	&:hover {
		.alert_close_icon {
			margin-left: auto;
			display: block;
		}
	}
}

.alert_icon {
	flex-shrink: 0;

	fill: var(--warning);
}

.alert_message {
	margin-top: 2px;

	& span {
		line-height: 1.2;
	}
}

.alert_close_icon {
	display: none;

	cursor: pointer;
	padding: 2px;

	fill: var(--warning);

	border-radius: 12px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-10);
		transform: scale(1.1);
	}
}

.operation_window {
	max-width: 550px;
	width: 550px;

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
	background: var(--etherlink-green);
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
	background: var(--etherlink-green);
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
