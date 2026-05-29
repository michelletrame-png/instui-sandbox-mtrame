/**
 * Shell.tsx — shared Canvas chrome for the three edit-dates prototypes.
 *
 * Wraps the unique content area of each concept in the same SideNavBar +
 * breadcrumb + page header so the three can be compared on equal footing.
 * Adapted from src/templates/CanvasPage.tsx.
 */
import { useState, useEffect, type ReactNode } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  SunInstUIIcon,
  MoonInstUIIcon,
  IconCanvasLogoSolid,
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

type ShellProps = {
  isDark: boolean
  onToggleTheme: () => void
  /** Short descriptive line under the page title. */
  subtitle: string
  /** Toolbar/action area rendered to the right of the title. */
  actions?: ReactNode
  children: ReactNode
}

export function Shell({ isDark, onToggleTheme, subtitle, actions, children }: ShellProps) {
  const { sharedTokens } = useComputedTheme()
  const isMobile = useIsMobile()

  const breadcrumb = (
    <Breadcrumb label="Navigation">
      <Breadcrumb.Link href="#">Courses</Breadcrumb.Link>
      <Breadcrumb.Link href="#">Introduction to Biology</Breadcrumb.Link>
      <Breadcrumb.Link href="#">Assignments</Breadcrumb.Link>
      <Breadcrumb.Link>Edit assignment dates</Breadcrumb.Link>
    </Breadcrumb>
  )

  const header = (
    <Flex direction="column" gap="small">
      {breadcrumb}
      <Flex gap="medium" alignItems="end" wrap="wrap">
        <Flex.Item shouldGrow shouldShrink>
          <Heading level="h1" variant={isMobile ? 'titlePageMobile' : 'titlePageDesktop'} margin="0">
            Edit assignment dates
          </Heading>
          <Text size="descriptionPage" color="secondary">
            {subtitle}
          </Text>
        </Flex.Item>
        {actions ? <Flex.Item>{actions}</Flex.Item> : null}
      </Flex>
    </Flex>
  )

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
            <IconButton
              screenReaderLabel="Toggle theme"
              color="secondary"
              size="small"
              withBackground={false}
              withBorder={false}
              onClick={onToggleTheme}
              renderIcon={isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
            />
          </Flex>
        </View>
        <View as="div" padding="medium" display="block">
          <Flex direction="column" gap="medium">
            {header}
            {children}
          </Flex>
        </View>
      </View>
    )
  }

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
        <View as="div" height="100%" display="block">
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
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" selected />
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

        <Flex.Item shouldGrow shouldShrink overflowY="auto">
          <View as="div" height="100%" overflowY="auto" padding="large" display="block">
            <View as="div" maxWidth="1200px" display="block" margin="0 auto" width="100%">
              <Flex direction="column" gap="large">
                {header}
                {children}
              </Flex>
            </View>
          </View>
        </Flex.Item>
      </Flex>
    </View>
  )
}
