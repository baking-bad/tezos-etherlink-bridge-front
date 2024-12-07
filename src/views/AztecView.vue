<script lang="ts" setup>
import UniversalProvider from '@walletconnect/universal-provider'
import { WalletConnectModal } from '@walletconnect/modal'
import { computed, ref, watch } from 'vue';

import { arbitrum, mainnet } from '@reown/appkit/networks'

import { WalletConnectModalSign } from "@walletconnect/modal-sign-html"
import { getSdkError } from "@walletconnect/utils";

import Button from "@/components/ui/Button.vue"

const projectId = '734c08921b9f4f202d6b63a45fb0d800';
if (!projectId) {
  throw new Error("You need to provide VITE_PROJECT_ID env variable");
}

const metadata = [
	{
		name: "3Route",
		description: "Tezos DEX aggregator",
		url: "https://3route.io/",
		icons: ["https://bcd-static-assets.fra1.digitaloceanspaces.com/dapps/3route/3route_logo_x3.png"],
	},
	{
		name: "Atomex",
		description: "Atomex",
		url: "https://atomex.me",
		icons: ["https://bcd-static-assets.fra1.digitaloceanspaces.com/dapps/atomex/atomex_logo.jpg"],
	},
	{
		name: "Juster",
		description: "Juster",
		url: "https://app.juster.fi/",
		icons: ["https://bcd-static-assets.fra1.digitaloceanspaces.com/dapps/juster/juster_logo.png"],
	},
	{
		name: "Test Dapp",
		description: "Test Dapp description",
		url: "",
		icons: [],
	},
]

const getRandomMetadata = () => {
	return metadata[Math.floor(Math.random() * metadata.length)]
}

const web3Modal = new WalletConnectModalSign({
	projectId,
	metadata: getRandomMetadata(),
});

const session = ref()
const connected = ref(false)
const accounts = ref([])
const selectedAccount = ref()
const sendPayload = ref()
const sendPayloadView = ref()

async function connect() {
  try {
    // connectButton.disabled = true;
    session.value = await web3Modal.connect({
      requiredNamespaces: {
        aztec: {
            chains: ["aztec:41337"],
            methods: ["aztec_execute"],
            events: ["accountsChanged"],
        },
      },
      optionalNamespaces: {
        aztec: {
            chains: ["aztec:31337", "aztec:51337"],
            methods: ["aztec_execute"],
            events: ["accountsChanged"],
        },
      },
    });
    console.info('connect response', session.value);
	// console.log('session.value?.namespaces', session.value.namespaces);
	
	accounts.value = session.value?.namespaces.aztec.accounts
	accounts.value = accounts.value.map(acc => acc.split(":").pop()) //replace('aztec:41337:', '').replace('aztec:31337:', ''))
	selectedAccount.value = accounts.value[0]

	connected.value = true
  } catch (err) {
    console.error(err);
    connected.value = false
  } finally {
    // connectButton.disabled = false;
  }
}

async function disconnect() {
  console.log('active session', await web3Modal.getSession());
  
    await web3Modal.disconnect({
      topic: session.value.topic,
      reason: {
        message: "USER_DISCONNECTED",
        code: 5000,
      }
      // reason: getSdkError("USER_DISCONNECTED"),
    });

    session.value = undefined
    connected.value = false

    console.log('droped session', await web3Modal.getSession());
  }


async function sendRequest () {
	await web3Modal.request(JSON.parse(sendPayloadView.value))
}

async function sendEvent() {
  
}

const handleSelectAccount = (acc) => {
	console.log('selectedAccount.value', selectedAccount.value);
	console.log('acc', acc);
	
	selectedAccount.value = acc
	console.log('selectedAccount.value', selectedAccount.value);
}

const addressFrom = ref("0x0249ff6810cafb31ac99511292d0104ba160292bed3ca4a0eb9d7ac2f37e5371")
const addressTo = ref("0x02c2a6d5a406673674d8405ecb48f7cb26322a6b7d7724ee1b47be8c61d0467f")
const capsule = ref("0x02c2a6d5a406673674d8405ecb48f7cb26322a6b7d7724ee1b47be8c61d0467f")
const contract = ref("0x03f5eb79b443df7879b6903082dc0585d235011fdf42c91594c72dce2d64adc3")
const amount = ref("100")

const params = computed(() => {
	return [
		{
			type: "call",
			contract: contract.value,
			method: "transfer",
			args: [addressTo.value, 1],
		},
		{
			type: "add_capsule",
			capsule: [capsule.value],
		},
		{
			type: "add_contact",
			address: contract.value,
		},
		{
			type: "authorize_call",
			registry: false,
			caller: addressFrom.value,
			contract: contract.value,
			method: "transfer_public",
			args: [addressFrom.value, addressTo.value, amount.value, 0],
		},
		{
			type: "authorize_call",
			registry: true,
			caller: addressFrom.value,
			contract: contract.value,
			method: "transfer_public",
			args: [addressFrom.value, addressTo.value, amount.value, 0],
		},
		{
			type: "authorize_intent",
			registry: false,
			consumer: contract.value,
			intent: [addressTo.value],
		},
		{
			type: "authorize_intent",
			registry: true,
			consumer: contract.value,
			intent: [addressTo.value],
		},
		{
			type: "call",
			contract: contract.value,
			method: "transfer_public",
			args: [addressFrom.value, addressTo.value, amount.value, 0],
		},
		{
			type: "call",
			contract: contract.value,
			method: "transfer_public",
			args: [addressFrom.value, addressTo.value, amount.value, 0],
		},
	]
})

watch(
	() => session.value,
	() => {
		if (session.value) {
			sendPayload.value = {
				topic: session.value.topic,
				request: {
					method: "aztec_execute",
					account: selectedAccount.value,
					params: params,
				},
				chainId: "aztec:41337",
			}
		} else {
			sendPayload.value = ""
		}
	},
)

watch(
	() => [selectedAccount.value, addressFrom.value, addressTo.value, capsule.value, contract.value, amount.value],
	() => {
		sendPayload.value = {
			topic: session.value.topic,
			request: {
				method: "aztec_execute",
				account: selectedAccount.value,
				params: params.value,
			},
			chainId: "aztec:41337",
		}
	}
)

watch(
	() => sendPayload.value,
	() => {
		sendPayloadView.value = JSON.stringify(sendPayload.value, null, 2)
	}
)
</script>

<template>
  <Flex justify="center">
    <Flex direction="column" align="center" justify="center" gap="24" :class="$style.wrapper">
      <Flex direction="column" gap="16" :class="$style.section">
        <Button
          @click="connect"
          type="secondary"
          size="medium"
        >
          Connect
        </Button>

        <Flex v-if="connected" align="center" :class="$style.section">
          <Text v-if="session" size="13" color="primary"> {{ JSON.stringify(session, null, 2) }} </Text>
        </Flex>
      </Flex>

      <Flex v-if="connected" direction="column" gap="16" :class="$style.section">
        <Button
          @click="disconnect"
          type="secondary"
          size="medium"
        >
          Disconnect
        </Button>

        <Flex align="center" :class="$style.section">
          <Text v-if="session" size="13" color="primary"> {{ JSON.stringify(session, null, 2) }} </Text>
        </Flex>
      </Flex>

      <Flex v-if="connected" direction="column" gap="12" :class="$style.section_big">
        <Button
          @click="sendRequest"
          type="secondary"
          size="medium"
        >
          Send
        </Button>
		
		<Flex direction="column" align="start" gap="6" :style="{width: '100%'}">
			<Text size="13" weight="600" color="primary">Shared Accounts</Text>
			<Text v-for="acc in accounts" @click="handleSelectAccount(acc)" size="13" color="secondary" :class="[$style.account, selectedAccount === acc && $style.account_selected]"> {{ acc }} </Text>
		</Flex>

		<Flex direction="column" align="start" gap="4" :style="{width: '100%'}">
			<Text size="13" weight="600" color="primary">Address From</Text>
			<input v-model="addressFrom" :class="$style.input" />
		</Flex>
		
		<Flex direction="column" align="start" gap="4" :style="{width: '100%'}">
			<Text size="13" weight="600" color="primary">Address To</Text>
			<input v-model="addressTo" :class="$style.input" />
		</Flex>

		<Flex direction="column" align="start" gap="4" :style="{width: '100%'}">
			<Text size="13" weight="600" color="primary">Contract</Text>
			<input v-model="contract" :class="$style.input" />
		</Flex>

		<Flex direction="column" align="start" gap="4" :style="{width: '100%'}">
			<Text size="13" weight="600" color="primary">Capsule</Text>
			<input v-model="capsule" :class="$style.input" />
		</Flex>

		<Flex direction="column" align="start" gap="4" :style="{width: '100%'}">
			<Text size="13" weight="600" color="primary">Amount</Text>
			<input v-model="amount" :class="$style.input" />
		</Flex>

        <Flex align="center" :class="$style.section">
			<textarea ref="fromInputEl" v-model="sendPayloadView" :class="$style.input_big" />
        </Flex>
      </Flex>
    </Flex>
  </Flex>
</template>

<style module>
.wrapper {
	max-width: 500px;
	width: 500px;

  justify-items: center;
  justify-content: center;

  height: auto;


	border-radius: 16px;
	background: linear-gradient(rgba(0, 0, 0, 40%), rgba(0, 0, 0, 0%));
	box-shadow: 0 0 0 2px var(--op-5);

	padding: 20px 8px 20px 8px;

	margin: 32px 16px;
}

.section {
  width: 400px;
  max-height: 250px;

  overflow-y: auto;

  align-items: start;
  align-content: start;
  justify-items: start;
  justify-content: start;
}

.section_big {
  width: 400px;
  max-height: 500px;

  overflow-y: auto;

  align-items: start;
  align-content: start;
  justify-items: start;
  justify-content: start;
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

.account {
	cursor: pointer;
}

.account_selected {
	color: var(--green);
}

.input {
	width: 100%;
	height: 20px;

	padding: 0;

	background-color: var(--card-background);

	font-size: 14px;
	font-family: "ClashGrotesk", "sans-serif";
	color: var(--txt-primary);
}

.input_big {
	width: 100%;
	height: 300px;

	padding: 0;

	background-color: var(--card-background);

	font-size: 14px;
	font-family: "ClashGrotesk", "sans-serif";
	color: var(--txt-primary);
}

</style>
