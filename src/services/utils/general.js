import { config, statusMapping } from "@/services/cfg";

export const getLinkToExplorer = (hash, network, type) => {
	if (!hash) return ''
	
	if (network === 'tezos') {
		return `${config.tezos.network.blockExplorerUrl}/${hash}`
	} else {
		if (type === 'address') {
			return `${config.etherlink.network.blockExplorerUrl}/address/${hash}`
		} else {
			return `${config.etherlink.network.blockExplorerUrl}/tx/${hash}`
		}
	}
}

export const getStatus = (num) => {
	return statusMapping[num]
}
