<script setup>
import { plainTokens, nativeTezosToken } from "@/services/cfg/tokens.js"
import Flex from "@/components/global/Flex.vue"

const props = defineProps({
	transfer: {
		type: Object,
		required: true,
	}
})
const operationTypes = {
	0: 'deposit',
	1: 'withdraw'
}
const token = plainTokens
	.find((t) => t.address === props.transfer?.tezosOperation?.token?.address) ??
	nativeTezosToken // maybe nativeEtherlink, but not supported now

const tokenWithAmount = `${ ((props.transfer?.tezosOperation?.amount || BigInt(10)) / BigInt(10 ** token.decimals)).toString() || '000' } ${ token.name }`

</script>

<template>
<Flex :class="[$style.wrapper]" align="center">
	{{ tokenWithAmount }} from {{ props.transfer.source }} to {{ props.transfer.receiver }}
</Flex>
</template>

<style module>
.wrapper {
	max-width: 400px;
	width: 400px;

	border-radius: 16px;
	background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%));
	box-shadow: 0 0 0 2px var(--op-5);

	padding: 8px;

	margin: 16px 0;

	color: var(--txt-secondary);
}
</style>