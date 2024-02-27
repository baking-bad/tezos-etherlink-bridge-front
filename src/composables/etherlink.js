/** Vendor */
import { computed } from "vue"
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/vue"

/** Services */
import EtherlinkService from "@/services/etherlink"

/** Constants */
import { ConnectionStatus } from "@/services/constants/wallets"

export const useEtherlink = () => {
	const { address, isConnected } = useWeb3ModalAccount()

	const status = computed(() => (isConnected.value ? ConnectionStatus.CONNECTED : ConnectionStatus.NOT_CONNECTED))

	const connect = async () => {
		try {
			const web3Modal = useWeb3Modal()
			web3Modal.open()
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
