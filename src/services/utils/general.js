import { config, statusMapping } from "@/services/cfg"

export const getLinkToExplorer = (hash, network, type) => {
	if (!hash) return ''
	if (network === 'tezos')
		return `${config.tezos.network.blockExplorerUrl}/${hash}`
	if (type === 'address')
		return `${config.etherlink.network.blockExplorerUrl}/address/${hash}`
	return `${config.etherlink.network.blockExplorerUrl}/tx/${hash}`
}

export const getStatus = (num) => {
	return statusMapping[num]
}

export const getStates = () => {
	return Object.values(statusMapping)
}

export const getSteps = (transfer) => {
	let steps = [
		{
			step: 'Pending',
			passed: true,
		},
	]

	if (transfer.status === 400) {
		steps.push(
			{
				step: 'Failed',
				passed: true,
			},
		)
	} else if (transfer.kind === 0) {
		steps.push(
			...[
				{
					step: 'Created',
					passed: transfer.status > 0
				},
				{
					step: 'Finished',
					passed: transfer.status > 200
				},
			]
		)
	} else if (transfer.kind === 1) {
		steps.push(
			...[
				{
					step: 'Created',
					passed: transfer.status > 0
				},
				{
					step: 'Sealed',
					passed: transfer.status > 100
				},
				{
					step: 'Finished',
					passed: transfer.status > 200
				},
			]
		)
	}

	return steps
}
