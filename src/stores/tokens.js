import { defineStore } from "pinia"
import { tokenPairs, getTokenKey, isSameToken } from "@/services/cfg/tokens.js"
import { computed, ref, watch } from "vue"
import { prettyNumber } from "@/services/utils/index.js"
import BigNumber from "bignumber.js"
import { useWeb3ModalProvider } from "@web3modal/ethers/vue"
import etherlink from "@/services/etherlink"
import TokenBridge from "@/services/tokenBridge"

export const useTokensStore = defineStore("tokens", () => {
	function modifyPair({tezos, etherlink}) {
		return {
			tezos: {
				...tezos,
				balance: BigInt(0),
				pairKey: getTokenKey(etherlink),
				get prettyBalance() {
					return prettyNumber((BigNumber(this.balance.toString()) / BigNumber(10 ** this.decimals)).toString(), this.decimals)
				}
			},
			etherlink: {
				...etherlink,
				balance: BigInt(0),
				pairKey: getTokenKey(tezos),
				get prettyBalance() {
					return prettyNumber((BigNumber(this.balance.toString()) / BigNumber(10 ** this.decimals)).toString(), this.decimals)
				}
			}
		}
	}
	const modifiedTokenPairs = tokenPairs.map(modifyPair)
	const tokensObject = ref({})
	modifiedTokenPairs.forEach(({tezos, etherlink}) => {
		tokensObject.value[getTokenKey(tezos)] = tezos
		tokensObject.value[getTokenKey(etherlink)] = etherlink
	})

	const tezosNativeToken = computed(() => tokensObject.value.tezosNative)
	const etherlinkNativeToken = computed(() => tokensObject.value.etherlinkNative)

	const tezosTokens = computed(() => modifiedTokenPairs.map((p) => p.tezos))
	const etherlinkTokens = computed(() => modifiedTokenPairs.map((p) => p.etherlink))
	const plainTokens = computed(() => [...tezosTokens.value, ...etherlinkTokens.value])

	function isPairedToken(tokenA, tokenB)  {
		return tokensObject.value[getTokenKey(tokenA)].pairKey === getTokenKey(tokenB)
	}

	function getPairedToken(compareWith) {
		return tokensObject.value[tokensObject.value[getTokenKey(compareWith)].pairKey]
	}

	async function mergeBalances(tokenBridge) {
		let balances = []
		function flattenBalances(chainBalances, fakeNativeAddress) {
			if (!chainBalances?.tokenBalances?.length) return;
			chainBalances.tokenBalances.forEach((tb) => {
				if (tb.token.type === 'native') {
					tb.token.fakeAddress = fakeNativeAddress
				}
				balances.push(tb)
			})
		}
		const { tezosSignerBalances, etherlinkSignerBalances } = await tokenBridge.data.getSignerBalances()

		flattenBalances(tezosSignerBalances, 'tezosNative')
		flattenBalances(etherlinkSignerBalances, 'etherlinkNative')

		balances.forEach((b) => {
			tokensObject.value[getTokenKey(b.token)].balance = b.balance
		})
	}

	const { walletProvider } = useWeb3ModalProvider()
	watch(
		() => walletProvider.value,
		async (newVal) => {
			etherlink.instances.toolkit.setProvider(newVal)
			const { tokenBridge } = TokenBridge.instances
			await mergeBalances(tokenBridge)
		},
	)
	return  {
		tokenPairs,
		modifiedTokenPairs,
		tokensObject,
		tezosNativeToken,
		etherlinkNativeToken,
		tezosTokens,
		etherlinkTokens,
		plainTokens,
		isPairedToken,
		getPairedToken,
		getTokenKey,
		isSameToken,
		mergeBalances,
	}
})