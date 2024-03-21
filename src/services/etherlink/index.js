/** Vendor */
import Web3 from "web3"
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider } from "@web3modal/ethers/vue"
import { watch } from "vue";
// import { EthersStoreUtil } from "@web3modal/scaffold-utils/ethers"

/** Services */
import { config } from "@/services/cfg"

const instances = {
	web3Modal: null,
	toolkit: null,
}

const init = () => {
	instances.web3Modal = createWeb3Modal({
		ethersConfig: defaultConfig({
			metadata: {
				name: config.app.name,
				description: config.app.description,
				url: config.app.url,
				icons: [],
			},
		}),
		chains: [
			{
				chainId: config.etherlink.network.chainId,
				name: config.etherlink.network.name,
				currency: config.etherlink.network.nativeCurrency.symbol,
				rpcUrl: config.etherlink.network.rpcUrl,
				explorerUrl: config.etherlink.network.blockExplorerUrl,
			},
		],
		projectId: config.walletConnectProjectId,
		enableAnalytics: false,
	})

	const { walletProvider } = useWeb3ModalProvider()
	instances.toolkit = new Web3(walletProvider.value)

	watch(
		() => walletProvider.value,
		() => {
			instances.toolkit.setProvider(walletProvider.value)
		},
	)
	
}

export default { init, instances }
