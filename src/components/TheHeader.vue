<script setup>
/** Vendor */
import { ref, reactive, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"

/** Stores */
import { useWalletsStore } from "@/stores/wallets.js"
const { allConnected } = storeToRefs(useWalletsStore())

const route = useRoute()

const tabEls = ref()

const tabs = ref([
	{
		icon: "logo",
		name: "Bridge",
		path: "/",
	},
	{
		icon: "transfers",
		name: "Transfers",
		path: "/transfers",
	},
	{
		icon: "settings",
		name: "Config",
		path: "/config",
	},
	{
		icon: "settings",
		name: "Aztec",
		path: "/aztec",
	},
])

const highlightStyle = reactive({
	transform: ``,
	width: `88px`,
})

const updateHighlightStyle = () => {
	tabEls.value.forEach((tab) => {
		if ((!route.name && tab.wrapper.id === "Bridge") || tab.wrapper.id === route.name) {
			const tabRect = tab.wrapper.getBoundingClientRect()

			highlightStyle.width = `${tabRect.width}px`
			highlightStyle.transform = `translateX(${tab.wrapper.offsetLeft - 2}px)`
		}
	})
}

const handleSelectTab = () => {
	updateHighlightStyle()
}

onMounted(() => {
	updateHighlightStyle()
})

watch(
	() => route.path,
	() => {
		updateHighlightStyle()
	},
)
</script>

<template>
	<Flex align="center" justify="between" :class="$style.wrapper">
		<RouterLink to="/">
			<Flex align="center" gap="4">
				<Flex align="center" gap="10">
					<img src="../assets/images/etherlink.png" :class="$style.etherlink" />
					<Text size="16" color="support">/</Text>
				</Flex>

				<Flex align="center" gap="6" :class="$style.logo">
					<Icon name="logo" size="20" color="primary" />
					<Text size="18" color="primary" :class="$style.name">Bridge</Text>
				</Flex>
			</Flex>
		</RouterLink>

		<div :class="$style.tabs_wrapper">
			<Flex gap="4" :class="$style.tabs">
				<RouterLink v-for="tab in tabs" :to="tab.path">
					<Flex
						ref="tabEls"
						:id="tab.name"
						align="center"
						gap="6"
						:class="[$style.tab, route.name === tab.name && $style.active]"
					>
						<Icon :name="tab.icon" size="16" color="tertiary" />
						<Text size="15" color="secondary">{{ tab.name }}</Text>
					</Flex>
				</RouterLink>

				<div v-if="['Bridge', 'Transfers', 'Config'].includes(route.name)" :style="highlightStyle" :class="$style.highlight" />
			</Flex>
		</div>

		<RouterLink to="/config">
			<Flex align="center" :class="[$style.button, allConnected && $style.connected]">
				<Text size="14" color="black">{{ allConnected ? "Connected" : "Connect" }} </Text>
			</Flex>
		</RouterLink>
	</Flex>
</template>

<style module>
.wrapper {
	position: relative;

	min-height: 48px;

	border-bottom: 2px solid var(--op-5);

	padding: 0 16px;
}

.logo {
	border-radius: 6px;

	padding: 2px 4px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-8);
	}

	&:active {
		background: var(--op-15);
	}
}

.etherlink {
	width: 20px;
	height: 20px;
}

.tabs_wrapper {
	position: absolute;
	left: 50%;

	transform: translateX(-50%);
}

.tabs {
	position: relative;

	background: var(--op-5);
	border-radius: 5000px;

	padding: 2px;
}

.highlight {
	z-index: -1;
	position: absolute;
	top: 2px;

	width: 0;
	height: 24px;

	background: var(--op-8);
	border-radius: 500px;

	will-change: transform, width;
	transition: all 0.2s ease;
}

.tab {
	height: 24px;

	cursor: pointer;

	padding: 0 10px;

	transition: background 0.1s ease;
}

.tab.active {
	& span {
		color: var(--txt-primary);
	}

	& svg {
		fill: var(--txt-primary);
	}
}

.button {
	height: 26px;

	background: rgba(255, 255, 255, 95%);
	border-radius: 5000px;
	cursor: pointer;

	padding: 0 10px;

	transition: transform 0.2s ease;

	&:active {
		transform: translateY(1px);
	}

	&.connected {
		opacity: 0.5;
		pointer-events: none;
	}
}

@media (max-width: 650px) {
	.tab {
		& span {
			display: none;
		}
	}
}

@media (max-width: 450px) {
	.name {
		display: none;
	}
}
</style>
