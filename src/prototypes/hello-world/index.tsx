import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import type { PrototypeProps } from '../../registry'

export default function HelloWorld({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()

  return (
    <View
      as="div"
      minHeight="100vh"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
    >
      <Flex justifyItems="center" alignItems="center" height="100vh">
        <View
          as="div"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderRadius={sharedTokens.borderRadius.card.lg}
          shadow="resting"
          padding="x-large"
          display="block"
          textAlign="center"
        >
          <Flex direction="column" gap="medium" alignItems="center">
            <Heading level="h1" margin="0">Hello, World!</Heading>
            <Text color="secondary">Your first InstUI prototype. Start building here.</Text>
            <Button color="primary" onClick={onToggleTheme}>
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </Flex>
        </View>
      </Flex>
    </View>
  )
}
