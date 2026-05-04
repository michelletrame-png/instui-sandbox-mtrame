/* eslint-disable react-refresh/only-export-components */
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
  CircleCheckInstUIIcon,
  ChevronDownInstUIIcon,
  ChevronRightInstUIIcon,
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

const USER_MESSAGE = 'Draft a study guide for Biology 101'
const RESPONSE_TEXT = "Here is a study guide outline for Biology 101. I've organized it around the most heavily weighted topics in Unit 1: cell structure, the cell cycle, and membrane transport. Each section includes key concepts, vocabulary, and practice questions."

function AgentReasonedToggle({ sharedTokens }: FrameCtx): React.ReactNode {
  const [expanded, setExpanded] = React.useState(true)
  const agentHeaderBg = `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`
  return (
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
                  <Flex direction="column" gap="small">
                    <button
                      onClick={() => setExpanded(e => !e)}
                      style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
                    >
                      <Flex alignItems="center" gap="xx-small">
                        <CircleCheckInstUIIcon color="success" size="x-small" />
                        <Text weight="bold" color="success">Agent thought for 10s</Text>
                        {expanded
                          ? <ChevronDownInstUIIcon color="success" size="x-small" />
                          : <ChevronRightInstUIIcon color="success" size="x-small" />
                        }
                      </Flex>
                    </button>
                    {expanded && (
                      <View as="div" display="block" padding="0 0 0 x-small">
                        <View as="div" display="block" borderWidth="0 0 0 small" borderColor="primary" themeOverride={{ borderColorPrimary: sharedTokens.stroke.baseColor }} padding="0 0 0 mediumSmall">
                          <Flex direction="column" gap="small">
                            <Text size="small">I am prioritizing topics like cell structure, the cell cycle, and membrane transport because they are the most heavily weighted concepts in your Biology 101, Unit 1 syllabus.</Text>
                            <Flex direction="column" gap="xxx-small">
                              <Text size="small" weight="bold">Tools</Text>
                              <Text size="small">list_courses, listAssignments</Text>
                            </Flex>
                            <Flex direction="column" gap="xxx-small">
                              <Text size="small" weight="bold">Sources</Text>
                              <Text size="small">
                                <Link href="#">Biology 101</Link>{', '}
                                <Link href="#">Unit 1</Link>{', '}
                                <Link href="#">Assessment 1</Link>
                              </Text>
                            </Flex>
                          </Flex>
                        </View>
                      </View>
                    )}
                  </Flex>
                  <Text size="content">{RESPONSE_TEXT}</Text>
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

export function agentReasonedExpanded({ sharedTokens }: FrameCtx): React.ReactNode {
  return <AgentReasonedToggle sharedTokens={sharedTokens} />
}

export const agentReasonedExpandedCode = `// expanded is a boolean state value — true = panel open
<Flex direction="column" gap="medium">
  <Flex direction="column" gap="small">
    <button onClick={() => setExpanded(e => !e)} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
      <Flex alignItems="center" gap="xx-small">
        <CircleCheckInstUIIcon color="success" size="x-small" />
        <Text weight="bold" color="success">Agent thought for 10s</Text>
        {expanded
          ? <ChevronDownInstUIIcon color="success" size="x-small" />
          : <ChevronRightInstUIIcon color="success" size="x-small" />
        }
      </Flex>
    </button>
    {expanded && (
      <View as="div" display="block" padding="0 0 0 x-small">
        <View as="div" display="block" borderWidth="0 0 0 small" borderColor="primary"
          themeOverride={{ borderColorPrimary: sharedTokens.stroke.baseColor }} padding="0 0 0 mediumSmall">
          <Flex direction="column" gap="small">
            <Text size="small">I am prioritizing topics like cell structure, the cell cycle, and membrane transport because they are the most heavily weighted concepts in your Biology 101, Unit 1 syllabus.</Text>
            <Flex direction="column" gap="xxx-small">
              <Text size="small" weight="bold">Tools</Text>
              <Text size="small">list_courses, listAssignments</Text>
            </Flex>
            <Flex direction="column" gap="xxx-small">
              <Text size="small" weight="bold">Sources</Text>
              <Text size="small">
                <Link href="#">Biology 101</Link>{', '}
                <Link href="#">Unit 1</Link>{', '}
                <Link href="#">Assessment 1</Link>
              </Text>
            </Flex>
          </Flex>
        </View>
      </View>
    )}
  </Flex>
  <Text size="content">{responseText}</Text>
</Flex>`
