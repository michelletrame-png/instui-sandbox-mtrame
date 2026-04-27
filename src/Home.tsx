import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Link } from '@instructure/ui-link/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { Table } from '@instructure/ui-table/latest'
import { prototypes } from './prototypes/registry'
import { Text } from '@instructure/ui-text/latest'
import CanvasLogo from './assets/Canvas.svg'
import type { PrototypeMeta, PrototypeStatus } from './prototypes/registry'

type SortCol = 'title' | 'createdAt' | 'status'
type SortDir = 'ascending' | 'descending'

const statusOrder: Record<PrototypeStatus, number> = {
  WIP: 0,
  'In Review': 1,
  Complete: 2,
  Archived: 3,
  Reference: 4,
}

const statusColor: Record<PrototypeStatus, 'warning' | 'info' | 'success' | 'primary'> = {
  WIP: 'warning',
  'In Review': 'info',
  Complete: 'success',
  Archived: 'primary',
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
    else if (col === 'status') cmp = statusOrder[a.status] - statusOrder[b.status]
    return dir === 'ascending' ? cmp : -cmp
  })
}

export function Home() {
  const [sortCol, setSortCol] = useState<SortCol>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('descending')
  const { sharedTokens } = useComputedTheme()

  function handleSort(_e: React.SyntheticEvent, { id }: { id: string }) {
    const col = id as SortCol
    if (col === sortCol) {
      setSortDir(d => d === 'ascending' ? 'descending' : 'ascending')
    } else {
      setSortCol(col)
      setSortDir('ascending')
    }
  }

  const sorted = sortPrototypes(prototypes, sortCol, sortDir)

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
            <img src={CanvasLogo} alt="Canvas" style={{ width: 48, height: 48 }} />
            <Heading level="h1" margin="0">Canvas Prototypes</Heading>
          </Flex>
          <Text color="secondary" size="medium">Design Sandbox for <Text weight="bold">[Designer Name]</Text></Text>
        </Flex>

        <View
          as="div"
          display="block"
          maxWidth="700px"
          width="100%"
          background="primary"
          themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
          borderRadius={sharedTokens.borderRadius.card.lg}
          shadow="resting"
          padding="medium"
        >
          <Table caption="Prototypes" hover>
            <Table.Head>
              <Table.Row>
                <Table.ColHeader
                  id="title"
                  sortDirection={sortCol === 'title' ? sortDir : 'none'}
                  onRequestSort={handleSort}
                  stackedSortByLabel="Title"
                >
                  Title
                </Table.ColHeader>
                <Table.ColHeader
                  id="createdAt"
                  sortDirection={sortCol === 'createdAt' ? sortDir : 'none'}
                  onRequestSort={handleSort}
                  stackedSortByLabel="Created"
                >
                  Created
                </Table.ColHeader>
                <Table.ColHeader
                  id="status"
                  sortDirection={sortCol === 'status' ? sortDir : 'none'}
                  onRequestSort={handleSort}
                  stackedSortByLabel="Status"
                  width="120px"
                >
                  Status
                </Table.ColHeader>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {sorted.map(p => (
                <Table.Row key={p.id}>
                  <Table.Cell>
                    <Link as={RouterLink} to={p.path}>{p.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{formatDate(p.createdAt)}</Table.Cell>
                  <Table.Cell>
                    <Pill color={statusColor[p.status]}>{p.status}</Pill>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </View>
      </Flex>
    </View>
  )
}
