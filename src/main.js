/** Styles */
import "./assets/styles/main.css"

/** Vendor */
import { createApp } from "vue"
import { createPinia } from "pinia"

/** Services */
import TezosWallet from "@/services/tezos"
import EtherlinkWallet from "@/services/etherlink"
import TokenBridgeService from "@/services/tokenBridge"

/** Global Components */
import Flex from "@/components/global/Flex.vue"
import Icon from "@/components/global/Icon.vue"
import Text from "@/components/global/Text.vue"

import App from "./App.vue"
import router from "./router"

/**
 *
 * App Services
 */
TezosWallet.init()
EtherlinkWallet.init()
TokenBridgeService.init()
.then(() => {
    /**
     * Vue
     */
    const app = createApp(App)

    app.use(createPinia())
    app.use(router)

    app.component("Flex", Flex)
    app.component("Icon", Icon)
    app.component("Text", Text)

    app.mount("#app")
})
