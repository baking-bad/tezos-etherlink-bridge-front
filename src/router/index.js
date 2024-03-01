/** Vendor */
import { createRouter, createWebHistory } from "vue-router"

/** Views */
import BridgeView from "@/views/BridgeView.vue"
import ConnectView from "@/views/ConnectView.vue"
import ConfirmView from "@/views/ConfirmView.vue"
import TransfersView from "@/views/TransfersView.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "Bridge",
			component: BridgeView,
		},
		{
			path: "/connect",
			name: "Connect",
			component: ConnectView,
		},
		{
			path: "/transfers",
			name: "Transfers",
			component: TransfersView,
		},
		{
			path: "/config",
			name: "Config",
			component: BridgeView,
		},
		{
			path: "/confirm",
			name: "Confirm",
			component: ConfirmView,
		},
	],
})

export default router
