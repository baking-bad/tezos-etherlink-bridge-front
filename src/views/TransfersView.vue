<script setup>
/** Vendor */
import { onBeforeUnmount, onMounted, ref } from "vue"
import { storeToRefs } from "pinia"

/** Components */
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue";

/** Services */
import TokenBridgeService from "@/services/tokenBridge"

/** Store */
import { useTransfersStore } from "@/stores/transfers.js";
const transfersStore = useTransfersStore()
const { allTransfers } = storeToRefs(transfersStore)

const { tokenBridge } = TokenBridgeService.instances

const transfersListEl = ref(null)
const handleScroll = () => {
	if (transfersListEl.value.wrapper.scrollHeight - transfersListEl.value.wrapper.scrollTop - 600 <= transfersListEl.value.wrapper.clientHeight) {
		loadTransfers()
	}
}

const isLoading = ref(false)

const offset = ref(0)
const limit = ref(20)

const loadTransfers = () => {
	if (isLoading.value) return

	isLoading.value = true

	// setTimeout(() => {
	// 	Promise.all( [
	// 	tokenBridge.getTezosConnectedAddress(),
	// 	tokenBridge.getEtherlinkConnectedAddress()
	// 	]).then((res) => {
	// 		return tokenBridge.data.getAccountTokenTransfers(res, offset.value, limit.value)
	// 	}).then((res) => {
	// 		transfersStore.addTransfers(res, 'all')
	// 		offset.value += limit.value
	// 	}).finally(() => {
	// 		isLoading.value = false
	// })
		
	// }, 5000);

	Promise.all( [
		tokenBridge.getTezosConnectedAddress(),
		tokenBridge.getEtherlinkConnectedAddress()
		]).then((res) => {
			return tokenBridge.data.getAccountTokenTransfers(res, offset.value, limit.value)
		}).then((res) => {
			transfersStore.addTransfers(res, 'all')
			offset.value += limit.value
		}).finally(() => {
			isLoading.value = false
	})

}

loadTransfers()

onMounted(() => {
	transfersListEl.value.wrapper.addEventListener('scroll', handleScroll)
});

onBeforeUnmount(() => {
	transfersStore.clearStore()
	transfersListEl.value.wrapper.removeEventListener('scroll', handleScroll)
})
</script>

<template>
	<Flex direction="column" align="center" ref="transfersListEl" :class="$style.wrapper">
		<Flex align="center" justify="between" wide :class="$style.filters">
			<Text>Filter1</Text>

			<Text>Filter2</Text>
		</Flex>
		<Flex v-if="isLoading" :class="$style.overlay">
			<Flex align="center" gap="10" :class="$style.spinner">
				<Spinner size="20" />
				<Text size="20" weight="600" color="secondary">Loading transfers..</Text>
				<!-- To do (?): for looong loading -->
			</Flex>
		</Flex>
		<TransfersList
			:transfers="allTransfers"
		/>

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

.spinner {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 999;
}
</style>