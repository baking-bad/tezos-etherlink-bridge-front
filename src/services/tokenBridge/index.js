import {
	TokenBridge, DefaultDataProvider,
	TaquitoWalletTezosBridgeBlockchainService, Web3EtherlinkBridgeBlockchainService,
	loggerProvider as sdkLoggerProvider
} from '@baking-bad/tezos-etherlink-bridge-sdk'

import { tokenPairs } from "@/services/cfg/tokens"
import etherlink from "@/services/etherlink"
import tezos from "@/services/tezos"

const defaultDataProvider = new DefaultDataProvider({
	dipDup: {
		baseUrl: import.meta.env.VITE_SDK_URL,
		webSocketApiBaseUrl: import.meta.env.VITE_SDK_WSS,
	},
	tzKTApiBaseUrl: `https://api.${import.meta.env.VITE_TEZOS_NETWORK_NAME}.tzkt.io`,
	etherlinkRpcUrl: import.meta.env.VITE_ETHERLINK_RPC,
	tokenPairs,
})

const instances = {
	tokenBridge: null
}

const init = async () => {
	instances.tokenBridge = new TokenBridge({
		tezosBridgeBlockchainService: new TaquitoWalletTezosBridgeBlockchainService({
			tezosToolkit: tezos.instances.toolkit,
			smartRollupAddress: import.meta.env.VITE_SMART_ROLLUP_ADDRESS,
		}),
		etherlinkBridgeBlockchainService: new Web3EtherlinkBridgeBlockchainService({
			web3: etherlink.instances.toolkit,
			withdrawNativeTokenPrecompileAddress: '0xff00000000000000000000000000000000000001',
            withdrawNonNativeTokenPrecompileAddress: '0xff00000000000000000000000000000000000002',
		}),	
		bridgeDataProviders: {
			transfers: defaultDataProvider,
			balances: defaultDataProvider,
			tokens: defaultDataProvider,
		}
	})

	window.sdkLoggerProvider = sdkLoggerProvider
}

export default { init, instances }

