/** Vendor */
import { computed, ref, watch } from "vue"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"

/** Services */
import { getSteps } from "@/services/utils";
import TokenBridgeService from "@/services/tokenBridge"

export const useTransfersStore = defineStore("transfers", () => {
	const allTransfers = ref([])
	const recentTransfers = ref([])

	const tokenBridge = computed(() => TokenBridgeService.instances.tokenBridge)

	function addTransfers(newTransfers, store) {
		newTransfers.forEach(t => {
			t.id = uuidv4()
			t.steps = getSteps(t)
			t.removable = store === 'recent'
			checkSubscribe(t)
		})

		if (store === 'recent') {
			recentTransfers.value.unshift(...newTransfers)
		} else if (store === 'all') {
			allTransfers.value.push(...newTransfers)
		}
	}

	function updateTransfer(transfer) {
		let foundTransfer = searchTransfer(transfer)
		if (foundTransfer) {
			transfer.steps = getSteps(transfer)
			Object.assign(foundTransfer, transfer)
			checkSubscribe(foundTransfer)
		} else {
			// To do: add notification
		}
	}

	function searchTransfer(transfer) {
		let res = recentTransfers.value.find(t => {
			return t.tezosOperation?.hash === transfer.tezosOperation?.hash || t.etherlinkOperation?.hash === transfer.etherlinkOperation?.hash
		})
		if (!res) {
			res = allTransfers.value.find(t => {
				return t.tezosOperation?.hash === transfer.tezosOperation?.hash || t.etherlinkOperation?.hash === transfer.etherlinkOperation?.hash
			})
		}
		
		return res
	}

	function checkSubscribe(transfer) {
		let lastStep = transfer.steps[transfer.steps?.length - 1]
		if (!lastStep.passed && !transfer.subscribed) {
			tokenBridge.value.stream.subscribeToTokenTransfer(transfer)
			transfer.subscribed = true
		} else if (lastStep.passed && transfer.subscribed) {
			tokenBridge.value.stream.unsubscribeFromTokenTransfer(transfer)
			transfer.subscribed = false
		}
	}

	function removeRecentTransfer(transfer) {
		recentTransfers.value = recentTransfers.value.filter((t) => t.id !== transfer.id)
	}

	function clearStore() {
		tokenBridge.value.stream.unsubscribeFromAllSubscriptions()
		allTransfers.value = []
		recentTransfers.value = []
	}

	return { recentTransfers, allTransfers, addTransfers, clearStore, removeRecentTransfer, updateTransfer }
})
