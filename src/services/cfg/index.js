const appUrl = window.location.origin
const tezosNetworkName = "parisnet"

export const config = {
	isTestnet: true,
	isMock: false,
	app: {
		name: "Etherlink Bridge",
		description: "",
		url: appUrl,
	},
	bridge: {
		smartRollupAddress: "sr1GBHEgzZmpWH4URqshZEZFCxBpqzi6ahvL",
		smartRollupNodeBaseUrl: "https://etherlink-rollup-paris.dipdup.net",
	},
	tezos: {
		network: {
			name: tezosNetworkName,
			displayName: tezosNetworkName[0].toLocaleUpperCase() + tezosNetworkName.slice(1),
			rpcUrl: `https://rpc.tzkt.io/${tezosNetworkName}`,
			blockExplorerUrl: `https://${tezosNetworkName ? tezosNetworkName + '.' : ''}tzkt.io`
		},
	},
	etherlink: {
		network: {
			name: "Etherlink Testnet",
			displayName: "Etherlink Testnet",
			chainId: 1337, // '0x539',
			nativeCurrency: {
				name: "XTZ",
				symbol: "XTZ",
				decimals: 18,
			},
			rpcUrl: "https://etherlink.dipdup.net",
			blockExplorerUrl: "https://blockscout.dipdup.net",
		},
	},
	providers: {
		dipDup: {
			baseUrl: "https://etherlink-bridge-indexer.dipdup.net",
			webSocketApiBaseUrl: "wss://etherlink-bridge-indexer.dipdup.net",
		},
		tzKT: {
			baseUrl: `https://api.${tezosNetworkName}.tzkt.io`,
		},
	},
	walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
}

export const statusMapping = {
	0: "Pending",
	100: "Created",
	200: "Sealed",
	300: "Finished",
	400: "Failed",
}
