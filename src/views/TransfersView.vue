<script setup>
import { computed } from "vue"
import Flex from "@/components/global/Flex.vue"
import TransferItem from "@/components/TransferItem.vue"
import TokenBridgeService from "@/services/tokenBridge"

const computedTransfers = computed(() => [])
const { tokenBridge } = TokenBridgeService.instances
tokenBridge.data.getTokenTransfers(0, 300);
</script>

<template>
<Flex direction="column" align="center">
	<TransferItem v-for="transfer in computedTransfers" :key="transfer.id" />
</Flex>
</template>

<style module>

</style>