import{G as e,T as t,U as n,t as r}from"./v2-C9oVrVvN.js";import{t as i}from"./useComputedTheme-BEikr0mC.js";import{o as a}from"./styles-BZX8NXj1.js";import{$ as o,A as s,Ct as c,G as l,H as u,N as d,O as f,V as p,Y as m,c as h,et as g,ht as _,kt as v,l as y,p as b,rt as x,z as S}from"./v2-D5azTNSG.js";import{n as C,t as w}from"./v2-mL5pBMnh.js";import{n as T,t as E}from"./v2-CtT4FRw2.js";import{t as D}from"./v2-DIv8g5mi.js";import{n as O}from"./v2-kEPpYkQu.js";import{SpecSheet as k}from"./SpecSheet-CoRhWxoB.js";var A=`import React from 'react'
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
`,j=`import React from 'react'
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
 * Details tab — filled-in state.
 *
 * The same Details tab as \`details-empty\`, but with realistic content the
 * teacher has entered: a named assignment, selected coursework type, and
 * drafted instructions. Used in handoff to show the engaged state of the
 * form once a teacher is mid-way through setting up an assignment.
 */
export function detailsFilled({ sharedTokens }: FrameCtx): React.ReactNode {
  const pageBg     = sharedTokens.background.pageColor
  const surfaceBg  = sharedTokens.background.containerColor
  const mutedBg    = sharedTokens.background.mutedColor
  const accentBg   = sharedTokens.background.accentBlue
  const accentStroke = sharedTokens.stroke.accentBlue
  const stroke     = sharedTokens.stroke.baseColor

  const TABS = ['Instructions', 'Grading', 'Rubric', 'Assign', 'Publish']
  const activeTab = 'Instructions'
  const title = 'Rhetorical Appeals Analysis Essay'

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
              <Heading level="h2">Create coursework: {title}</Heading>
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

              {/* Editable title — filled */}
              <TextInput
                renderLabel={<ScreenReaderContent>Coursework title</ScreenReaderContent>}
                value={title}
                size="large"
              />

              {/* Coursework type section */}
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
                      {typeCard({ icon: <SparklesInstUIIcon size="small" />,       label: 'AI conversation',      description: 'Students have a guided conversation with AI to show their learning', badge: 'Later in the roadmap' })}
                    </div>
                  </View>
                </Flex>
              </View>

              {/* Instructions section — with content */}
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
                      <Flex direction="column" gap="small">
                        <Text>
                          Choose one of the assigned readings and write a 1,200-word analysis of the rhetorical strategies the author uses to persuade their audience.
                        </Text>
                        <Text>
                          Your essay should:
                        </Text>
                        <Text as="div">
                          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                            <li>Identify and explain the use of ethos, pathos, and logos with specific examples from the text</li>
                            <li>Evaluate which appeal is most effective and explain why</li>
                            <li>Consider how the historical and cultural context shapes the audience&apos;s reception</li>
                          </ul>
                        </Text>
                        <Text>
                          Submit your essay as a Word document or PDF. Use 12-point Times New Roman, double-spaced, with MLA citations.
                        </Text>
                      </Flex>
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
`,M=e(n(),1),N=e(t(),1);function P({sharedTokens:e}){let t=e.background.pageColor,n=e.background.containerColor,i=e.background.mutedColor,k=e.background.accentBlue,A=e.stroke.accentBlue,j=e.stroke.baseColor,P=[`Instructions`,`Grading`,`Rubric`,`Assign`,`Publish`];function F(t){let{icon:n,label:a,description:o,active:s,badge:c}=t;return(0,N.jsx)(r,{as:`div`,display:`block`,padding:`small`,borderRadius:`medium`,borderWidth:`medium`,background:s?`primary`:`secondary`,themeOverride:{backgroundPrimary:s?k:void 0,backgroundSecondary:s?void 0:i,borderColorPrimary:s?A:j},children:(0,N.jsxs)(w,{direction:`column`,gap:`x-small`,alignItems:`start`,children:[(0,N.jsxs)(w,{justifyItems:`space-between`,width:`100%`,alignItems:`center`,children:[(0,N.jsx)(`span`,{style:{display:`flex`,color:s?A:e.stroke.mutedColor},children:n}),c&&(0,N.jsx)(C,{size:`x-small`,color:`secondary`,weight:`bold`,children:c})]}),(0,N.jsx)(C,{weight:`bold`,size:`small`,color:s?`brand`:`primary`,children:a}),(0,N.jsx)(C,{size:`x-small`,color:`secondary`,lineHeight:`default`,children:o})]})})}function I(e,t){return(0,N.jsx)(r,{as:`div`,display:`inline-block`,width:`1.375rem`,height:`1.375rem`,borderRadius:`circle`,borderWidth:`medium`,background:t?`primary`:`secondary`,themeOverride:{backgroundPrimary:t?A:void 0,backgroundSecondary:t?void 0:n,borderColorPrimary:t?A:j},textAlign:`center`,children:(0,N.jsx)(C,{size:`x-small`,weight:`bold`,color:t?`primary-inverse`:`secondary`,children:e})})}return(0,N.jsx)(r,{as:`div`,width:`100%`,height:`100%`,background:`secondary`,themeOverride:{backgroundSecondary:t},display:`block`,overflowX:`hidden`,overflowY:`hidden`,children:(0,N.jsxs)(w,{direction:`column`,height:`100%`,children:[(0,N.jsx)(r,{as:`div`,background:`primary`,themeOverride:{backgroundPrimary:n},padding:`0 medium`,borderWidth:`0 0 small 0`,height:`3.25rem`,display:`block`,children:(0,N.jsxs)(w,{height:`100%`,alignItems:`center`,justifyItems:`space-between`,gap:`small`,children:[(0,N.jsxs)(w,{alignItems:`center`,gap:`small`,children:[(0,N.jsx)(D,{screenReaderLabel:`Toggle navigation`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(h,{}),size:`small`}),(0,N.jsx)(E,{level:`h2`,children:`Create coursework: Untitled coursework`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,padding:`xxx-small x-small`,borderRadius:`small`,background:`primary`,themeOverride:{backgroundPrimary:i},children:(0,N.jsx)(C,{size:`x-small`,color:`secondary`,children:`Draft saved`})})]}),(0,N.jsxs)(w,{alignItems:`center`,gap:`x-small`,children:[(0,N.jsx)(T,{size:`small`,renderIcon:(0,N.jsx)(d,{}),children:`Copy link`}),(0,N.jsx)(D,{screenReaderLabel:`Help`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(f,{}),size:`small`}),(0,N.jsx)(r,{as:`div`,display:`inline-block`,width:`2rem`,height:`2rem`,borderRadius:`circle`,background:`primary`,themeOverride:{backgroundPrimary:i}})]})]})}),(0,N.jsx)(r,{as:`div`,background:`primary`,themeOverride:{backgroundPrimary:n},padding:`0 medium`,borderWidth:`0 0 small 0`,height:`3.5rem`,display:`block`,children:(0,N.jsxs)(w,{height:`100%`,alignItems:`center`,justifyItems:`space-between`,children:[(0,N.jsx)(w,{alignItems:`center`,children:P.map((e,t)=>{let n=e===`Instructions`;return(0,N.jsxs)(M.Fragment,{children:[t>0&&(0,N.jsx)(r,{as:`span`,display:`inline-block`,width:`1.5rem`,height:`0.0625rem`,margin:`0 x-small`,background:`primary`,themeOverride:{backgroundPrimary:j}}),(0,N.jsxs)(w,{alignItems:`center`,gap:`x-small`,padding:`x-small`,children:[I(t+1,n),(0,N.jsx)(C,{size:`small`,weight:n?`bold`:`normal`,color:n?`brand`:`secondary`,children:e})]})]},e)})}),(0,N.jsxs)(w,{alignItems:`center`,gap:`x-small`,children:[(0,N.jsx)(T,{size:`small`,renderIcon:(0,N.jsx)(S,{}),children:`View as student`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,padding:`xx-small small`,borderRadius:`pill`,background:`secondary`,themeOverride:{backgroundSecondary:i},children:(0,N.jsx)(C,{size:`x-small`,color:`secondary`,children:`Unpublished`})})]})]})}),(0,N.jsx)(r,{as:`div`,padding:`x-large medium`,overflowX:`hidden`,overflowY:`auto`,width:`100%`,children:(0,N.jsx)(r,{as:`div`,display:`block`,margin:`0 auto`,maxWidth:`50rem`,children:(0,N.jsxs)(w,{direction:`column`,gap:`large`,children:[(0,N.jsx)(O,{renderLabel:(0,N.jsx)(a,{children:`Coursework title`}),placeholder:`Untitled coursework`,size:`large`}),(0,N.jsx)(r,{as:`div`,display:`block`,padding:`medium`,borderRadius:`large`,background:`secondary`,themeOverride:{backgroundSecondary:i},borderWidth:`small`,children:(0,N.jsxs)(w,{direction:`column`,gap:`small`,children:[(0,N.jsx)(E,{level:`h3`,children:`Coursework type`}),(0,N.jsx)(r,{as:`div`,display:`block`,children:(0,N.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:10},children:[F({icon:(0,N.jsx)(s,{size:`small`}),label:`Assignment`,description:`Students submit work via text, file upload, URL, or media`,active:!0}),F({icon:(0,N.jsx)(_,{size:`small`}),label:`Quiz`,description:`Auto-graded questions: multiple choice, true/false, and fill-in`,badge:`Coming in V2`}),F({icon:(0,N.jsx)(x,{size:`small`}),label:`Discussion`,description:`Graded discussion with threaded replies, reactions, and groups`,badge:`Coming in V2`}),F({icon:(0,N.jsx)(u,{size:`small`}),label:`Portfolio`,description:`Students curate and reflect on a collection of their work`,badge:`Later in the roadmap`}),F({icon:(0,N.jsx)(p,{size:`small`}),label:`Worksheet/Problem set`,description:`Structured problems or questions students complete and submit`,badge:`Later in the roadmap`}),F({icon:(0,N.jsx)(c,{size:`small`}),label:`AI conversation`,description:`Students have a guided conversation with AI to show their learning`,badge:`Later in the roadmap`})]})})]})}),(0,N.jsx)(r,{as:`div`,display:`block`,padding:`medium`,borderRadius:`large`,background:`secondary`,themeOverride:{backgroundSecondary:i},borderWidth:`small`,children:(0,N.jsxs)(w,{direction:`column`,gap:`small`,children:[(0,N.jsx)(E,{level:`h3`,children:`Instructions`}),(0,N.jsxs)(r,{as:`div`,display:`block`,borderRadius:`medium`,borderWidth:`small`,background:`primary`,themeOverride:{backgroundPrimary:n},overflowX:`hidden`,children:[(0,N.jsx)(r,{as:`div`,display:`block`,padding:`x-small small`,borderWidth:`0 0 small 0`,children:(0,N.jsxs)(w,{alignItems:`center`,gap:`xx-small`,children:[(0,N.jsx)(D,{screenReaderLabel:`Bold`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(b,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Italic`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(m,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Underline`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(v,{}),size:`small`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,width:`0.0625rem`,height:`1.25rem`,margin:`0 xx-small`,background:`primary`,themeOverride:{backgroundPrimary:j}}),(0,N.jsx)(D,{screenReaderLabel:`Insert link`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(o,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Insert image`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(l,{}),size:`small`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,width:`0.0625rem`,height:`1.25rem`,margin:`0 xx-small`,background:`primary`,themeOverride:{backgroundPrimary:j}}),(0,N.jsx)(D,{screenReaderLabel:`Bulleted list`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(g,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Align left`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(y,{}),size:`small`})]})}),(0,N.jsx)(r,{as:`div`,display:`block`,padding:`medium`,minHeight:`12rem`,children:(0,N.jsx)(C,{color:`secondary`,children:`Describe what students need to do`})})]})]})})]})})})]})})}function F({sharedTokens:e}){let t=e.background.pageColor,n=e.background.containerColor,i=e.background.mutedColor,k=e.background.accentBlue,A=e.stroke.accentBlue,j=e.stroke.baseColor,P=[`Instructions`,`Grading`,`Rubric`,`Assign`,`Publish`],F=`Rhetorical Appeals Analysis Essay`;function I(t){let{icon:n,label:a,description:o,active:s,badge:c}=t;return(0,N.jsx)(r,{as:`div`,display:`block`,padding:`small`,borderRadius:`medium`,borderWidth:`medium`,background:s?`primary`:`secondary`,themeOverride:{backgroundPrimary:s?k:void 0,backgroundSecondary:s?void 0:i,borderColorPrimary:s?A:j},children:(0,N.jsxs)(w,{direction:`column`,gap:`x-small`,alignItems:`start`,children:[(0,N.jsxs)(w,{justifyItems:`space-between`,width:`100%`,alignItems:`center`,children:[(0,N.jsx)(`span`,{style:{display:`flex`,color:s?A:e.stroke.mutedColor},children:n}),c&&(0,N.jsx)(C,{size:`x-small`,color:`secondary`,weight:`bold`,children:c})]}),(0,N.jsx)(C,{weight:`bold`,size:`small`,color:s?`brand`:`primary`,children:a}),(0,N.jsx)(C,{size:`x-small`,color:`secondary`,lineHeight:`default`,children:o})]})})}function L(e,t){return(0,N.jsx)(r,{as:`div`,display:`inline-block`,width:`1.375rem`,height:`1.375rem`,borderRadius:`circle`,borderWidth:`medium`,background:t?`primary`:`secondary`,themeOverride:{backgroundPrimary:t?A:void 0,backgroundSecondary:t?void 0:n,borderColorPrimary:t?A:j},textAlign:`center`,children:(0,N.jsx)(C,{size:`x-small`,weight:`bold`,color:t?`primary-inverse`:`secondary`,children:e})})}return(0,N.jsx)(r,{as:`div`,width:`100%`,height:`100%`,background:`secondary`,themeOverride:{backgroundSecondary:t},display:`block`,overflowX:`hidden`,overflowY:`hidden`,children:(0,N.jsxs)(w,{direction:`column`,height:`100%`,children:[(0,N.jsx)(r,{as:`div`,background:`primary`,themeOverride:{backgroundPrimary:n},padding:`0 medium`,borderWidth:`0 0 small 0`,height:`3.25rem`,display:`block`,children:(0,N.jsxs)(w,{height:`100%`,alignItems:`center`,justifyItems:`space-between`,gap:`small`,children:[(0,N.jsxs)(w,{alignItems:`center`,gap:`small`,children:[(0,N.jsx)(D,{screenReaderLabel:`Toggle navigation`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(h,{}),size:`small`}),(0,N.jsxs)(E,{level:`h2`,children:[`Create coursework: `,F]}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,padding:`xxx-small x-small`,borderRadius:`small`,background:`primary`,themeOverride:{backgroundPrimary:i},children:(0,N.jsx)(C,{size:`x-small`,color:`secondary`,children:`Draft saved`})})]}),(0,N.jsxs)(w,{alignItems:`center`,gap:`x-small`,children:[(0,N.jsx)(T,{size:`small`,renderIcon:(0,N.jsx)(d,{}),children:`Copy link`}),(0,N.jsx)(D,{screenReaderLabel:`Help`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(f,{}),size:`small`}),(0,N.jsx)(r,{as:`div`,display:`inline-block`,width:`2rem`,height:`2rem`,borderRadius:`circle`,background:`primary`,themeOverride:{backgroundPrimary:i}})]})]})}),(0,N.jsx)(r,{as:`div`,background:`primary`,themeOverride:{backgroundPrimary:n},padding:`0 medium`,borderWidth:`0 0 small 0`,height:`3.5rem`,display:`block`,children:(0,N.jsxs)(w,{height:`100%`,alignItems:`center`,justifyItems:`space-between`,children:[(0,N.jsx)(w,{alignItems:`center`,children:P.map((e,t)=>{let n=e===`Instructions`;return(0,N.jsxs)(M.Fragment,{children:[t>0&&(0,N.jsx)(r,{as:`span`,display:`inline-block`,width:`1.5rem`,height:`0.0625rem`,margin:`0 x-small`,background:`primary`,themeOverride:{backgroundPrimary:j}}),(0,N.jsxs)(w,{alignItems:`center`,gap:`x-small`,padding:`x-small`,children:[L(t+1,n),(0,N.jsx)(C,{size:`small`,weight:n?`bold`:`normal`,color:n?`brand`:`secondary`,children:e})]})]},e)})}),(0,N.jsxs)(w,{alignItems:`center`,gap:`x-small`,children:[(0,N.jsx)(T,{size:`small`,renderIcon:(0,N.jsx)(S,{}),children:`View as student`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,padding:`xx-small small`,borderRadius:`pill`,background:`secondary`,themeOverride:{backgroundSecondary:i},children:(0,N.jsx)(C,{size:`x-small`,color:`secondary`,children:`Unpublished`})})]})]})}),(0,N.jsx)(r,{as:`div`,padding:`x-large medium`,overflowX:`hidden`,overflowY:`auto`,width:`100%`,children:(0,N.jsx)(r,{as:`div`,display:`block`,margin:`0 auto`,maxWidth:`50rem`,children:(0,N.jsxs)(w,{direction:`column`,gap:`large`,children:[(0,N.jsx)(O,{renderLabel:(0,N.jsx)(a,{children:`Coursework title`}),value:F,size:`large`}),(0,N.jsx)(r,{as:`div`,display:`block`,padding:`medium`,borderRadius:`large`,background:`secondary`,themeOverride:{backgroundSecondary:i},borderWidth:`small`,children:(0,N.jsxs)(w,{direction:`column`,gap:`small`,children:[(0,N.jsx)(E,{level:`h3`,children:`Coursework type`}),(0,N.jsx)(r,{as:`div`,display:`block`,children:(0,N.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3, 1fr)`,gap:10},children:[I({icon:(0,N.jsx)(s,{size:`small`}),label:`Assignment`,description:`Students submit work via text, file upload, URL, or media`,active:!0}),I({icon:(0,N.jsx)(_,{size:`small`}),label:`Quiz`,description:`Auto-graded questions: multiple choice, true/false, and fill-in`,badge:`Coming in V2`}),I({icon:(0,N.jsx)(x,{size:`small`}),label:`Discussion`,description:`Graded discussion with threaded replies, reactions, and groups`,badge:`Coming in V2`}),I({icon:(0,N.jsx)(u,{size:`small`}),label:`Portfolio`,description:`Students curate and reflect on a collection of their work`,badge:`Later in the roadmap`}),I({icon:(0,N.jsx)(p,{size:`small`}),label:`Worksheet/Problem set`,description:`Structured problems or questions students complete and submit`,badge:`Later in the roadmap`}),I({icon:(0,N.jsx)(c,{size:`small`}),label:`AI conversation`,description:`Students have a guided conversation with AI to show their learning`,badge:`Later in the roadmap`})]})})]})}),(0,N.jsx)(r,{as:`div`,display:`block`,padding:`medium`,borderRadius:`large`,background:`secondary`,themeOverride:{backgroundSecondary:i},borderWidth:`small`,children:(0,N.jsxs)(w,{direction:`column`,gap:`small`,children:[(0,N.jsx)(E,{level:`h3`,children:`Instructions`}),(0,N.jsxs)(r,{as:`div`,display:`block`,borderRadius:`medium`,borderWidth:`small`,background:`primary`,themeOverride:{backgroundPrimary:n},overflowX:`hidden`,children:[(0,N.jsx)(r,{as:`div`,display:`block`,padding:`x-small small`,borderWidth:`0 0 small 0`,children:(0,N.jsxs)(w,{alignItems:`center`,gap:`xx-small`,children:[(0,N.jsx)(D,{screenReaderLabel:`Bold`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(b,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Italic`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(m,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Underline`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(v,{}),size:`small`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,width:`0.0625rem`,height:`1.25rem`,margin:`0 xx-small`,background:`primary`,themeOverride:{backgroundPrimary:j}}),(0,N.jsx)(D,{screenReaderLabel:`Insert link`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(o,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Insert image`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(l,{}),size:`small`}),(0,N.jsx)(r,{as:`span`,display:`inline-block`,width:`0.0625rem`,height:`1.25rem`,margin:`0 xx-small`,background:`primary`,themeOverride:{backgroundPrimary:j}}),(0,N.jsx)(D,{screenReaderLabel:`Bulleted list`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(g,{}),size:`small`}),(0,N.jsx)(D,{screenReaderLabel:`Align left`,withBackground:!1,withBorder:!1,renderIcon:(0,N.jsx)(y,{}),size:`small`})]})}),(0,N.jsx)(r,{as:`div`,display:`block`,padding:`medium`,minHeight:`12rem`,children:(0,N.jsxs)(w,{direction:`column`,gap:`small`,children:[(0,N.jsx)(C,{children:`Choose one of the assigned readings and write a 1,200-word analysis of the rhetorical strategies the author uses to persuade their audience.`}),(0,N.jsx)(C,{children:`Your essay should:`}),(0,N.jsx)(C,{as:`div`,children:(0,N.jsxs)(`ul`,{style:{margin:0,paddingLeft:`1.5rem`},children:[(0,N.jsx)(`li`,{children:`Identify and explain the use of ethos, pathos, and logos with specific examples from the text`}),(0,N.jsx)(`li`,{children:`Evaluate which appeal is most effective and explain why`}),(0,N.jsx)(`li`,{children:`Consider how the historical and cultural context shapes the audience's reception`})]})}),(0,N.jsx)(C,{children:`Submit your essay as a Word document or PDF. Use 12-point Times New Roman, double-spaced, with MLA citations.`})]})})]})]})})]})})})]})})}var I=Object.assign({"./frames/details-empty.tsx":A,"./frames/details-filled.tsx":j});function L(e){let{sharedTokens:t}=i(),n={sharedTokens:t};return(0,N.jsx)(k,{title:`Create Assignment — Spec`,description:`Spec sheet for the five-step Create coursework flow. Each tab is documented as a section with key state variants. Click 'InstUI Source' on any board for the production-clean frame code; 'UX Copy' extracts the strings for writer review.`,basePath:`src/designs/create-assignment-spec`,frameSources:I,sections:[{title:`Details`,description:`Step 1 of 5 — the teacher names the coursework, picks a type, and writes the instructions. This is the entry point of the flow.`,boards:[{width:1440,height:900,caption:`Empty state`,notes:`First view a teacher sees on entering the flow. Title defaults to "Untitled coursework". Coursework type defaults to Assignment (the only V1 option). Instructions placeholder visible. Top bar shows a "Draft saved" badge from the auto-save mechanism.`,content:P(n),frame:`details-empty`},{width:1440,height:900,caption:`Filled in`,notes:`After the teacher has named the coursework and drafted instructions. Title input shows the entered value; the RCE body shows formatted content. Used to verify spacing, type scale, and content overflow at realistic content density.`,content:F(n),frame:`details-filled`}]},{title:`Grading`,description:`Step 2 of 5 — points, grading rules, rubric activation toggle, and grade visibility settings. (Frames pending.)`,boards:[{width:1440,height:900,caption:`Default — rubric off`,notes:`Default state with rubric not yet activated. Manual points entry visible. Coming next.`},{width:1440,height:900,caption:`Rubric on`,notes:`After the teacher activates a rubric in the Rubric tab — manual points entry is replaced by a derived total. Coming next.`}]},{title:`Rubric`,description:`Step 3 of 5 — landing page with three setup paths (create new, use existing, skip), plus the rubric builder itself. (Frames pending.)`,boards:[{width:1440,height:900,caption:`Landing — choose path`,notes:`Three options: build a new rubric, attach an existing rubric, or skip rubric for this assignment. Coming next.`},{width:1440,height:900,caption:`Rubric builder with criteria`,notes:`Active rubric editor with two or more criteria added. Shows the rubric preview alongside the editor. Coming next.`}]},{title:`Assign`,description:`Step 4 of 5 — who gets the assignment, when it's due, and the available-from / available-until window. Supports differentiated assignments for sections, groups, or individual students. (Frames pending.)`,boards:[{width:1440,height:900,caption:`Single assignee — Everyone`,notes:`Default state: one assignment row, "Everyone" selected, due date and availability window empty. Coming next.`},{width:1440,height:900,caption:`Multiple assignment groups`,notes:`Differentiated dates: a second row added for a specific section with its own due and availability dates. Coming next.`}]},{title:`Publish`,description:`Step 5 of 5 — review summary and publish or save as draft. (Frames pending.)`,boards:[{width:1440,height:900,caption:`Ready to publish`,notes:`Review summary with all earlier-tab decisions reflected. Publish button active. Coming next.`},{width:1440,height:900,caption:`Published confirmation`,notes:`Success state after publish — assignment now appears in the course modules list. Coming next.`}]}]})}export{L as default};