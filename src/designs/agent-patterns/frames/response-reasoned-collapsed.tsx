import React from 'react'
import { Global } from '@instructure/emotion'
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
  CircleCheckInstUIIcon,
  ChevronRightInstUIIcon,
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
  CopyInstUIIcon,
  ThumbsUpInstUIIcon,
  ThumbsDownInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

const USER_MESSAGE = 'Draft a study guide for Biology 101'
const RESPONSE_TEXT = "Here is a study guide outline for Biology 101. I've organized it around the most heavily weighted topics in Unit 1: cell structure, the cell cycle, and membrane transport. Each section includes key concepts, vocabulary, and practice questions."

export function agentReasonedCollapsed({ sharedTokens }: FrameCtx): React.ReactNode {
  const agentHeaderBg = `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`
  const fadeIn = (i: number): React.CSSProperties => ({
    opacity: 0,
    animation: `agent-fade-in 300ms ease-out ${i * 150}ms both`,
  })
  return (
    <>
      <Global styles={`
        @keyframes agent-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `} />
      <View as="div" width="100%" height="100%" background="secondary" themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }} padding="small" display="block">
        <View as="div" width="100%" height="100%" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} borderRadius={sharedTokens.borderRadius.card.lg} shadow="resting" display="block" overflowY="hidden" overflowX="hidden">
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
                      <Text>{USER_MESSAGE}</Text>
                    </View>
                  </Flex>
                  <Flex direction="column" gap="medium">
                    <Flex alignItems="center" gap="xx-small">
                      <CircleCheckInstUIIcon color="success" size="x-small" />
                      <Text weight="bold" color="success">Agent thought for 10s</Text>
                      <ChevronRightInstUIIcon color="success" size="x-small" />
                    </Flex>
                    <div style={fadeIn(0)}>
                      <Text size="content">{RESPONSE_TEXT}</Text>
                    </div>
                    <div style={fadeIn(1)}>
                      <Flex gap="xx-small">
                        <IconButton screenReaderLabel="Copy response" color="secondary" withBackground={false} size="small" renderIcon={<CopyInstUIIcon />} />
                        <IconButton screenReaderLabel="Like response" color="secondary" withBackground={false} size="small" renderIcon={<ThumbsUpInstUIIcon />} />
                        <IconButton screenReaderLabel="Dislike response" color="secondary" withBackground={false} size="small" renderIcon={<ThumbsDownInstUIIcon />} />
                      </Flex>
                    </div>
                    <Flex direction="column" gap="small">
                      {/* eslint-disable-next-line instui/button-text-max-words */}
                      <div style={fadeIn(2)}><Button color="secondary" display="block" textAlign="start">Help me study cell structure</Button></div>
                      {/* eslint-disable-next-line instui/button-text-max-words */}
                      <div style={fadeIn(3)}><Button color="secondary" display="block" textAlign="start">Quiz me on the cell cycle</Button></div>
                      {/* eslint-disable-next-line instui/button-text-max-words */}
                      <div style={fadeIn(4)}><Button color="secondary" display="block" textAlign="start">Explain membrane transport in simple terms</Button></div>
                    </Flex>
                    <div style={fadeIn(5)}>
                      <Text size="small" color="secondary">AI can make mistakes. Consider checking important information.</Text>
                    </div>
                  </Flex>
                </Flex>
              </View>
            </Flex.Item>
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
                  <IconButton screenReaderLabel="Send" color="primary" size="small" renderIcon={<ArrowUpInstUIIcon />} />
                </Flex>
              </View>
            </View>
          </Flex>
        </View>
      </View>
    </>
  )
}

export const agentReasonedCollapsedCode = `<>
  <Global styles={\`
    @keyframes agent-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  \`} />
  <Flex direction="column" gap="medium">
    <Flex alignItems="center" gap="xx-small">
      <CircleCheckInstUIIcon color="success" size="x-small" />
      <Text weight="bold" color="success">Agent thought for 10s</Text>
      <ChevronRightInstUIIcon color="success" size="x-small" />
    </Flex>
    <div style={{ opacity: 0, animation: 'agent-fade-in 300ms ease-out 0ms both' }}>
      <Text size="content">{responseText}</Text>
    </div>
    <div style={{ opacity: 0, animation: 'agent-fade-in 300ms ease-out 150ms both' }}>
      <Flex gap="xx-small">
        <IconButton screenReaderLabel="Copy response" color="secondary" withBackground={false} size="small" renderIcon={<CopyInstUIIcon />} />
        <IconButton screenReaderLabel="Like response" color="secondary" withBackground={false} size="small" renderIcon={<ThumbsUpInstUIIcon />} />
        <IconButton screenReaderLabel="Dislike response" color="secondary" withBackground={false} size="small" renderIcon={<ThumbsDownInstUIIcon />} />
      </Flex>
    </div>
    <Flex direction="column" gap="small">
      <div style={{ opacity: 0, animation: 'agent-fade-in 300ms ease-out 300ms both' }}>
        <Button color="secondary" display="block" textAlign="start">Help me study cell structure</Button>
      </div>
      <div style={{ opacity: 0, animation: 'agent-fade-in 300ms ease-out 450ms both' }}>
        <Button color="secondary" display="block" textAlign="start">Quiz me on the cell cycle</Button>
      </div>
      <div style={{ opacity: 0, animation: 'agent-fade-in 300ms ease-out 600ms both' }}>
        <Button color="secondary" display="block" textAlign="start">Explain membrane transport in simple terms</Button>
      </div>
    </Flex>
    <div style={{ opacity: 0, animation: 'agent-fade-in 300ms ease-out 750ms both' }}>
      <Text size="small" color="secondary">AI can make mistakes. Consider checking important information.</Text>
    </div>
  </Flex>
</>`
