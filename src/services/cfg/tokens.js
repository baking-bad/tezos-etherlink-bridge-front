export const tokenPairs = [
	{
		tezos: {
			type: "native",
			name: "Tezos",
			fakeAddress: 'tezosNative',
			ticker: "XTZ",
			decimals: 6,
			icon: "xtz",
			ticketHelperContractAddress: "KT1Wj8SUGmnEPFqyahHAcjcNQwe6YGhEXJb5",
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
		etherlink: {
			type: "erc20",
			name: "TEZOS PEPE",
			ticker: "tzPEPE",
			address: "0x9121B153bbCF8C23F20eE43b494F08760B91aD64",
			decimals: 2,
			icon: "tzpepe",
		},
		tezos: {
			type: "fa2",
			name: "TEZOS PEPE",
			ticker: "tzPEPE",
			address: "KT1MZg99PxMDEENwB4Fi64xkqAVh5d1rv8Z9",
			tokenId: "0",
			decimals: 2,
			icon: "tzpepe",
			ticketerContractAddress: "KT1UzfUMQDiEv7w6RQnnvt412qFXZmgjrLpd",
			ticketHelperContractAddress: "KT1JJsiwXgGVhomcUQsPQYdALkRRqakvK3XC",
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
