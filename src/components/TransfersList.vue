<script setup>
/** Vendor */
import { onBeforeUnmount, onMounted, ref } from "vue";

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

const listWrapperEl = ref(null)

const handleWheel = (event) => {
	if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
	
	event.preventDefault()

	listWrapperEl.value.wrapper.scrollBy({
		left: event.deltaY < 0 ? -10 : 10,
	})
}

onBeforeUnmount(() => {
	listWrapperEl.value.wrapper.removeEventListener('wheel', handleWheel)
})

onMounted(() => {
	if (props.direction === 'row') {
		listWrapperEl.value.wrapper.addEventListener('wheel', handleWheel)
	}
});

</script>

<template>
	<Flex
		ref="listWrapperEl"
		:direction="direction"
		align="center"
		:class="[$style.wrapper, direction === 'column' && $style.columns, direction === 'row' && $style.row]"
	>
		<TransitionGroup name="navigation" tag="div" :class="direction === 'row' && $style.items_row" >
			<TransferItem
				v-for="t in transfers"
				:key="t.tezosOperation?.hash || t.etherlinkOperation?.hash"
				:transfer="t"
				:removable="t.removable"
			/>
		</TransitionGroup>
	</Flex>
</template>

<style module>
.wrapper {
	width: 100%;
}

::-webkit-scrollbar {
  height: 3px;
}

.items_row {
	width: 100%;
	display: flex;
	flex-direction: row;
}

.row {
	width: 100%;
	height: auto;

    overflow-x: auto;
    white-space: nowrap;

	/* transition: all 500ms ease; */
}

.row_transfer {
	height: 200px;
}

.columns {
	height: calc(100vh - 70px - 48px);
}
</style>
