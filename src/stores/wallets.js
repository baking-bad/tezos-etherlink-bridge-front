import { defineStore } from "pinia"
// import TezService from '@/services/tezos'
import EthService from '@/services/etherlink'
import { watch, ref, computed, onMounted } from "vue"
import { useDisconnect, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/vue"
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

	//FIXME: remake to initTezos
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

	const tezSubscribed = ref(false)

	watch(
		() => tezAddress.value,
		(newVal) => {
			if (!newVal || !!tezSubscribed.value) return
			/** Listen for account changes */
			TezosService.instances.beacon.client.subscribeToEvent("ACTIVE_ACCOUNT_SET", async ({ address }) => {
				if (address) {
					tezAddress.value = address
					tezStatus.value = ConnectionStatus.CONNECTED
				} else {
					tezAddress.value = null
					tezStatus.value = ConnectionStatus.NOT_CONNECTED
				}
			})
			tezSubscribed.value = true
		},
	)

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
	const { walletProvider } = useWeb3ModalProvider()
	watch(
		() => walletProvider.value,
		async (newVal) => {
			EthService.instances.toolkit.setProvider(newVal)
		},
	)

	watch(
		() => [tezAddress.value, ethAddress.value],
		([newTezAddress, newEthAddress]) => {
			console.log('get balances for addresses', [newTezAddress, newEthAddress])
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