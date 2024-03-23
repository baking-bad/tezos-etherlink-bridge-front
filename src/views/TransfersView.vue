<script setup>
/** Vendor */
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { storeToRefs } from "pinia"
import { BridgeTokenTransferStatus, BridgeTokenTransferKind } from '@baking-bad/tezos-etherlink-bridge-sdk';

/** Components */
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
import { capitilize, getStates } from "@/services/utils"

/** Store */
import { useTransfersStore } from "@/stores/transfers.js"
const transfersStore = useTransfersStore()
const { allTransfers } = storeToRefs(transfersStore)

const { tokenBridge } = TokenBridgeService.instances

const isLoading = ref(false)
const loadMore = ref(true)

const offset = ref(0)
const limit = ref(20)

const loadTransfers = () => {
	isLoading.value = true

	tokenBridge.data.getSignerTokenTransfers({
		filter: {
			status: !isNaN(BridgeTokenTransferStatus[selectedState.value]) ? [BridgeTokenTransferStatus[selectedState.value]] : null,
			kind: !isNaN(BridgeTokenTransferKind[selectedKind.value]) ? [BridgeTokenTransferKind[selectedKind.value]] : null,
		},
		offset: offset.value,
		limit: limit.value,
	})
	.then((res) => {
		loadMore.value = res.length === limit.value
		offset.value += limit.value
		transfersStore.addTransfers(res, 'all')
	}).finally(() => {
		isLoading.value = false
	})
}

/** Filters */
const selectedState = ref('All states')
const transferStates = ref(getStates())
transferStates.value.unshift(selectedState.value)

const selectedKind = ref('All transfers')
const transferKinds = ['All transfers', 'Deposit', 'Withdrawal']

const filtersChanged = () => {
	transfersStore.clearStore()
	loadMore.value = true
	offset.value = 0
	loadTransfers()
}

const handleKindSelect = (kind) => {
	selectedKind.value = kind
	filtersChanged()
}

const handleStatusSelect = (status) => {
	selectedState.value = status
	filtersChanged()
}

const transfersListEl = ref(null)
const handleScroll = () => {
	if (transfersListEl.value.wrapper.scrollHeight - transfersListEl.value.wrapper.scrollTop -300 <= transfersListEl.value.wrapper.clientHeight && loadMore.value && !isLoading.value) {
		loadTransfers()
	}
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
			<Dropdown>
				<template #trigger="{isOpen}">
					<Flex align="center" gap="6" :class="$style.selector">
						<Text size="16" color="secondary"> {{ selectedKind }} </Text>
						<Icon
							name="chevron-right"
							size="14"
							color="tertiary"
							:style="{
										transform: `rotate(${!isOpen ? '90deg' : '-90deg'})`,
										transition: 'all 200ms ease',
									}"
						/>
					</Flex>
				</template>
				<template #popup>
					<DropdownItem v-for="kind in transferKinds.filter(k => k !== selectedKind)" @click="handleKindSelect(kind)">
						<Text size="13" color="secondary"> {{ kind }} </Text>
					</DropdownItem>
				</template>
			</Dropdown>


			<Dropdown>
				<template #trigger="{isOpen}">
					<Flex align="center" gap="6" :class="$style.selector">
						<Text size="16" color="secondary"> {{ selectedState }} </Text>
						<Icon
							name="chevron-right"
							size="14"
							color="tertiary"
							:style="{
										transform: `rotate(${!isOpen ? '90deg' : '-90deg'})`,
										transition: 'all 200ms ease',
									}"
						/>
					</Flex>
				</template>
				<template #popup>
					<DropdownItem v-for="status in transferStates.filter(s => s !== selectedState)" @click="handleStatusSelect(status)">
						<Text size="13" color="secondary"> {{ status }} </Text>
					</DropdownItem>
				</template>
			</Dropdown>
		</Flex>

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

.empty {
	padding-top: 50px;
}
</style>