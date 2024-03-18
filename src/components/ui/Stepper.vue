<script setup>
/** Vendor */
import { computed, onMounted, ref } from "vue"

/** Services */
import { isEven } from "@/services/utils";

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
const statusDotSize = computed(() => Math.round(stepperWidth.value / 100 * 3.5))
const stepWidth = computed(() => (stepperWidth.value - statusDotSize.value) / (props.steps.length - 1))
const dividerDotSize = computed(() => (Math.round((stepperWidth.value - (statusDotSize.value * props.steps.length)) / (30 + 30 + (props.steps.length - 1)))))
const dotsSpace = computed(() => Math.round((stepWidth.value - statusDotSize.value) / dividerDotSize.value))
const dotsCount = computed(() => isEven(dotsSpace.value) ? dotsSpace.value / 2 : (dotsSpace.value - 1) / 2  ) // check if odd
const marginSize = computed(() => (((stepWidth.value - statusDotSize.value) - (dividerDotSize.value * dotsCount.value)) / (dotsCount.value + 1)))

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
						'margin-right': `${marginSize}px`
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
						'margin-right': `${marginSize}px`
					}">
				</div>

				<Tooltip>
					<div
						:class="[$style.status, s.passed && $style.passed, isFailed && $style.failed]"
						:style="{
							width: `${statusDotSize}px`,
							height: `${statusDotSize}px`,
							'margin-right': i === steps.length - 1 ? '0px' : `${marginSize}px`,
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

	background-color: var(--txt-support);

	animation: skeleton 1.8s ease infinite;
}

.status:hover {
	transform: scale(1.15);
}

.divider_dot {
	border-radius: 50%;

	background-color: var(--txt-support);

	animation: skeleton 1.8s ease infinite;
}

.passed {
	background-color: var(--green);

	animation: none;
}

.failed {
	background-color: var(--red);

	animation: none;
}

@keyframes skeleton {
	0% {
		opacity: 1;
	}

	50% {
		opacity: 0.5;
	}

	100% {
		opacity: 1;
	}
}

</style>
