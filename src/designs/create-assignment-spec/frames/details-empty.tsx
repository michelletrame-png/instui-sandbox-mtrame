import React from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  AlignJustifyInstUIIcon, CircleHelpInstUIIcon, CopyInstUIIcon, EyeInstUIIcon,
  ClipboardListInstUIIcon, RocketInstUIIcon, MessageCircleInstUIIcon,
  FolderOpenInstUIIcon, FileTextInstUIIcon, SparklesInstUIIcon,
  BoldInstUIIcon, ItalicInstUIIcon, UnderlineInstUIIcon, LinkInstUIIcon,
  ImageInstUIIcon, ListInstUIIcon, AlignLeftInstUIIcon,
} from '@instructure/ui-icons'
import type { FrameCtx } from '../../../components/SpecSheet'

/**
 * Details tab — empty state.
 *
 * The first tab in the Create Coursework flow. Shown immediately on entry,
 * before the user has named the assignment or written any instructions.
 *
 * Key elements:
 *   • App top bar with course title and "Draft saved" badge
 *   • 5-step progress indicator (Instructions / Grading / Rubric / Assign / Publish)
 *   • Editable coursework title (defaults to "Untitled coursework")
 *   • Coursework type grid — Assignment is the only V1 type; others show
 *     "Coming in V2" or "Later in the roadmap"
 *   • Rich content editor for assignment instructions
 */
export function detailsEmpty({ sharedTokens }: FrameCtx): React.ReactNode {
  const pageBg     = sharedTokens.background.pageColor
  const surfaceBg  = sharedTokens.background.containerColor
  const mutedBg    = sharedTokens.background.mutedColor
  const accentBg   = sharedTokens.background.accentBlue
  const accentStroke = sharedTokens.stroke.accentBlue
  const stroke     = sharedTokens.stroke.baseColor

  const TABS = ['Instructions', 'Grading', 'Rubric', 'Assign', 'Publish']
  const activeTab = 'Instructions'

  // Lowercase render function for each coursework type card. Lowercase keeps it
  // inline (not a custom component), which the spec contract requires.
  function typeCard(opts: {
    icon: React.ReactNode
    label: string
    description: string
    active?: boolean
    badge?: string
  }) {
    const { icon, label, description, active, badge } = opts
    return (
      <View
        as="div"
        display="block"
        padding="small"
        borderRadius="medium"
        borderWidth="medium"
        background={active ? 'primary' : 'secondary'}
        themeOverride={{
          backgroundPrimary: active ? accentBg : undefined,
          backgroundSecondary: !active ? mutedBg : undefined,
          borderColorPrimary: active ? accentStroke : stroke,
        }}
      >
        <Flex direction="column" gap="x-small" alignItems="start">
          <Flex justifyItems="space-between" width="100%" alignItems="center">
            <span style={{ display: 'flex', color: active ? accentStroke : sharedTokens.stroke.mutedColor }}>{icon}</span>
            {badge && (
              <Text size="x-small" color="secondary" weight="bold">{badge}</Text>
            )}
          </Flex>
          <Text weight="bold" size="small" color={active ? 'brand' : 'primary'}>{label}</Text>
          <Text size="x-small" color="secondary" lineHeight="default">{description}</Text>
        </Flex>
      </View>
    )
  }

  // Numbered step indicator in the tab progress bar.
  function stepDot(num: number, isActive: boolean) {
    return (
      <View
        as="div"
        display="inline-block"
        width="1.375rem"
        height="1.375rem"
        borderRadius="circle"
        borderWidth="medium"
        background={isActive ? 'primary' : 'secondary'}
        themeOverride={{
          backgroundPrimary: isActive ? accentStroke : undefined,
          backgroundSecondary: !isActive ? surfaceBg : undefined,
          borderColorPrimary: isActive ? accentStroke : stroke,
        }}
        textAlign="center"
      >
        <Text size="x-small" weight="bold" color={isActive ? 'primary-inverse' : 'secondary'}>{num}</Text>
      </View>
    )
  }

  return (
    <View
      as="div"
      width="100%"
      height="100%"
      background="secondary"
      themeOverride={{ backgroundSecondary: pageBg }}
      display="block"
      overflowX="hidden"
      overflowY="hidden"
    >
      <Flex direction="column" height="100%">

        {/* ── Top bar ─────────────────────────────────────────────────────────── */}
        <View
          as="div"
          background="primary"
          themeOverride={{ backgroundPrimary: surfaceBg }}
          padding="0 medium"
          borderWidth="0 0 small 0"
          height="3.25rem"
          display="block"
        >
          <Flex height="100%" alignItems="center" justifyItems="space-between" gap="small">
            <Flex alignItems="center" gap="small">
              <IconButton screenReaderLabel="Toggle navigation" withBackground={false} withBorder={false} renderIcon={<AlignJustifyInstUIIcon />} size="small" />
              <Heading level="h2">Create coursework: Untitled coursework</Heading>
              <View as="span" display="inline-block" padding="xxx-small x-small" borderRadius="small" background="primary" themeOverride={{ backgroundPrimary: mutedBg }}>
                <Text size="x-small" color="secondary">Draft saved</Text>
              </View>
            </Flex>
            <Flex alignItems="center" gap="x-small">
              <Button size="small" renderIcon={<CopyInstUIIcon />}>Copy link</Button>
              <IconButton screenReaderLabel="Help" withBackground={false} withBorder={false} renderIcon={<CircleHelpInstUIIcon />} size="small" />
              <View as="div" display="inline-block" width="2rem" height="2rem" borderRadius="circle" background="primary" themeOverride={{ backgroundPrimary: mutedBg }} />
            </Flex>
          </Flex>
        </View>

        {/* ── Tab progress bar ────────────────────────────────────────────────── */}
        <View
          as="div"
          background="primary"
          themeOverride={{ backgroundPrimary: surfaceBg }}
          padding="0 medium"
          borderWidth="0 0 small 0"
          height="3.5rem"
          display="block"
        >
          <Flex height="100%" alignItems="center" justifyItems="space-between">
            <Flex alignItems="center">
              {TABS.map((tab, i) => {
                const isActive = tab === activeTab
                return (
                  <React.Fragment key={tab}>
                    {i > 0 && <View as="span" display="inline-block" width="1.5rem" height="0.0625rem" margin="0 x-small" background="primary" themeOverride={{ backgroundPrimary: stroke }} />}
                    <Flex alignItems="center" gap="x-small" padding="x-small">
                      {stepDot(i + 1, isActive)}
                      <Text size="small" weight={isActive ? 'bold' : 'normal'} color={isActive ? 'brand' : 'secondary'}>{tab}</Text>
                    </Flex>
                  </React.Fragment>
                )
              })}
            </Flex>
            <Flex alignItems="center" gap="x-small">
              <Button size="small" renderIcon={<EyeInstUIIcon />}>View as student</Button>
              <View as="span" display="inline-block" padding="xx-small small" borderRadius="pill" background="secondary" themeOverride={{ backgroundSecondary: mutedBg }}>
                <Text size="x-small" color="secondary">Unpublished</Text>
              </View>
            </Flex>
          </Flex>
        </View>

        {/* ── Content ─────────────────────────────────────────────────────────── */}
        <View
          as="div"
          padding="x-large medium"
          overflowX="hidden"
          overflowY="auto"
          width="100%"
        >
          <View as="div" display="block" margin="0 auto" maxWidth="50rem">
            <Flex direction="column" gap="large">

              {/* Editable title */}
              <TextInput
                renderLabel={<ScreenReaderContent>Coursework title</ScreenReaderContent>}
                placeholder="Untitled coursework"
                size="large"
              />

              {/* Coursework Type section */}
              <View
                as="div"
                display="block"
                padding="medium"
                borderRadius="large"
                background="secondary"
                themeOverride={{ backgroundSecondary: mutedBg }}
                borderWidth="small"
              >
                <Flex direction="column" gap="small">
                  <Heading level="h3">Coursework type</Heading>
                  <View as="div" display="block">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                      {typeCard({ icon: <ClipboardListInstUIIcon size="small" />, label: 'Assignment',           description: 'Students submit work via text, file upload, URL, or media',         active: true })}
                      {typeCard({ icon: <RocketInstUIIcon size="small" />,         label: 'Quiz',                 description: 'Auto-graded questions: multiple choice, true/false, and fill-in', badge: 'Coming in V2' })}
                      {typeCard({ icon: <MessageCircleInstUIIcon size="small" />,  label: 'Discussion',           description: 'Graded discussion with threaded replies, reactions, and groups',  badge: 'Coming in V2' })}
                      {typeCard({ icon: <FolderOpenInstUIIcon size="small" />,     label: 'Portfolio',            description: 'Students curate and reflect on a collection of their work',       badge: 'Later in the roadmap' })}
                      {typeCard({ icon: <FileTextInstUIIcon size="small" />,       label: 'Worksheet/Problem set', description: 'Structured problems or questions students complete and submit', badge: 'Later in the roadmap' })}
                      {typeCard({ icon: <SparklesInstUIIcon size="small" />,       label: 'AI conversation',      description: 'Students have a guided conversation with AI to show their learning',     badge: 'Later in the roadmap' })}
                    </div>
                  </View>
                </Flex>
              </View>

              {/* Instructions section */}
              <View
                as="div"
                display="block"
                padding="medium"
                borderRadius="large"
                background="secondary"
                themeOverride={{ backgroundSecondary: mutedBg }}
                borderWidth="small"
              >
                <Flex direction="column" gap="small">
                  <Heading level="h3">Instructions</Heading>
                  {/* RCE shell — toolbar + empty content area */}
                  <View as="div" display="block" borderRadius="medium" borderWidth="small" background="primary" themeOverride={{ backgroundPrimary: surfaceBg }} overflowX="hidden">
                    <View as="div" display="block" padding="x-small small" borderWidth="0 0 small 0">
                      <Flex alignItems="center" gap="xx-small">
                        <IconButton screenReaderLabel="Bold"          withBackground={false} withBorder={false} renderIcon={<BoldInstUIIcon />}      size="small" />
                        <IconButton screenReaderLabel="Italic"        withBackground={false} withBorder={false} renderIcon={<ItalicInstUIIcon />}    size="small" />
                        <IconButton screenReaderLabel="Underline"     withBackground={false} withBorder={false} renderIcon={<UnderlineInstUIIcon />} size="small" />
                        <View as="span" display="inline-block" width="0.0625rem" height="1.25rem" margin="0 xx-small" background="primary" themeOverride={{ backgroundPrimary: stroke }} />
                        <IconButton screenReaderLabel="Insert link"   withBackground={false} withBorder={false} renderIcon={<LinkInstUIIcon />}      size="small" />
                        <IconButton screenReaderLabel="Insert image"  withBackground={false} withBorder={false} renderIcon={<ImageInstUIIcon />}     size="small" />
                        <View as="span" display="inline-block" width="0.0625rem" height="1.25rem" margin="0 xx-small" background="primary" themeOverride={{ backgroundPrimary: stroke }} />
                        <IconButton screenReaderLabel="Bulleted list" withBackground={false} withBorder={false} renderIcon={<ListInstUIIcon />}      size="small" />
                        <IconButton screenReaderLabel="Align left"    withBackground={false} withBorder={false} renderIcon={<AlignLeftInstUIIcon />} size="small" />
                      </Flex>
                    </View>
                    <View as="div" display="block" padding="medium" minHeight="12rem">
                      <Text color="secondary">Describe what students need to do</Text>
                    </View>
                  </View>
                </Flex>
              </View>
            </Flex>
          </View>
        </View>
      </Flex>
    </View>
  )
}
