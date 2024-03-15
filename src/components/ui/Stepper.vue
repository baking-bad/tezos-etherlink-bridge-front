<script setup>
/** Vendor */
import { computed, onMounted, ref } from "vue"

/** Components */
import Tooltip from "@/components/ui/Tooltip.vue"

const props = defineProps({
	steps: {
		type: Array,
		required: true,
	},
})

const stepperEl = ref(null)
const stepperWidth = ref(0)
const statusDotSize = computed(() => stepperWidth.value / 100 * 3.5)
const stepWidth = computed(() => (stepperWidth.value - statusDotSize.value) / (props.steps.length - 1))
const dividerDotSize = computed(() => (stepperWidth.value - (statusDotSize.value * props.steps.length)) / (30 + 30 + (props.steps.length - 1)))
const dotsCount = computed(() => (Math.round(((stepWidth.value - statusDotSize.value) / dividerDotSize.value) - 1) / 2))

const isFailed = props.steps[props.steps.length - 1].step === 'Failed'

onMounted(() => {
	stepperWidth.value = stepperEl.value.wrapper.offsetWidth
})

</script>

<template>
	<Flex align="center" :class="$style.stepper" ref="stepperEl">
		<div v-for="(s, i) in steps">
			<Tooltip v-if="i === 0">
				<Flex
					align="center"
					:class="[$style.status, $style.passed]"
					:style="{
						width: `${statusDotSize}px`,
						height: `${statusDotSize}px`,
						'margin-right': `${dividerDotSize}px`
					}"
				/>

				<template #content>
					<Text> {{ s.step }} </Text>
				</template>
			</Tooltip>
			<Flex
				v-else
				align="center"
				direction="row"
				:class="$style.step"
				:style="{
					width: `${stepWidth}px`
				}"
			>
				<div
					v-if="dotsCount"
					v-for="d in dotsCount"
					:class="[$style.divider_dot, s.passed && $style.passed, isFailed && $style.failed]"
					:style="{
						width: `${dividerDotSize}px`,
						height: `${dividerDotSize}px`,
						'margin-right': `${dividerDotSize}px`
					}">
				</div>

				<Tooltip>
					<div
						:class="[$style.status, s.passed && $style.passed, isFailed && $style.failed]"
						:style="{
							width: `${statusDotSize}px`,
							height: `${statusDotSize}px`,
						}">
					</div>

					<template #content>
						<Text> {{ s.step }} </Text>
					</template>
				</Tooltip>
			</Flex>
		</div>
	</Flex>
</template>

<style module>
.stepper {
	width: 100%;
	display: flex;
	align-items: center;
}

.step {
	display: flex;
	align-items: center;
}

.status {
	border-radius: 50%;
	cursor: pointer;

	background-color: var(--txt-support);
}

.divider_dot {
	border-radius: 50%;

	background-color: var(--txt-support);
}

.passed {
	background-color: var(--green);
}

.failed {
	background-color: var(--red);
}
</style>
