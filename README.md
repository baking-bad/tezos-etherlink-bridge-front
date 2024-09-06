### Local Setup

Clone the repository and run on the root folder:

```
pnpm i
pnpm dev
```

### Docker run
```
docker-compose up --build
```

### ENV setup
* `VITE_TEZOS_NETWORK_NAME` - Tezos network name.
* `VITE_SMART_ROLLUP_ADDRESS` - Tezos smart rollup address.
* `VITE_ETHERLINK_RPC` - Etherlink RPC address.
* `VITE_ETHERLINK_CHAIN_ID` - Etherlink chain ID.
* `VITE_ETHERLINK_EXPLORER` - Etherlink explorer.
* `VITE_SDK_URL` - DipDup instance link (used by [tezos-etherlink-bridge-sdk](https://github.com/baking-bad/tezos-etherlink-bridge-ts-sdk)).
* `VITE_SDK_WSS` - DipDup instance link (used by [tezos-etherlink-bridge-sdk](https://github.com/baking-bad/tezos-etherlink-bridge-ts-sdk)).
* `VITE_WALLET_CONNECT_PROJECT_ID` - WalletConnect Projet ID (after registering on https://cloud.walletconnect.com).
