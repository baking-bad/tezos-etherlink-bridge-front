/** Vendor */
import { createRouter, createWebHistory } from "vue-router"

/** Views */
import BridgeView from "@/views/BridgeView.vue"
import ConnectView from "@/views/ConnectView.vue"
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
			path: "/transfers",
			name: "Transfers",
			component: TransfersView,
		},
		{
			path: "/config",
			name: "Config",
			component: ConnectView,
		},
		{
			path: '/:catchAll(.*)*',
			name: "NotFound",
			redirect: { name: "Bridge" }
		}
	],
})

export default router
