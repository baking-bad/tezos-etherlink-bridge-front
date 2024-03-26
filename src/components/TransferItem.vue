<script setup>
/** Vendor */
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"

/** Components */
import CountdownBar from "@/components/ui/CountdownBar.vue";
import ExplorerLink from "@/components/ExplorerLink.vue"
import RelativeDateTime from "@/components/ui/RelativeDateTime.vue"
import Stepper from "@/components/ui/Stepper.vue"
import Spinner from "@/components/ui/Spinner.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
import { amountToString, capitilize, getStatus, parseTime } from "@/services/utils"

/** Config */
import { getToken } from "@/services/cfg/tokens.js";

/** Stores */
import { useTokensStore } from "@/stores/tokens.js"
import { useTransfersStore } from "@/stores/transfers.js"
import { useWalletsStore } from "@/stores/wallets.js"
const tokensStore = useTokensStore()
const { tezosTokens } = storeToRefs(tokensStore)
const { removeRecentTransfer, updateTransfer } = useTransfersStore()
const { tokenBridge } = TokenBridgeService.instances
const { tezConnected } = storeToRefs(useWalletsStore())

const props = defineProps({
	transfer: {
		type: Object,
		required: true,
	},
	removable: {
		type: Boolean,
		default: false,
	}
})

const isProcessingWithdraw = ref(false)
const tezosNativebalance = computed(() => +(tezosTokens.value.find((t) => t.ticker === 'XTZ').prettyBalance))

const loadImage = (n) => new URL(`../assets/images/${n}.png`, import.meta.url).href

const operation = computed(() => {
	let op = {}
	op.kind = props.transfer.kind
	op.status = getStatus(props.transfer.status)
	op.estimatedExecuteTime = props.transfer.rollupData?.estimatedOutboxMessageExecutionTimestamp

	const tezosOperation = {
		amount: props.transfer.tezosOperation?.amount,
		chain: 'tezos',
		opHash: props.transfer.tezosOperation?.hash,
		token: props.transfer.tezosOperation?.token,
		time: parseTime(props.transfer.tezosOperation?.timestamp),
	}

	const etherlinkOperation = {
		amount: props.transfer.etherlinkOperation?.amount,
		chain: 'etherlink',
		opHash: props.transfer.etherlinkOperation?.hash,
		token: props.transfer.etherlinkOperation?.token,
		time: parseTime(props.transfer.etherlinkOperation?.timestamp),
	}

	const sourceOperation = props.transfer.kind === 1 ? etherlinkOperation : tezosOperation
	const recieverOperation = props.transfer.kind === 1 ? tezosOperation : etherlinkOperation

	op.source = {
		address: props.transfer.source,
		...sourceOperation,
	}
	op.destination = {
		address: props.transfer.receiver,
		...recieverOperation,
	}

	return op
})

const token = computed(() => {
	return getToken(operation.value.source.chain, operation.value.source.token.address)
})

const statusStyle = computed(() => {
	let lastStep = props.transfer.steps[props.transfer.steps.length - 1]
	if (lastStep.passed) {
		if (lastStep.step === 'Failed') {
			return {color: `var(--red)`}
		}

		return {color: `var(--green)`, opacity: 0.8}
	}

	return {color: `var(--blue)`}
})

const finishWithdraw = async () => {
	isProcessingWithdraw.value = true

	tokenBridge.finishWithdraw(props.transfer)
	.then((res) => {
		updateTransfer(res.tokenTransfer)
	}).catch(e => {
		if (e.title === 'Aborted') {
			console.log(e.description);
			isProcessingWithdraw.value = false
		} else {
			console.error(e);
			isProcessingWithdraw.value = false
		}
        // To do: catch for walletConnect abortions
    }).finally(() => {
		// isProcessingWithdraw.value = false
	})
}

const handleRemove = () => {
	removeRecentTransfer(props.transfer)
}
</script>

<template>
	<Flex direction="column" gap="10" :class="$style.transfer">
		<Flex align="center" justify="between" :class="$style.header">
			<Flex align="center" gap="8">
				<Tooltip delay="300">
					<Text>
						{{ amountToString(operation.source.amount, token.decimals, true) }}
					</Text>
					<template #content>
						<Text color="secondary">
							{{ amountToString(operation.source.amount, token.decimals) }}
						</Text>
					</template>
				</Tooltip>
				<img width="20" height="20" :src="loadImage(token.icon)" :class="$style.img" alt=""/>
				<Text size="16" color="primary"> {{ token.ticker }} </Text>
			</Flex>

			<Flex align="center" gap="6">
				<Text :style="statusStyle"> {{ operation.status }} </Text>
				<Icon v-if="removable" @click="handleRemove" name="close" size="16" color="secondary" :class="$style.icon_close" :style="{cursor: 'pointer'}" />
			</Flex>
		</Flex>

		<Flex align="center" justify="between" gap="12" :class="$style.progress">
			<Flex align="center" gap="6">
				<img width="20" height="20" :src="loadImage(operation.source.chain)" :class="$style.img" alt=""/>
				<Text size="16" color="primary"> {{ capitilize(operation.source.chain) }} </Text>
			</Flex>

			<Stepper :steps="transfer.steps" />

			<Flex align="center" gap="6">
				<img width="20" height="20" :src="loadImage(operation.destination.chain)" :class="$style.img" alt=""/>
				<Text size="16" color="primary"> {{ capitilize(operation.destination.chain) }} </Text>
			</Flex>
		</Flex>

		<Flex align="center" justify="between">
			<ExplorerLink :hash="operation.source.address" :network="operation.source.chain" type="address" />

			<ExplorerLink :hash="operation.destination.address" :network="operation.destination.chain" type="address" />
		</Flex>

		<div :class="$style.divider" />

		<Flex align="center" justify="between">
			<ExplorerLink :hash="operation.source.opHash" :network="operation.source.chain" type="tx" />

			<ExplorerLink v-if="operation.destination.opHash" :hash="operation.destination.opHash" :network="operation.destination.chain" type="tx" />
		</Flex>

		<Flex align="center" justify="between">
			<RelativeDateTime v-if="operation.source.time" :time="operation.source.time" />

			<RelativeDateTime v-if="operation.destination.time" :time="operation.destination.time" />
			<Flex v-else-if="operation.estimatedExecuteTime && transfer.status === 100" align="center" gap="3">
				<Text size="14" color="secondary">Finish withdrawal</Text>

				<RelativeDateTime :time="operation.estimatedExecuteTime" />
			</Flex>
		</Flex>

		<Flex v-if="transfer.status === 200" justify="center">
			<Flex v-if="!tezConnected" align="center" justify="center" :class="[$style.button, $style.disabled]" wide>
				<Text size="16" color="black">Connect your Tezos wallet to finalize the withdrawal</Text>
			</Flex>
			<Flex v-else-if="tezosNativebalance === 0" align="center" justify="center" :class="[$style.button, $style.disabled]" wide>
				<Text size="16" color="black">Not enough XTZ to finalize the withdrawal</Text>
			</Flex>
			<Flex v-else @click="finishWithdraw" align="center" justify="center" :class="[$style.button, isProcessingWithdraw && $style.disabled]" wide>
				<Flex v-if="isProcessingWithdraw" gap="6">
					<Spinner size="14" />

					<Text size="16" color="black">Processing..</Text>
				</Flex>
				
				<Text v-else size="16" color="black">Finish withdraw</Text>
			</Flex>
		</Flex>

		<CountdownBar :start="transfer.autoDestroy" :destroyTime="transfer.autoDestroyDelay" title="Transfer complited" subtitle :class="$style.countdown" />
	</Flex>
</template>

<style module>
.transfer {
	max-width: 500px;
	min-width: 500px;

	border-radius: 16px;
	background: var(--card-background);
	box-shadow: inset 0 0 0 2px var(--op-5);

	padding: 16px 16px 12px 16px;

	margin: 16px;

	color: var(--txt-secondary);

	.header {
		padding-bottom: 6px;
	}

	.progress {
		height: 40px;
	}
}

.img {
	border-radius: 50%;	
}

.icon_close{
	opacity: 0.5;
}

.icon_close:hover{
	opacity: 1;
}
.divider {
	width: 100%;
	height: 2px;
	background: var(--op-5);

	margin-top: 2px;
	margin-bottom: 2px;
}

.button {
	width: 100%;
	height: 32px;

	border-radius: 8px;
	background: var(--green);
	opacity: 0.85;
	cursor: pointer;

	margin-top: 6px;
	margin-bottom: 4px;

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

.countdown {
	margin-top: -8px;
}
</style>
