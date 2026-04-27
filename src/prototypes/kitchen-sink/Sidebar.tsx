import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { CanvasLogoIcon } from '../../assets/CanvasLogoIcon'

export type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
  selected?: boolean
  onClick?: () => void
}

type SidebarProps = {
  title: string
  items: NavItem[]
  footer?: React.ReactNode
}

export function Sidebar({ title, items, footer }: SidebarProps) {
  const { sharedTokens } = useComputedTheme()

  return (
    <View
      as="nav"
      display="block"
      height="100%"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      borderWidth="small"
      shadow="resting"
      padding="small"
      width="220px"
    >
      <Flex direction="column" height="100%" gap="xx-small">

        {/* Canvas logo in navy app-icon square + title */}
        <View as="div" display="block" padding="x-small small" margin="0 0 xx-small 0">
          <Flex alignItems="center" gap="small">
            <div style={{
              backgroundColor: sharedTokens.background.brandColor,
              borderRadius: sharedTokens.borderRadius.card.nestedContainer.sm,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <CanvasLogoIcon color={sharedTokens.background.baseColor} size={18} />
            </div>
            <Text weight="bold" size="medium">{title}</Text>
          </Flex>
        </View>

        {/* Nav items */}
        <Flex direction="column" gap="xx-small">
          {items.map(item => (
            <View
              key={item.id}
              as="button"
              display="block"
              width="100%"
              borderWidth="0"
              cursor="pointer"
              padding="none"
              background={item.selected ? 'primary' : 'transparent'}
              themeOverride={
                item.selected
                  ? { backgroundPrimary: sharedTokens.background.brandColor }
                  : undefined
              }
              borderRadius={sharedTokens.borderRadius.md}
              onClick={item.onClick}
            >
              <Flex alignItems="center" gap="small" padding="xx-small small">
                <span style={{ color: item.selected ? sharedTokens.background.baseColor : 'inherit', display: 'flex' }}>
                  {item.icon}
                </span>
                <Text color={item.selected ? 'primary-inverse' : 'primary'}>{item.label}</Text>
              </Flex>
            </View>
          ))}
        </Flex>

        {/* Footer slot */}
        {footer && (
          <View as="div" display="block" padding="xx-small small" margin="xx-small 0 0 0">
            {footer}
          </View>
        )}

      </Flex>
    </View>
  )
}
