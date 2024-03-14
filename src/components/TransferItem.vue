<script setup>
/** Vendor */
import { DateTime } from "luxon"
import { computed, ref } from "vue"

/** Components */
import ExplorerLink from "@/components/ExplorerLink.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { plainTokens, getTokenKey } from "@/services/cfg/tokens.js"
import { capitilize, getStatus } from "@/services/utils";

const props = defineProps({
	transfer: {
		type: Object,
		required: true,
	}
})

const loadImage = (n) => new URL(`../assets/images/${n}.png`, import.meta.url).href

const operationTypes = {
	0: 'deposit',
	1: 'withdraw'
}
const token = computed(() => {
	return plainTokens.find((pt) => {
		return getTokenKey(
			(props.transfer.tezosOperation?.token && { fakeAddress: 'tezosNative' }) ||
			(props.transfer.etherlinkOperation?.token && { fakeAddress: 'etherlinkNative' })
		) === getTokenKey(pt)
	})
})
const operation = ref({})
const fillOperation = () => {
	operation.value.kind = props.transfer.kind
	operation.value.status = getStatus(props.transfer.status)

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

	operation.value.source = {
		address: props.transfer.source,
		...sourceOperation,
	}
	operation.value.destination = {
		address: props.transfer.receiver,
		...recieverOperation,
	}
}

fillOperation()

</script>

<template>
	<Flex direction="column" gap="10" :class="$style.transfer">
		<Flex align="center" justify="between" :class="$style.header">
			<Flex align="center" gap="8">
				<img width="20" height="20" :src="loadImage(token.icon)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ token.ticker }} </Text>
			</Flex>

			<Text> {{ operation.status }} </Text>
		</Flex>

		<Flex align="center" justify="between">
			<Flex align="center" gap="6">
				<img width="20" height="20" :src="loadImage(operation.source.chain)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ capitilize(operation.source.chain) }} </Text>
			</Flex>

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
	width: 500px;

	border-radius: 16px;
	background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%));
	box-shadow: 0 0 0 2px var(--op-5);

	padding: 16px;

	margin: 16px 0;

	color: var(--txt-secondary);

	.header {
		padding-bottom: 6px;
	}
}

.img {
	border-radius: 50%;	
}

.divider {
	width: 100%;
	height: 2px;
	background: var(--op-5);

	margin-top: 2px;
	margin-bottom: 2px;
}
</style>