<script setup>
/** Services */
import { getLinkToExplorer, midHash, shortHash } from "@/services/utils"

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
	},
	short: {
		type: Boolean,
		default: false,
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
		{{ short ? shortHash(hash) : midHash(hash) }}
	</a>
</template>

<style module>
.link {
	font-size: 13px;
	color: var(--txt-primary);

	&:hover {
		color: var(--green);
	}
}
</style>