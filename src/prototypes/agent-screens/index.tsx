import React from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { Link } from '@instructure/ui-link/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  IgniteaiLogoInstUIIcon,
  EllipsisVerticalInstUIIcon,
  XInstUIIcon,
  PlusInstUIIcon,
  ArrowUpInstUIIcon,
  AiInfoInstUIIcon,
  IconCanvasLogoSolid,
  WandSparklesInstUIIcon,
  LibraryInstUIIcon,
  HistoryInstUIIcon,
  SquarePenInstUIIcon,
  ChevronLeftInstUIIcon,
  ChevronRightInstUIIcon,
  CircleCheckInstUIIcon,
  CopyInstUIIcon,
  ThumbsUpInstUIIcon,
  ThumbsDownInstUIIcon,
  AlignJustifyInstUIIcon,
  HandInstUIIcon,
} from '@instructure/ui-icons'
import { InfiniteCanvas } from '../../templates/InfiniteCanvas'
import { SpecSheet } from '../../templates/SpecSheet'
import type { PrototypeProps } from '../../registry'

type AgentView = 'welcome' | 'history' | 'chat'

// ─── Agent panel shared sub-components ────────────────────────────────────────

function AgentPanelHeader() {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      display="block"
      padding="small mediumSmall"
      background="primary"
      themeOverride={{
        backgroundPrimary: `linear-gradient(to right, ${sharedTokens.background.aiTopGradientColor} 0%, ${sharedTokens.background.aiBottomGradientColor} 100%)`,
      }}
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
  )
}

function AgentPanelInput() {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.baseColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      borderWidth="small"
      borderColor="primary"
      display="block"
      padding="mediumSmall"
    >
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
  )
}

function AgentWelcomeBody() {
  const { sharedTokens } = useComputedTheme()
  const aiGradient = `linear-gradient(90deg, ${sharedTokens.background.aiTopGradientColor} 20%, ${sharedTokens.background.aiBottomGradientColor} 81%)`

  function pill(label: string, description: string, icon: React.ReactNode, showBadge = false) {
    return (
      <View
        as="div"
        display="block"
        width="100%"
        borderWidth="small"
        borderColor="primary"
        borderRadius={sharedTokens.borderRadius.card.md}
        padding="small medium"
        background="primary"
        themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
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
  }

  return (
    <View as="div" display="block" padding="large medium">
      <Flex direction="column" gap="large">
        <Flex direction="column" gap="xx-small">
          <Flex alignItems="center" gap="x-small">
            <View as="span" display="inline-block" style={{ transform: 'rotate(-35deg)' }}>
              <HandInstUIIcon size="lg" />
            </View>
            <Heading level="h2" margin="0">
              <span style={{ background: aiGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Hello, Zoe!
              </span>
            </Heading>
          </Flex>
          <Text color="secondary">What are we doing today?</Text>
        </Flex>
        <Flex direction="column" gap="small">
          <Heading level="h4" as="h3" margin="0">Get started</Heading>
          <Flex direction="column" gap="small">
            {pill('Prompt builder', 'Generate common prompts', <WandSparklesInstUIIcon color="brand" size="md" />, true)}
            {pill('Community library', 'Browse and contribute community prompts', <LibraryInstUIIcon color="brand" size="md" />)}
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
  )
}

const HISTORY_GROUPS = [
  {
    date: '12/31/2025',
    chats: [
      'Review geometry proofs for the Unit 4 quiz',
      'Build a weekly study plan across classes',
      'Get feedback on my English essay draft',
    ],
  },
  {
    date: '12/30/2025',
    chats: [
      'Create a catch up plan for overdue work',
      'Practice biology terms with quick flashcards',
      "Prepare for tomorrow's chemistry lab checklist",
    ],
  },
]

function ChatHistoryBody() {
  const { sharedTokens } = useComputedTheme()
  return (
    <View as="div" display="block" padding="medium">
      <Flex direction="column" gap="medium">
        <Link renderIcon={<ChevronLeftInstUIIcon size="x-small" />} iconPlacement="start" href="#">Back</Link>
        <Heading level="h2" margin="0">Chat History</Heading>
        {HISTORY_GROUPS.map((group) => (
          <Flex key={group.date} direction="column" gap="small">
            <Text>{group.date}</Text>
            <Flex direction="column" gap="none">
              {group.chats.map((chat, i) => (
                <React.Fragment key={chat}>
                  <Flex alignItems="center" justifyItems="space-between" padding="small none">
                    <Flex.Item shouldGrow shouldShrink>
                      <Link href="#">{chat}</Link>
                    </Flex.Item>
                    <IconButton screenReaderLabel="More options" color="secondary" withBackground={false} withBorder={false} size="small" renderIcon={<EllipsisVerticalInstUIIcon />} />
                  </Flex>
                  {i < group.chats.length - 1 && (
                    <View as="div" display="block" borderWidth="small 0 0 0" borderColor="primary"
                      themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }} />
                  )}
                </React.Fragment>
              ))}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </View>
  )
}

function ChatResponseBody() {
  const { sharedTokens } = useComputedTheme()
  return (
    <View as="div" display="block" padding="large medium">
      <Flex direction="column" gap="large">
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
            <Text size="content">
              Here are the 5 most recently published courses: Biology 101, English Composition, World History, Calculus II, and Introduction to Psychology. Each was published within the last 30 days.
            </Text>
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
  )
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

function DesktopAgentPanel({ view }: { view: AgentView }) {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      width="420px"
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
        <AgentPanelHeader />
        <Flex.Item shouldGrow shouldShrink overflowY="auto">
          {view === 'welcome' && <AgentWelcomeBody />}
          {view === 'history' && <ChatHistoryBody />}
          {view === 'chat' && <ChatResponseBody />}
        </Flex.Item>
        <View as="div" display="block" padding="none mediumSmall mediumSmall">
          <AgentPanelInput />
        </View>
      </Flex>
    </View>
  )
}

function DesktopPageContent({ showAgentButton }: { showAgentButton?: boolean }) {
  const { sharedTokens } = useComputedTheme()
  return (
    <View as="div" height="100%" overflowY="auto" padding="large" display="block">
      <View as="div" maxWidth="1100px" display="block" margin="0 auto" width="100%">
        <Flex direction="column" gap="medium">
          <Flex alignItems="start" gap="small">
            <Flex.Item shouldGrow shouldShrink>
              <Flex direction="column" gap="small">
                <Breadcrumb label="Navigation">
                  <Breadcrumb.Link href="#">Admin</Breadcrumb.Link>
                  <Breadcrumb.Link>Dashboard</Breadcrumb.Link>
                </Breadcrumb>
                <Heading level="h1" variant="titlePageDesktop" margin="0">Dashboard</Heading>
                <Text size="descriptionPage">Overview of your institution's courses, activity, and recent updates.</Text>
              </Flex>
            </Flex.Item>
            {showAgentButton && (
              <IconButton color="ai-primary" screenReaderLabel="Open AI assistant">
                <IgniteaiLogoInstUIIcon />
              </IconButton>
            )}
          </Flex>
          <Flex gap="small">
            <Button color="primary">Primary action</Button>
            <Button>Secondary action</Button>
          </Flex>
          <Tabs>
            <Tabs.Panel renderTitle="Overview" isSelected padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
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
                  <Heading level="h2" variant="titleCardLarge" margin="0">Course activity</Heading>
                  <Text size="content" color="secondary">Recent enrollment and publishing events</Text>
                  <Text size="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Text>
                </Flex>
              </View>
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Reports" isSelected={false} padding="none" />
          </Tabs>
        </Flex>
      </View>
    </View>
  )
}

function DesktopSnapshot({ showAgent = false, agentView = 'welcome' }: { showAgent?: boolean; agentView?: AgentView }) {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      width="100%"
      height="100%"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
      overflowX="hidden"
      overflowY="hidden"
    >
      
      <Flex height="100%" alignItems="stretch" padding="0">
        <View as="div" height="96vh" padding="0 0 0 0" display="block">
          <SideNavBar label="Main navigation" toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}>
            <SideNavBar.Item icon={<IconCanvasLogoSolid size="medium" />} label={<ScreenReaderContent>Canvas</ScreenReaderContent>} href="#" themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }} />
            <SideNavBar.Item icon={<Avatar name="User" size="x-small" />} label="Account" href="#" />
            <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" selected />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
          </SideNavBar>
        </View>
        <Flex.Item shouldGrow shouldShrink overflowX="hidden" overflowY="hidden">
          <Flex height="100%" alignItems="stretch">
            <Flex.Item shouldGrow shouldShrink>
              <DesktopPageContent showAgentButton={!showAgent} />
            </Flex.Item>
            {showAgent && (
              <Flex.Item shouldShrink={false}>
                <View as="div" display="block" height="97vh" padding="small small 0 0">
                  <DesktopAgentPanel view={agentView} />
                </View>
              </Flex.Item>
            )}
          </Flex>
        </Flex.Item>
      </Flex>
    </View>
  )
}

// ─── Mobile ───────────────────────────────────────────────────────────────────

function MobileSnapshot({ agentOpen = false, agentView = 'welcome' }: { agentOpen?: boolean; agentView?: AgentView }) {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      width="100%"
      height="100%"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
      overflowX="hidden"
      overflowY="hidden"
      position="relative"
    >
      <View as="header" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} borderWidth="0 0 small 0" display="block">
        <Flex alignItems="center" justifyItems="space-between" padding="x-small medium">
          <IconCanvasLogoSolid size="small" />
          <Flex alignItems="center" gap="x-small">
            {!agentOpen && (
              <IconButton color="ai-primary" screenReaderLabel="Open AI assistant" size="small">
                <IgniteaiLogoInstUIIcon />
              </IconButton>
            )}
            <IconButton color="secondary" screenReaderLabel="Navigation menu" size="small" withBackground={false} withBorder={false} renderIcon={<AlignJustifyInstUIIcon />} />
          </Flex>
        </Flex>
      </View>

      {!agentOpen && (
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
      )}

      {agentOpen && (
        <View
          as="div"
          position="absolute"
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
            <AgentPanelHeader />
            <Flex.Item shouldGrow shouldShrink overflowY="auto">
              {agentView === 'welcome' && <AgentWelcomeBody />}
              {agentView === 'history' && <ChatHistoryBody />}
              {agentView === 'chat' && <ChatResponseBody />}
            </Flex.Item>
            <View as="div" padding="none x-small x-small" display="block">
              <AgentPanelInput />
            </View>
          </Flex>
        </View>
      )}
    </View>
  )
}

// ─── Prototype export ─────────────────────────────────────────────────────────

export default function AgentScreens({ isDark, onToggleTheme }: PrototypeProps) {
  return (
    <InfiniteCanvas title="Agent Screens" isDark={isDark} onToggleTheme={onToggleTheme}>
      <SpecSheet
        title="Agent Screens"
        description="Customer journey: opening the IgniteAI agent, browsing chat history, and sending a message."
        sections={[
          {
            title: 'Desktop',
            description: 'Full browser at 1280×800',
            boards: [
              { width: 1280, height: 800, caption: 'Agent Closed', notes: 'User visits the course page. The IgniteAI button is visible in the page header.', content: <DesktopSnapshot /> },
              { width: 1280, height: 800, caption: 'Agent Open', notes: 'User opens the agent. Welcome screen greets them by name with suggested actions.', content: <DesktopSnapshot showAgent agentView="welcome" /> },
              { width: 1280, height: 800, caption: 'Chat History', notes: 'User taps the history icon to browse previous conversations.', content: <DesktopSnapshot showAgent agentView="history" /> },
              { width: 1280, height: 800, caption: 'Chat Response', notes: 'Agent responds to the prompt with a structured answer and follow-up suggestions.', content: <DesktopSnapshot showAgent agentView="chat" /> },
            ],
          },
          {
            title: 'Mobile',
            description: 'Mobile viewport at 390×844',
            boards: [
              { width: 390, height: 844, caption: 'Agent Closed', notes: 'User is on the mobile dashboard. The IgniteAI button appears in the top bar.', content: <MobileSnapshot /> },
              { width: 390, height: 844, caption: 'Agent Open', notes: 'Tapping the button opens the agent as a full-screen overlay.', content: <MobileSnapshot agentOpen agentView="welcome" /> },
              { width: 390, height: 844, caption: 'Chat History', notes: 'User navigates to their conversation history from within the agent.', content: <MobileSnapshot agentOpen agentView="history" /> },
              { width: 390, height: 844, caption: 'Chat Response', notes: 'Agent responds inline. Follow-up prompts appear below the answer.', content: <MobileSnapshot agentOpen agentView="chat" /> },
            ],
          },
        ]}
      />
    </InfiniteCanvas>
  )
}
