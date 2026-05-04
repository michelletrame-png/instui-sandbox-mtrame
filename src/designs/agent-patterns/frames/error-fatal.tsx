import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import {
  IgniteaiLogoInstUIIcon,
  SquarePenInstUIIcon,
  HistoryInstUIIcon,
  XInstUIIcon,
  CircleAlertInstUIIcon,
  RefreshCwInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function agentErrorFatal({ sharedTokens }: FrameCtx): React.ReactNode {
  const agentHeaderBg = `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`

  return (
    <View as="div" width="100%" height="100%" background="secondary" themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }} padding="small" display="block">
      <View as="div" width="100%" height="100%" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} borderRadius={sharedTokens.borderRadius.card.lg} shadow="resting" display="block" overflowY="hidden" overflowX="hidden">
        <Flex direction="column" height="100%">

          {/* Header */}
          <View as="div" display="block" padding="small mediumSmall" background="primary" themeOverride={{ backgroundPrimary: agentHeaderBg }}>
            <Flex alignItems="center" justifyItems="space-between">
              <Flex alignItems="center" gap="x-small">
                <IgniteaiLogoInstUIIcon color="onColor" size="md" />
                <Heading level="h2" variant="titleCardRegular" color="primary-on" margin="0">IgniteAI Agent</Heading>
              </Flex>
              <Flex alignItems="center" gap="xx-small">
                <IconButton screenReaderLabel="New chat" color="primary-inverse" withBackground={false} size="small" renderIcon={<SquarePenInstUIIcon />} />
                <IconButton screenReaderLabel="Chat history" color="primary-inverse" withBackground={false} size="small" renderIcon={<HistoryInstUIIcon />} />
                <IconButton screenReaderLabel="Close" color="primary-inverse" withBackground={false} withBorder={false} size="small" renderIcon={<XInstUIIcon />} />
              </Flex>
            </Flex>
          </View>

          {/* Content — no user message, error appears standalone */}
          <Flex.Item shouldGrow shouldShrink overflowY="auto">
            <View as="div" display="block" padding="large medium">
              <Flex direction="column" gap="small">
                <Flex gap="x-small" alignItems="center">
                  <CircleAlertInstUIIcon color="error" size="x-small" />
                  <Text weight="bold" color="danger">An unexpected error occurred</Text>
                </Flex>
                <Text size="content">Please check back later or try again</Text>
                <View as="div" display="block" margin="x-small 0 0 0">
                  <Button color="secondary" withBackground={false} renderIcon={<RefreshCwInstUIIcon />}>Try again</Button>
                </View>
              </Flex>
            </View>
          </Flex.Item>

          {/* No input area for fatal errors */}

        </Flex>
      </View>
    </View>
  )
}

export const agentErrorFatalCode = `<Flex direction="column" gap="small">
  <Flex gap="x-small" alignItems="center">
    <CircleAlertInstUIIcon color="error" size="x-small" />
    <Text weight="bold" color="danger">An unexpected error occurred</Text>
  </Flex>
  <Text size="content">Please check back later or try again</Text>
  <View as="div" display="block" margin="x-small 0 0 0">
    <Button color="secondary" withBackground={false} renderIcon={<RefreshCwInstUIIcon />}>Try again</Button>
  </View>
</Flex>`
