export const tokenPairs = [
	{
		tezos: {
			type: "native",
			name: "Tezos",
			fakeAddress: 'tezosNative',
			ticker: "XTZ",
			decimals: 6,
			icon: "xtz",
			ticketHelperContractAddress: "KT1VEjeQfDBSfpDH5WeBM5LukHPGM2htYEh3",
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
			address: "KT1HmyazXfKDbo8XjwtWPXcoyHcmNPDCvZyb",
			decimals: 8,
			icon: "tzbtc",
			ticketerContractAddress: "KT1H7if3gSZE1pZSK48W3NzGpKmbWyBxWDHe",
			ticketHelperContractAddress: "KT1KUAaaRMeMS5TJJyGTQJANcpSR4egvHBUk",
		},
		etherlink: {
			type: "erc20",
			name: "tzBTC",
			ticker: "tzBTC",
			address: "0x8e73aE3CF688Fbd8368c99520d26F9eF1B4d3BCa",
			decimals: 8,
			icon: "tzbtc",
		},
	},
	{
		tezos: {
			type: "fa1.2",
			name: "Sirius",
			ticker: "SIRS",
			address: "KT1TCTpXXbpnWBZ8whqExokbKfUrUW3nAXDJ",
			decimals: 0,
			icon: "sirs",
			ticketerContractAddress: "KT1Cw8WZLp4XUPLrDWUjwwpShzCRqzRByyVh",
			ticketHelperContractAddress: "KT1DSy9C2dBRDYPCHuBVaYYDQPjhprcSA9eL",
		},
		etherlink: {
			type: "erc20",
			name: "Sirius",
			ticker: "SIRS",
			address: "0xbaA233e2f62f45e9D91Dacd3D6C6A57Bc2CBc575",
			decimals: 0,
			icon: "sirs",
		},
	},
	{
		tezos: {
			type: "fa2",
			name: "Tether USD",
			ticker: "USDt",
			address: "KT1V2ak1MfNd3w4oyKD64ehYU7K4CrpUcDGR",
			tokenId: "0",
			decimals: 6,
			icon: "usdt",
			ticketerContractAddress: "KT1S6Nf9MnafAgSUWLKcsySPNFLUxxqSkQCw",
			ticketHelperContractAddress: "KT1JLZe4qTa76y6Us2aDoRNUgZyssSDUr6F5",
		},
		etherlink: {
			type: "erc20",
			name: "Tether USD",
			ticker: "USDt",
			address: "0xf68997eCC03751cb99B5B36712B213f11342452b",
			decimals: 6,
			icon: "usdt",
		},
	},
	{
		tezos: {
			type: "fa2",
			name: "youves YOU Governance",
			ticker: "YOU",
			address: "KT1VyYTej9iHeAfpCKBEdpqiKaHAk4hUN7h8",
			tokenId: "0",
			decimals: 12,
			icon: "you",
			ticketerContractAddress: "KT1DjH84P98gKFptqiAevj1qoKqxrTaG1T7i",
			ticketHelperContractAddress: "KT1HV4o5WnnJ6QEPWqck9Lk3vQakcUD89qc8",
		},
		etherlink: {
			type: "erc20",
			name: "YOU",
			ticker: "YOU",
			address: "0x59118D19848bAca5C3Dd1603acfC99C4cbcCC3db",
			decimals: 12,
			icon: "you",
		},
	}
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
