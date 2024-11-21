<script lang="ts" setup>
  import { createAppKit } from '@reown/appkit/vue'
  import { arbitrum, mainnet, type AppKitNetwork } from '@reown/appkit/networks'
  import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

  // 1. Get projectId from https://cloud.reown.com
  const projectId = 'e263299ab5fc37323ff95231b8e15c7f' // 734c08921b9f4f202d6b63a45fb0d800

  // 2. Create a metadata object
  const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://example.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }

  // 3. Set the networks
  const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet]

  // 4. Create Wagmi Adapter
  const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId
  })

  // 5. Create the modal
  const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
  })
</script>

<template><appkit-button /></template>