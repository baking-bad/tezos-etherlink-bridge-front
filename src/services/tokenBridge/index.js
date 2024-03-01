import {
	TokenBridge, DefaultDataProvider,
	defaultEtherlinkKernelAddress, defaultEtherlinkWithdrawPrecompileAddress
} from '@baking-bad/tezos-etherlink-bridge-sdk'

import { tokenPairs } from "@/services/cfg/tokens"
import etherlink from "@/services/etherlink"
import tezos from "@/services/tezos"
import { reactive } from "vue"

const defaultDataProvider = new DefaultDataProvider({
	dipDup: {
		baseUrl: 'https://etherlink-bridge-indexer.dipdup.net',
		webSocketApiBaseUrl: 'wss://etherlink-indexer.dipdup.net'
	},
	tzKTApiBaseUrl: 'https://api.oxfordnet.tzkt.io',
	etherlinkRpcUrl: 'https://etherlink.dipdup.net',
	tokenPairs
})

const instances = reactive({
	tokenBridge: null
})

const init = () => {
	instances.tokenBridge = new TokenBridge({
		tezos: {
			toolkit: tezos.instances.toolkit,
			bridgeOptions: {
				rollupAddress: 'sr1T4XVcVtBRzYy52edVTdgup9Kip4Wrmn97'
			}
		},
		etherlink: {
			toolkit: etherlink.instances.toolkit,
			bridgeOptions: {
				kernelAddress: defaultEtherlinkKernelAddress,
				withdrawPrecompileAddress: defaultEtherlinkWithdrawPrecompileAddress
			}
		},
		bridgeDataProviders: {
			tokens: defaultDataProvider,
			balances: defaultDataProvider,
			transfers: defaultDataProvider
		}
	})
}

export default { init, instances }

