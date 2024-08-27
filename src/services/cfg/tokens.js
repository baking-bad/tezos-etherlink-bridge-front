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
			address: "KT1Vq1toL9mQquJhCvVRbbcC8PbZJWM4bPui",
			decimals: 8,
			icon: "tzbtc",
			ticketerContractAddress: "KT1AAi4DCQiTUv5MYoXtdiFwUrPH3t3Yhkjo",
			ticketHelperContractAddress: "KT1FcXb4oFBWtUVbEa96Do4DfQZXn6878yu1",
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
			address: "KT1DCKKboEMmpUtVnf7hTCnArxgNpFneHcv5",
			decimals: 0,
			icon: "sirs",
			ticketerContractAddress: "KT1GfTvzB5SG4eSsBEoNRyMyrspycaMHtUxu",
			ticketHelperContractAddress: "KT1Gy188nbnThwYBwSKotZ4Zmp1s8nGfzQpG",
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
			address: "KT1K6uyg7cjNRoPkYw6SfyCm1f2tPLHfVUez",
			tokenId: "0",
			decimals: 6,
			icon: "usdt",
			ticketerContractAddress: "KT1JT3T9jodxKchWEcwMtHzKTcM5pKD4phFp",
			ticketHelperContractAddress: "KT1G4athp6hNRmy65MdM1stv3bXXh82NEvCH",
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
	{
		tezos: {
			type: "fa2",
			name: "YOU",
			ticker: "YOU",
			address: "KT1VyYTej9iHeAfpCKBEdpqiKaHAk4hUN7h8",
			decimals: 8,
			icon: "you",
			ticketerContractAddress: "KT1AAi4DCQiTUv5MYoXtdiFwUrPH3t3Yhkjo",
			ticketHelperContractAddress: "KT1FcXb4oFBWtUVbEa96Do4DfQZXn6878yu1",
		},
		etherlink: {
			type: "erc20",
			name: "YOU",
			ticker: "YOU",
			address: "0x87dcBf128677ba36E79D47dAf4eb4e51610e0150",
			decimals: 8,
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
