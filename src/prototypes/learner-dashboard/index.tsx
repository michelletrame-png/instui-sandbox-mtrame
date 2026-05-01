import { useState, useEffect } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { Tray } from '@instructure/ui-tray/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { ToggleDetails } from '@instructure/ui-toggle-details/latest'
import { ProgressBar } from '@instructure/ui-progress/latest'
import { Table } from '@instructure/ui-table/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  LayoutDashboardInstUIIcon,
  BookOpenInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  SunInstUIIcon,
  MoonInstUIIcon,
  AlignJustifyInstUIIcon,
  XInstUIIcon,
  IconCanvasLogoSolid,
} from '@instructure/ui-icons'
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

const COURSES = [
  { id: '1', name: 'Intro to Psychology', instructor: 'Dr. Sarah Chen', progress: 68, tag: 'info' as const },
  { id: '2', name: 'World History', instructor: 'Prof. James Miller', progress: 45, tag: 'success' as const },
  { id: '3', name: 'Biology 101', instructor: 'Dr. Maria Torres', progress: 82, tag: 'warning' as const },
  { id: '4', name: 'English Composition', instructor: 'Prof. David Kim', progress: 31, tag: 'primary' as const },
]

const ASSIGNMENTS = [
  { id: '1', name: 'Research Paper Draft', course: 'Intro to Psychology', due: 'May 2, 2026', status: 'Due Soon' },
  { id: '2', name: 'Chapter 5 Quiz', course: 'World History', due: 'Apr 30, 2026', status: 'Due Soon' },
  { id: '3', name: 'Lab Report #3', course: 'Biology 101', due: 'Apr 28, 2026', status: 'Submitted' },
  { id: '4', name: 'Essay Outline', course: 'English Composition', due: 'Apr 25, 2026', status: 'Submitted' },
  { id: '5', name: 'Midterm Study Guide', course: 'World History', due: 'Apr 15, 2026', status: 'Missing' },
  { id: '6', name: 'Behavior Analysis', course: 'Intro to Psychology', due: 'May 7, 2026', status: 'Upcoming' },
  { id: '7', name: 'Cell Division Essay', course: 'Biology 101', due: 'May 10, 2026', status: 'Upcoming' },
]

const GRADES = [
  { id: '1', name: 'Intro to Psychology', grade: 'B+', pct: 87, trend: 'up' },
  { id: '2', name: 'World History', grade: 'A-', pct: 91, trend: 'up' },
  { id: '3', name: 'Biology 101', grade: 'B', pct: 84, trend: 'down' },
  { id: '4', name: 'English Composition', grade: 'C+', pct: 78, trend: 'up' },
]

const ANNOUNCEMENTS = [
  {
    id: '1',
    instructor: 'Dr. Sarah Chen',
    course: 'Intro to Psychology',
    title: 'Office hours change this week',
    date: 'Apr 28, 2026',
    body: 'My regular Thursday office hours (2–4 pm) are being moved to 3–5 pm this week only. If you have a scheduled appointment, please adjust accordingly. You can also email me to set up an alternate time.',
  },
  {
    id: '2',
    instructor: 'Prof. James Miller',
    course: 'World History',
    title: 'Midterm grades posted',
    date: 'Apr 27, 2026',
    body: 'Midterm exam grades are now available in the gradebook. The class average was 82%. Please review the feedback comments on your exam. If you have questions about your grade, bring your exam to office hours.',
  },
  {
    id: '3',
    instructor: 'Dr. Maria Torres',
    course: 'Biology 101',
    title: 'Lab materials for next Tuesday',
    date: 'Apr 26, 2026',
    body: 'Please bring your lab notebook and a #2 pencil to next Tuesday\'s class. We will be conducting the enzyme activity experiment. Review Chapter 7 beforehand to make the most of the session.',
  },
  {
    id: '4',
    instructor: 'Prof. David Kim',
    course: 'English Composition',
    title: 'Peer review session on May 5',
    date: 'Apr 25, 2026',
    body: 'Our next class session on May 5 will be a structured peer review workshop. Bring two printed copies of your current essay draft. We will exchange papers and provide written feedback using the rubric posted on the course page.',
  },
  {
    id: '5',
    instructor: 'Dr. Sarah Chen',
    course: 'Intro to Psychology',
    title: 'Guest speaker on May 3',
    date: 'Apr 23, 2026',
    body: 'We are excited to welcome Dr. Priya Nair from the university\'s clinical research center on May 3. She will speak about cognitive behavioral therapy in practice. Attendance counts toward your participation grade.',
  },
]

const TAB_LABELS = ['Courses', 'Assignments', 'Grades', 'Announcements']

function assignmentPillColor(status: string): 'warning' | 'success' | 'error' | 'info' {
  if (status === 'Due Soon') return 'warning'
  if (status === 'Submitted') return 'success'
  if (status === 'Missing') return 'error'
  return 'info'
}

function CourseCard({ course, isMobile, sharedTokens }: {
  course: typeof COURSES[0]
  isMobile: boolean
  sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens']
}) {
  return (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      shadow="resting"
      display="block"
      width={isMobile ? '100%' : 'auto'}
    >
      <Flex direction="column" height="100%">
        <View
          as="div"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.mutedColor }}
          borderRadius={`${sharedTokens.borderRadius.card.md} ${sharedTokens.borderRadius.card.md} 0 0`}
          padding="x-small medium"
          display="block"
        >
          <Pill color={course.tag}>{course.tag === 'info' ? 'Social Science' : course.tag === 'success' ? 'Humanities' : course.tag === 'warning' ? 'Natural Science' : 'Language Arts'}</Pill>
        </View>
        <View as="div" padding="medium" display="block">
          <Flex direction="column" gap="small">
            <Flex direction="column" gap="xxx-small">
              <Heading level="h3" variant="titleCardRegular" margin="0">{course.name}</Heading>
              <Text size="small" color="secondary">{course.instructor}</Text>
            </Flex>
            <Flex direction="column" gap="xx-small">
              <Flex justifyItems="space-between">
                <Text size="small">Progress</Text>
                <Text size="small" weight="bold">{course.progress}%</Text>
              </Flex>
              <ProgressBar
                screenReaderLabel={`${course.name} progress: ${course.progress}%`}
                valueNow={course.progress}
                valueMax={100}
                size="x-small"
              />
            </Flex>
            <Button size="small" display="block">Go to course</Button>
          </Flex>
        </View>
      </Flex>
    </View>
  )
}

function CoursesTab({ isMobile, sharedTokens }: { isMobile: boolean; sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens'] }) {
  return (
    <Flex direction="column" gap="medium">
      <Flex wrap="wrap" gap="medium">
        {COURSES.map(course => (
          <Flex.Item key={course.id} size={isMobile ? '100%' : 'calc(50% - 0.75rem)'}>
            <CourseCard course={course} isMobile={isMobile} sharedTokens={sharedTokens} />
          </Flex.Item>
        ))}
      </Flex>
    </Flex>
  )
}

function AssignmentsTab({ sharedTokens }: { sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens'] }) {
  return (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      shadow="resting"
      display="block"
      overflowX="auto"
    >
      <Table caption="Upcoming assignments" hover>
        <Table.Head>
          <Table.Row>
            <Table.ColHeader id="name" stackedSortByLabel="Assignment">Assignment</Table.ColHeader>
            <Table.ColHeader id="course" stackedSortByLabel="Course">Course</Table.ColHeader>
            <Table.ColHeader id="due" stackedSortByLabel="Due Date">Due date</Table.ColHeader>
            <Table.ColHeader id="status" stackedSortByLabel="Status" width="130px">Status</Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {ASSIGNMENTS.map(a => (
            <Table.Row key={a.id}>
              <Table.Cell>{a.name}</Table.Cell>
              <Table.Cell>{a.course}</Table.Cell>
              <Table.Cell>{a.due}</Table.Cell>
              <Table.Cell>
                <Pill color={assignmentPillColor(a.status)}>{a.status}</Pill>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </View>
  )
}

function GradesTab({ sharedTokens }: { sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens'] }) {
  return (
    <Flex direction="column" gap="medium">
      {GRADES.map(g => (
        <View
          key={g.id}
          as="div"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderRadius={sharedTokens.borderRadius.card.md}
          shadow="resting"
          padding="medium"
          display="block"
        >
          <Flex alignItems="center" gap="medium">
            <View
              as="div"
              background="primary"
              themeOverride={{ backgroundPrimary: sharedTokens.background.mutedColor }}
              borderRadius={sharedTokens.borderRadius.card.sm}
              padding="small medium"
              display="block"
              textAlign="center"
              width="72px"
            >
              <Heading level="h2" margin="0">{g.grade}</Heading>
            </View>
            <Flex.Item shouldGrow shouldShrink>
              <Flex direction="column" gap="x-small">
                <Flex justifyItems="space-between" alignItems="center">
                  <Heading level="h3" variant="titleCardRegular" margin="0">{g.name}</Heading>
                  <Text size="small" color="secondary">{g.pct}%</Text>
                </Flex>
                <ProgressBar
                  screenReaderLabel={`${g.name} grade: ${g.pct}%`}
                  valueNow={g.pct}
                  valueMax={100}
                  size="x-small"
                />
                <Text size="small" color="secondary">
                  {g.pct >= 90 ? 'Excellent work — keep it up.' : g.pct >= 80 ? 'Good standing — a little more effort could push you to an A.' : g.pct >= 70 ? 'Satisfactory — review recent feedback to improve.' : 'At risk — talk to your instructor about extra support.'}
                </Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </View>
      ))}
    </Flex>
  )
}

function AnnouncementsTab({ sharedTokens }: { sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens'] }) {
  return (
    <Flex direction="column" gap="medium">
      {ANNOUNCEMENTS.map(a => (
        <View
          key={a.id}
          as="div"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderRadius={sharedTokens.borderRadius.card.md}
          shadow="resting"
          padding="medium"
          display="block"
        >
          <Flex gap="medium" alignItems="start">
            <Avatar name={a.instructor} size="small" />
            <Flex.Item shouldGrow shouldShrink>
              <Flex direction="column" gap="x-small">
                <Flex justifyItems="space-between" alignItems="start" wrap="wrap" gap="xx-small">
                  <Flex direction="column" gap="xxx-small">
                    <Heading level="h3" variant="titleCardRegular" margin="0">{a.title}</Heading>
                    <Text size="small" color="secondary">{a.instructor} · {a.course}</Text>
                  </Flex>
                  <Text size="small" color="secondary">{a.date}</Text>
                </Flex>
                <ToggleDetails summary="Read announcement" variant="filled">
                  <Text size="content">{a.body}</Text>
                </ToggleDetails>
              </Flex>
            </Flex.Item>
          </Flex>
        </View>
      ))}
    </Flex>
  )
}

export default function LearnerDashboard({ isDark, onToggleTheme }: PrototypeProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const { sharedTokens } = useComputedTheme()
  const isMobile = useIsMobile()

  const breadcrumb = (
    <Breadcrumb label="Navigation">
      <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
      <Breadcrumb.Link>Dashboard</Breadcrumb.Link>
    </Breadcrumb>
  )

  const tabContent = [
    <CoursesTab key="courses" isMobile={isMobile} sharedTokens={sharedTokens} />,
    <AssignmentsTab key="assignments" sharedTokens={sharedTokens} />,
    <GradesTab key="grades" sharedTokens={sharedTokens} />,
    <AnnouncementsTab key="announcements" sharedTokens={sharedTokens} />,
  ]

  const navItems = [
    { icon: <LayoutDashboardInstUIIcon />, label: 'Dashboard', selected: true },
    { icon: <BookOpenInstUIIcon />, label: 'Courses' },
    { icon: <CalendarDaysInstUIIcon />, label: 'Calendar' },
    { icon: <InboxInstUIIcon />, label: 'Inbox' },
    { icon: <CircleHelpInstUIIcon />, label: 'Help' },
  ]

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
            <IconCanvasLogoSolid size="small" />
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
        </View>

        {/* Mobile nav tray */}
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
              {navItems.map(({ icon, label, selected }) => (
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
              ))}
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
              <Heading level="h1" variant="titlePageMobile" margin="0">Dashboard</Heading>
              <Text size="content">Welcome back. Here's what's happening in your courses.</Text>
            </Flex>

            <SimpleSelect
              renderLabel={<ScreenReaderContent>Select section</ScreenReaderContent>}
              value={String(selectedTabIndex)}
              onChange={(_e, { value }) => setSelectedTabIndex(Number(value))}
            >
              {TAB_LABELS.map((label, i) => (
                <SimpleSelect.Option key={label} id={`tab-${i}`} value={String(i)}>{label}</SimpleSelect.Option>
              ))}
            </SimpleSelect>

            {tabContent[selectedTabIndex]}
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
            <SideNavBar.Item icon={<Avatar name="Alex Rivera" size="x-small" />} label="Account" href="#" />
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

        {/* Main content */}
        <Flex.Item shouldGrow shouldShrink overflowY="auto">
          <View as="div" height="100%" overflowY="auto" padding="large" display="block">
            <View as="div" maxWidth="1100px" display="block" margin="0 auto" width="100%">
              <Flex direction="column" gap="medium">

                <Flex direction="column" gap="small">
                  {breadcrumb}
                  <Heading level="h1" variant="titlePageDesktop" margin="0">Dashboard</Heading>
                  <Text size="descriptionPage">
                    Welcome back, Alex. Here's what's happening in your courses.
                  </Text>
                </Flex>

                <Tabs onRequestTabChange={(_e, { index }) => setSelectedTabIndex(index)}>
                  {TAB_LABELS.map((label, i) => (
                    <Tabs.Panel
                      key={label}
                      renderTitle={label}
                      isSelected={selectedTabIndex === i}
                      padding="none"
                      themeOverride={{ defaultOverflowY: 'visible' }}
                    >
                      <View as="div" margin="medium 0 0 0" display="block">
                        {tabContent[i]}
                      </View>
                    </Tabs.Panel>
                  ))}
                </Tabs>

              </Flex>
            </View>
          </View>
        </Flex.Item>

      </Flex>
    </View>
  )
}
