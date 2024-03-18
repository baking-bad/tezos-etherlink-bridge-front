<script setup>
/** Vendor */
import { DateTime } from "luxon"
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"

/** Components */
import ExplorerLink from "@/components/ExplorerLink.vue"
import Tooltip from "@/components/ui/Tooltip.vue"
import Stepper from "@/components/ui/Stepper.vue"
import Spinner from "@/components/ui/Spinner.vue";

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
import { capitilize, getStatus } from "@/services/utils";

/** Stores */
import { useTransfersStore } from "@/stores/transfers.js";
import { useTokensStore } from "@/stores/tokens.js"
const tokensStore = useTokensStore()
const { plainTokens } = storeToRefs(tokensStore)
const { getTokenKey } = tokensStore

const { removeRecentTransfer, updateTransfer } = useTransfersStore()
const { tokenBridge } = TokenBridgeService.instances

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

const loadImage = (n) => new URL(`../assets/images/${n}.png`, import.meta.url).href

const token = computed(() => {
	return plainTokens.value.find((pt) => {
		return getTokenKey(
			(props.transfer.tezosOperation?.token && { fakeAddress: 'tezosNative' }) ||
			(props.transfer.etherlinkOperation?.token && { fakeAddress: 'etherlinkNative' })
		) === getTokenKey(pt)
	})
})

const operation = computed(() => {
	let op = {}
	op.kind = props.transfer.kind
	op.status = getStatus(props.transfer.status)

	const tezosOperation = {
		chain: 'tezos',
		opHash: props.transfer.tezosOperation?.hash,
		time: props.transfer.tezosOperation?.timestamp,
	}

	const etherlinkOperation = {
		chain: 'etherlink',
		opHash: props.transfer.etherlinkOperation?.hash,
		time: props.transfer.etherlinkOperation?.timestamp,
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

	let { tokenTransfer } = await tokenBridge.finishWithdraw(props.transfer)
	updateTransfer(tokenTransfer)

	isProcessingWithdraw.value = false
}

const handleRemove = () => {
	removeRecentTransfer(props.transfer)
}
</script>

<template>
	<Flex direction="column" gap="10" :class="$style.transfer">
		<Flex align="center" justify="between" :class="$style.header">
			<Flex align="center" gap="8">
				<img width="20" height="20" :src="loadImage(token.icon)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ token.ticker }} </Text>
			</Flex>

			<Flex align="center" gap="6">
				<Text :style="statusStyle"> {{ operation.status }} </Text>
				<Icon v-if="removable" @click="handleRemove" name="close" size="16" color="secondary" :class="$style.icon_close" :style="{cursor: 'pointer'}" />
			</Flex>
		</Flex>

		<Flex align="center" justify="between" gap="12" :class="$style.progress">
			<Flex align="center" gap="6">
				<img width="20" height="20" :src="loadImage(operation.source.chain)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ capitilize(operation.source.chain) }} </Text>
			</Flex>

			<Stepper :steps="transfer.steps" />

			<Flex align="center" gap="6">
				<img width="20" height="20" :src="loadImage(operation.destination.chain)" :class="$style.img"/>
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

			<ExplorerLink :hash="operation.destination.opHash" :network="operation.destination.chain" type="tx" />
		</Flex>

		<Flex align="center" justify="between">
			<Tooltip>
				<Text size="14" color="secondary"> {{ DateTime.fromISO(operation.source.time).toRelative({ locale: "en", style: "long" }) }} </Text>

				<template #content>
					<Text size="14" color="secondary"> {{ DateTime.fromISO(operation.source.time).setLocale("en").toFormat("LLL d, y, tt") }} </Text>
				</template>
			</Tooltip>

			<Flex v-if="transfer.status === 200" @click="finishWithdraw" align="center" justify="center" :class="$style.button">
				<Flex v-if="isProcessingWithdraw" gap="6">
					<Spinner size="14" />
					<Text  size="14" color="black">Processing..</Text>
				</Flex>
				
				<Text v-else size="14" color="black">Finish withdraw</Text>
			</Flex>

			<Tooltip>
				<Text size="14" color="secondary"> {{ DateTime.fromISO(operation.destination.time).toRelative({ locale: "en", style: "long" }) }} </Text>

				<template #content>
					<Text size="14" color="secondary"> {{ DateTime.fromISO(operation.destination.time).setLocale("en").toFormat("LLL d, y, tt") }} </Text>
				</template>
			</Tooltip>
		</Flex>

		<!-- <Flex>
			<Text>{{ tokenWithAmount }} from {{ transfer.source }} to {{ transfer.receiver }}</Text>
		</Flex> -->
	</Flex>
</template>

<style module>
.transfer {
	max-width: 500px;
	min-width: 500px;

	border-radius: 16px;
	/* background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%)); */
	background: var(--card-background);
	box-shadow: inset 0 0 0 2px var(--op-5);

	padding: 16px;

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
	width: 200px;
	height: 20px;

	border-radius: 8px;
	background: var(--green);
	opacity: 0.85;
	cursor: pointer;

	margin: 6px 0px;
}

.button:hover {
	box-shadow: 0 0 0 2px var(--op-5);
	opacity: 1;
}
</style>