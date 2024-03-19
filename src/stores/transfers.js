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

	const tokenBridge = ref(TokenBridgeService.instances.tokenBridge)
	tokenBridge.value.addEventListener('tokenTransferUpdated', updateTransfer)

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
		console.log('update', transfer);
		let foundTransfers = searchTransfers(transfer)
		console.log('found', foundTransfers);
		if (foundTransfers.length > 0) {
			transfer.steps = getSteps(transfer)
			foundTransfers.forEach(t => {
				Object.assign(t, transfer)
				checkSubscribe(t)
			})
		} else {
			// To do: add notification
		}

	}

	function searchTransfers(transfer) {
		console.log('start search', transfer);
		let res = [...recentTransfers.value, ...allTransfers.value]
		
		return res.filter(t => {
			return t.tezosOperation ? t.tezosOperation.hash === transfer.tezosOperation.hash : t.etherlinkOperation.hash === transfer.etherlinkOperation.hash
		})
	}

	function checkSubscribe(transfer) {
		let lastStep = transfer.steps[transfer.steps?.length - 1]
		if (!lastStep.passed && !transfer.subscribed) {
			console.log('subscribe', transfer);
			tokenBridge.value.stream.subscribeToTokenTransfer(transfer)
			transfer.subscribed = true
		} else if (lastStep.passed && transfer.subscribed) {
			console.log('unsubscribe', transfer);
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