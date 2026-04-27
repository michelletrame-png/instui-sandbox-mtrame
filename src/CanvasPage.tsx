import { useState, useEffect } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@instructure/ui-link/latest'
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
import CanvasLogo from './assets/Canvas.svg'
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
} from '@instructure/ui-icons'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

type CanvasPageProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export function CanvasPage({ isDark, onToggleTheme }: CanvasPageProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const { sharedTokens } = useComputedTheme()
  const isMobile = useIsMobile()

  const logoFilter = isDark ? 'brightness(0) invert(1)' : 'none'

  const breadcrumb = (
    <Breadcrumb label="Navigation">
      <Breadcrumb.Link href="#">Level 1</Breadcrumb.Link>
      <Breadcrumb.Link>Current Level</Breadcrumb.Link>
    </Breadcrumb>
  )

  const showcaseLink = (
    <Link as={RouterLink} to="/showcase">View component showcase</Link>
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
        {/* Mobile top bar */}
        <View
          as="header"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderWidth="0 0 small 0"
          display="block"
        >
          <Flex alignItems="center" justifyItems="space-between" padding="x-small medium">
            <img src={CanvasLogo} alt="Canvas" style={{ filter: logoFilter, width: 40, height: 40 }} />
            <Flex alignItems="center" gap="x-small">
              <IconButton color="ai-primary" screenReaderLabel="AI button" size="small">
                <IgniteaiLogoInstUIIcon />
              </IconButton>
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

        {/* Mobile nav tray */}
        <Tray
          label="Navigation menu"
          open={menuOpen}
          onDismiss={() => setMenuOpen(false)}
          placement="start"
          size="regular"
          shouldCloseOnDocumentClick
          themeOverride={{ padding: '0' } as any}
        >
          <View as="div" height="100%" background="primary" themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }} display="block">
            <View as="div" display="block" borderWidth="0 0 small 0">
              <Flex alignItems="center" justifyItems="space-between" padding="small medium">
                <img src={CanvasLogo} alt="Canvas" style={{ filter: logoFilter, width: 40, height: 40 }} />
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
              )})}

              <View
                as="button"
                display="block"
                width="100%"
                background="transparent"
                borderWidth="0"
                cursor="pointer"
                padding="none"
                onClick={onToggleTheme}
              >
                <Flex alignItems="center" gap="medium" padding="small medium">
                  {isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
                  <Text>Theme</Text>
                </Flex>
              </View>
            </View>
          </View>
        </Tray>

        {/* Mobile content */}
        <View as="div" padding="medium" display="block">
          <Flex direction="column" gap="medium">

            <Flex direction="column" gap="x-small">
              {breadcrumb}
              <Heading level="h1" variant="titlePageMobile" margin="0">Page title</Heading>
              <Text size="content">
                This is a page description. If your page requires describing in 1-2 rows, then use this.
              </Text>
            </Flex>

            <Flex gap="small" alignItems="center">
              <Flex.Item shouldGrow shouldShrink>
                <Button color="primary" display="block">Primary action</Button>
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
                {showcaseLink}
              </Flex>
            </View>

          </Flex>
        </View>
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
      <Flex height="100%" width="100%" alignItems="stretch">

        {/* Sidebar */}
        <Flex.Item>
          <View as="div" height="97vh">
            <SideNavBar
              label="Main navigation"
              toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
            >
              <SideNavBar.Item
                icon={<img src={CanvasLogo} alt="" style={{ filter: logoFilter }} />}
                label={<ScreenReaderContent>Canvas</ScreenReaderContent>}
                href="#"
                themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }}
              />
              <SideNavBar.Item icon={<Avatar name="User" size="x-small" />} label="Account" href="#" />
              <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
              <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" selected />
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
        </Flex.Item>

        {/* Main content */}
        <Flex.Item shouldGrow shouldShrink overflowY="auto" padding="large">
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
                <IconButton color="ai-primary" screenReaderLabel="AI button" margin="0">
                  <IgniteaiLogoInstUIIcon />
                </IconButton>
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
                      {showcaseLink}
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
        </Flex.Item>

      </Flex>
    </View>
  )
}
