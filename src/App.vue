<script setup>
/** Vendor */
import { RouterView } from "vue-router"

/** Components */
import Notifications from "@/components/Notifications.vue";
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import { useWalletsStore } from "@/stores/wallets.js"
const { tezCheckConnection } = useWalletsStore()
tezCheckConnection();
</script>

<template>
	<div id="tooltip" />
	<div id="dropdown" />

	<TheHeader />

	<div :class="$style.main">
		<RouterView v-slot="{ Component }">
			<transition name="navigation" mode="out-in">
				<component :is="Component" />
			</transition>
		</RouterView>
	</div>
	
	<Notifications />

	<TheFooter />
</template>

<style module>
.main {
	min-height: calc(100vh - 50px - 48px);

	flex: 1;
}
</style>
