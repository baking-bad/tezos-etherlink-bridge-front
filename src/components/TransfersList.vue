<script setup>
/** Components */
import TransferItem from "@/components/TransferItem.vue";

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
		gap="16"
		:class="[$style.wrapper]"
	>
		<TransferItem
			v-for="t in transfers"
			:transfer="t"	
		/>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 500px;
	width: 500px;
}
</style>