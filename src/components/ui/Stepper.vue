<script setup>
/** Vendor */
import { computed, onMounted, ref } from "vue"

const props = defineProps({
	steps: {
		type: Array,
		required: false, // change
	},
	failed: {
		type: Boolean,
		default: false,
	}
})

const stepsMock = [
	{
		title: 'Pending',
		passed: true,
	},
	{
		title: 'Created',
		passed: true,
	},
	{
		title: 'Finished',
		passed: false,
	},
	{
		title: 'Finished',
		passed: false,
	}
]

const stepperEl = ref(null)
const stepperWidth = ref(0)
const statusDotSize = computed(() => stepperWidth.value / 100 * 3.5)
const stepWidth = computed(() => (stepperWidth.value - statusDotSize.value) / (stepsMock.length - 1))
const dividerDotSize = computed(() => (stepperWidth.value - (statusDotSize.value * stepsMock.length)) / (30 + 30 + (stepsMock.length - 1)))
const dotsCount = computed(() => (Math.round(((stepWidth.value - statusDotSize.value) / dividerDotSize.value) - 1) / 2))


onMounted(() => {
	stepperWidth.value = stepperEl.value.wrapper.offsetWidth
})

</script>

<template>

<!-- <Flex align="center" :class="$style.stepper">
    <div v-for="(step, index) in stepsMock" :key="index" class="step">
      <div :class="{ 'step-circle': true, 'step-passed': step.passed, 'step-failed': !step.passed }">
        
      </div>
      <div v-if="index !== stepsMock.length - 1" class="step-divider">
        <div v-if="step.passed" class="step-line"></div>
        <div v-else class="step-line step-line-failed"></div>
      </div>
    </div>
</Flex>	 -->
	<Flex align="center" :class="$style.stepper" ref="stepperEl">
		<div v-for="(s, i) in stepsMock">
			<Flex v-if="i !== stepsMock.length - 1" align="center" direction="row" :class="$style.step" :style="{width: `${stepWidth}px`}">
				<div :class="$style.point" :style="{width: `${statusDotSize}px`, height: `${statusDotSize}px`, 'margin-right': `${dividerDotSize}px`}"></div>

				<div v-if="dotsCount" v-for="p in dotsCount" :class="$style.small_point" :style="{width: `${dividerDotSize}px`, height: `${dividerDotSize}px`, 'margin-right': `${dividerDotSize}px`}"></div>
			</Flex>

			<Flex v-else align="center" :class="$style.point" :style="{width: `${statusDotSize}px`, height: `${statusDotSize}px`}" />
		</div>
	</Flex>
</template>

<style module>
.stepper {
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
}

.point {
	/* width: 10px;
	height: 10px; */
	border-radius: 50%;

	/* border-radius: 2px; */
	cursor: pointer;

	/* margin-right: 4px; */
	/* margin-bottom: 4px; */
	background-color: var(--green);
}

.small_point {
	/* width: 4px;
	height: 4px; */
	border-radius: 50%;

	/* margin-right: 4px; */
	/* margin-bottom: 6px; */
	background-color: var(--green);
}

.step {
	/* width: 136px; */
	/* width: 91px; */
	display: flex;
	align-items: center;
}

.step-circle {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: #ccc;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 10px;
}

.step-passed {
	background-color: #4caf50;
}

.step-failed {
	background-color: #ccc;
}

.step-divider {
	flex: 1;
	height: 2px;
	position: relative;
}

.step-line {
	width: 50px;
	height: 2px;
	background-color: #ccc;
}

.step-line-failed {
	background-color: #ccc;
}
</style>
