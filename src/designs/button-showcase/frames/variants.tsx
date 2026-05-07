import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import type { FrameCtx, CopyEntry } from '../../../components/SpecSheet'

const COLORS = ['primary', 'secondary', 'success', 'danger'] as const
const VARIANTS = [
  { withBackground: true, label: 'Filled' },
  { withBackground: false, label: 'Ghost' },
] as const

export function variantsFrame({ sharedTokens }: FrameCtx): React.ReactNode {
  function row(color: (typeof COLORS)[number]) {
    return (
      <Flex gap="small" alignItems="center">
        <View as="div" display="block" minWidth="88px">
          <Text size="small" color="secondary">{color}</Text>
        </View>
        {VARIANTS.map(v => (
          <Button key={v.label} color={color} withBackground={v.withBackground}>
            {v.label}
          </Button>
        ))}
      </Flex>
    )
  }

  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="medium"
    >
      <Flex direction="column" gap="medium">
        <Flex gap="small" alignItems="center">
          <View as="div" display="block" minWidth="88px" />
          {VARIANTS.map(v => (
            <Text key={v.label} size="small" color="secondary" weight="bold">{v.label}</Text>
          ))}
        </Flex>
        {COLORS.map(c => <React.Fragment key={c}>{row(c)}</React.Fragment>)}
      </Flex>
    </View>
  )
}

export const variantsFrameCopy: CopyEntry[] = [
  { label: 'Primary filled button', text: 'Save changes' },
  { label: 'Danger ghost button', text: 'Delete' },
]
