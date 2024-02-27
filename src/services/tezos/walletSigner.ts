import { BeaconWallet } from "@taquito/beacon-wallet"
import { Signer } from "@taquito/taquito"
import { b58cdecode, buf2hex, prefix } from "@taquito/utils"

export class TezosWalletSigner implements Signer {
	constructor(readonly wallet: BeaconWallet) {}

	async sign(op: string, magicByte?: Uint8Array | undefined): ReturnType<Signer["sign"]> {
		const signature = await this.wallet.sign(op, magicByte)

		const decodedSignatureBytes = b58cdecode(signature, prefix.edsig)
		const decodedSignature = buf2hex(decodedSignatureBytes)

		return {
			sig: signature,
			prefixSig: signature,
			bytes: op,
			sbytes: op + decodedSignature,
		}
	}

	publicKey(): Promise<string> {
		return this.wallet.getPK()
	}

	publicKeyHash(): Promise<string> {
		return this.wallet.getPKH()
	}

	secretKey(): Promise<string | undefined> {
		throw new Error("Method not implemented.")
	}
}
