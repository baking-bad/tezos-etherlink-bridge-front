import { defineStore } from "pinia"
import { tokenPairs, getTokenKey, isSameToken } from "@/services/cfg/tokens.js"
import { computed, ref } from "vue"
import { prettyNumber } from "@/services/utils/index.js"
import BigNumber from "bignumber.js"

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
		const addresses = await Promise.all( [
			tokenBridge.getTezosSignerAddress(),
			tokenBridge.getEtherlinkSignerAddress()
		])
		const balances = await Promise.all([
			tokenBridge.data.getBalances(addresses[0]),
			tokenBridge.data.getBalances(addresses[1])
		])
		balances[0].tokenBalances[0].token.fakeAddress = 'tezosNative'
		balances[1].tokenBalances[0].token.fakeAddress = 'etherlinkNative';
		// breaks without ;
		[...balances[0].tokenBalances, ...balances[1].tokenBalances].forEach((b) => {
			tokensObject.value[getTokenKey(b.token)].balance = b.balance
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