<script setup>
/** Vendor */
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import { storeToRefs } from "pinia"
import { BridgeTokenTransferStatus, BridgeTokenTransferKind } from '@baking-bad/tezos-etherlink-bridge-sdk';

/** Components */
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
const { tokenBridge } = TokenBridgeService.instances


/** Store */
import { useTransfersStore } from "@/stores/transfers.js"
import { useWalletsStore } from "@/stores/wallets.js"
import TransfersFilters from "@/components/TransfersFilters.vue"
const transfersStore = useTransfersStore()
const { allTransfers } = storeToRefs(transfersStore)
const { tezAddress, ethAddress, walletProviderUpdated } = storeToRefs(useWalletsStore())

const isLoading = ref(false)
const loadMore = ref(true)

const offset = ref(0)
const limit = ref(20)

const loadTransfers = async (reset) => {
	isLoading.value = true
	try {
		const statusCode = BridgeTokenTransferStatus[filters.value.state]
		const kindCode = BridgeTokenTransferKind[filters.value.kind]
		const res = await tokenBridge.data.getSignerTokenTransfers({
			filter: {
				status: statusCode !== undefined ? [statusCode] : null,
				kind: kindCode !== undefined ? [kindCode] : null,
			},
			offset: offset.value,
			limit: limit.value,
		})
		loadMore.value = res.length === limit.value
		offset.value += limit.value
		if (reset) transfersStore.clearStore()
		transfersStore.addTransfers(res, 'all')
	} catch(error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
}

const filters = ref({
	state: 'All states',
	kind: 'All transfers'
})

/** Filters */

const resetTransfers = () => {
	transfersStore.clearStore()
	loadMore.value = true
	offset.value = 0
}

const transfersListEl = ref(null)
const handleScroll = async () => {
	if (transfersListEl.value.wrapper.scrollHeight - transfersListEl.value.wrapper.scrollTop -300 <= transfersListEl.value.wrapper.clientHeight && loadMore.value && !isLoading.value) {
		loadTransfers()
	}
}


watch(
	() => [tezAddress.value, ethAddress.value, walletProviderUpdated.value],
	() => {
		resetTransfers();
		loadTransfers(true)
	},
	{ immediate: true }
)

watch(
	() => filters.value,
	() => {
		resetTransfers();
		loadTransfers(true);
	},
)

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
		<TransfersFilters v-model="filters"/>
		<Flex v-if="isLoading" :class="$style.overlay">
			<Flex align="center" gap="10" :class="$style.spinner">
				<Spinner size="20" />
				<Text size="20" weight="800" color="secondary">Loading transfers..</Text>
				<!-- To do (?): for looong loading -->
			</Flex>
		</Flex>

		<TransfersList
			v-if="allTransfers.length > 0"
			:transfers="allTransfers"
		/>

		<Flex v-else-if="!isLoading" :class="$style.empty">
			<Text size="16" color="secondary">No transfers found . . .</Text>
		</Flex>

	</Flex>
</template>

<style module>

.wrapper {
	overflow-y: auto;
	height: calc(100vh - 70px - 48px);
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

.empty {
	padding-top: 50px;
}
</style>