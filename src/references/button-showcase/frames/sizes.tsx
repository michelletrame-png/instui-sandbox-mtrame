import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import type { FrameCtx } from '../../../components/SpecSheet'

const SIZES = [
  { size: 'small', label: 'small' },
  { size: 'medium', label: 'medium (default)' },
  { size: 'large', label: 'large' },
] as const

export function sizesFrame({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="medium"
    >
      <Flex direction="column" gap="medium" alignItems="start">
        {SIZES.map(({ size, label }) => (
          <Flex key={size} gap="medium" alignItems="center">
            <View as="div" display="block" minWidth="140px">
              <Text size="small" color="secondary">{label}</Text>
            </View>
            <Button color="primary" size={size}>Button</Button>
            <Button color="primary" size={size} withBackground={false}>Ghost</Button>
          </Flex>
        ))}
      </Flex>
    </View>
  )
}
