<script setup>
/** Vendor */
import { onMounted, ref } from "vue"
import { storeToRefs } from "pinia"

/** Components */
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue";

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
const { tokenBridge } = TokenBridgeService.instances

/** Store */
import { useTransfersStore } from "@/stores/transfers.js";
const transfersStore = useTransfersStore()
const { allTransfers } = storeToRefs(transfersStore)
transfersStore.clearStore()

const transfersListEl = ref(null)
const handleScroll = () => {
	if (transfersListEl.value.wrapper.scrollHeight - transfersListEl.value.wrapper.scrollTop <= transfersListEl.value.wrapper.clientHeight + 1) {
		loadTransfers()
	}
}

const isLoading = ref(false)

const offset = ref(0)
const limit = ref(20)

async function loadTransfers() {
	if (isLoading.value) return

	isLoading.value = true

	const addresses = await Promise.all( [
		tokenBridge.getTezosConnectedAddress(),
		tokenBridge.getEtherlinkConnectedAddress()
	])
	const transfers = await tokenBridge.data.getAccountTokenTransfers(addresses, offset.value, limit.value)
	transfersStore.addTransfers(transfers, 'all')
	offset.value += limit.value
	isLoading.value = false
}

loadTransfers()

onMounted(() => {
	transfersListEl.value.wrapper.addEventListener('scroll', handleScroll)
});

</script>

<template>
	<Flex direction="column" align="center" ref="transfersListEl" :class="$style.wrapper">
		<Flex align="center" justify="between" wide :class="$style.filters">
			<Text>Filter1</Text>

			<Text>Filter2</Text>
		</Flex>
		<TransfersList
			:transfers="allTransfers"
		/>

		<Spinner v-if="isLoading" size="50" />
	</Flex>
</template>

<style module>

.wrapper {
	overflow-y: auto;
	height: calc(100vh - 70px - 48px);
}

.filters {
	width: 500px;
	
	margin: 15px 0 25px 0;
}
</style>