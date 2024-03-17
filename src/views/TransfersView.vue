<script setup>
/** Vendor */
import { ref } from "vue"
import { storeToRefs } from "pinia"

/** Components */
import TransfersList from "@/components/TransfersList.vue"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"

/** Store */
import { useTransfersStore } from "@/stores/transfers.js";
const transfersStore = useTransfersStore()
const { transfers } = storeToRefs(transfersStore)

const { tokenBridge } = TokenBridgeService.instances

Promise.all( [
	tokenBridge.getTezosConnectedAddress(),
	tokenBridge.getEtherlinkConnectedAddress()
]).then((res) => {
	return tokenBridge.data.getAccountTokenTransfers(res, 0, 30)
}).then((res) => transfersStore.addTransfers(res))

</script>

<template>
<Flex direction="column" align="center">
	<TransfersList
		:transfers="transfers"
		:class="$style.wrapper"
	/>
</Flex>
</template>

<style module>

.wrapper {
	overflow-y: auto;
}
</style>