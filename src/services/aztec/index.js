// /** Vendor */
// import Web3 from "web3"
// import { createWeb3Modal, defaultConfig, useWeb3ModalProvider } from "@web3modal/ethers/vue"

// import { createAppKit } from '@reown/appkit/vue'
// import { arbitrum, mainnet } from '@reown/appkit/networks'
// import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// /** Services */
// import { config } from "@/services/cfg"

// const instances = {
// 	web3Modal: null,
// 	toolkit: null,
// }

// const init = () => {
// 	// instances.web3Modal = createWeb3Modal({
// 	// 	ethersConfig: defaultConfig({
// 	// 		metadata: {
// 	// 			name: config.app.name,
// 	// 			description: config.app.description,
// 	// 			url: config.app.url,
// 	// 			icons: [],
// 	// 		},
// 	// 	}),
// 	// 	chains: [
// 	// 		{
// 	// 			chainId: config.etherlink.network.chainId,
// 	// 			name: config.etherlink.network.name,
// 	// 			currency: config.etherlink.network.nativeCurrency.symbol,
// 	// 			rpcUrl: config.etherlink.network.rpcUrl,
// 	// 			explorerUrl: config.etherlink.network.blockExplorerUrl,
// 	// 		},
// 	// 	],
// 	// 	projectId: config.walletConnectProjectId,
// 	// 	enableAnalytics: false,
// 	// })

// 	// 1. Get projectId from https://cloud.reown.com
// 	const projectId = config.walletConnectProjectId

// 	// 2. Create a metadata object
// 	const metadata = {
// 		name: config.app.name,
// 		description: config.app.description,
// 		url: config.app.url,
// 		icons: [],
// 	}

// 	// 3. Set the networks
// 	const networks = [mainnet, arbitrum]
// 	console.log('networks', networks);


// 	// 4. Create Wagmi Adapter
// 	const wagmiAdapter = new WagmiAdapter({
// 		networks,
// 		projectId
// 	})

// 	// 5. Create the modal
// 	const modal = createAppKit({
// 		adapters: [wagmiAdapter],
// 		networks,
// 		projectId,
// 		metadata,
// 		features: {
// 			analytics: true // Optional - defaults to your Cloud configuration
// 		}
// 	})

// 	// const { walletProvider } = useWeb3ModalProvider()
// 	// instances.toolkit = new Web3(walletProvider.value)
// }

// export default { init, instances }

