<script setup>
/** Components */
import TransferItem from "@/components/TransferItem.vue"

const props = defineProps({
	transfers: {
		type: Array,
		required: true,
	},
	direction: {
		type: String,
		default: 'column'
	}
})

</script>

<template>
	<Flex
		:direction="direction"
		align="center"
		gap="20"
		:class="[$style.wrapper, direction === 'column' && $style.columns, direction === 'row' && $style.row]"
	>
		<TransferItem
			v-for="t in transfers"
			:transfer="t"
			:removable="t.removable"
		/>
	</Flex>
</template>

<style module>
.wrapper {
	width: 100%;
}

/* .row {
	
} */

.row {
	width: 100%;
	height: auto;

    overflow-x: auto;
    white-space: nowrap;

	/* transition: all 500ms ease; */
}

.row_transfer {
	/* display: inline-block; */
	height: 200px;
}

.columns {
	height: calc(100vh - 70px - 48px);
}

/* @keyframes slidein {
	from {
		transform: translateX(50px);
		opacity: 0;
	}

	to {
		transform: 0;
		opacity: 1;
	}
} */
</style>