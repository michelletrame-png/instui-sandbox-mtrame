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
import { IconCanvasLogoSolid } from '@instructure/ui-icons'
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
            <Tabs.Panel renderTitle="Prototypes" isSelected={tabIndex === 0} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(<PrototypeTable items={workItems} showCategory showStatus />)}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Templates" isSelected={tabIndex === 1} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(<PrototypeTable items={templateItems} />)}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="References" isSelected={tabIndex === 2} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(<PrototypeTable items={referenceItems} />)}
            </Tabs.Panel>
          </Tabs>
        </View>
      </Flex>
    </View>
  )
}
