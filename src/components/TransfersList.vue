<script setup>
/** Components */
import TransferItem from "@/components/TransferItem.vue"

const props = defineProps({
	transfers: {
		type: Array,
		required: true,
	}
})

</script>

<template>
	<Flex
		direction="column"
		align="center"
		gap="8"
		:class="$style.wrapper"
	>
		<TransferItem
			v-for="t in transfers"
			:transfer="t"	
		/>
	</Flex>
</template>

<style module>
.wrapper {
	height: calc(100vh - 70px - 48px);;
	width: 100%;

	overflow-y: auto;
}
</style>