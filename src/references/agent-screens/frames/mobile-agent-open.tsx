import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Link } from '@instructure/ui-link/latest'
import { Pill } from '@instructure/ui-pill/latest'
import {
  IgniteaiLogoInstUIIcon,
  IconCanvasLogoSolid,
  AlignJustifyInstUIIcon,
  SquarePenInstUIIcon,
  HistoryInstUIIcon,
  XInstUIIcon,
  HandInstUIIcon,
  WandSparklesInstUIIcon,
  LibraryInstUIIcon,
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function mobileAgentOpen({ sharedTokens }: FrameCtx): React.ReactNode {
  const aiGradient = `linear-gradient(90deg, ${sharedTokens.background.aiTopGradientColor} 20%, ${sharedTokens.background.aiBottomGradientColor} 81%)`
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
                <Flex direction="column" gap="xx-small">
                  <Flex alignItems="center" gap="x-small">
                    <View as="span" display="inline-block" style={{ transform: 'rotate(-35deg)' }}>
                      <HandInstUIIcon size="lg" />
                    </View>
                    <Heading level="h2" margin="0">
                      <span style={{ background: aiGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Hello, Zoe!</span>
                    </Heading>
                  </Flex>
                  <Text color="secondary">What are we doing today?</Text>
                </Flex>
                <Flex direction="column" gap="small">
                  <Heading level="h4" as="h3" margin="0">Get started</Heading>
                  <Flex direction="column" gap="small">
                    <View as="div" display="block" width="100%" borderWidth="small" borderColor="primary" borderRadius={sharedTokens.borderRadius.card.md} padding="small medium" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}>
                      <Flex gap="mediumSmall" alignItems="center">
                        <WandSparklesInstUIIcon color="brand" size="md" />
                        <Flex.Item shouldGrow shouldShrink>
                          <Flex direction="column" gap="xxx-small">
                            <Text weight="bold">Prompt builder</Text>
                            <Text size="small" color="secondary">Generate common prompts</Text>
                          </Flex>
                        </Flex.Item>
                        <Pill color="info">Start here</Pill>
                      </Flex>
                    </View>
                    <View as="div" display="block" width="100%" borderWidth="small" borderColor="primary" borderRadius={sharedTokens.borderRadius.card.md} padding="small medium" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}>
                      <Flex gap="mediumSmall" alignItems="center">
                        <LibraryInstUIIcon color="brand" size="md" />
                        <Flex.Item shouldGrow shouldShrink>
                          <Flex direction="column" gap="xxx-small">
                            <Text weight="bold">Community library</Text>
                            <Text size="small" color="secondary">Browse and contribute community prompts</Text>
                          </Flex>
                        </Flex.Item>
                      </Flex>
                    </View>
                  </Flex>
                </Flex>
                <Flex direction="column" gap="small">
                  <Heading level="h4" as="h3" margin="0">Try asking</Heading>
                  <Flex direction="column" gap="small">
                    <Button color="secondary" display="block" textAlign="start">List recently published courses</Button>
                    {/* eslint-disable-next-line instui/button-text-max-words */}
                    <Button color="secondary" display="block" textAlign="start">Draft a message to students</Button>
                    {/* eslint-disable-next-line instui/button-text-max-words */}
                    <Button color="secondary" display="block" textAlign="start">Shift dates in a module</Button>
                  </Flex>
                  <View as="div" display="block" margin="small 0 0 0">
                    <Link href="#">What else can you do?</Link>
                  </View>
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
