<template>
	<Flex justify="center" align="center" :class="$style.wrapper">
		<Flex align="center" direction="column" gap="8">
			<Flex align="center" gap="4">
				<Icon name="logo" size="12" color="tertiary" />
				<Text size="13" color="tertiary"> Etherlink Bridge <Text color="support">by</Text> Baking Bad </Text>
			</Flex>
		</Flex>
	</Flex>
</template>

<style module>
.wrapper {
	min-height: 70px;

	border-top: 2px solid var(--op-5);

	padding: 0 16px;
}
</style>
