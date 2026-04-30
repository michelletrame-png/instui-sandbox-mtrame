import React, { useState, useEffect, useRef } from 'react'
import { useComputedTheme, Global } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { Tray } from '@instructure/ui-tray/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  IgniteaiLogoInstUIIcon,
  SunInstUIIcon,
  MoonInstUIIcon,
  EllipsisVerticalInstUIIcon,
  AlignJustifyInstUIIcon,
  XInstUIIcon,
  PlusInstUIIcon,
  ArrowUpInstUIIcon,
  AiInfoInstUIIcon,
  IconCanvasLogoSolid,
  HandInstUIIcon,
  WandSparklesInstUIIcon,
  LibraryInstUIIcon,
} from '@instructure/ui-icons'
import { Link } from '@instructure/ui-link/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { DrawerLayout } from '@instructure/ui-drawer-layout/latest'
import { Transition } from '@instructure/ui-motion'
import type { PrototypeProps } from '../../registry'


function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function AgentWelcome() {
  const { sharedTokens } = useComputedTheme()
  const aiGradient = `linear-gradient(90deg, ${sharedTokens.background.aiTopGradientColor} 20%, ${sharedTokens.background.aiBottomGradientColor} 81%)`
  const handRef = useRef<HTMLSpanElement | null>(null)

  function waveHand() {
    const el = handRef.current
    if (!el) return
    el.style.animation = 'none'
    void el.offsetWidth
    el.style.animation = 'agent-wave 0.7s ease-in-out'
    el.addEventListener('animationend', () => { el.style.animation = '' }, { once: true })
  }

  useEffect(() => {
    const t = setTimeout(waveHand, 400)
    return () => clearTimeout(t)
  }, [])

  const pill = (label: string, description: string, icon: React.ReactNode, showBadge = false) => (
    <View
      as="button"
      display="block"
      width="100%"
      borderWidth="small"
      borderColor="primary"
      borderRadius={sharedTokens.borderRadius.card.md}
      padding="small medium"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.mutedColor }}
      cursor="pointer"
      textAlign="start"
    >
      <Flex gap="mediumSmall" alignItems="center">
        {icon}
        <Flex.Item shouldGrow shouldShrink>
          <Flex direction="column" gap="xxx-small">
            <Text weight="bold">{label}</Text>
            <Text size="small" color="secondary">{description}</Text>
          </Flex>
        </Flex.Item>
        {showBadge && <Pill color="info">Start here</Pill>}
      </Flex>
    </View>
  )

  return (
    <View as="div" display="block" padding="large medium">
      <Global styles={`
        @keyframes agent-wave {
          0%   { transform: rotate(0deg); }
          20%  { transform: rotate(20deg); }
          40%  { transform: rotate(-15deg); }
          60%  { transform: rotate(18deg); }
          80%  { transform: rotate(-8deg); }
          100% { transform: rotate(0deg); }
        }
      `} />
      <Flex direction="column" gap="large">

        {/* Greeting */}
        <Flex direction="column" gap="xx-small">
          <Flex alignItems="center" gap="x-small">
            <span
              ref={handRef}
              style={{ display: 'inline-block', flexShrink: 0, transformOrigin: 'bottom center' }}
              onMouseEnter={waveHand}
            >
              <View as="span" display="inline-block" style={{ transform: 'rotate(-35deg)' }}>
                <HandInstUIIcon size="lg" />
              </View>
            </span>
            <Heading level="h2" margin="0">
              <span
                style={{
                  background: aiGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Hello, Zoe!
              </span>
            </Heading>
          </Flex>
          <Text color="secondary">What are we doing today?</Text>
        </Flex>

        {/* Get started */}
        <Flex direction="column" gap="small">
          <Heading level="h4" as="h3" margin="0">Get started</Heading>
          <Flex direction="column" gap="small">
            {pill('Prompt builder', 'Generate common prompts', <WandSparklesInstUIIcon color="brand" size="md" />, true)}
            {pill('Community library', 'Browse and contribute community prompts', <LibraryInstUIIcon color="brand" size="md" />)}
          </Flex>
        </Flex>

        {/* Try asking */}
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
  )
}

export default function AgentShell({ isDark, onToggleTheme }: PrototypeProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [agentOpen, setAgentOpen] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const { sharedTokens, semantics } = useComputedTheme()
  const isMobile = useIsMobile()

  const breadcrumb = (
    <Breadcrumb label="Navigation">
      <Breadcrumb.Link href="#">Level 1</Breadcrumb.Link>
      <Breadcrumb.Link>Current Level</Breadcrumb.Link>
    </Breadcrumb>
  )

  const loremContent = (
    <Flex direction="column" gap="small">
      <Text size="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
      <Text size="content">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
      <Text size="content">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</Text>
    </Flex>
  )

  const agentInput = (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.baseColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      borderWidth="small"
      borderColor="primary"
      display="block"
      padding="mediumSmall"
      withFocusOutline={inputFocused}
      focusColor="info"
      focusPosition="offset"
    >
        <Flex direction="column" gap="xx-small">
          <Text size="small" color="secondary">Enter a prompt</Text>
          {/* Native textarea: InstUI TextArea v2 doesn't support component-level token overrides, and transparent-border styling is required to simulate focus on the outer card. */}
          <style>{`[data-agent-prompt]::placeholder { color: ${(semantics as unknown as { color?: { text?: { input?: { placeholder?: string } } } })?.color?.text?.input?.placeholder}; }`}</style>
          {/* eslint-disable instui/no-style-border */}
          <textarea
            data-agent-prompt
            placeholder="Help me…"
            rows={2}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: '1rem',
              lineHeight: '1.5',
              color: 'inherit',
              padding: 0,
            }}
          />
          {/* eslint-enable instui/no-style-border */}
        </Flex>
        <Flex justifyItems="space-between" alignItems="center" margin="x-small 0 0 0">
          <Flex gap="x-small">
            <IconButton
              screenReaderLabel="Attach file"
              color="secondary"
              withBackground={false}
              size="small"
              renderIcon={<PlusInstUIIcon />}
            />
            <IconButton
              screenReaderLabel="AI suggestions"
              color="secondary"
              withBackground={false}
              size="small"
              renderIcon={<AiInfoInstUIIcon />}
            />
          </Flex>
          <IconButton
            screenReaderLabel="Send message"
            color="primary"
            size="small"
            renderIcon={<ArrowUpInstUIIcon />}
          />
        </Flex>
      </View>
  )

  /* ── Mobile layout ── */
  if (isMobile) {
    return (
      <View
        as="div"
        minHeight="100vh"
        overflowX="hidden"
        background="secondary"
        themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
        display="block"
      >
        <View
          as="header"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderWidth="0 0 small 0"
          display="block"
        >
          <Flex alignItems="center" justifyItems="space-between" padding="x-small medium">
            <IconCanvasLogoSolid size="small" />
            <Flex alignItems="center" gap="x-small">
              {!agentOpen && (
                <IconButton color="ai-primary" screenReaderLabel="Open AI assistant" size="small" onClick={() => setAgentOpen(true)}>
                  <IgniteaiLogoInstUIIcon />
                </IconButton>
              )}
              <IconButton
                screenReaderLabel="Open navigation menu"
                color="secondary"
                size="small"
                withBackground={false}
                withBorder={false}
                onClick={() => setMenuOpen(true)}
                renderIcon={<AlignJustifyInstUIIcon />}
              />
            </Flex>
          </Flex>
        </View>

        <Tray
          label="Navigation menu"
          open={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          placement="start"
          size="regular"
          shouldCloseOnDocumentClick
          themeOverride={{ padding: '0' } as object}
        >
          <View as="div" height="100%" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} display="block">
            <View as="div" display="block" borderWidth="0 0 small 0">
              <Flex alignItems="center" justifyItems="space-between" padding="small medium">
                <IconCanvasLogoSolid size="small" />
                <IconButton
                  screenReaderLabel="Close menu"
                  color="secondary"
                  size="small"
                  onClick={() => setMenuOpen(false)}
                  renderIcon={<XInstUIIcon />}
                />
              </Flex>
            </View>
            <View as="nav" display="block" padding="x-small 0">
              {([
                { icon: <Avatar name="User" size="x-small" />, label: 'Account' },
                { icon: <SettingsInstUIIcon />, label: 'Admin' },
                { icon: <LayoutDashboardInstUIIcon />, label: 'Dashboard', selected: true },
                { icon: <BookOpenInstUIIcon />, label: 'Courses' },
                { icon: <CalendarDaysInstUIIcon />, label: 'Calendar' },
                { icon: <InboxInstUIIcon />, label: 'Inbox' },
                { icon: <CircleHelpInstUIIcon />, label: 'Help' },
              ] as const).map(({ icon, label, ...rest }) => {
                const selected = 'selected' in rest ? rest.selected : false
                return (
                  <View
                    key={label}
                    as="button"
                    display="block"
                    width="100%"
                    background={selected ? 'primary' : 'transparent'}
                    themeOverride={selected ? { backgroundPrimary: sharedTokens.background.mutedColor } : undefined}
                    borderWidth="0"
                    cursor="pointer"
                    padding="none"
                  >
                    <Flex alignItems="center" gap="medium" padding="small medium">
                      {icon}
                      <Text weight={selected ? 'bold' : 'normal'}>{label}</Text>
                    </Flex>
                  </View>
                )
              })}
              <View as="button" display="block" width="100%" background="transparent" borderWidth="0" cursor="pointer" padding="none" onClick={onToggleTheme}>
                <Flex alignItems="center" gap="medium" padding="small medium">
                  {isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
                  <Text>Theme</Text>
                </Flex>
              </View>
            </View>
          </View>
        </Tray>

        <View as="div" padding="medium" display="block">
          <Flex direction="column" gap="medium">
            <Flex direction="column" gap="x-small">
              {breadcrumb}
              <Heading level="h1" variant="titlePageMobile" margin="0">Page title</Heading>
              <Text size="content">This is a page description. If your page requires describing in 1-2 rows, then use this.</Text>
            </Flex>
            <Flex gap="small" alignItems="center">
              <Flex.Item shouldGrow shouldShrink>
                <Button color="primary" display="block" textAlign="center">Primary action</Button>
              </Flex.Item>
              <IconButton color="secondary" screenReaderLabel="More actions" renderIcon={<EllipsisVerticalInstUIIcon />} />
            </Flex>
            <SimpleSelect
              renderLabel="Select"
              value={String(selectedTabIndex)}
              onChange={(_e, { value }) => setSelectedTabIndex(Number(value))}
            >
              <SimpleSelect.Option id="tab-0" value="0">Tab item</SimpleSelect.Option>
              <SimpleSelect.Option id="tab-1" value="1">Tab item</SimpleSelect.Option>
            </SimpleSelect>
            <View
              as="div"
              background="primary"
              themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
              borderRadius={sharedTokens.borderRadius.card.md}
              shadow="resting"
              padding="small"
              display="block"
            >
              <Flex direction="column" gap="xx-small">
                <Heading level="h2" variant="titleCardRegular" margin="0">Content area</Heading>
                <Text size="content" color="secondary">Short card description</Text>
                {loremContent}
              </Flex>
            </View>
          </Flex>
        </View>

        {/* Mobile agent panel - full screen overlay */}
        {agentOpen && (
          <Transition in type="fade" transitionOnMount>
            <View
              as="div"
              position="fixed"
              insetBlockStart="0"
              insetInlineStart="0"
              width="100%"
              height="100%"
              background="primary"
              themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
              display="block"
              overflowY="hidden"
            >
              <Flex direction="column" height="100%">
                <View
                  as="div"
                  background="primary"
                  themeOverride={{ backgroundPrimary: `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)` }}
                  padding="small medium"
                  display="block"
                >
                  <Flex alignItems="center" justifyItems="space-between">
                    <Flex alignItems="center" gap="x-small">
                      <IgniteaiLogoInstUIIcon color="onColor" size="md" />
                      <Heading level="h2" variant="titleCardRegular" color="primary-on" margin="0">IgniteAI Agent</Heading>
                    </Flex>
                    <IconButton
                      screenReaderLabel="Close AI assistant"
                      color="primary-inverse"
                      withBackground={false}
                      withBorder={false}
                      size="small"
                      onClick={() => setAgentOpen(false)}
                      renderIcon={<XInstUIIcon />}
                    />
                  </Flex>
                </View>
                <Flex.Item shouldGrow shouldShrink overflowY="auto" style={{ scrollbarGutter: 'stable both-edges' }}>
                  <AgentWelcome />
                </Flex.Item>
                <View as="div" padding="none x-small x-small" display="block">
                  {agentInput}
                </View>
              </Flex>
            </View>
          </Transition>
        )}

      </View>
    )
  }

  /* ── Desktop layout ── */
  return (
    <View
      as="div"
      height="100vh"
      overflowX="hidden"
      overflowY="hidden"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
    >
      <Flex height="100%" width="100%" alignItems="stretch" padding="0 0 small 0">

        {/* Sidebar */}
        <View as="div" height="100%" padding="0 0 small 0" display="block">
          <SideNavBar
            label="Main navigation"
            toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
          >
            <SideNavBar.Item
              icon={<IconCanvasLogoSolid size="medium" />}
              label={<ScreenReaderContent>Canvas</ScreenReaderContent>}
              href="#"
              themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }}
            />
            <SideNavBar.Item icon={<Avatar name="User" size="x-small" />} label="Account" href="#" />
            <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
            <SideNavBar.Item
              icon={<LayoutDashboardInstUIIcon/>}
              label="Dashboard"
              href="#"
              selected
            />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
            <SideNavBar.Item
              icon={isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
              label="Theme"
              onClick={onToggleTheme}
            />
          </SideNavBar>
        </View>

        {/* Main content + agent panel */}
        <Flex.Item shouldGrow shouldShrink overflowX="visible" overflowY="visible">
          <DrawerLayout minWidth="600px">

            <DrawerLayout.Tray
              open={agentOpen}
              placement="end"
              label="AI Assistant"
              border={false}
              shadow={false}
              themeOverride={{ background: sharedTokens.background.pageColor, overflowY: 'visible', overflowX: 'visible', contentOverflowY: 'visible' }}
            >
              <View as="div" display="block" height="100%" overflowY="visible" padding="small small 0 0">
                <View
                  as="div"
                  width="420px"
                  height="100%"
                  background="primary"
                  themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
                  borderRadius={sharedTokens.borderRadius.card.lg}
                  shadow="resting"
                  padding="none"
                  display="block"
                  overflowY="hidden"
                  overflowX="hidden"
                >
                  <Flex direction="column" height="100%" gap="none">
                    <View
                      as="div"
                      background="primary"
                      themeOverride={{ backgroundPrimary: `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)` }}
                      padding="small mediumSmall"
                      display="block"
                    >
                      <Flex alignItems="center" justifyItems="space-between">
                        <Flex alignItems="center" gap="x-small">
                          <IgniteaiLogoInstUIIcon color="onColor" size="md" />
                          <Heading level="h2" variant="titleCardRegular" color="primary-on" margin="0">IgniteAI Agent</Heading>
                        </Flex>
                        <IconButton
                          screenReaderLabel="Close AI assistant"
                          color="primary-inverse"
                          withBackground={false}
                          withBorder={false}
                          size="small"
                          onClick={() => setAgentOpen(false)}
                          renderIcon={<XInstUIIcon />}
                        />
                      </Flex>
                    </View>
                    <Flex.Item shouldGrow shouldShrink overflowY="auto" style={{ scrollbarGutter: 'stable both-edges' }}>
                      <AgentWelcome />
                    </Flex.Item>
                    <View as="div" padding="none mediumSmall mediumSmall" display="block">
                      {agentInput}
                    </View>
                  </Flex>
                </View>
              </View>
            </DrawerLayout.Tray>

            <DrawerLayout.Content label="Main content">
              <View as="div" height="100%" overflowY="auto" padding="large" display="block">
                <View as="div" maxWidth="1100px" display="block" margin="0 auto" width="100%">
                  <Flex direction="column" gap="medium">

                    <Flex alignItems="start" gap="small">
                      <Flex.Item shouldGrow shouldShrink>
                        <Flex direction="column" gap="small">
                          {breadcrumb}
                          <Heading level="h1" variant="titlePageDesktop" margin="0">Page title</Heading>
                          <Text size="descriptionPage">
                            This is a page description. If your page requires describing in 1-2 rows, then use this. Try to keep it as short as possible.
                          </Text>
                        </Flex>
                      </Flex.Item>
                      {!agentOpen && (
                        <IconButton
                          color="ai-primary"
                          screenReaderLabel="Open AI assistant"
                          margin="0"
                          onClick={() => setAgentOpen(true)}
                        >
                          <IgniteaiLogoInstUIIcon />
                        </IconButton>
                      )}
                    </Flex>

                    <Flex gap="small">
                      <Button color="primary">Primary action</Button>
                      <Button>Secondary action</Button>
                    </Flex>

                    <Tabs onRequestTabChange={(_e, { index }) => setSelectedTabIndex(index)}>
                      <Tabs.Panel
                        renderTitle="Tab item"
                        isSelected={selectedTabIndex === 0}
                        padding="none"
                        themeOverride={{ defaultOverflowY: 'visible' }}
                      >
                        <View
                          as="div"
                          background="primary"
                          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
                          borderRadius={sharedTokens.borderRadius.card.lg}
                          shadow="resting"
                          padding="medium"
                          display="block"
                          margin="medium 0 0 0"
                        >
                          <Flex direction="column" gap="xx-small">
                            <Heading level="h2" variant="titleCardLarge" margin="0">Content area</Heading>
                            <Text size="content" color="secondary">Short card description</Text>
                            {loremContent}
                          </Flex>
                        </View>
                      </Tabs.Panel>
                      <Tabs.Panel
                        renderTitle="Tab item"
                        isSelected={selectedTabIndex === 1}
                        padding="none"
                      />
                    </Tabs>

                  </Flex>
                </View>
              </View>
            </DrawerLayout.Content>

          </DrawerLayout>
        </Flex.Item>

      </Flex>
    </View>
  )
}
