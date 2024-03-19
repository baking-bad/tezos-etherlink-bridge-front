<script setup>
/** Vendor */
import { ref, computed, onMounted, watch } from "vue"
import { storeToRefs } from "pinia"

/** Constants */
import { ConnectionStatus } from "@/services/constants/wallets"

/** Components */
import TokenSelector from "@/components/TokenSelector.vue"
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue";


/** Composables */
import { useTezos } from "@/composables/tezos.js"
import { useEtherlink } from "@/composables/etherlink.js"

/** Services */
import { capitilize, comma, prettyNumber, purgeNumber } from "@/services/utils"
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

tokensStore.mergeBalances(tokenBridge)

const transfersStore = useTransfersStore()
const { recentTransfers } = storeToRefs(transfersStore)
// tokenBridge.addEventListener('tokenTransferUpdated', transfersStore.updateTransfer)

const reverseDirection = ref(false)
const playRotateAnimation = ref(false)

const FAKE_USD_PRICE = 3
const FAKE_TRANSFER_PRICE = 0.053
const MAX_DIGITS = 4
const FAKE_COMPUTED_TRANSFER_PRICE = computed(() => (!reverseDirection.value ? FAKE_TRANSFER_PRICE : 1 / FAKE_TRANSFER_PRICE))

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
const fromAmount = ref("")
const fromInUSD = computed(() => parseFloat(purgeNumber(fromAmount.value)) * FAKE_USD_PRICE)
const handleFromInput = (e) => {
	if (!fromAmount.value.length) toAmount.value = ""

	const normalizedAmount = normalizeAmount(fromAmount.value, fromToken.value.decimals)
	if (typeof normalizedAmount === "string") {
		fromAmount.value = normalizedAmount
		return
	}

	fromAmount.value = comma(purgeNumber(fromAmount.value), ",", MAX_DIGITS)

	/** Calc "to" */
	toAmount.value = comma(parseFloat(purgeNumber(fromAmount.value)) * FAKE_COMPUTED_TRANSFER_PRICE.value, ",", MAX_DIGITS)
}

/** To Data */
const toChain = ref({
	name: "etherlink",
	logo: "etherlink",
	tokens: etherlinkTokens,
	exchange: tokenBridge.startWithdraw.bind(tokenBridge)
})
const toInputEl = ref()
const toToken = ref()
const toAmount = ref("")
const toInUSD = computed(() => parseFloat(purgeNumber(toAmount.value)) * FAKE_USD_PRICE)
const handleToInput = (e) => {
	if (!toAmount.value.length) fromAmount.value = ""

	const normalizedAmount = normalizeAmount(toAmount.value, toToken.value.decimals)
	if (typeof normalizedAmount === "string") {
		toAmount.value = normalizedAmount
		return
	}

	toAmount.value = comma(purgeNumber(toAmount.value), ",", MAX_DIGITS)

	/** Calc "from" */
	fromAmount.value = comma(parseFloat(purgeNumber(toAmount.value)) / FAKE_COMPUTED_TRANSFER_PRICE.value, ",", MAX_DIGITS)
}

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

	if (!fromAmount.value.length) return

	toAmount.value = fromAmount.value
	fromAmount.value = comma(parseFloat(purgeNumber(toAmount.value)) * FAKE_COMPUTED_TRANSFER_PRICE.value, ",", MAX_DIGITS)

	reverseDirection.value = !reverseDirection.value
}

onMounted(() => {
	fromInputEl.value.focus()
})

const isLoading = ref(false)

async function testTransfer() {
	isLoading.value = true

	const bigIntSum = BigInt(
		Number(
			fromAmount.value.replaceAll(",", "")
		) * (10 ** fromToken.value.decimals)
	)
	const _address = fromToken.value.address
	const _token = {
		type: fromToken.value.type,
		...(_address && {address: _address})
	}

	fromChain.value.exchange(bigIntSum, _token)
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
</script>

<template>
	<Flex align="center" justify="center" direction="column" gap="40" :class="$style.wrapper">
		<Flex direction="column" gap="20" :class="$style.operation_window">
			<Flex direction="column" gap="4" :class="$style.inputs">
				<Flex @click="fromInputEl.focus()" direction="column" gap="16" :class="$style.from">
					<Flex align="center" justify="between" :class="$style.top">
						<Text size="14" color="secondary">From</Text>

						<Flex align="center" gap="6">
							<img width="16" height="16" :src="loadImage(fromChain.logo)" :class="$style.logo" />
							<Text size="13" weight="semibold" color="primary">{{ capitilize(fromChain.name) }}</Text>
						</Flex>
					</Flex>

					<Flex justify="between">
						<Flex direction="column" gap="8">
							<input ref="fromInputEl" v-model="fromAmount" @input="handleFromInput" placeholder="0.00" :class="$style.input" />
							<Text size="14" color="tertiary">${{ comma(fromInUSD) }}</Text>
						</Flex>

						<Flex direction="column" align="end" gap="8">
							<TokenSelector
								v-model="fromToken"
								:chain="fromChain.name"
							/>

							<Flex align="center" gap="4">
								<Icon name="banknote" size="14" color="tertiary" />
								<Text size="12" weight="semibold" color="tertiary">{{ fromToken.prettyBalance }}</Text>
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
							<img width="16" height="16" :src="loadImage(toChain.logo)" :class="$style.logo" />
							<Text size="13" weight="semibold" color="primary">{{ capitilize(toChain.name) }}</Text>
						</Flex>
					</Flex>

					<Flex justify="between">
						<Flex direction="column" gap="8">
							<input ref="toInputEl" v-model="toAmount" @input="handleToInput" placeholder="0.00" :class="$style.input" />
							<Text size="14" color="tertiary">${{ comma(toInUSD) }}</Text>
						</Flex>

						<Flex direction="column" align="end" gap="8">
							<TokenSelector
								v-model="toToken"
								:chain="toChain.name"
							/>

							<Flex align="center" gap="4">
								<Icon name="banknote" size="14" color="tertiary" />
								<Text size="12" weight="semibold" color="tertiary">{{ toToken.prettyBalance }}</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Flex direction="column" gap="12" :class="$style.metadata">
				<Flex align="center" justify="between">
					<Text size="13" color="tertiary">Estimated Time</Text>
					<Text size="13" color="secondary">15 min</Text>
				</Flex>
				<Flex align="center" justify="between">
					<Text size="13" color="tertiary">Estimated Gas Fee</Text>
					<Text size="13" color="secondary">$2.62</Text>
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

				<Flex v-else @click="testTransfer" align="center" justify="center" :class="[$style.button, (!(fromAmount > 0) || isLoading) && $style.disabled]">
					<Flex v-if="isLoading" align="center" gap="6">
						<Spinner size="14" />
						<Text size="16" color="black">Waiting for transfer creation..</Text>
					</Flex>

					<Text v-else-if="fromAmount > 0" size="16" color="black"> {{ fromChain.name === 'tezos' ? 'Deposit' : 'Withdraw' }}</Text>

					<Text v-else size="16" color="black"> Enter amount to {{ fromChain.name === 'tezos' ? 'deposit' : 'withdraw' }} </Text>
				</Flex>
			</Flex>
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

	background: #222222;
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
	box-shadow: 0 0 0 6px #222222;
	cursor: pointer;

	padding: 8px;

	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 0 0 6px #303030;
	}

	&:active {
		box-shadow: 0 0 0 6px #3f3f3f;
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

.selector {
	background: #111111;
	border-radius: 500px;
	cursor: pointer;

	padding: 6px;

	transition: all 0.2s ease;

	& img {
		border-radius: 50%;
	}

	&:hover {
		box-shadow: 0 0 0 1px var(--op-5);
	}

	&:active {
		box-shadow: 0 0 0 2px var(--op-5);
	}
}

.input {
	width: 100%;

	font-size: 28px;
	font-family: "ClashGrotesk";
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
</style>
