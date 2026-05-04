import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import {
  IgniteaiLogoInstUIIcon,
  IconCanvasLogoSolid,
  EllipsisVerticalInstUIIcon,
  AlignJustifyInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from './ctx'

export function mobileAgentClosed({ sharedTokens }: FrameCtx): React.ReactNode {
  return (
    <View as="div" width="100%" height="100%" background="secondary" themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }} display="block" overflowX="hidden" overflowY="hidden" position="relative">
      <View as="header" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} borderWidth="0 0 small 0" display="block">
        <Flex alignItems="center" justifyItems="space-between" padding="x-small medium">
          <IconCanvasLogoSolid size="small" />
          <Flex alignItems="center" gap="x-small">
            <IconButton color="ai-primary" screenReaderLabel="Open AI assistant" size="small">
              <IgniteaiLogoInstUIIcon />
            </IconButton>
            <IconButton color="secondary" screenReaderLabel="Navigation menu" size="small" withBackground={false} withBorder={false} renderIcon={<AlignJustifyInstUIIcon />} />
          </Flex>
        </Flex>
      </View>
      <View as="div" padding="medium" display="block">
        <Flex direction="column" gap="medium">
          <Flex direction="column" gap="x-small">
            <Breadcrumb label="Navigation">
              <Breadcrumb.Link href="#">Admin</Breadcrumb.Link>
              <Breadcrumb.Link>Dashboard</Breadcrumb.Link>
            </Breadcrumb>
            <Heading level="h1" variant="titlePageMobile" margin="0">Dashboard</Heading>
            <Text size="content">Overview of your institution's courses and activity.</Text>
          </Flex>
          <Flex gap="small" alignItems="center">
            <Flex.Item shouldGrow shouldShrink>
              <Button color="primary" display="block" textAlign="center">Primary action</Button>
            </Flex.Item>
            <IconButton color="secondary" screenReaderLabel="More actions" renderIcon={<EllipsisVerticalInstUIIcon />} />
          </Flex>
          <View as="div" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} borderRadius={sharedTokens.borderRadius.card.md} shadow="resting" padding="small" display="block">
            <Flex direction="column" gap="xx-small">
              <Heading level="h2" variant="titleCardRegular" margin="0">Course activity</Heading>
              <Text size="content" color="secondary">Recent enrollment and publishing events</Text>
              <Text size="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
            </Flex>
          </View>
        </Flex>
      </View>
    </View>
  )
}
