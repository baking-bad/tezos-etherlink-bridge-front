<script setup>
/** Vendor */
import { computed, watchEffect } from "vue"
import { storeToRefs } from "pinia"

/** Services */
import TokenBridgeService from "@/services/tokenBridge"
const { tokenBridge } = TokenBridgeService.instances

/** Stores */
import { useTokensStore } from "@/stores/tokens.js"
const tokensStore = useTokensStore()
const {
	tezosNativeToken,
	etherlinkNativeToken,
	tezosTokens,
	etherlinkTokens,
} = storeToRefs(tokensStore)

/** UI */
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"


const props = defineProps({
	chain: {
		type: String,
		default: 'tezos',
	},
	modelValue: {
		type: Object,
		required: false,
	}
})

const emit = defineEmits(["update:modelValue"])
const loadImage = (n) => new URL(`../assets/images/${n}.png`, import.meta.url).href


const selectedToken = computed({
	get: () => {
		if (!props.modelValue) {
			return props.chain === 'tezos' ? tezosNativeToken.value : etherlinkNativeToken.value
		}
		return props.modelValue
	},
	set: (newVal) => {
		emit("update:modelValue", newVal)
	}
})

watchEffect(() => {
	if (!props.modelValue) {
		emit("update:modelValue", selectedToken.value)
	}
})

const dropdownItems = computed(() => {
	switch (props.chain) {
		case 'tezos':
			return tezosTokens.value.filter(token => token?.ticker !== selectedToken.value?.ticker)
		case 'etherlink':
			return etherlinkTokens.value.filter(token => token?.ticker !== selectedToken.value?.ticker)
		default:
			break;
	}
})

</script>

<template>
	<Dropdown>
		<template #trigger="{isOpen}">
			<Flex align="center" gap="6" :class="$style.selector">
				<img width="20" height="20" :src="loadImage(selectedToken.icon)" />
				<Text size="16" color="primary"> {{ selectedToken.ticker }} </Text>
				<Icon
					name="chevron-right"
					size="14"
					color="tertiary"
					:style="{
								transform: `rotate(${!isOpen ? '0' : '90deg'})`,
								transition: 'all 200ms ease',
							}"
				/>
			</Flex>
		</template>
		<template #popup>
			<DropdownItem v-for="item in dropdownItems" @click="selectedToken = item">
				<Flex align="center" gap="6">
					<img width="16" height="16" :src="loadImage(item.icon)" :class="$style.img" />
					<Text size="13" color="primary"> {{ item.ticker }} </Text>
					<Text size="13" color="primary"> {{ item.balance }} </Text>
				</Flex>
			</DropdownItem>
		</template>
	</Dropdown>
</template>

<style module>
.selector {
	background: #111111;
	border-radius: 500px;
	cursor: pointer;

	padding: 6px;

	transition: all 0.2s ease;

	& img {
		border-radius: 50%;
	}

	&:hover {
		box-shadow: 0 0 0 1px var(--op-5);
	}

	&:active {
		box-shadow: 0 0 0 2px var(--op-5);
	}
}

.img {
	border-radius: 50%;	
}
</style>
