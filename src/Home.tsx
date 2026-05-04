import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Link } from '@instructure/ui-link/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { Table } from '@instructure/ui-table/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { Text } from '@instructure/ui-text/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import { IconCanvasLogoSolid, CopyInstUIIcon } from '@instructure/ui-icons'
import { prototypes } from './registry'
import type { PrototypeMeta, PrototypeCategory, PrototypeStatus } from './registry'

type SortCol = 'title' | 'createdAt' | 'status' | 'category'
type SortDir = 'ascending' | 'descending'

const statusOrder: Record<PrototypeStatus, number> = {
  WIP: 0,
  'In Review': 1,
  Complete: 2,
  Archived: 3,
}

const statusColor: Record<PrototypeStatus, 'warning' | 'info' | 'success' | 'primary'> = {
  WIP: 'warning',
  'In Review': 'info',
  Complete: 'success',
  Archived: 'primary',
}

const categoryColor: Record<PrototypeCategory, 'warning' | 'info' | 'success' | 'primary'> = {
  Spec: 'success',
  Prototype: 'info',
  Template: 'primary',
  Reference: 'primary',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function sortPrototypes(list: PrototypeMeta[], col: SortCol, dir: SortDir) {
  return [...list].sort((a, b) => {
    let cmp = 0
    if (col === 'title') cmp = a.title.localeCompare(b.title)
    else if (col === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt)
    else if (col === 'category') cmp = (a.category ?? '').localeCompare(b.category ?? '')
    else if (col === 'status') cmp = (statusOrder[a.status ?? 'Archived'] ?? 99) - (statusOrder[b.status ?? 'Archived'] ?? 99)
    return dir === 'ascending' ? cmp : -cmp
  })
}

function PrototypeTable({ items, showCategory = false, showStatus = false }: {
  items: PrototypeMeta[]
  showCategory?: boolean
  showStatus?: boolean
}) {
  const [sortCol, setSortCol] = useState<SortCol>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('descending')

  function handleSort(_e: React.SyntheticEvent, { id }: { id: string }) {
    const col = id as SortCol
    if (col === sortCol) {
      setSortDir(d => d === 'ascending' ? 'descending' : 'ascending')
    } else {
      setSortCol(col)
      setSortDir('ascending')
    }
  }

  const sorted = sortPrototypes(items, sortCol, sortDir)

  return (
    <Table caption="Prototypes" hover>
      <Table.Head>
        <Table.Row>
          <Table.ColHeader id="title" sortDirection={sortCol === 'title' ? sortDir : 'none'} onRequestSort={handleSort} stackedSortByLabel="Title">Title</Table.ColHeader>
          {showCategory && <Table.ColHeader id="category" sortDirection={sortCol === 'category' ? sortDir : 'none'} onRequestSort={handleSort} stackedSortByLabel="Category" width="110px">Category</Table.ColHeader>}
          {showStatus && <Table.ColHeader id="status" sortDirection={sortCol === 'status' ? sortDir : 'none'} onRequestSort={handleSort} stackedSortByLabel="Status" width="120px">Status</Table.ColHeader>}
          <Table.ColHeader id="createdAt" sortDirection={sortCol === 'createdAt' ? sortDir : 'none'} onRequestSort={handleSort} stackedSortByLabel="Created">Created</Table.ColHeader>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sorted.map(p => (
          <Table.Row key={p.id}>
            <Table.Cell><Link as={RouterLink} to={p.path}>{p.title}</Link></Table.Cell>
            {showCategory && <Table.Cell><Pill color={categoryColor[p.category]}>{p.category}</Pill></Table.Cell>}
            {showStatus && <Table.Cell>{p.status && <Pill color={statusColor[p.status]}>{p.status}</Pill>}</Table.Cell>}
            <Table.Cell>{formatDate(p.createdAt)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

type PromptGroup = {
  skill: string
  description: string
  prompts: string[]
}

const promptGroups: PromptGroup[] = [
  {
    skill: '/design',
    description: 'Start here. Figures out what to build and hands off to the right skill.',
    prompts: [
      'I want to design the assignment submission flow.',
      'Create a spec for the new gradebook empty states — desktop and mobile.',
      'Build me an interactive prototype of the course dashboard.',
      'I need to spec out the error states for file upload.',
    ],
  },
  {
    skill: '/get-component',
    description: 'Look up any InstUI component\'s props before using it.',
    prompts: [
      'What props does SimpleSelect accept? I want to make one with a placeholder and a disabled option.',
      'Show me the props for Tray so I can build a slide-in panel from the right side.',
      'What are the available sizes and colors for Pill?',
    ],
  },
  {
    skill: '/get-icons',
    description: 'Find the right icon from the Lucide or Canvas icon sets.',
    prompts: [
      'Find an icon for "upload" — I want something that suggests sending a file to the cloud.',
      'Is there a calendar icon with a clock or time indicator?',
      'Find a Canvas-specific icon for SpeedGrader.',
    ],
  },
  {
    skill: '/get-tokens',
    description: 'Look up design token values for spacing, color, and typography.',
    prompts: [
      'What token should I use for a muted border color on a card?',
      'What are the available borderRadius tokens for cards?',
      'Show me the spacing scale — I want to pick the right gap between list items.',
    ],
  },
  {
    skill: '/uxcopy-write',
    description: 'Write UI copy in Instructure voice.',
    prompts: [
      'Write an empty state heading and body for a gradebook that has no submissions yet.',
      'Write button labels and a confirmation dialog for deleting a course module.',
      'Write a loading message and a success toast for submitting an assignment.',
    ],
  },
  {
    skill: '/uxcopy-check',
    description: 'Audit existing UI copy against Instructure voice guidelines.',
    prompts: [
      'Check this copy for voice issues: "Empower your students by leveraging our robust grading tools to seamlessly transform their learning journey."',
      'Review the labels in the 2.0 board of the spec for tone and Instructure standards.',
    ],
  },
]

function PromptGroupCard({ group, sharedTokens }: { group: PromptGroup; sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens'] }) {
  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor, borderColorPrimary: sharedTokens.stroke.mutedColor }}
      borderRadius={sharedTokens.borderRadius.card.sm}
      borderWidth="small"
      borderColor="primary"
      padding="medium"
    >
      <Flex direction="column" gap="small">
        <Flex direction="column" gap="xx-small">
          <Text weight="bold" size="medium">{group.skill}</Text>
          <Text color="secondary" size="small">{group.description}</Text>
        </Flex>
        <Flex direction="column" gap="x-small">
          {group.prompts.map((prompt, i) => (
            <View
              key={i}
              as="div"
              display="block"
              background="secondary"
              themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
              borderRadius={sharedTokens.borderRadius.card.sm}
              padding="x-small small"
            >
              <Flex alignItems="center" gap="x-small">
                <Flex.Item shouldGrow shouldShrink>
                  <Text size="small">{prompt}</Text>
                </Flex.Item>
                <IconButton
                  size="small"
                  withBackground={false}
                  withBorder={false}
                  screenReaderLabel="Copy prompt"
                  renderIcon={<CopyInstUIIcon />}
                  onClick={() => navigator.clipboard.writeText(prompt)}
                />
              </Flex>
            </View>
          ))}
        </Flex>
      </Flex>
    </View>
  )
}

export function Home() {
  const [tabIndex, setTabIndex] = useState(0)
  const { sharedTokens } = useComputedTheme()

  const workItems = prototypes.filter(p => p.category === 'Spec' || p.category === 'Prototype')
  const templateItems = prototypes.filter(p => p.category === 'Template')
  const referenceItems = prototypes.filter(p => p.category === 'Reference')

  const tabPanelView = (children: React.ReactNode) => (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.sm}
      shadow="resting"
      padding="medium"
      margin="medium 0 0 0"
    >
      {children}
    </View>
  )

  return (
    <View
      as="div"
      minHeight="100vh"
      display="block"
      background="secondary"
      themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
    >
      <Flex direction="column" alignItems="center" padding="xx-large large large large">
        <Flex direction="column" alignItems="center" gap="x-small" margin="0 0 large 0">
          <Flex alignItems="center" gap="small">
            <IconCanvasLogoSolid size="medium" />
            <Heading level="h1" margin="0">InstUI Prototypes</Heading>
          </Flex>
          <Text color="secondary" size="medium">Sandbox for <Text weight="bold">[name]</Text></Text>
        </Flex>

        <View as="div" display="block" maxWidth="700px" width="100%">
          <Tabs onRequestTabChange={(_e, { index }) => setTabIndex(index)}>
            <Tabs.Panel renderTitle="Designs" isSelected={tabIndex === 0} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(<PrototypeTable items={workItems} showCategory showStatus />)}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Templates" isSelected={tabIndex === 1} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(<PrototypeTable items={templateItems} />)}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="References" isSelected={tabIndex === 2} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(<PrototypeTable items={referenceItems} />)}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Prompts & Skills" isSelected={tabIndex === 3} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              <View as="div" display="block" margin="medium 0 0 0">
                <Flex direction="column" gap="medium">
                  {promptGroups.map(group => (
                    <PromptGroupCard key={group.skill} group={group} sharedTokens={sharedTokens} />
                  ))}
                </Flex>
              </View>
            </Tabs.Panel>
          </Tabs>
        </View>
      </Flex>
    </View>
  )
}
