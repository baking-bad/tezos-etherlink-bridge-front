<script setup>
/** Services */
import { getLinkToExplorer, shortHash } from "@/services/utils"

const props = defineProps({
	hash: {
		type: String,
		default: '',
	},
	network: {
		type: String,
		default: 'tezos',
	},
	type: {
		type: String,
		default: '',
	}
})

</script>

<template>
	<a
		v-if="hash"
		:href="getLinkToExplorer(hash, network, type)"
		target="_blank"
		:class="$style.link"
	>
		{{ shortHash(hash) }}
	</a>
</template>

<style module>
.link {
	color: var(--txt-primary);

	&:hover {
		color: var(--green);
	}
}
</style>