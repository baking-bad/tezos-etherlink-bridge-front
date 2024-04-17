export const tokenPairs = [
	{
		tezos: {
			type: "native",
			name: "Tezos",
			fakeAddress: 'tezosNative',
			ticker: "XTZ",
			decimals: 6,
			icon: "xtz",
			ticketHelperContractAddress: "KT1DWVsu4Jtu2ficZ1qtNheGPunm5YVniegT",
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
			name: "Ctez",
			ticker: "CTEZ",
			address: "KT1LpdETWYvPWCQTR2FEW6jE6dVqJqxYjdeW",
			decimals: 0,
			icon: "ctez",
			ticketerContractAddress: "KT1RvSp4yDKUABqWmv3pKGE9fA6iCGy7bqGh",
			ticketHelperContractAddress: "KT1DHLWJorW9WB6ztkx1XcoaJKWXeTu9yoR1",
		},
		etherlink: {
			type: "erc20",
			name: "Ctez",
			ticker: "CTEZ",
			address: "0x87dcBf128677ba36E79D47dAf4eb4e51610e0150",
			decimals: 0,
			icon: "ctez",
		},
	},
	{
		tezos: {
			type: "fa2",
			name: "fxhash, token: 42",
			ticker: "FXHASH_42",
			address: "KT195Eb8T524v5VJ99ZzH2wpnPfQ2wJfMi6h",
			tokenId: "42",
			decimals: 0,
			icon: "fxhash",
			ticketerContractAddress: "KT1VybveLaWhpQHKph28WcGwSy1ud22KSEan",
			ticketHelperContractAddress: "KT1DNtHLr9T9zksZjZvQwgtx5XJwrW9wzETB",
		},
		etherlink: {
			type: "erc20",
			name: "fxhash, token: 42",
			ticker: "FXHASH_42",
			address: "0xcB5d40c6B1bdf5Cd51b3801351b0A68D101a561b",
			decimals: 0,
			icon: "fxhash",
		},
	},
	{
		tezos: {
			type: "fa1.2",
			name: "tzBTC",
			ticker: "tzBTC",
			address: "KT1CTpSVM5iwL5GGCA7Dixzbp8qwpnthNirm",
			decimals: 8,
			icon: "tzbtc",
			ticketerContractAddress: "KT1SoFYsd6jqf7SPNUbriUKGbmcNjnMzZQFY",
			ticketHelperContractAddress: "KT19HX9LJvsEcjBvadB2YzELUJ3zNuXMVKyu",
		},
		etherlink: {
			type: "erc20",
			name: "tzBTC",
			ticker: "tzBTC",
			address: "0x80d33a72b6d13b44da36c2a93a8cb6e1d451eb2a",
			decimals: 8,
			icon: "tzbtc",
		},
	},
	{
		tezos: {
			type: "fa1.2",
			name: "Sirius",
			ticker: "SIRS",
			address: "KT1FLMJPxJeyYzUSB9Yt3UptD2oXkwG84rUv",
			decimals: 0,
			icon: "sirs",
			ticketerContractAddress: "KT1TLCPyP1xwLmwXqTh5QtyL7jhXKEaABaLV",
			ticketHelperContractAddress: "KT1TFfzJzRNjAJcjDAZBrHfAbyy315ZjVrVK",
		},
		etherlink: {
			type: "erc20",
			name: "Sirius",
			ticker: "SIRS",
			address: "0x1144de4736cc0e83ab7c8e51872eac2015629e07",
			decimals: 0,
			icon: "sirs",
		},
	},
	{
		tezos: {
			type: "fa2",
			name: "Tether USD",
			ticker: "USDt",
			address: "KT1PpsQEFEg6ZbLwqv7SWW9UDQA7dmjVeF1d",
			tokenId: "0",
			decimals: 6,
			icon: "usdt",
			ticketerContractAddress: "KT1MNrN1XUxZMPSy2NZAGUhk1dnY8MFtA5eu",
			ticketHelperContractAddress: "KT1KRSC4UWEoPoZtrwFUZ8nDsL4cGZbJY4e3",
		},
		etherlink: {
			type: "erc20",
			name: "Tether USD",
			ticker: "USDt",
			address: "0x5b69d8c28fb0f766a32fd9ac8b0f5fb5f2104f88",
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

	return pair[chain]
}
