/** Vendor */
import { reactive } from "vue"
import Web3 from "web3"
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/vue"
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
	instances.toolkit = new Web3(window.ethereum)
}

export default { init, instances }
