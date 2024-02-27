import { fileURLToPath, URL } from "node:url"
import path from "node:path"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
	plugins: [vue(), nodePolyfills()],
	resolve: {
		alias: {
			web3: path.resolve(__dirname, "./node_modules/web3/dist/web3.min.js"),
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
})
