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
]

export const nativeTezosToken = tokenPairs[0].tezos
export const nativeEtherlinkToken = tokenPairs[0].etherlink

export const tezosTokens = tokenPairs.map((p) => p.tezos)
export const etherlinkTokens = tokenPairs.map((p) => p.etherlink)
export const plainTokens = [...tezosTokens, ...etherlinkTokens]

export const getTokenKey = (token) => {
	return token?.address || token?.fakeAddress || undefined
}
export const pairsMap = {}
tokenPairs.forEach((p) => {
	const tezosKey = getTokenKey(p.tezos)
	const etherlinkKey = getTokenKey(p.etherlink)
	pairsMap[tezosKey] = etherlinkKey
	pairsMap[etherlinkKey] = tezosKey
})

export const isPairedToken = (tokenA, tokenB) => {
	return pairsMap[getTokenKey(tokenA)] === getTokenKey(tokenB)
}
export const isSameToken = (tokenA, tokenB) => {
	return getTokenKey(tokenA) === getTokenKey(tokenB)
}
export const getPairedToken = (compareWith) => {
	return plainTokens.find((t) => {
		return getTokenKey(t) === pairsMap[getTokenKey(compareWith)]
	})
}





