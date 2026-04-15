import { useState } from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import CanvasLogo from './assets/Canvas.svg'
import {
  SettingsInstUIIcon,
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  ClockInstUIIcon,
  CircleHelpInstUIIcon,
  MenuInstUIIcon,
} from '@instructure/ui-icons'

export function CanvasPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  return (
    <Flex height="100vh" width="100%" alignItems="stretch">

      {/* Sidebar */}
      <Flex.Item>
        <View as="div" height="97vh">
          <SideNavBar
            label="Main navigation"
            toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}
          >
            <SideNavBar.Item
              icon={<img src={CanvasLogo} alt="" />}
              label={<ScreenReaderContent>Canvas</ScreenReaderContent>}
              href="#"
              themeOverride={{ contentPadding: '1rem 0' }}
            />
            <SideNavBar.Item icon={<Avatar name="User" size="x-small" />} label="Account" href="#" />
            <SideNavBar.Item icon={<SettingsInstUIIcon />} label="Admin" href="#" />
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" />
            <SideNavBar.Item icon={<BookOpenInstUIIcon />} label="Courses" href="#" />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<ClockInstUIIcon />} label="History" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
          </SideNavBar>
        </View>
      </Flex.Item>

      {/* Main content column — fully scrollable */}
      <Flex.Item shouldGrow shouldShrink overflowY="auto" padding="small medium medium medium">
        <Flex direction="column" gap="x-large">

          {/* Top navbar */}
          <View
            as="header"
            background="primary"
            borderRadius="1rem"
            shadow="resting"
            display="block"
          >
            <Flex alignItems="center" padding="0 medium" height="64px" gap="large">
              <Flex.Item shouldGrow shouldShrink>
                <Flex alignItems="center" gap="medium">
                  <View as="button" cursor="pointer" padding="x-small" borderRadius="small" borderWidth="0" background="transparent" display="block">
                    <MenuInstUIIcon />
                  </View>
                  <Breadcrumb label="Navigation">
                    <Breadcrumb.Link href="#">Level 1</Breadcrumb.Link>
                    <Breadcrumb.Link>Current Level</Breadcrumb.Link>
                  </Breadcrumb>
                </Flex>
              </Flex.Item>
              <Flex alignItems="center" gap="small">
                <Avatar name="Tom Murphy" size="x-small" />
                <Text size="contentSmall">Tom Murphy</Text>
              </Flex>
            </Flex>
          </View>

          {/* Constrained content area */}
          <View as="div" maxWidth="1100px" display="block" margin="0 auto">
            <Flex direction="column" gap="medium">

              {/* Page header row: title/desc + buttons */}
              <Flex justifyItems="space-between" alignItems="start" gap="small">
                <Flex.Item shouldGrow shouldShrink>
                  <Flex direction="column" gap="small">
                    <Heading level="h1" margin="0">Page title</Heading>
                    <Text size="descriptionPage">
                      This is a page description. If your page requires describing in 1-2 rows, then use this. Try to keep it as short as possible.
                    </Text>
                  </Flex>
                </Flex.Item>
                <Flex gap="small" alignItems="center">
                  <Button>Button</Button>
                  <Button>Button</Button>
                  <Button color="primary">Button</Button>
                </Flex>
              </Flex>

              {/* Tabs */}
              <Tabs
                onRequestTabChange={(_e, { index }) => setSelectedTabIndex(index)}
              >
                <Tabs.Panel
                  renderTitle="Tab item"
                  isSelected={selectedTabIndex === 0}
                  padding="none"
                  themeOverride={{ defaultOverflowY: 'visible' }}
                >
                  <View
                    as="div"
                    background="primary"
                    borderRadius="1.5rem"
                    shadow="resting"
                    padding="medium"
                    display="block"
                    margin="large 0 0 0"
                  >
                    <Flex direction="column" gap="small">
                      <Heading level="h2">Card title</Heading>
                      <Text size="descriptionSection" color="secondary">Short card description</Text>
                      <Text size="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
                      <Text size="content">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</Text>
                      <Text size="content">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</Text>
                      <Text size="content">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</Text>
                      <Text size="content">Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</Text>
                      <Text size="content">Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum semper, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Donec nisl ligula, pharetra at volutpat in, blandit at lorem. Maecenas lobortis urna quis diam feugiat fringilla. Morbi odio justo, tempus non diam vel, hendrerit dapibus nisl.</Text>
                      <Text size="content">Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus.</Text>
                    </Flex>
                  </View>
                </Tabs.Panel>
                <Tabs.Panel
                  renderTitle="Tab item"
                  isSelected={selectedTabIndex === 1}
                  padding="none"
                >
                </Tabs.Panel>
              </Tabs>

            </Flex>
          </View>

        </Flex>
      </Flex.Item>

    </Flex>
  )
}
