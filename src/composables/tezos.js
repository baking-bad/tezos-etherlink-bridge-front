/** Vendor */
import { ref, watch, onMounted } from "vue"

/** Services */
import TezosService from "@/services/tezos"

/** Constants */
import { ConnectionStatus } from "@/services/constants/wallets"

export const useTezos = () => {
	const status = ref(ConnectionStatus.NOT_CONNECTED)

	const address = ref()

	onMounted(async () => {
		if (address.value) return

		/** Check existing connection  */
		const activeAccount = await TezosService.instances.beacon.client.getActiveAccount()
		const addr = activeAccount?.address

		if (address) {
			address.value = addr
			status.value = ConnectionStatus.CONNECTED
		}
	})

	watch(
		() => address.value,
		() => {
			if (!address.value) return

			/** Listen for account changes */
			TezosService.instances.beacon.client.subscribeToEvent("ACTIVE_ACCOUNT_SET", async ({ address: addr }) => {
				if (addr) {
					address.value = addr
					status.value = ConnectionStatus.CONNECTED
				} else {
					address.value = null
					status.value = ConnectionStatus.NOT_CONNECTED
				}
			})
		},
	)

	const connect = async () => {
		try {
			const { address: account } = await TezosService.instances.beacon.client.requestPermissions()

			address.value = account
			status.value = ConnectionStatus.CONNECTED

			return address.value
		} catch (error) {
			console.log(error)
		}
	}

	const disconnect = () => {
		address.value = null
		status.value = ConnectionStatus.NOT_CONNECTED

		return TezosService.instances.beacon.client.disconnect()
	}

	return { address, status, connect, disconnect }
}
