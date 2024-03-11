<script setup>
/** Vendor */
import { ref, computed, watch } from "vue"

/** Constants */
import { etherlinkTokens, nativeEtherlinkToken, nativeTezosToken, tezosTokens } from "@/services/cfg/tokens";

/** UI */
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown"

const props = defineProps({
	chain: {
		type: String,
		default: 'tezos',
	},
	token: {
		type: Object,
		required: false,
	}
})

const emit = defineEmits(["updateSelectedToken"])

const selectedToken = ref({})
const defineSelectedToken = () => {
	if (!props.token) {
		selectedToken.value = props.chain === 'tezos' ? nativeTezosToken : nativeEtherlinkToken
	} else {
		selectedToken.value = props.token
	}

	emit("updateSelectedToken", selectedToken.value)
}
defineSelectedToken()

const dropdownItems = computed(() => {
	switch (props.chain) {
		case 'tezos':
			return tezosTokens.filter(token => token.ticker !== selectedToken.value.ticker)
		
		case 'etherlink':
			return etherlinkTokens.filter(token => token.ticker !== selectedToken.value.ticker)

		default:
			break;
	}
})

watch(
	() => props.chain,
	() => {
		defineSelectedToken()
	},
)

watch(
	() => selectedToken.value,
	() => {
		emit("updateSelectedToken", selectedToken.value)
	},
)

</script>

<template>
	<Dropdown>
		<template #trigger="{isOpen}">
			<Flex align="center" gap="6" :class="$style.selector">
				<img width="20" height="20" :src="selectedToken.iconSrc" />
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
					<img width="16" height="16" :src="item.iconSrc" :class="$style.img" />
					<Text size="13" color="primary"> {{ item.ticker }} </Text>
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
