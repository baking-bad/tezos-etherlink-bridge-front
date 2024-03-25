<script setup>
/** Vendor */
import { onBeforeUnmount, onMounted, ref } from "vue"
import { DateTime } from 'luxon'

/** Components */
import Tooltip from "@/components/ui/Tooltip.vue";

const props = defineProps({
	time: [String, Object],
})

const timeAgo = ref('')

const updateTimeAgo = () => {
	timeAgo.value = DateTime.fromISO(props.time).toRelative({ locale: 'en', style: 'long' })

	let minutesAgo = DateTime.now().diff(DateTime.fromISO(props.time), 'minutes').minutes
	if (minutesAgo < 1 && currentInterval.value === 0) {
		currentInterval.value = 1_000
	} else if (minutesAgo > 1 && minutesAgo < 60) {
		stopTimer()
		currentInterval.value = 60_000
		startTimer()
	} else if (minutesAgo > 60 && currentInterval.value > 0) {
		currentInterval.value = 0
		stopTimer()
	}
}

const timer = ref(null)
const currentInterval = ref(0)

const startTimer = () => {
	timer.value = setInterval(updateTimeAgo, currentInterval.value)
}

const stopTimer = () => {
	clearInterval(timer.value)
}

onMounted(() => {
	updateTimeAgo()
	if (currentInterval.value > 0) {
		startTimer()
	}
})

onBeforeUnmount(() => {
	if (currentInterval.value > 0) {
		stopTimer()
	}
})

</script>

<template>
	<Tooltip v-if="timeAgo">
		<Text size="14" color="secondary"> {{ timeAgo }} </Text>

		<template #content>
			<Text size="14" color="secondary"> {{ DateTime.fromISO(time).setLocale("en").toFormat("LLL d, y, tt") }} </Text>
		</template>
	</Tooltip>
</template>

<style module>

</style>
