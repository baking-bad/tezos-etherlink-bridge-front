<script lang="ts" setup>
import UniversalProvider from '@walletconnect/universal-provider'
import { WalletConnectModal } from '@walletconnect/modal'
import { onMounted, ref } from 'vue';

import { arbitrum, mainnet } from '@reown/appkit/networks'

export const networks = [mainnet, arbitrum]

// import {
//   createWeb3Modal,
//   defaultConfig,
//   useWeb3Modal,
//   useWeb3ModalEvents,
//   useWeb3ModalState,
//   useWeb3ModalTheme
// } from '@web3modal/ethers/vue'
// import { localhost } from 'viem/chains';


// function getBlockchainApiRpcUrl(chainId) {
//   return `https://rpc.walletconnect.org/v1/?chainId=eip155:${chainId}&projectId=${projectId}`
// }

// // 2. Set chains
// const chains = [
//   {
//     chainId: 1,
//     name: 'Ethereum',
//     currency: 'ETH',
//     explorerUrl: 'https://etherscan.io',
//     rpcUrl: getBlockchainApiRpcUrl(1)
//   },
//   {
//     chainId: 42161,
//     name: 'Arbitrum',
//     currency: 'ETH',
//     explorerUrl: 'https://arbiscan.io',
//     rpcUrl: getBlockchainApiRpcUrl(42161)
//   }
// ]

// const ethersConfig = defaultConfig({
//   metadata: {
//     name: 'AppKit',
//     description: 'AppKit Laboratory',
//     url: 'https://example.com',
//     icons: ['https://avatars.githubusercontent.com/u/37784886']
//   },
//   defaultChainId: 1
// })

// const namespaces = {
//     aztec: {
//         chains: ["aztec:1"],
//         methods: [
//             "aztec_sendTransaction",
//             "aztec_experimental_createSecretHash",
//             "aztec_experimental_tokenRedeemShield",
//             "aztec_requestAccounts",
//             "aztec_accounts"
//         ],
//         events: ["accountsChanged"],
//     }
// }

// // 3. Create modal
// createWeb3Modal({
//   ethersConfig,
//   projectId,
//   chains,
//   themeMode: 'light',
//   themeVariables: {
//     '--w3m-color-mix': '#00BB7F',
//     '--w3m-color-mix-strength': 20
//   }
// })

// // 4. Use modal composable
// const modal = useWeb3Modal()
// const state = useWeb3ModalState()
// const { setThemeMode, themeMode, themeVariables } = useWeb3ModalTheme()
// const events = useWeb3ModalEvents()

// const provider = await UniversalProvider.init({
//   projectId: '734c08921b9f4f202d6b63a45fb0d800',
//   relayUrl: 'wss://relay.walletconnect.com'
// })

// const params = {
//   requiredNamespaces: {
//     polkadot: {
//       methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
//       chains: [
//         'polkadot:91b171bb158e2d3848fa23a9f1c25182', // polkadot
//         'polkadot:afdc188f45c71dacbaa0b62e16a91f72', // hydradx
//         'polkadot:0f62b701fb12d02237a33b84818c11f6' // turing network
//       ],
//       events: ['chainChanged', 'accountsChanged']
//     }
//   }
// }

// const { uri, approval } = await provider.client.connect(params)
// console.log('uri', uri);

// const walletConnectModal = new WalletConnectModal({
//   projectId: 'e263299ab5fc37323ff95231b8e15c7f',
// })

// // if there is a URI from the client connect step open the modal
// if (uri) {
//   walletConnectModal.openModal({ uri })
// }
// await session approval from the wallet app
// const walletConnectSession = await approval()


const provider = ref<UniversalProvider | null>(null);
const uri = ref<string | null>(null);
// const walletConnectModal = new WalletConnectModal({
//   projectId: 'e263299ab5fc37323ff95231b8e15c7f',
// });

const initializeProvider = async () => {
  try {
    provider.value = await UniversalProvider.init({
      projectId: 'e263299ab5fc37323ff95231b8e15c7f',
      // relayUrl: 'wss://relay.walletconnect.com',
      // logger: 'debug',
    });

    const params = {
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: [
            'polkadot:91b171bb158e2d3848fa23a9f1c25182',
            'polkadot:afdc188f45c71dacbaa0b62e16a91f72',
            'polkadot:0f62b701fb12d02237a33b84818c11f6',
          ],
          events: ['chainChanged', 'accountsChanged'],
        },
      },
    };

    const { uri: connectUri, approval } = await provider.value.client.connect(params);
    uri.value = connectUri;
    console.log('uri.value', uri.value);
    

    // if (uri.value) {
    //   walletConnectModal.openModal({ uri: uri.value });
    // }

    // Подождать одобрения пользователя
    // const walletConnectSession = await approval();
  } catch (error) {
    console.error('Error initializing provider:', error);
  }
};

onMounted(() => {
  initializeProvider();
});

</script>

<template>
  <!-- <w3m-button />
  <w3m-network-button />
  <w3m-connect-button />
  <w3m-account-button /> -->

  <!-- <button @click="modal.open()">Open Connect Modal</button>
  <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
  <button @click="setThemeMode(themeMode === 'dark' ? 'light' : 'dark')">Toggle Theme Mode</button>
  <pre>{{ JSON.stringify(state, null, 2) }}</pre>
  <pre>{{ JSON.stringify({ themeMode, themeVariables }, null, 2) }}</pre>
  <pre>{{ JSON.stringify(events, null, 2) }}</pre> -->
</template>