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
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function agentErrorNewChat({ sharedTokens }: FrameCtx): React.ReactNode {
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

          {/* Content */}
          <Flex.Item shouldGrow shouldShrink overflowY="auto">
            <View as="div" display="block" padding="large medium">
              <Flex direction="column" gap="large">

                {/* User message */}
                <Flex justifyItems="end" padding="0 0 0 large">
                  <View as="div" display="block" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.mutedColor }} borderWidth="small" borderColor="primary" borderRadius={sharedTokens.borderRadius.card.md} padding="mediumSmall">
                    <Text>Message</Text>
                  </View>
                </Flex>

                {/* Error response */}
                <Flex direction="column" gap="small">
                  <Flex gap="x-small" alignItems="center">
                    <CircleAlertInstUIIcon color="error" size="x-small" />
                    <Text weight="bold" color="danger">This conversation can't continue</Text>
                  </Flex>
                  <Text size="content">Something in this chat is no longer usable, so it can't be resumed. Starting a new chat is required to continue.</Text>
                  <View as="div" display="block" margin="x-small 0 0 0">
                    <Button color="secondary" withBackground={false} renderIcon={<SquarePenInstUIIcon />}>Start a new chat</Button>
                  </View>
                </Flex>

              </Flex>
            </View>
          </Flex.Item>

          {/* Input — send disabled since chat can't continue */}
          <View as="div" display="block" padding="none mediumSmall mediumSmall">
            <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.baseColor }} borderRadius={sharedTokens.borderRadius.card.md} borderWidth="small" borderColor="primary" display="block" padding="mediumSmall">
              <Flex direction="column" gap="xx-small">
                <Text size="small" color="secondary">Enter a prompt</Text>
                <Text color="secondary">Help me…</Text>
              </Flex>
              <Flex justifyItems="space-between" alignItems="center" margin="x-small 0 0 0">
                <Flex gap="x-small">
                  <IconButton screenReaderLabel="Attach file" color="secondary" withBackground={false} size="small" renderIcon={<PlusInstUIIcon />} />
                  <IconButton screenReaderLabel="AI suggestions" color="secondary" withBackground={false} size="small" renderIcon={<AiInfoInstUIIcon />} />
                </Flex>
                <IconButton screenReaderLabel="Send" color="primary" size="small" interaction="disabled" renderIcon={<ArrowUpInstUIIcon />} />
              </Flex>
            </View>
          </View>

        </Flex>
      </View>
    </View>
  )
}

export const agentErrorNewChatCode = `<Flex direction="column" gap="small">
  <Flex gap="x-small" alignItems="center">
    <CircleAlertInstUIIcon color="error" size="x-small" />
    <Text weight="bold" color="danger">This conversation can't continue</Text>
  </Flex>
  <Text size="content">Something in this chat is no longer usable, so it can't be resumed. Starting a new chat is required to continue.</Text>
  <View as="div" display="block" margin="x-small 0 0 0">
    <Button color="secondary" withBackground={false} renderIcon={<SquarePenInstUIIcon />}>Start a new chat</Button>
  </View>
</Flex>`
