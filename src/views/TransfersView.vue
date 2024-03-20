<script setup>
/** Vendor */
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import { storeToRefs } from "pinia"

/** Components */
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"
import TransfersList from "@/components/TransfersList.vue"
import Spinner from "@/components/ui/Spinner.vue"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
const { tokenBridge } = TokenBridgeService.instances
import { capitilize, getStatuses } from "@/services/utils"


/** Store */
import { useTransfersStore } from "@/stores/transfers.js"
const transfersStore = useTransfersStore()
const { allTransfers } = storeToRefs(transfersStore)

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

	tokenBridge.data.getSignerTokenTransfers({ offset: offset.value, limit: limit.value })
	.then((res) => {
		transfersStore.addTransfers(res, 'all')
		offset.value += limit.value
	}).finally(() => {
		isLoading.value = false
	})
}

loadTransfers()

/** Filters */
const selectedState = ref('all states')
const transferStates = ref(getStatuses())
transferStates.value.unshift(selectedState.value)
const handleStatusSelect = (status) => {
	selectedState.value = status
}

const selectedKind = ref('all transfers')
const transferKinds = ['all transfers', 'deposits', 'withdrawals']

const handleKindSelect = (kind) => {
	selectedKind.value = kind
}

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
						<Text size="16" color="secondary"> {{ capitilize(selectedKind) }} </Text>
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
						<Text size="13" color="secondary"> {{ capitilize(kind) }} </Text>
					</DropdownItem>
				</template>
			</Dropdown>


			<Dropdown>
				<template #trigger="{isOpen}">
					<Flex align="center" gap="6" :class="$style.selector">
						<Text size="16" color="secondary"> {{ capitilize(selectedState) }} </Text>
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
						<Text size="13" color="secondary"> {{ capitilize(status) }} </Text>
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