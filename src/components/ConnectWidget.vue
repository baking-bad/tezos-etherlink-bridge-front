<script setup>
/** Vendor */
import { computed } from "vue"

/** Components */
import Tooltip from "@/components/ui/Tooltip.vue"
import ExplorerLink from "@/components/ExplorerLink.vue";
import CopyButton from "@/components/ui/CopyButton.vue";

/** Constants */
import { ConnectionStatus } from "@/services/constants/wallets"

/** Composables */
import { useTezos } from "@/composables/tezos.js"
import { useEtherlink } from "@/composables/etherlink.js"

// const { address: tezosAddress, status: tezosStatus, connect: connectTezos, disconnect: disconnectTezos } = useTezos()
// const { address: etherlinkAddress, status: etherlinkStatus, connect: connectEtherlink, disconnect: disconnectEtherlink } = useEtherlink()

// const isReady = computed(() => tezosStatus.value === ConnectionStatus.CONNECTED && etherlinkStatus.value === ConnectionStatus.CONNECTED)

// const handleConnectTezos = async () => {
// 	connectTezos()
// }
//
// const handleConnectEtherlink = async () => {
// 	connectEtherlink()
// }
//
// const handleDisconnectTezos = async () => {
// 	disconnectTezos()
// }
//
// const handleDisconnectEtherlink = async () => {
// 	disconnectEtherlink()
// }

</script>

<template>
	<Flex direction="column" align="center" justify="center" gap="6" :class="$style.wrapper">
		<Flex direction="column" align="center" gap="24">
			<Flex align="center" gap="12">
				<Tooltip :disabled="tezosStatus === ConnectionStatus.CONNECTED">
					<Flex
						align="center"
						justify="center"
						:class="[$style.wallet, tezosStatus === ConnectionStatus.CONNECTED && $style.connected]"
					>
						<img width="32" height="32" src="@/assets/images/tezos.png" />

						<Icon v-if="tezosStatus === ConnectionStatus.CONNECTED" name="check-circle" size="20" color="green" />
						<Icon v-else name="zap-circle" size="20" color="yellow" />
					</Flex>

					<template #content>
						<Flex direction="column" align="center" gap="6">
							<Text weight="600">Tezos is not connected</Text>
							<Text weight="600" color="secondary">Click on task below to resolve</Text>
						</Flex>
					</template>
				</Tooltip>

				<Flex align="center" gap="8" :class="isReady && $style.ready_icon">
					<Icon name="left-connect" size="24" :color="tezosStatus === ConnectionStatus.CONNECTED ? 'green' : 'tertiary'" />
					<Icon name="right-connect" size="24" :color="etherlinkStatus === ConnectionStatus.CONNECTED ? 'green' : 'tertiary'" />
				</Flex>

				<Tooltip :disabled="etherlinkStatus === ConnectionStatus.CONNECTED">
					<Flex
						align="center"
						justify="center"
						:class="[$style.wallet, etherlinkStatus === ConnectionStatus.CONNECTED && $style.connected]"
					>
						<img width="32" height="32" src="@/assets/images/etherlink.png" />

						<Icon v-if="etherlinkStatus === ConnectionStatus.CONNECTED" name="check-circle" size="20" color="green" />
						<Icon v-else name="zap-circle" size="20" color="yellow" />
					</Flex>

					<template #content>
						<Flex direction="column" align="center" gap="6">
							<Text weight="600">Etherlink is not connected</Text>
							<Text weight="600" color="secondary">Click on task below to resolve</Text>
						</Flex>
					</template>
				</Tooltip>
			</Flex>

			<Flex direction="column" align="center" gap="8">
				<Flex align="center" gap="6">
					<!-- <img width="20" height="20" src="@/assets/images/etherlink.png" /> -->
					<Icon name="logo" size="20" color="primary" />
					<Text size="20" color="primary">Etherlink</Text>
					<Text size="20" color="primary">Bridge</Text>
					<Text size="20" color="secondary">uses</Text>
				</Flex>
				<Flex align="center" gap="6">
					<Text size="20" color="primary">Beacon Wallet</Text>
					<Text size="20" color="secondary">and</Text>
					<Text size="20" color="primary">WalletConnect</Text>
				</Flex>
			</Flex>

			<Flex direction="column" gap="6">
				<!-- Tezos Tasks -->
				<transition name="navigation" mode="out-in">
					<Flex
						v-if="tezosStatus === ConnectionStatus.NOT_CONNECTED"
						@click="handleConnectTezos"
						justify="between"
						align="center"
						:class="[$style.task]"
					>
						<Flex direction="column" gap="6">
							<Flex align="center" gap="8">
								<Icon name="info" size="14" color="yellow" />
								<Text size="14" color="primary">Missing Tezos </Text>
							</Flex>

							<Text size="13" color="tertiary" :class="$style.description">Beacon Wallet</Text>
						</Flex>

						<Flex align="center" gap="4">
							<Icon name="open" size="14" color="primary" />
							<Text size="13" weight="semibold" color="primary">Connect</Text>
						</Flex>
					</Flex>
					<Flex v-else direction="column" :class="[$style.task, $style.done]" gap="6">
						<Flex align="center" gap="8">
							<Icon name="check-circle" size="14" color="green" />
							<Text size="14" color="primary">Tezos is ready </Text>
						</Flex>

						<Flex justify="between">
							<Flex align="center" gap="6">
								<ExplorerLink :hash="tezosAddress" network="tezos" type="address" short :class="[$style.description, $style.link]"/>
								<CopyButton :text="tezosAddress" size="11" />
							</Flex>

							<Flex @click="handleDisconnectTezos" align="center" gap="6" :class="$style.disconnect">
								<Text size="13">Disconnect</Text>
								<Icon name="log-out" size="13" />
							</Flex>
						</Flex>
					</Flex>
				</transition>

				<!-- Etherlink Tasks -->
				<transition name="navigation" mode="out-in">
					<Flex
						v-if="etherlinkStatus === ConnectionStatus.NOT_CONNECTED"
						@click="handleConnectEtherlink"
						justify="between"
						align="center"
						:class="[$style.task]"
					>
						<Flex direction="column" gap="6">
							<Flex align="center" gap="8">
								<Icon name="info" size="14" color="yellow" />
								<Text size="14" color="primary">Missing Etherlink </Text>
							</Flex>

							<Text size="13" color="tertiary" :class="$style.description">WalletConnect</Text>
						</Flex>

						<Flex align="center" gap="4">
							<Icon name="open" size="14" color="primary" />
							<Text size="13" weight="semibold" color="primary">Connect</Text>
						</Flex>
					</Flex>
					<Flex v-else direction="column" :class="[$style.task, $style.done]" gap="6">
						<Flex align="center" gap="8">
							<Icon name="check-circle" size="14" color="green" />
							<Text size="14" color="primary">Etherlink is ready </Text>
						</Flex>

						<Flex justify="between">
							<Flex align="center" gap="6">
								<ExplorerLink :hash="etherlinkAddress" network="etherlink" type="address" short :class="[$style.description, $style.link]"/>
								<CopyButton :text="etherlinkAddress" size="11" />
							</Flex>

							<Flex @click="handleDisconnectEtherlink" align="center" gap="6" :class="$style.disconnect">
								<Text size="13">Disconnect</Text>
								<Icon name="log-out" size="13" />
							</Flex>
						</Flex>
					</Flex>
				</transition>
			</Flex>

			<Transition name="fade" mode="out-in">
				<Flex v-if="!isReady" direction="column" align="center" gap="6">
					<Text size="13" color="support"> Resolve the above tasks to complete the connection </Text>
					<Text size="13" color="support"> You will be redirected when you are finished </Text>
				</Flex>
				<router-link v-else to="/" :class="$style.next_btn">
					<Text size="16" color="black">Switch to Bridge</Text>
				</router-link>
			</Transition>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	max-width: 400px;
	width: 400px;

	border-radius: 16px;
	background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%));
	box-shadow: 0 0 0 2px var(--op-5);

	padding: 20px 8px 20px 8px;

	margin: 32px 16px;
}

.button {
	width: fit-content;
	height: 26px;

	border-radius: 8px;
	background: var(--op-10);
	cursor: pointer;

	padding: 0 8px;

	transition: all 0.2s ease;

	&:hover {
		background: var(--op-15);
	}

	&:active {
		background: var(--op-20);
	}
}

.wallet {
	position: relative;

	width: 56px;
	height: 56px;

	border-radius: 12px;
	background: var(--op-8);

	& img {
		border-radius: 50%;
		filter: grayscale(1);
		opacity: 0.5;

		transition: all 0.2s ease;
	}

	& svg {
		position: absolute;
		top: -12px;
		right: -12px;
		box-sizing: content-box;

		background: #101010;
		border-radius: 50%;

		padding: 3px;
	}
}

.wallet.connected {
	& img {
		filter: none;
		opacity: 1;
	}
}

.task {
	width: 316px;

	border-radius: 8px;
	background: var(--op-5);
	cursor: pointer;

	padding: 10px 10px 10px 10px;

	transition: all 0.1s ease;

	&:hover {
		background: var(--op-8);
	}

	&.done {
		cursor: auto;
	}
}

.link {
	color: var(--txt-tertiary);
}

.disconnect {
	color: var(--txt-tertiary);
	fill: var(--txt-tertiary);
	cursor: pointer;
}

.disconnect:hover {
	fill: var(--red);
	color: var(--red);
	opacity: 0.8;
}

.description {
	margin-left: 22px;
}

.ready_icon {
	& svg {
		transition: all 0.5s ease;
	}

	& svg:first-child {
		fill: var(--green);

		transform: translateX(16px);

		filter: drop-shadow(0 0px 8px var(--green));
	}

	& svg:last-child {
		fill: var(--green);

		transform: translateX(-16px);

		filter: drop-shadow(0 0px 8px var(--green));
	}
}

.next_btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	height: 32px;

	border-radius: 8px;
	background: var(--green);
	cursor: pointer;

	margin: 0 12px;
}
</style>
