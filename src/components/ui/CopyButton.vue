<script setup>
/** Vendor */
import { ref } from "vue";

const props = defineProps({
	text: {
		type: [String, Number],
	},
	size: {
		type: String,
		default: "12",
	},
})

const isCopied = ref(false)

const handleCopy = (target) => {
	window.navigator.clipboard.writeText(target)

	isCopied.value = true
	setTimeout(() => {
		isCopied.value = false
	}, 1_500)
}
</script>

<template>
	<Icon
		@click.prevent.stop="handleCopy(text)"
		:name="!isCopied ? 'copy' : 'check'"
		:size="size"
		:color="!isCopied ? 'tertiary' : 'green'"
		class="copyable"
		:style="{cursor: 'pointer'}"
	/>
</template>
