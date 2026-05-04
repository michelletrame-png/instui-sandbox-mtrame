import React from "react";
import { View } from "@instructure/ui-view/latest";
import { Flex } from "@instructure/ui-flex/latest";
import { Heading } from "@instructure/ui-heading/latest";
import { Text } from "@instructure/ui-text/latest";
import { Button } from "@instructure/ui-buttons/latest";
import { IconButton } from "@instructure/ui-buttons/latest";
import { Avatar } from "@instructure/ui-avatar/latest";
import { Breadcrumb } from "@instructure/ui-breadcrumb/latest";
import { Tabs } from "@instructure/ui-tabs/latest";
import { SideNavBar } from "@instructure/ui-side-nav-bar/latest";
import { ScreenReaderContent } from "@instructure/ui-a11y-content";
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  IgniteaiLogoInstUIIcon,
  IconCanvasLogoSolid,
} from "@instructure/ui-icons";
import type { FrameCtx } from "./ctx";

export function desktopAgentClosed({
  sharedTokens,
}: FrameCtx): React.ReactNode {
  return (
    <View
      as="div"
      width="100%"
      height="100%"
      padding="small"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
      display="block"
      overflowX="hidden"
      overflowY="hidden"
    >
      <Flex height="100%" alignItems="start" gap="medium" padding="0">
        <View as="div" height="100%" display="block">
          <SideNavBar
            label="Main navigation"
            toggleLabel={{
              expandedLabel: "Minimize navigation",
              minimizedLabel: "Expand navigation",
            }}
            themeOverride={{ marginBottom: "0", margin: "0" } as object}
          >
            <SideNavBar.Item
              icon={<IconCanvasLogoSolid size="medium" />}
              label={<ScreenReaderContent>Canvas</ScreenReaderContent>}
              href="#"
              themeOverride={{ contentPadding: "1em 0.375rem 1em 0.375rem" }}
            />
            <SideNavBar.Item
              icon={<Avatar name="User" size="x-small" />}
              label="Account"
              href="#"
            />
            <SideNavBar.Item
              icon={<SettingsInstUIIcon />}
              label="Admin"
              href="#"
            />
            <SideNavBar.Item
              icon={<LayoutDashboardInstUIIcon />}
              label="Dashboard"
              href="#"
              selected
            />
            <SideNavBar.Item
              icon={<BookOpenInstUIIcon />}
              label="Courses"
              href="#"
            />
            <SideNavBar.Item
              icon={<CalendarDaysInstUIIcon />}
              label="Calendar"
              href="#"
            />
            <SideNavBar.Item
              icon={<InboxInstUIIcon />}
              label="Inbox"
              href="#"
            />
            <SideNavBar.Item
              icon={<CircleHelpInstUIIcon />}
              label="Help"
              href="#"
            />
          </SideNavBar>
        </View>
        <Flex.Item
          shouldGrow
          shouldShrink
          overflowX="hidden"
          overflowY="hidden"
        >
          <View
            as="div"
            overflowY="auto"
            padding="large"
            display="block"
          >
            <View
              as="div"
              maxWidth="1100px"
              display="block"
              margin="0 auto"
              width="100%"
            >
              <Flex direction="column" gap="medium">
                <Flex alignItems="start" gap="small">
                  <Flex.Item shouldGrow shouldShrink>
                    <Flex direction="column" gap="small">
                      <Breadcrumb label="Navigation">
                        <Breadcrumb.Link href="#">Admin</Breadcrumb.Link>
                        <Breadcrumb.Link>Dashboard</Breadcrumb.Link>
                      </Breadcrumb>
                      <Heading level="h1" variant="titlePageDesktop" margin="0">
                        Dashboard
                      </Heading>
                      <Text size="descriptionPage">
                        Overview of your institution's courses, activity, and
                        recent updates.
                      </Text>
                    </Flex>
                  </Flex.Item>
                  <IconButton
                    color="ai-primary"
                    screenReaderLabel="Open AI assistant"
                  >
                    <IgniteaiLogoInstUIIcon />
                  </IconButton>
                </Flex>
                <Flex gap="small">
                  <Button color="primary">Primary action</Button>
                  <Button>Secondary action</Button>
                </Flex>
                <Tabs>
                  <Tabs.Panel
                    renderTitle="Overview"
                    isSelected
                    padding="none"
                    themeOverride={{ defaultOverflowY: "visible" }}
                  >
                    <View
                      as="div"
                      background="primary"
                      themeOverride={{
                        backgroundPrimary:
                          sharedTokens.background.containerColor,
                      }}
                      borderRadius={sharedTokens.borderRadius.card.lg}
                      shadow="resting"
                      padding="medium"
                      display="block"
                      margin="medium 0 0 0"
                    >
                      <Flex direction="column" gap="xx-small">
                        <Heading level="h2" variant="titleCardLarge" margin="0">
                          Course activity
                        </Heading>
                        <Text size="content" color="secondary">
                          Recent enrollment and publishing events
                        </Text>
                        <Text size="content">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris.
                        </Text>
                      </Flex>
                    </View>
                  </Tabs.Panel>
                  <Tabs.Panel
                    renderTitle="Reports"
                    isSelected={false}
                    padding="none"
                  />
                </Tabs>
              </Flex>
            </View>
          </View>
        </Flex.Item>
      </Flex>
    </View>
  );
}

export const desktopAgentClosedCode = `<View
  as="div"
  width="100%"
  height="100%"
  background="secondary"
  themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
  display="block"
>
  <Flex height="100%" alignItems="stretch">
    <SideNavBar
      label="Main navigation"
      toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
    >
      <SideNavBar.Item icon={<IconCanvasLogoSolid size="medium" />} label={<ScreenReaderContent>Canvas</ScreenReaderContent>} href="#" />
      <SideNavBar.Item icon={<Avatar name="User" size="x-small" />} label="Account" href="#" />
      <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
      <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" selected />
      <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" />
      <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
      <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
      <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
    </SideNavBar>

    <Flex.Item shouldGrow shouldShrink overflowX="hidden" overflowY="hidden">
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
              <IconButton color="ai-primary" screenReaderLabel="Open AI assistant">
                <IgniteaiLogoInstUIIcon />
              </IconButton>
            </Flex>

            <Flex gap="small">
              <Button color="primary">Primary action</Button>
              <Button>Secondary action</Button>
            </Flex>

            <Tabs>
              <Tabs.Panel renderTitle="Overview" isSelected padding="none">
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
                  </Flex>
                </View>
              </Tabs.Panel>
              <Tabs.Panel renderTitle="Reports" isSelected={false} padding="none" />
            </Tabs>
          </Flex>
        </View>
      </View>
    </Flex.Item>
  </Flex>
</View>`;

export const desktopAgentClosedCopy = [
  { label: "Nav: breadcrumb parent", text: "Admin" },
  { label: "Nav: breadcrumb current", text: "Dashboard" },
  { label: "Page title", text: "Dashboard" },
  {
    label: "Page description",
    text: "Overview of your institution's courses, activity, and recent updates.",
  },
  { label: "Primary action", text: "Primary action" },
  { label: "Secondary action", text: "Secondary action" },
  { label: "Tab: first", text: "Overview" },
  { label: "Card heading", text: "Course activity" },
  {
    label: "Card description",
    text: "Recent enrollment and publishing events",
  },
  { label: "AI button: screen reader label", text: "Open AI assistant" },
];
