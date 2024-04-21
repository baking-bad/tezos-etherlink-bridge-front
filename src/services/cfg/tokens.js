export const tokenPairs = [
	{
		tezos: {
			type: "native",
			name: "Tezos",
			fakeAddress: 'tezosNative',
			ticker: "XTZ",
			decimals: 6,
			icon: "xtz",
			ticketHelperContractAddress: "KT1MJxf4KVN3sosR99VRG7WBbWTJtAyWUJt9",
		},
		etherlink: {
			type: "native",
			name: "Tezos",
			fakeAddress: 'etherlinkNative',
			ticker: "XTZ",
			decimals: 18,
			icon: "xtz",
		},
	},
	{
		tezos: {
			type: "fa1.2",
			name: "tzBTC",
			ticker: "tzBTC",
			address: "KT1KQ4myF9ekWazFTGjRboaFgTWeu9J1ps4m",
			decimals: 8,
			icon: "tzbtc",
			ticketerContractAddress: "KT1KUhD7qjMSxoQxyJcFUyGQWMcMuiruXnyh",
			ticketHelperContractAddress: "KT19ggVkcZFRRutiyDbmU4iVLpkQRm94SLbE",
		},
		etherlink: {
			type: "erc20",
			name: "tzBTC",
			ticker: "tzBTC",
			address: "0x87dcBf128677ba36E79D47dAf4eb4e51610e0150",
			decimals: 8,
			icon: "tzbtc",
		},
	},
	{
		tezos: {
			type: "fa1.2",
			name: "Sirius",
			ticker: "SIRS",
			address: "KT1F8RXfsdGZXR8AYvDGTjEEg4SY7SdakD9y",
			decimals: 0,
			icon: "sirs",
			ticketerContractAddress: "KT1HF2CqbX4Y7vivhQQZUjaedh5pMZvugowS",
			ticketHelperContractAddress: "KT1E2RvgzjpwLookeBzqeDYhSxRhqiY2PShZ",
		},
		etherlink: {
			type: "erc20",
			name: "Sirius",
			ticker: "SIRS",
			address: "0xcB5d40c6B1bdf5Cd51b3801351b0A68D101a561b",
			decimals: 0,
			icon: "sirs",
		},
	},
	{
		tezos: {
			type: "fa2",
			name: "Tether USD",
			ticker: "USDt",
			address: "KT1QbE9Y61X8iQha24FxKVy1nDXv7KLVmPPM",
			tokenId: "0",
			decimals: 6,
			icon: "usdt",
			ticketerContractAddress: "KT1A8zkhk8FZhLhA1CqFuHM17WXunYuAtonw",
			ticketHelperContractAddress: "KT1R7bVGLYjwPiscSRuEDj8CXv11iXCYvvXb",
		},
		etherlink: {
			type: "erc20",
			name: "Tether USD",
			ticker: "USDt",
			address: "0x8554cD57C0C3E5Ab9d1782c9063279fA9bFA4680",
			decimals: 6,
			icon: "usdt",
		},
	},
]

export const getTokenKey = (token) => {
	return token?.address || token?.fakeAddress || undefined
}

// TODO: add id for fa2 tokens, maybe get rid of fakeAddress and make it address

export const isSameToken = (tokenA, tokenB) => {
	return getTokenKey(tokenA) === getTokenKey(tokenB)
}

export const getToken = (chain, address) => {
	let pair = tokenPairs.find(p => {
        if (!address) return p[chain].type === 'native';
        return p[chain].address === address;
    })

	return pair?.[chain] ?? {
		type: "unknown",
			name: "unknown",
			ticker: "UNKN",
			fakeAddress: "unknowntoken",
			decimals: 0,
			icon: "xtz",
	}
}
