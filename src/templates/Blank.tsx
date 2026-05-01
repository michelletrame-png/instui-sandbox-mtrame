import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import type { PrototypeProps } from '../registry'

export default function Blank(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      minHeight="100vh"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
    />
  )
}
