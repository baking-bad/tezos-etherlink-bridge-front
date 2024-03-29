import { defineStore } from "pinia"
import TezService from '@/services/tezos'
import EthService from '@/services/etherlink'
import { watch, ref, computed } from "vue"
import { useDisconnect, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/vue"
import { ConnectionStatus } from "@/services/constants/wallets.js"
import { useTokensStore } from "@/stores/tokens.js"

export const useWalletsStore =  defineStore("wallets", () => {
	const tezStatus = ref(ConnectionStatus.NOT_CONNECTED)
	const tezConnected = computed(() => tezStatus.value === ConnectionStatus.CONNECTED)

	const tezAddress = ref()

	//FIXME: can i merge it with next watch?
	async function tezCheckConnection() {
		if (tezAddress.value) return
		/** Check existing connection  */
		const activeAccount = await TezService.instances.beacon.client.getActiveAccount()
		const addr = activeAccount?.address
		if (addr) {
			tezAddress.value = addr
			tezStatus.value = ConnectionStatus.CONNECTED
		}
	}

	const tezSubscribed = ref(false)

	watch(
		() => tezAddress.value,
		(newVal) => {
			if (!newVal || !!tezSubscribed.value) return
			/** Listen for account changes */
			TezService.instances.beacon.client.subscribeToEvent('ACTIVE_ACCOUNT_SET', ({ address }) => {
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
			const { address: account } = await TezService.instances.beacon.client.requestPermissions()

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

		return TezService.instances.beacon.client.disconnect()
	}

	const { address: ethAddress, isConnected: ethIsConnected } = useWeb3ModalAccount()
	const ethStatus = computed(() => (ethIsConnected.value ? ConnectionStatus.CONNECTED : ConnectionStatus.NOT_CONNECTED))
	const ethConnected = computed(() => !!ethIsConnected.value)
	const ethConnect = async () => {
		try {
			const web3Modal = useWeb3Modal()
			web3Modal.open()
		} catch (error) {
			console.log(error)
		}
	}
	const { disconnect: ethDisconnectWallet } = useDisconnect()
	const ethDisconnect = () => {
		ethAddress.value = null
		ethIsConnected.value = ConnectionStatus.NOT_CONNECTED

		ethDisconnectWallet()
	}
	const allConnected = computed(() => {
		return tezStatus.value === ConnectionStatus.CONNECTED && ethStatus.value === ConnectionStatus.CONNECTED
	})

	const walletProviderUpdated = ref(false);
	const { walletProvider } = useWeb3ModalProvider()
	watch(
		() => walletProvider.value,
		async (newVal) => {
			EthService.instances.toolkit.setProvider(newVal)
			walletProviderUpdated.value = true
			const tokens = useTokensStore()
			tokens.mergeBalances();
		},
	)

	watch(
		() => ({ tezAddres: tezAddress.value, ethAddress: ethAddress.value }),
		() => {
			const tokens = useTokensStore()
			tokens.mergeBalances();
		}
	)

	return {
		tezAddress,
		tezStatus,
		tezConnected,
		tezConnect,
		tezDisconnect,
		tezCheckConnection,
		ethAddress,
		ethStatus,
		ethConnected,
		ethConnect,
		ethDisconnect,
		allConnected,
		walletProviderUpdated
	}
})