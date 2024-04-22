import { defineStore, storeToRefs } from "pinia"
import { tokenPairs, getTokenKey, isSameToken } from "@/services/cfg/tokens.js"
import { computed, ref } from "vue"
import { prettyNumber } from "@/services/utils/index.js"
import BigNumber from "bignumber.js"
import TokenBridge from "@/services/tokenBridge"
import { useWalletsStore } from "@/stores/wallets.js"

export const useTokensStore = defineStore("tokens", () => {
	function modifyPair({ tezos, etherlink }) {
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

	async function mergeBalances() {
		let balances = {}
		Object.keys(tokensObject.value).forEach((key) => balances[key] = 0n)
		function flattenBalances(chainBalances, fakeNativeAddress) {
			chainBalances?.tokenBalances?.forEach((tb) => {
				if (tb.token.type === 'native') {
					tb.token.fakeAddress = fakeNativeAddress
				}
				balances[getTokenKey(tb.token)] = tb.balance
			})
		}
		const { tokenBridge } = TokenBridge.instances
		const { tezAddress, ethAddress } = storeToRefs(useWalletsStore())
		// const tezBalances = tezAddress.value ? await tokenBridge.data.getBalances(tezAddress.value) : undefined;
		// const ethBalances = ethAddress.value ? await tokenBridge.data.getBalances(ethAddress.value) : undefined;
		const [tezBalances, ethBalances] = await Promise.all([
			tezAddress.value && tokenBridge.data.getBalances(tezAddress.value),
			ethAddress.value && tokenBridge.data.getBalances(ethAddress.value),
		])

		flattenBalances(tezBalances, 'tezosNative')
		flattenBalances(ethBalances, 'etherlinkNative')
		Object.keys(balances).forEach((key) => {
			if (tokensObject.value[key]) {
				tokensObject.value[key].balance = balances[key]
			}
		})
	}

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