<script setup>
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown/index.js"
import { computed, ref, watch } from "vue"
import { getStates } from "@/services/utils"
const props = defineProps({
	modelValue: {
		type: Object,
		required: true,
	}
})
const defaultState = 'All states';
const defaultKind = 'All transfers';
const selectedState = ref(defaultState)
const transferStates = ['All states', ...getStates().filter((s) => s !== 'Pending')]
const transferStateItems = computed(() => transferStates.filter((s) => s !== selectedState.value))

const selectedKind = ref(defaultKind)
const transferKinds = ['All transfers', 'Deposit', 'Withdrawal']
const transferKindItems = computed(() => transferKinds.filter((s) => s !== selectedKind.value))
const emit = defineEmits(['update:modelValue'])
watch(
	() => props.modelValue,
	(newVal) => {
		if (!newVal || !newVal.state || !newVal.kind) {
			emit('update:modelValue', { state: defaultState, kind: defaultKind })
		}
		else {
			selectedState.value = newVal.state
			selectedKind.value = newVal.kind
		}
	},
	{ immediate: true }
)
watch(
	() => ({state: selectedState.value, kind: selectedKind.value}),
	(newVal) => {
		const model = props.modelValue
		if (newVal.state !== model.state || newVal.kind !== model.kind) {
			emit('update:modelValue', { state: newVal.state, kind: newVal.kind })
		}
	}
)
</script>

<template>
	<Flex align="center" justify="between" wide :class="$style.filters">
		<Dropdown>
			<template #trigger="{isOpen}">
				<Flex align="center" gap="6" :class="$style.selector">
					<Text size="16" color="secondary"> {{ selectedKind }} </Text>
					<Icon
						name="chevron-right"
						size="14"
						color="tertiary"
						:style="{
										transform: `rotate(${!isOpen ? '90deg' : '-90deg'})`,
										transition: 'all 200ms ease',
									}"
					/>
				</Flex>
			</template>
			<template #popup>
				<DropdownItem v-for="kind in transferKindItems" @click="selectedKind = kind">
					<Text size="13" color="secondary"> {{ kind }} </Text>
				</DropdownItem>
			</template>
		</Dropdown>


		<Dropdown>
			<template #trigger="{isOpen}">
				<Flex align="center" gap="6" :class="$style.selector">
					<Text size="16" color="secondary"> {{ selectedState }} </Text>
					<Icon
						name="chevron-right"
						size="14"
						color="tertiary"
						:style="{
										transform: `rotate(${!isOpen ? '90deg' : '-90deg'})`,
										transition: 'all 200ms ease',
									}"
					/>
				</Flex>
			</template>
			<template #popup>
				<DropdownItem v-for="status in transferStateItems" @click="selectedState = status">
					<Text size="13" color="secondary"> {{ status }} </Text>
				</DropdownItem>
			</template>
		</Dropdown>
	</Flex>
</template>

<style module>
.filters {
	width: 500px;

	margin: 15px 0 25px 0;
}
</style>