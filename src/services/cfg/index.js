import { capitalize } from "@/services/utils"

const appUrl = window.location.origin
const tezosNetworkName = import.meta.env.VITE_TEZOS_NETWORK_NAME

export const config = {
	isTestnet: true,
	isMock: false,
	app: {
		name: "Etherlink Bridge",
		description: "",
		url: appUrl,
	},
	bridge: {
		smartRollupAddress: import.meta.env.VITE_SMART_ROLLUP_ADDRESS,
	},
	tezos: {
		network: {
			name: tezosNetworkName,
			displayName: capitalize(tezosNetworkName),
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
			rpcUrl: import.meta.env.VITE_ETHERLINK_RPC,
			blockExplorerUrl: import.meta.env.VITE_ETHERLINK_EXPLORER,
		},
	},
	providers: {
		dipDup: {
			baseUrl: import.meta.env.VITE_SDK_URL,
			webSocketApiBaseUrl: import.meta.env.VITE_SDK_WSS,
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
