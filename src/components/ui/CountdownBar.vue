<script setup>
/** Vendor */
import { onMounted, nextTick, ref, watch } from "vue";

/** Components */
import Tooltip from "@/components/ui/Tooltip.vue";

const props = defineProps({
	start: {
		type: Boolean,
		default: false
	},
	destroyTime: {
		type: Number,
		default: 5_000,
	},
	title: {
		type: String,
		required: false,
	},
	subtitle: {
		type: Boolean,
		default: false,
	}
})

const countdownEl = ref(null)

watch(() => props.start, (newValue) => {
	if (newValue) {
		nextTick(() => {
			if (countdownEl) {
				beginDestruction()
			}
		})
	}
})

const beginDestruction = () => {
	countdownEl.value.style.transition = `width ${props.destroyTime / 1_000}s linear`
	countdownEl.value.style.width = '0px'
}

onMounted(() => {
	if (props.start) {
		nextTick(() => {
			if (countdownEl) {
				beginDestruction()
			}
		})
	}
})

</script>

<template>
	<Flex v-if="start" :class="$style.wrapper">
		<Tooltip v-if="title || subtitle" :class="$style.countdown_container" position="start">
			<div ref="countdownEl" :class="$style.countdown_bar" />

			<template #content>
				<Flex direction="column" align="center" gap="4">
					<Text v-if="title" size="14" color="secondary"> {{ title }} </Text>
					<Text v-if="subtitle" size="12" color="tertiary">Will remove in {{ destroyTime / 1_000 }}s</Text>
				</Flex>
			</template>
		</Tooltip>
		<Flex v-else :class="$style.countdown_container">
			<div ref="countdownEl" :class="$style.countdown_bar" />
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	width: 100%;
}
.countdown_container {
	width: 100%;
	height: 4px;

	position: relative;
	overflow: hidden;
}

.countdown_bar {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 100%;
	border-radius: 2px;
	background: var(--gray);
}
</style>
