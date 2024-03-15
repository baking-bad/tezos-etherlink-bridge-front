<script setup>
/** Vendor */
import { ref } from "vue"

/** Components */
import TransfersList from "@/components/TransfersList.vue"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"

const transfers = ref([])
const { tokenBridge } = TokenBridgeService.instances
Promise.all( [
	tokenBridge.getTezosConnectedAddress(),
	tokenBridge.getEtherlinkConnectedAddress()
]).then((res) => {
	return tokenBridge.data.getAccountTokenTransfers(res, 0, 1)
}).then((res) => transfers.value = res)
</script>

<template>
<Flex direction="column" align="center">
	<TransfersList
		:transfers="transfers"
	/>
</Flex>
</template>

<style module>
</style>