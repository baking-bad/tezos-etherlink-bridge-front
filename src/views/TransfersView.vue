<script setup>
import { ref } from "vue"
import Flex from "@/components/global/Flex.vue"
import TransferItem from "@/components/TransferItem.vue"
import TokenBridgeService from "@/services/tokenBridge"

const transfers = ref([])
const { tokenBridge } = TokenBridgeService.instances
Promise.all( [
	tokenBridge.getTezosConnectedAddress(),
	tokenBridge.getEtherlinkConnectedAddress()
]).then((res) => {
	console.log(res);
	return tokenBridge.data.getAccountTokenTransfers(res, 0, 300)
}).then((res) => transfers.value = res)

</script>

<template>
<Flex direction="column" align="center">
	<TransferItem
		v-for="transfer in transfers"
		:transfer="transfer"
		:key="transfer.id"
	/>
</Flex>
</template>

<style module>
</style>