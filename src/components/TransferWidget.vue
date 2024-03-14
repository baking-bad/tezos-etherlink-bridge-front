<script setup>
/** Vendor */
import { ref, computed, onMounted, watch } from "vue"

/** Components */
import TokenSelector from "@/components/TokenSelector.vue"

/** Services */
import { capitilize, comma, prettyNumber, purgeNumber } from "@/services/utils"

import TokenBridgeService from "@/services/tokenBridge"
import {
	tezosTokens,
	etherlinkTokens,
	isPairedToken,
	isSameToken,
	getPairedToken
} from "@/services/cfg/tokens.js"

const { tokenBridge } = TokenBridgeService.instances

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

const balancesTezos = ref({})
const balancesEtherlink = ref({})

async function getBalances() {
	const addresses = await Promise.all( [
		tokenBridge.getTezosConnectedAddress(),
		tokenBridge.getEtherlinkConnectedAddress()
	])
	const balances = await Promise.all([
		tokenBridge.data.getBalances(addresses[0]),
		tokenBridge.data.getBalances(addresses[1])
	])
	balancesTezos.value = balances[0]
	balancesEtherlink.value = balances[1]
}

getBalances()

function testTransfer() {
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
	<Flex direction="column" gap="20" :class="$style.wrapper">
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
							<Text size="12" weight="semibold" color="tertiary">152,620</Text>
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
							<Text size="12" weight="semibold" color="tertiary">152,620</Text>
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
			<Flex align="center" justify="center" :class="$style.button">
				<Text size="16" color="black" @click="testTransfer">Continue</Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 400px;
	width: 400px;

	border-radius: 16px;
	background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%));
	box-shadow: 0 0 0 2px var(--op-5);

	padding: 8px 8px 20px 8px;

	margin: 32px 16px;
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
	height: 32px;

	border-radius: 8px;
	background: var(--green);
	cursor: pointer;

	margin: 0 12px;
}
</style>
