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
			name: "tzBTC",
			ticker: "tzBTC",
			address: "KT1V7YkCUvuLCcMvrNfxvfP7AYdh7SUy3gVk",
			decimals: 8,
			icon: "tzbtc",
			ticketerContractAddress: "KT1KnYz9eRVQHYgj25FMdQ9fo5f9SUEonzxe",
			ticketHelperContractAddress: "KT1WmUoTU91RVjGv8MHW5DFRn8daoFvnoNBh",
		},
		etherlink: {
			type: "erc20",
			name: "tzBTC",
			ticker: "tzBTC",
			address: "0x54B20569c0aa92a5618589142b2d5cc5Fe6FE426",
			decimals: 8,
			icon: "tzbtc",
		},
	},
	{
		tezos: {
			type: "fa1.2",
			name: "Sirius",
			ticker: "SIRS",
			address: "KT1Dhb74UkncT5FcZfqmgnnXsBe3LBVXbpRb",
			decimals: 0,
			icon: "sirs",
			ticketerContractAddress: "KT1BSE3Vzu2aMMg1Aa35vnM1MMPq4YAJRU5G",
			ticketHelperContractAddress: "KT1KvgaQ9Eztr3hXzV2tGT85fPRPGmXBzF7r",
		},
		etherlink: {
			type: "erc20",
			name: "Sirius",
			ticker: "SIRS",
			address: "0x1B674B7D28d3Da4bB0CbDA959DE2bCEbe2AC83e8",
			decimals: 0,
			icon: "sirs",
		},
	},
	{
		tezos: {
			type: "fa2",
			name: "Tether USD",
			ticker: "USDt",
			address: "KT1TJK6aTreCyfrrEjj1ZRPUmKdnLXfcgAAa",
			tokenId: "0",
			decimals: 6,
			icon: "usdt",
			ticketerContractAddress: "KT1LBv2tVJt17UXC32SS6Vtbtg7yPcJ8scbb",
			ticketHelperContractAddress: "KT1H4TBKdAjCxQKBcdPqnfLvLbhShZ2CPC51",
		},
		etherlink: {
			type: "erc20",
			name: "Tether USD",
			ticker: "USDt",
			address: "0xE4BF1873cFDAED33bAB4E0f5788cBA6d03a267F0",
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
