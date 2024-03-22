<script setup>
import {useWalletsStore} from "@/stores/wallets.js"
import { storeToRefs } from "pinia"
import Button from "@/components/ui/Button.vue"
const wallets = useWalletsStore();
const {tezStatus, ethStatus, allConnected} = storeToRefs(wallets);
const {tezConnect, ethConnect, tezDisconnect, ethDisconnect} = wallets
</script>

<template>
<div class="base">
	<button @click="tezConnect">tezConnect</button>
	<button @click="ethConnect">ethConnect</button>
	<button @click="tezDisconnect">tezDisconnect</button>
	<button @click="ethDisconnect">ethDisconnect</button>
	<span>TEZ {{tezStatus}}</span>
	<span>ETH {{ethStatus}}</span>
	<span>All {{allConnected}}</span>
</div>
</template>

<style scoped>
*:not(.base) {
	display: inline-block;
	font-size: 16px;
	background-color: #3f3f3f;
	border-radius: 4px;
	margin-bottom: 4px;
	color: white;
	border: 0;
	text-align: center;
}

button:not(.base) {
	background-color: #59ad8c;
}

.base {
	margin: auto;
	display: flex;
	flex-direction: column;
}


</style>