import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Link } from '@instructure/ui-link/latest'
import {
  IgniteaiLogoInstUIIcon,
  SquarePenInstUIIcon,
  HistoryInstUIIcon,
  XInstUIIcon,
  ChevronRightInstUIIcon,
  CircleCheckInstUIIcon,
  CopyInstUIIcon,
  DownloadInstUIIcon,
  EllipsisVerticalInstUIIcon,
  CheckInstUIIcon,
  PlusInstUIIcon,
  AiInfoInstUIIcon,
  ArrowUpInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function approvalStep4Revised({ sharedTokens }: FrameCtx): React.ReactNode {
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

                {/* User message — revision request */}
                <Flex justifyItems="end" padding="0 0 0 large">
                  <View
                    as="div"
                    display="block"
                    background="primary"
                    themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.mutedColor }}
                    borderWidth="small"
                    borderColor="primary"
                    borderRadius={sharedTokens.borderRadius.card.md}
                    padding="mediumSmall"
                  >
                    <Text>Add that partial credit is only available until December 15th.</Text>
                  </View>
                </Flex>

                {/* Agent response — revised draft */}
                <Flex direction="column" gap="medium">
                  <Flex direction="column" gap="small">
                    <Flex alignItems="center" gap="xx-small">
                      <CircleCheckInstUIIcon color="success" size="x-small" />
                      <Text weight="bold" color="success">Agent thought for 12 seconds</Text>
                      <ChevronRightInstUIIcon color="success" size="x-small" />
                    </Flex>
                    <Text size="content">I've updated the message to include the December 15th deadline. Please review and approve.</Text>
                  </Flex>

                  {/* Updated draft card */}
                  <View
                    as="div"
                    display="block"
                    background="primary"
                    themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.mutedColor }}
                    borderWidth="small"
                    borderColor="primary"
                    borderRadius={sharedTokens.borderRadius.card.md}
                    overflowX="hidden"
                    overflowY="hidden"
                  >
                    <View as="div" display="block" padding="mediumSmall mediumSmall small mediumSmall">
                      <Flex alignItems="center" justifyItems="space-between">
                        <Heading level="h3" variant="titleCardMini" margin="0">Send message</Heading>
                        <Flex gap="xx-small">
                          <IconButton screenReaderLabel="Copy" color="secondary" withBackground={false} size="small" renderIcon={<CopyInstUIIcon />} />
                          <IconButton screenReaderLabel="Download" color="secondary" withBackground={false} size="small" renderIcon={<DownloadInstUIIcon />} />
                          <IconButton screenReaderLabel="More options" color="secondary" withBackground={false} size="small" renderIcon={<EllipsisVerticalInstUIIcon />} />
                        </Flex>
                      </Flex>
                    </View>
                    <View as="div" display="block" padding="0 mediumSmall mediumSmall mediumSmall">
                      <Flex direction="column" gap="small">
                        <Flex direction="column" gap="xxx-small">
                          <Text weight="bold">Subject</Text>
                          <Text>Partial credit available for missing assignments</Text>
                        </Flex>
                        <Flex direction="column" gap="xxx-small">
                          <Text weight="bold">Message</Text>
                          <Text>Reminder that late work can be submitted within seven days for partial credit. Partial credit is only available until December 15th. Extensions may be approved in cases of illness or emergencies.</Text>
                        </Flex>
                      </Flex>
                    </View>
                    <View as="div" display="block" margin="0 mediumSmall" borderWidth="small 0 0 0" borderColor="primary" themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }} />
                    <View as="div" display="block" padding="mediumSmall">
                      <Flex direction="column" gap="small">
                        <Text weight="bold">Plan</Text>
                        <ul style={{ margin: 0, paddingLeft: '1.5em' }}>
                          <li><Text>Send to Benjamen Alvarez, Maya Chen, and <Link href="#">3 others</Link>.</Text></li>
                          <li><Text>Create as group conversation</Text></li>
                        </ul>
                        <Text weight="bold">Send the message immediately after approval</Text>
                      </Flex>
                    </View>
                    <View as="div" display="block" padding="mediumSmall">
                      <Flex direction="column" gap="small">
                        <Flex gap="small">
                          <Flex.Item shouldGrow shouldShrink size="0px">
                            <Button color="success" withBackground={false} display="block" renderIcon={<CheckInstUIIcon />}>Approve</Button>
                          </Flex.Item>
                          <Flex.Item shouldGrow shouldShrink size="0px">
                            <Button color="danger" withBackground={false} display="block" renderIcon={<XInstUIIcon />}>Reject</Button>
                          </Flex.Item>
                        </Flex>
                        <View as="div" display="block" textAlign="center">
                          <Text size="small" color="secondary">You can also request changes by typing below.</Text>
                        </View>
                      </Flex>
                    </View>
                  </View>
                </Flex>

              </Flex>
            </View>
          </Flex.Item>

          {/* Input */}
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
