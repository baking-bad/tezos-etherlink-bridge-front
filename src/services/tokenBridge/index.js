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
		baseUrl: 'https://etherlink-bridge-indexer.dipdup.net',
		webSocketApiBaseUrl: 'wss://etherlink-bridge-indexer.dipdup.net'
	},
	tzKTApiBaseUrl: 'https://api.parisnet.tzkt.io',
	etherlinkRpcUrl: 'https://etherlink.dipdup.net',
	tokenPairs
})

const instances = {
	tokenBridge: null
}

const init = async () => {
	instances.tokenBridge = new TokenBridge({
		tezosBridgeBlockchainService: new TaquitoWalletTezosBridgeBlockchainService({
			tezosToolkit: tezos.instances.toolkit,
			smartRollupAddress: 'sr1GBHEgzZmpWH4URqshZEZFCxBpqzi6ahvL'
		}),
		etherlinkBridgeBlockchainService: new Web3EtherlinkBridgeBlockchainService({
			web3: etherlink.instances.toolkit,
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
