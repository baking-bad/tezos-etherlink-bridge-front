<script setup>
/** UI */
import Tooltip from "@/components/ui/Tooltip.vue"
</script>

<template>
	<Flex direction="column" justify="center" gap="20" :class="$style.wrapper">
		<Flex wide align="center" :class="$style.header">
			<RouterLink to="/">
				<Flex align="center" gap="4" :class="$style.cancel_button">
					<Icon name="back" size="14" color="secondary" />
					<Text size="13" weight="semibold" color="secondary">Cancel</Text>
				</Flex>
			</RouterLink>

			<Text size="16" color="primary" :class="$style.title">Transfer Confirmation</Text>
		</Flex>

		<Flex direction="column" gap="32">
			<Flex direction="column" align="center" justify="center" gap="12">
				<Flex align="center" gap="6">
					<Text size="13" color="tertiary">Receive in</Text>

					<Flex align="center" gap="4">
						<img width="14" height="14" src="@/assets/images/etherlink.png" />
						<Text size="13" color="primary">Etherlink</Text>
					</Flex>
				</Flex>

				<Flex direction="column" align="center" gap="8">
					<Text size="28" color="primary"> 7,620 <Text size="20" color="tertiary">XTZ</Text> </Text>
					<Text size="14" color="tertiary">~ 25,620 XTZ</Text>
				</Flex>
			</Flex>

			<table :class="$style.table">
				<tbody>
					<tr>
						<td>
							<Text size="13" color="tertiary">Paying</Text>
						</td>
						<td>
							<Flex align="center" gap="6">
								<img width="14" height="14" src="@/assets/images/tezos.png" />
								<Text size="13" color="primary"> 287,295 <Text color="tertiary">ETH</Text> </Text>
							</Flex>
						</td>
					</tr>
					<tr>
						<td>
							<Text size="13" color="tertiary">From</Text>
						</td>
						<td>
							<Flex align="center" gap="6">
								<Icon name="banknote" size="14" color="primary" />
								<Text size="13" color="primary"> tz3Zhs <Text color="tertiary">...</Text> Z4Xj1</Text>
							</Flex>
						</td>
					</tr>
					<tr>
						<td>
							<Text size="13" color="tertiary">To</Text>
						</td>
						<td>
							<Flex align="center" gap="6">
								<Icon name="banknote" size="14" color="primary" />
								<Text size="13" color="primary"> tz3Zhs <Text color="tertiary">...</Text> Z4Xj1</Text>
							</Flex>
						</td>
					</tr>
				</tbody>
			</table>
		</Flex>

		<Flex align="center" justify="center" gap="6" :class="$style.pay_button">
			<Icon name="banknote" size="16" color="black" />

			<Text size="16" color="black"> Pay 256,500 XTZ</Text>
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

	padding: 8px;

	margin: 32px 16px;
}

.header {
	position: relative;

	.title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
}

.cancel_button {
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

.table {
	border-spacing: 0;
	border: 1px solid var(--op-8);
	border-radius: 8px;

	margin: 0 12px;

	tbody {
		tr {
			td {
				border-bottom: 1px solid var(--op-8);

				padding: 12px 14px;
			}
		}

		tr:last-child {
			td {
				border-bottom: 1px solid transparent;
			}
		}
	}
}

.pay_button {
	height: 32px;

	border-radius: 8px;
	background: var(--green);
	cursor: pointer;

	margin: 0 12px 12px 12px;
}
</style>
