/** Vendor */
import { reactive } from "vue"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit } from "@taquito/taquito"
import { NetworkType, ColorMode } from "@airgap/beacon-types"

/** Services */
import { config } from "@/services/cfg"

import { TezosWalletSigner } from "./walletSigner"

const instances = {
	beacon: null,
	toolkit: null,
	signer: null,
}

const init = () => {
	instances.beacon = new BeaconWallet({
		name: config.app.name,
		description: config.app.description,
		network: {
			type: NetworkType.CUSTOM,
			rpcUrl: config.tezos.network.rpcUrl,
		},
		featuredWallets: ["temple", "atomex", "metamask", "trust"],
		colorMode: ColorMode.DARK,
		walletConnectOptions: {
			projectId: config.walletConnectProjectId,
		},
	})
	instances.toolkit = new TezosToolkit(config.tezos.network.rpcUrl)

	instances.signer = new TezosWalletSigner(instances.beacon)
	instances.toolkit.setWalletProvider(instances.beacon)
	instances.toolkit.setSignerProvider(instances.signer)
}

export default { init, instances }
