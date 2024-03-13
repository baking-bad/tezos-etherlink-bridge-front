<script setup>
/** Vendor */
import { DateTime } from "luxon"
import { ref } from "vue"

/** Components */
import ExplorerLink from "@/components/ExplorerLink.vue"
import Tooltip from "@/components/ui/Tooltip.vue"

/** Services */
import { findPair, nativeTezosToken, plainTokens } from "@/services/cfg/tokens.js"
import { capitilize, midHash } from "@/services/utils";

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
const operation = ref({})
const tokenPair = findPair(props.transfer.tezosOperation?.token?.type, props.transfer.tezosOperation ? props.transfer.tezosOperation?.token?.address : props.transfer.etherlinkOperation.token.address )

const fillOperation = () => {
	operation.value.kind = props.transfer.kind
	operation.value.status = props.transfer.status
	operation.value.source = {
		chain: 'tezos',
		address: props.transfer.source,
		opHash: props.transfer.tezosOperation?.hash,
		time: props.transfer.tezosOperation?.timestamp,
		token: {
			...tokenPair.tezos
		},
	}
	operation.value.destination = {
		chain: 'etherlink',
		address: props.transfer.receiver,
		opHash: props.transfer.etherlinkOperation?.hash,
		time: props.transfer.etherlinkOperation?.timestamp,
		token: {
			...tokenPair.etherlink
		},
	}

	if (props.transfer.kind === 1) {
		let stage = operation.value.source
		operation.value.source = operation.value.destination
		operation.value.destination = stage
	}
}

const token = plainTokens
	.find((t) => t.address === props.transfer.tezosOperation?.token?.address) ??
	nativeTezosToken // maybe nativeEtherlink, but not supported now

const tokenWithAmount = `${ ((props.transfer?.tezosOperation?.amount || BigInt(10)) / BigInt(10 ** token.decimals)).toString() || '000' } ${ token.name }`

fillOperation()

</script>

<template>
	<Flex align="center" direction="column" gap="8" :class="[$style.transfer]">
		<Flex align="center" justify="between">
			<Flex align="center" gap="8">
				<img width="20" height="20" :src="loadImage(tokenPair.tezos.icon)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ tokenPair.tezos.ticker }} </Text>
			</Flex>

			<Text> {{ operation.status }} </Text>
		</Flex>

		<Flex align="center" justify="between">
			<Flex align="center" gap="8">
				<img width="20" height="20" :src="loadImage(operation.source.chain)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ capitilize(operation.source.chain) }} </Text>
			</Flex>

			<Flex align="center" gap="8">
				<img width="20" height="20" :src="loadImage(operation.destination.chain)" :class="$style.img"/>
				<Text size="16" color="primary"> {{ capitilize(operation.destination.chain) }} </Text>
			</Flex>
		</Flex>

		<Flex align="center" justify="between">
			<ExplorerLink :hash="operation.source.address" :network="operation.source.chain" type="address" />

			<ExplorerLink :hash="operation.destination.address" :network="operation.destination.chain" type="address" />
		</Flex>

		<Flex align="center" justify="between">
			<ExplorerLink :hash="operation.source.opHash" :network="operation.source.chain" type="tx" />

			<ExplorerLink :hash="operation.destination.opHash" :network="operation.destination.chain" type="tx" />
		</Flex>

		<Flex align="center" justify="between">
			<Tooltip>
				<Text size="16" color="primary"> {{ DateTime.fromISO(operation.source.time).toRelative({ locale: "en", style: "long" }) }} </Text>

				<template #content>
					<Text size="16" color="primary"> {{ DateTime.fromISO(operation.source.time).setLocale("en").toFormat("LLL d, y, tt") }} </Text>
				</template>
			</Tooltip>

			<Tooltip>
				<Text size="16" color="primary"> {{ DateTime.fromISO(operation.destination.time).toRelative({ locale: "en", style: "long" }) }} </Text>

				<template #content>
					<Text size="16" color="primary"> {{ DateTime.fromISO(operation.destination.time).setLocale("en").toFormat("LLL d, y, tt") }} </Text>
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

	padding: 8px;

	margin: 16px 0;

	color: var(--txt-secondary);
}

.img {
	border-radius: 50%;	
}
</style>