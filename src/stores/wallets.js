import { defineStore } from "pinia"
import TezService from '@/services/tezos'
import EthService from '@/services/etherlink'
import { watch, ref, computed, onMounted } from "vue"
import { useDisconnect, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/vue"
import { ConnectionStatus } from "@/services/constants/wallets.js"
import TezosService from "@/services/tezos/index.js"

export const useWalletsStore =  defineStore("wallets", () => {
	const { address: ethAddress, isConnected: ethIsConnected } = useWeb3ModalAccount()
	const { disconnect: ethDisconnectWallet } = useDisconnect()
	const ethStatus = computed(() => (ethIsConnected.value ? ConnectionStatus.CONNECTED : ConnectionStatus.NOT_CONNECTED))
	const ethConnect = async () => {
		try {
			const web3Modal = useWeb3Modal()
			web3Modal.open()
		} catch (error) {
			console.log(error)
		}
	}
	const ethDisconnect = () => {
		ethAddress.value = null
		ethIsConnected.value = ConnectionStatus.NOT_CONNECTED

		ethDisconnectWallet()
	}

	const tezStatus = ref(ConnectionStatus.NOT_CONNECTED)

	const tezAddress = ref()

	onMounted(async () => {
		if (tezAddress.value) return

		/** Check existing connection  */
		const activeAccount = await TezosService.instances.beacon.client.getActiveAccount()
		const addr = activeAccount?.address

		if (addr) {
			tezAddress.value = addr
			tezStatus.value = ConnectionStatus.CONNECTED
		}
	})

	// watch(
	// 	() => address.value,
	// 	() => {
	// 		if (!address.value) return
	//
	// 		/** Listen for account changes */
	// 		TezosService.instances.beacon.client.subscribeToEvent("ACTIVE_ACCOUNT_SET", async ({ address: addr }) => {
	// 			if (addr) {
	// 				address.value = addr
	// 				status.value = ConnectionStatus.CONNECTED
	// 			} else {
	// 				address.value = null
	// 				status.value = ConnectionStatus.NOT_CONNECTED
	// 			}
	// 		})
	// 	},
	// )

	const tezConnect = async () => {
		try {
			const { address: account } = await TezosService.instances.beacon.client.requestPermissions()

			tezAddress.value = account
			tezStatus.value = ConnectionStatus.CONNECTED

			return tezAddress.value
		} catch (error) {
			console.log(error)
		}
	}

	const tezDisconnect = () => {
		tezAddress.value = null
		tezStatus.value = ConnectionStatus.NOT_CONNECTED

		return TezosService.instances.beacon.client.disconnect()
	}

	const allConnected = computed(() => {
		return tezStatus.value === ConnectionStatus.CONNECTED && ethStatus.value === ConnectionStatus.CONNECTED
	})
	const wallet = ref(null);
	watch(
		() => [TezService.instances, EthService.instances],
		([newTezInstances, newEthInstances]) => {
			console.log(newTezInstances, newEthInstances)
		}
	)
	return {
		ethAddress,
		ethStatus,
		ethConnect,
		ethDisconnect,
		tezAddress,
		tezStatus,
		tezConnect,
		tezDisconnect,
		allConnected
	}
})