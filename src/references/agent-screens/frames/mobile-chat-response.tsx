import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import {
  IgniteaiLogoInstUIIcon,
  IconCanvasLogoSolid,
  AlignJustifyInstUIIcon,
  SquarePenInstUIIcon,
  HistoryInstUIIcon,
  XInstUIIcon,
  ChevronRightInstUIIcon,
  CircleCheckInstUIIcon,
  CopyInstUIIcon,
  ThumbsUpInstUIIcon,
  ThumbsDownInstUIIcon,
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function mobileChatResponse({ sharedTokens }: FrameCtx): React.ReactNode {
  const agentHeaderBg = `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`

  return (
    <View as="div" width="100%" height="100%" background="secondary" themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }} display="block" overflowX="hidden" overflowY="hidden" position="relative">
      <View as="header" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} borderWidth="0 0 small 0" display="block">
        <Flex alignItems="center" justifyItems="space-between" padding="x-small medium">
          <IconCanvasLogoSolid size="small" />
          <Flex alignItems="center" gap="x-small">
            <IconButton color="secondary" screenReaderLabel="Navigation menu" size="small" withBackground={false} withBorder={false} renderIcon={<AlignJustifyInstUIIcon />} />
          </Flex>
        </Flex>
      </View>
      <View as="div" position="absolute" insetBlockStart="0" insetInlineStart="0" width="100%" height="100%" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} display="block" overflowY="hidden">
        <Flex direction="column" height="100%">
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
          <Flex.Item shouldGrow shouldShrink overflowY="auto">
            <View as="div" display="block" padding="large medium">
              <Flex direction="column" gap="large">
                <Flex justifyItems="end" padding="0 0 0 large">
                  <View as="div" display="block" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.mutedColor }} borderWidth="small" borderColor="primary" borderRadius={sharedTokens.borderRadius.card.md} padding="mediumSmall">
                    <Text>List recently published courses</Text>
                  </View>
                </Flex>
                <Flex direction="column" gap="medium">
                  <Flex direction="column" gap="small">
                    <Flex alignItems="center" gap="xx-small">
                      <CircleCheckInstUIIcon color="success" size="x-small" />
                      <Text weight="bold" color="success">Agent thought for 27 seconds</Text>
                      <ChevronRightInstUIIcon color="success" size="x-small" />
                    </Flex>
                    <Text size="content">Here are the 5 most recently published courses: Biology 101, English Composition, World History, Calculus II, and Introduction to Psychology. Each was published within the last 30 days.</Text>
                  </Flex>
                  <Flex direction="column" gap="medium">
                    <Flex gap="xx-small">
                      <IconButton screenReaderLabel="Copy response" color="secondary" withBackground={false} size="small" renderIcon={<CopyInstUIIcon />} />
                      <IconButton screenReaderLabel="Like response" color="secondary" withBackground={false} size="small" renderIcon={<ThumbsUpInstUIIcon />} />
                      <IconButton screenReaderLabel="Dislike response" color="secondary" withBackground={false} size="small" renderIcon={<ThumbsDownInstUIIcon />} />
                    </Flex>
                    <Flex direction="column" gap="small">
                      {/* eslint-disable-next-line instui/button-text-max-words */}
                      <Button color="secondary" display="block" textAlign="start">Show enrollment numbers for each</Button>
                      {/* eslint-disable-next-line instui/button-text-max-words */}
                      <Button color="secondary" display="block" textAlign="start">Which course has the most activity?</Button>
                      {/* eslint-disable-next-line instui/button-text-max-words */}
                      <Button color="secondary" display="block" textAlign="start">Draft a welcome message for these courses</Button>
                    </Flex>
                    <Text size="small" color="secondary">AI can make mistakes. Consider checking important information.</Text>
                  </Flex>
                </Flex>
              </Flex>
            </View>
          </Flex.Item>
          <View as="div" padding="none x-small x-small" display="block">
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
                <IconButton screenReaderLabel="Send" color="primary" size="small" renderIcon={<ArrowUpInstUIIcon />} />
              </Flex>
            </View>
          </View>
        </Flex>
      </View>
    </View>
  )
}
