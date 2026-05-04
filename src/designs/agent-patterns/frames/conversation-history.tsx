import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Link } from '@instructure/ui-link/latest'
import {
  IgniteaiLogoInstUIIcon,
  SquarePenInstUIIcon,
  HistoryInstUIIcon,
  XInstUIIcon,
  ChevronLeftInstUIIcon,
  EllipsisVerticalInstUIIcon,
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function agentConversationHistory({ sharedTokens }: FrameCtx): React.ReactNode {
  const agentHeaderBg = `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`

  return (
    <View
      as="div"
      width="100%"
      height="100%"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      padding="small"
      display="block"
    >
    <View
      as="div"
      width="100%"
      height="100%"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.lg}
      shadow="resting"
      display="block"
      overflowY="hidden"
      overflowX="hidden"
    >
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
          <View as="div" display="block" padding="medium">
            <Flex direction="column" gap="medium">
              <Link renderIcon={<ChevronLeftInstUIIcon size="x-small" />} iconPlacement="start" href="#">Back</Link>
              <Heading level="h2" margin="0">Chat History</Heading>
              <Flex direction="column" gap="small">
                <Text>12/31/2025</Text>
                <Flex direction="column" gap="none">
                  {['Review geometry proofs for the Unit 4 quiz', 'Build a weekly study plan across classes', 'Get feedback on my English essay draft'].map((chat, i, arr) => (
                    <React.Fragment key={chat}>
                      <Flex alignItems="center" justifyItems="space-between" padding="small none">
                        <Flex.Item shouldGrow shouldShrink><Link href="#">{chat}</Link></Flex.Item>
                        <IconButton screenReaderLabel="More options" color="secondary" withBackground={false} withBorder={false} size="small" renderIcon={<EllipsisVerticalInstUIIcon />} />
                      </Flex>
                      {i < arr.length - 1 && <View as="div" display="block" borderWidth="small 0 0 0" borderColor="primary" themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }} />}
                    </React.Fragment>
                  ))}
                </Flex>
              </Flex>
              <Flex direction="column" gap="small">
                <Text>12/30/2025</Text>
                <Flex direction="column" gap="none">
                  {['Create a catch up plan for overdue work', 'Practice biology terms with quick flashcards', "Prepare for tomorrow's chemistry lab checklist"].map((chat, i, arr) => (
                    <React.Fragment key={chat}>
                      <Flex alignItems="center" justifyItems="space-between" padding="small none">
                        <Flex.Item shouldGrow shouldShrink><Link href="#">{chat}</Link></Flex.Item>
                        <IconButton screenReaderLabel="More options" color="secondary" withBackground={false} withBorder={false} size="small" renderIcon={<EllipsisVerticalInstUIIcon />} />
                      </Flex>
                      {i < arr.length - 1 && <View as="div" display="block" borderWidth="small 0 0 0" borderColor="primary" themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }} />}
                    </React.Fragment>
                  ))}
                </Flex>
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
  )
}

export const agentConversationHistoryCode = `<View
  as="div"
  width="100%"
  height="100%"
  background="primary"
  themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
  borderRadius={sharedTokens.borderRadius.card.lg}
  shadow="resting"
  display="block"
  overflowY="hidden"
  overflowX="hidden"
>
  <Flex direction="column" height="100%">
    <View as="div" display="block" padding="small mediumSmall" background="primary"
      themeOverride={{ backgroundPrimary: \`linear-gradient(to right, \${sharedTokens.background.aiTopGradientColor} 0%, \${sharedTokens.background.aiBottomGradientColor} 100%)\` }}
    >
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
      <View as="div" display="block" padding="medium">
        <Flex direction="column" gap="medium">
          <Link renderIcon={<ChevronLeftInstUIIcon size="x-small" />} iconPlacement="start" href="#">Back</Link>
          <Heading level="h2" margin="0">Chat History</Heading>
          <Flex direction="column" gap="small">
            <Text>12/31/2025</Text>
            <Flex direction="column" gap="none">
              {conversations.map((chat, i, arr) => (
                <React.Fragment key={chat}>
                  <Flex alignItems="center" justifyItems="space-between" padding="small none">
                    <Flex.Item shouldGrow shouldShrink><Link href="#">{chat}</Link></Flex.Item>
                    <IconButton screenReaderLabel="More options" color="secondary" withBackground={false} withBorder={false} size="small" renderIcon={<EllipsisVerticalInstUIIcon />} />
                  </Flex>
                  {i < arr.length - 1 && <View as="div" display="block" borderWidth="small 0 0 0" borderColor="primary" themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }} />}
                </React.Fragment>
              ))}
            </Flex>
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
</View>`
