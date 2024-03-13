export const capitilize = (s) => {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const shortHash = (hash) => {
	if (!hash) return ''
	
	if (hash.length > 16) {
		return `${hash.slice(0, 4)} ••• ${hash.slice(-4)}`
	} else {
		return hash
	}
}

export const midHash = (hash) => {
	if (!hash) return ''

	if (hash.length > 24) {
		return `${hash.slice(0, 4)} ${hash.slice(4, 8)} ••• ${hash.slice(-8,-4)} ${hash.slice(-4)}`
	} else {
		return hash
	}
}
