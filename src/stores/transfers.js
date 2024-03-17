/** Vendor */
import { computed, ref, watch } from "vue"
import { defineStore } from "pinia"
import { v4 as uuidv4 } from "uuid"

/** Services */
import { getSteps } from "@/services/utils";
import TokenBridgeService from "@/services/tokenBridge"

export const useTransfersStore = defineStore("transfers", () => {
	const transfers = ref([])
	const lastTransfer = ref({})

	const tokenBridge = computed(() => TokenBridgeService.instances.tokenBridge)

	function addTransfers(newTransfers) {
		newTransfers.forEach(t => {
			// t.id = uuidv4()
			t.steps = getSteps(t)
		})

		transfers.value.push(...newTransfers)
	}

	function addLastTransfer(newTransfer) {
		// newTransfer.id = uuidv4()
		newTransfer.steps = getSteps(newTransfer)

		lastTransfer.value = newTransfer
		tokenBridge.value.stream.subscribeToTokenTransfer(newTransfer)
	}

	function updateTransfer(transfer) {
		if (compareTransfers(lastTransfer.value, transfer)) {
			let steps = getSteps(transfer)
			lastTransfer.value = {
				...transfer,
				steps: steps,
			}

			if (steps[steps.length - 1].passed) {
				tokenBridge.stream.unsubscribeFromTokenTransfer(transfer)
			}
		}
	}

	function compareTransfers(a, b) {
		return a.tezosOperation?.hash === b.tezosOperation?.hash || a.etherlinkOperation?.hash === b.etherlinkOperation?.hash
	}

	return { lastTransfer, transfers, addLastTransfer, addTransfers, updateTransfer }
})
