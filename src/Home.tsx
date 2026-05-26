import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Link } from '@instructure/ui-link/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { Pill } from '@instructure/ui-pill/latest'
import { Table } from '@instructure/ui-table/latest'
import { Tabs } from '@instructure/ui-tabs/latest'
import { Text } from '@instructure/ui-text/latest'
import { Alert } from '@instructure/ui-alerts/latest'
import { IconButton, CloseButton } from '@instructure/ui-buttons/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { CopyInstUIIcon, ExternalLinkInstUIIcon, SearchInstUIIcon } from '@instructure/ui-icons'
import { prototypes } from './registry'
import { sandboxOwner, sandboxHash } from './sandbox.config'

const _repoName = import.meta.env.BASE_URL.split('/').filter(Boolean)[0]
const sandboxLiveUrl = sandboxHash && _repoName ? `https://instructure.github.io/${_repoName}/${sandboxHash}/` : ''
import staticExportsData from './static-exports.json'
import type { PrototypeMeta, PrototypeCategory, PrototypeStatus } from './registry'

type SortCol = 'title' | 'createdAt' | 'category'
type SortDir = 'ascending' | 'descending'

const statusOrder: Record<PrototypeStatus, number> = {
  Active: 0,
  Archived: 1,
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
    else if (col === 'status') cmp = (statusOrder[a.status ?? 'Active'] ?? 99) - (statusOrder[b.status ?? 'Active'] ?? 99)
    return dir === 'ascending' ? cmp : -cmp
  })
}

function PrototypeTable({ items, showCategory = false }: {
  items: PrototypeMeta[]
  showCategory?: boolean
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
          <Table.ColHeader id="createdAt" sortDirection={sortCol === 'createdAt' ? sortDir : 'none'} onRequestSort={handleSort} stackedSortByLabel="Created">Created</Table.ColHeader>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {sorted.map(p => (
          <Table.Row key={p.id}>
            <Table.Cell><Link as={RouterLink} to={p.path}>{p.title}</Link></Table.Cell>
            {showCategory && <Table.Cell><Pill color={categoryColor[p.category]}>{p.category}</Pill></Table.Cell>}
            <Table.Cell>{formatDate(p.createdAt)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

type SkillInfo = {
  command: string
  title: string
  description: string
  triggers: string[]
}

const skills: SkillInfo[] = [
  {
    command: '/sandbox-design',
    title: 'Design',
    description: 'Start here for any new work. Asks what you want to create, identifies the right output type (spec, prototype, or reference), then hands off to the right skill.',
    triggers: [
      '/sandbox-design a submission flow using the canvas page template and this Figma file',
      '/sandbox-design spec for the gradebook empty states — desktop and mobile',
      '/sandbox-design an interactive prototype of the course dashboard',
    ],
  },
  {
    command: '/sandbox-init',
    title: 'Init',
    description: "Sets up the sandbox environment. Checks Node.js, installs dependencies, starts the dev server, and orients you to how the sandbox works. Run this when you first open a new sandbox or if the dev server isn't running.",
    triggers: [
      '/sandbox-init',
    ],
  },
  {
    command: '/sandbox-publish',
    title: 'Publish',
    description: 'Everything related to publishing. Creates your GitHub repo and configures GitHub Pages (one-time setup), deploys updates to the live sandbox, and manages frozen static exports with permanent shareable URLs.',
    triggers: [
      '/sandbox-publish setup',
      '/sandbox-publish my sandbox',
      '/sandbox-publish the learner overview to a static link',
      '/sandbox-publish delete learner-overview-v1',
    ],
  },
  {
    command: '/sandbox-push',
    title: 'Push',
    description: 'Commits any local changes and pushes to your live sandbox. Routes to /sandbox-publish setup if no GitHub repo is configured yet. After pushing, checks for upstream updates and suggests /sandbox-update if any exist.',
    triggers: [
      '/sandbox-push',
    ],
  },
  {
    command: '/sandbox-update',
    title: 'Update',
    description: "Pulls the latest improvements from the upstream base repo into your sandbox. Commits any local changes first if needed. Never pushes — use /sandbox-publish when you're ready to redeploy.",
    triggers: [
      '/sandbox-update',
    ],
  },
  {
    command: '/sandbox-eval',
    title: 'Eval',
    description: 'Writes a quality report for the current session to .claude/evals/. Use it to review how a design or prototype session went.',
    triggers: [
      '/sandbox-eval',
    ],
  },
  {
    command: '/sandbox-audit',
    title: 'Audit',
    description: "Audits a prototype or spec for token misuse, accessibility issues, and copy quality. Lists available prototypes if you don't name one.",
    triggers: [
      '/sandbox-audit',
      '/sandbox-audit agent patterns',
      '/sandbox-audit the learner overview spec',
    ],
  },
]

function SkillCard({ skill, sharedTokens }: { skill: SkillInfo; sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens'] }) {
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
      <Flex direction="column" gap="x-small">
        <Flex alignItems="center" gap="small">
          <View
            as="span"
            display="inline-block"
            background="secondary"
            themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
            borderRadius={sharedTokens.borderRadius.card.sm}
            padding="xx-small x-small"
          >
            <Text size="small" weight="bold">{skill.command}</Text>
          </View>
        </Flex>
        <Text size="small" color="secondary">{skill.description}</Text>
        <Flex direction="column" gap="xx-small" margin="x-small 0 0 0">
          {skill.triggers.map((t, i) => (
            <View
              key={i}
              as="div"
              display="block"
              background="secondary"
              themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
              borderRadius={sharedTokens.borderRadius.card.sm}
              padding="xx-small x-small"
            >
              <Flex alignItems="center" gap="x-small">
                <Flex.Item shouldGrow shouldShrink>
                  <Text size="small" color="secondary">{t}</Text>
                </Flex.Item>
                <IconButton
                  size="small"
                  withBackground={false}
                  withBorder={false}
                  screenReaderLabel="Copy prompt"
                  renderIcon={<CopyInstUIIcon />}
                  onClick={() => navigator.clipboard.writeText(t)}
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
  const [searchDesigns, setSearchDesigns] = useState('')
  const [searchPublished, setSearchPublished] = useState('')
  const [filterCategory, setFilterCategory] = useState<PrototypeCategory | ''>('')
  const [filterStatus, setFilterStatus] = useState<PrototypeStatus | ''>('Active')
  const { sharedTokens } = useComputedTheme()

  type StaticExport = { id: string; title: string; url: string; deployedAt: string }
  const allWorkItems = prototypes.filter(p => p.category === 'Spec' || p.category === 'Prototype')
  const workItems = allWorkItems
    .filter(p => !searchDesigns || p.title.toLowerCase().includes(searchDesigns.toLowerCase()))
    .filter(p => !filterCategory || p.category === filterCategory)
    .filter(p => !filterStatus || p.status === filterStatus)
  const templateItems = prototypes.filter(p => p.category === 'Template')
  const referenceItems = prototypes.filter(p => p.category === 'Reference')
  const allPublishedItems = (staticExportsData as StaticExport[]).slice().reverse()
  const publishedItems = searchPublished
    ? allPublishedItems.filter(p => p.id.toLowerCase().includes(searchPublished.toLowerCase()))
    : allPublishedItems

  const tabPanelView = (children: React.ReactNode) => (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.lg}
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
            <svg width="auto" height="32" viewBox="0 0 149 40" fill="none" aria-hidden="true" role="presentation" focusable={false}>
              <g role="presentation">
                <path d="M143.74 39.5083C146.41 39.5083 148.575 37.3465 148.575 34.6798C148.575 32.0131 146.41 29.8513 143.74 29.8513C141.069 29.8513 138.905 32.0131 138.905 34.6798C138.905 37.3465 141.069 39.5083 143.74 39.5083Z" fill="#E72429" />
                <path d="M86.4948 16.0066V8.87571H80.5086V0H73.2463V4.16476C73.2463 6.81989 71.7954 8.87571 68.6504 8.87571H67.2146C69.4556 11.144 70.4887 13.9053 70.7622 16.0066H72.5246V29.8436C72.5246 35.5863 76.1558 39.0228 81.9596 39.0228C84.3221 39.0228 85.7731 38.598 86.4948 38.2945V31.6491C86.0693 31.7705 84.983 31.8919 84.0183 31.8919C81.7165 31.8919 80.5086 31.0422 80.5086 28.4478V16.0066H86.4948Z" fill="#273540" />
                <path d="M133.555 0.963352H125.51V38.0593H133.555V0.963352Z" fill="#273540" />
                <path d="M91.6523 24.977V1.10743H99.6935V24.977C99.6935 28.2113 102.316 30.8335 105.55 30.8335C108.784 30.8335 111.406 28.2113 111.406 24.977V1.10743H119.448V24.977C119.448 32.6526 113.226 38.8747 105.55 38.8747C97.8744 38.8747 91.6523 32.6526 91.6523 24.977Z" fill="#273540" />
                <path d="M50.8134 28.8119C50.9958 31.1712 52.7506 33.3408 56.2602 33.3408C58.919 33.3408 60.1952 31.9525 60.1952 30.3822C60.1952 29.0547 59.2912 27.9699 56.9895 27.4844L53.0544 26.5816C47.3114 25.3147 44.7058 21.8707 44.7058 17.6983C44.7058 12.3805 49.4233 7.97298 55.8348 7.97298C64.305 7.97298 67.1461 13.3515 67.5107 16.5528L60.7954 18.0625C60.5523 16.3101 59.2836 14.0722 55.8956 14.0722C53.7761 14.0722 52.0821 15.3391 52.0821 17.0307C52.0821 18.4797 53.1684 19.39 54.8016 19.6859L59.0329 20.5886C64.8975 21.7948 67.8678 25.3603 67.8678 29.7071C67.8678 34.5394 64.1151 39.4931 56.3134 39.4931C47.357 39.4931 44.2728 33.6973 43.9157 30.314L50.8134 28.8043V28.8119Z" fill="#273540" />
                <path d="M8.0448 1.502H0V38.5979H8.0448V1.502Z" fill="#273540" />
                <path d="M21.5968 38.598H13.552V8.88335H21.3537V12.5702C23.1693 9.49023 26.7397 8.10198 29.9455 8.10198C37.3294 8.10198 40.7099 13.3591 40.7099 19.8831V38.6131H32.6651V21.279C32.6651 17.9563 31.0318 15.3619 27.1575 15.3619C23.6479 15.3619 21.5892 18.0777 21.5892 21.5217V38.6207L21.5968 38.598Z" fill="#273540" />
              </g>
            </svg>
            <Heading level="h1" margin="0">Sandbox</Heading>
          </Flex>
          <Flex alignItems="center" gap="x-small">
            {sandboxLiveUrl ? (
              <Link href={sandboxLiveUrl} target="_blank" rel="noopener noreferrer" renderIcon={<ExternalLinkInstUIIcon />} iconPlacement="start">
                {sandboxOwner}
              </Link>
            ) : (
              <Text color="secondary" size="medium" weight="bold">{sandboxOwner}</Text>
            )}
            {sandboxLiveUrl && (
              <IconButton size="small" withBackground={false} withBorder={false} screenReaderLabel="Copy live site link" renderIcon={<CopyInstUIIcon />} onClick={() => navigator.clipboard.writeText(sandboxLiveUrl)} />
            )}
          </Flex>
        </Flex>

        <View as="div" display="block" maxWidth="700px" width="100%">
          <Tabs onRequestTabChange={(_e, { index }) => setTabIndex(index)}>
            <Tabs.Panel renderTitle="Designs" isSelected={tabIndex === 0} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(
                <Flex direction="column" gap="medium">
                  <Flex gap="small" alignItems="end" wrap="wrap">
                    <Flex.Item shouldGrow shouldShrink>
                      <TextInput
                        renderLabel={<ScreenReaderContent>Search designs</ScreenReaderContent>}
                        placeholder="Search designs"
                        renderBeforeInput={<SearchInstUIIcon inline={false} />}
                        renderAfterInput={searchDesigns ? <CloseButton size="small" screenReaderLabel="Clear search" onClick={() => setSearchDesigns('')} /> : undefined}
                        size="small"
                        value={searchDesigns}
                        onChange={(_e, value) => setSearchDesigns(value)}
                      />
                    </Flex.Item>
                    <SimpleSelect
                      renderLabel={<ScreenReaderContent>Filter by category</ScreenReaderContent>}
                      value={filterCategory}
                      onChange={(_e, { value }) => setFilterCategory((value ?? '') as PrototypeCategory | '')}
                      size="small"
                      width="160px"
                    >
                      <SimpleSelect.Option id="cat-all" value="">All categories</SimpleSelect.Option>
                      <SimpleSelect.Option id="cat-spec" value="Spec">Spec</SimpleSelect.Option>
                      <SimpleSelect.Option id="cat-prototype" value="Prototype">Prototype</SimpleSelect.Option>
                    </SimpleSelect>
                    <SimpleSelect
                      renderLabel={<ScreenReaderContent>Filter by status</ScreenReaderContent>}
                      value={filterStatus}
                      onChange={(_e, { value }) => setFilterStatus((value ?? '') as PrototypeStatus | '')}
                      size="small"
                      width="160px"
                    >
                      <SimpleSelect.Option id="status-all" value="">All statuses</SimpleSelect.Option>
                      <SimpleSelect.Option id="status-active" value="Active">Active</SimpleSelect.Option>
                      <SimpleSelect.Option id="status-archived" value="Archived">Archived</SimpleSelect.Option>
                    </SimpleSelect>
                  </Flex>
                  <PrototypeTable items={workItems} showCategory />
                </Flex>
              )}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Published" isSelected={tabIndex === 1} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(
                allPublishedItems.length === 0
                  ? <Flex direction="column" gap="small">
                      <Text color="secondary">No links published yet. Share any design at a permanent URL:</Text>
                      <View
                        as="div"
                        display="block"
                        background="secondary"
                        themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
                        borderRadius={sharedTokens.borderRadius.card.sm}
                        padding="xx-small x-small"
                      >
                        <Flex alignItems="center" gap="x-small">
                          <Flex.Item shouldGrow shouldShrink>
                            <Text size="small" color="secondary">/sandbox-publish the [design name] to a static link</Text>
                          </Flex.Item>
                          <IconButton
                            size="small"
                            withBackground={false}
                            withBorder={false}
                            screenReaderLabel="Copy prompt"
                            renderIcon={<CopyInstUIIcon />}
                            onClick={() => navigator.clipboard.writeText('/sandbox-publish the [design name] to a static link')}
                          />
                        </Flex>
                      </View>
                    </Flex>
                  : <Flex direction="column" gap="medium">
                      <TextInput
                        renderLabel={<ScreenReaderContent>Search published</ScreenReaderContent>}
                        placeholder="Search published"
                        renderBeforeInput={<SearchInstUIIcon inline={false} />}
                        renderAfterInput={searchPublished ? <CloseButton size="small" screenReaderLabel="Clear search" onClick={() => setSearchPublished('')} /> : undefined}
                        size="small"
                        value={searchPublished}
                        onChange={(_e, value) => setSearchPublished(value)}
                      />
                      <Table caption="Published links" hover>
                      <Table.Head>
                        <Table.Row>
                          <Table.ColHeader id="title" stackedSortByLabel="Design">Design</Table.ColHeader>
                          <Table.ColHeader id="deployedAt" stackedSortByLabel="Published" width="130px">Published</Table.ColHeader>
                        </Table.Row>
                      </Table.Head>
                      <Table.Body>
                        {publishedItems.map(p => (
                          <Table.Row key={p.id}>
                            <Table.Cell>
                              <Flex alignItems="center" gap="x-small">
                                <Link href={p.url} target="_blank" rel="noopener noreferrer">{p.id}</Link>
                                <IconButton
                                  size="small"
                                  withBackground={false}
                                  withBorder={false}
                                  screenReaderLabel="Copy link"
                                  renderIcon={<CopyInstUIIcon />}
                                  onClick={() => navigator.clipboard.writeText(p.url)}
                                />
                              </Flex>
                            </Table.Cell>
                            <Table.Cell>{formatDate(p.deployedAt)}</Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                    </Flex>
              )}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Templates" isSelected={tabIndex === 2} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(
                <Flex direction="column" gap="medium">
                  <Alert variant="info" renderCloseButtonLabel={false} hasShadow={false}>Page wrappers for starting a new design.</Alert>
                  <PrototypeTable items={templateItems} />
                </Flex>
              )}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="References" isSelected={tabIndex === 3} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              {tabPanelView(
                <Flex direction="column" gap="medium">
                  <Alert variant="info" renderCloseButtonLabel={false} hasShadow={false}>Example code referenced by skills used to improve code quality.</Alert>
                  <PrototypeTable items={referenceItems} />
                </Flex>
              )}
            </Tabs.Panel>
            <Tabs.Panel renderTitle="Help" isSelected={tabIndex === 4} padding="none" themeOverride={{ defaultOverflowY: 'visible' }}>
              <View as="div" display="block" margin="medium 0 0 0">
                <Flex direction="column" gap="medium">
                  {skills.map(skill => (
                    <SkillCard key={skill.command} skill={skill} sharedTokens={sharedTokens} />
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
