/** Vendor */
import { computed } from "vue"
import { useWeb3Modal, useWeb3ModalAccount, useDisconnect } from "@web3modal/ethers/vue"

/** Services */
import EtherlinkService from "@/services/etherlink"

/** Constants */
import { ConnectionStatus } from "@/services/constants/wallets"

export const useEtherlink = () => {
	const { address, isConnected } = useWeb3ModalAccount()
	const { disconnect: disconnectWallet } = useDisconnect()

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
		isConnected.value = ConnectionStatus.NOT_CONNECTED
		disconnectWallet()

		// useDisconnect()
		// return EtherlinkService.instances.tokenBridge.disconnect()
	}

	return { address, status, connect, disconnect }
}
