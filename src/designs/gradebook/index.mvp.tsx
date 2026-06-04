import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Pill } from '@instructure/ui-pill/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { Menu } from '@instructure/ui-menu/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { Tray } from '@instructure/ui-tray/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  LayoutDashboardInstUIIcon,
  BookTextInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  ClockInstUIIcon,
  ShieldUserInstUIIcon,
  SearchInstUIIcon,
  SparklesInstUIIcon,
  XInstUIIcon,
  InfoInstUIIcon,
  OctagonAlertInstUIIcon,
  SettingsInstUIIcon,
  CheckInstUIIcon,
  IconCanvasLogoSolid,
} from '@instructure/ui-icons'
import {
  type CellData, type StudentData,
  seededRand, pct, GRADE_COLORS,
  STUDENTS, STUDENT_DEFS, ASSIGNMENTS, RUBRIC_TEMPLATE,
  getScore, setScore, getStatus, setStatus, needsGradingLive, getResubmitted,
} from './data'
import type { PrototypeProps } from '../../registry'
import { GradebookSettingsTray } from './GradebookSettingsTray'


// ── ScoreBadge ─────────────────────────────────────────────────────────────────

// Pill colors matching the reference HTML
const PILL = {
  ungraded: { bg: '#EAECEC', color: '#586874', label: 'Ungraded' },
  late:     { bg: '#FDE8D4', color: '#CF4A00', label: 'Late'     },
  missing:  { bg: '#FDE8E8', color: '#E62429', label: 'Missing'  },
  graded:   { bg: '#D6ECD9', color: '#03893D', label: 'Graded'   },
  excused:  { bg: '#EDE9F8', color: '#6B40CC', label: 'Excused'  },
  resubmitted: { bg: '#E0EBF5', color: '#0A5A87', label: 'Resubmitted' },
} as const

function ScoreBadge({
  cell, onExpand, onInfo, rowIdx, colIdx, studentId, version, onScoreChange, externalHovered,
}: {
  cell: CellData
  onExpand: () => void
  onInfo: () => void
  rowIdx: number
  colIdx: number
  studentId: string
  version: number
  onScoreChange?: () => void
  externalHovered?: boolean
}) {
  const [hovered, setHovered]       = useState(false)
  const [focused, setFocused]       = useState(false)
  const [editing, setEditing]       = useState(false)
  const [localScore, setLocalScore] = useState<string>(() => getScore(studentId, colIdx)?.toString() ?? '')
  const [savedScore, setSavedScore] = useState<number | undefined>(() => getScore(studentId, colIdx))
  const [justSaved, setJustSaved]   = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resync display when an external write updates the store (e.g. rubric selection in workspace)
  useEffect(() => {
    const stored = getScore(studentId, colIdx)
    setSavedScore(stored)
    if (!editing) setLocalScore(stored?.toString() ?? '')
  }, [version])
  const inputRef     = useRef<HTMLInputElement>(null)
  const saveTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasSubmission = cell.status !== 'missing' && cell.status !== 'excused' &&
    (cell.status !== 'ungraded' || !!cell.submittedAt)
  const showControls  = (externalHovered || hovered || focused) && hasSubmission
  const displayScore  = savedScore ?? cell.score

  useEffect(() => {
    if (editing) { inputRef.current?.focus(); inputRef.current?.select() }
  }, [editing])

  function navigateRow(delta: -1 | 1) {
    const target = document.querySelector<HTMLElement>(
      `[data-cell-row="${rowIdx + delta}"][data-cell-col="${colIdx}"]`
    )
    target?.focus()
  }

  function startEdit() {
    setLocalScore((savedScore ?? cell.score)?.toString() ?? '')
    setEditing(true)
  }

  function commitEdit() {
    const n = Number(localScore)
    if (localScore !== '' && !isNaN(n) && n >= 0 && n <= cell.max) {
      setSavedScore(n)
      setScore(studentId, colIdx, n)
      if (getStatus(studentId, colIdx) === 'ungraded') {
        setStatus(studentId, colIdx, 'graded')
      }
      onScoreChange?.()
      setJustSaved(true)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => setJustSaved(false), 2000)
    } else if (localScore === '' && savedScore !== undefined) {
      setSavedScore(undefined)
      setScore(studentId, colIdx, undefined)
      setStatus(studentId, colIdx, 'ungraded')
      onScoreChange?.()
    }
    setEditing(false)
  }

  function handleContainerKey(e: React.KeyboardEvent) {
    if (editing) return
    if (e.key === 'i') { e.preventDefault(); onInfo() }
    if (e.key === 'g') { e.preventDefault(); onExpand() }
    if (e.key === 'ArrowUp')   { e.preventDefault(); navigateRow(-1) }
    if (e.key === 'ArrowDown') { e.preventDefault(); navigateRow(1) }
    if ((e.key === 'Enter' || e.key === ' ') && hasSubmission) { e.preventDefault(); startEdit() }
  }

  function handleInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { setEditing(false); setLocalScore((savedScore ?? cell.score)?.toString() ?? '') }
    if (e.key === 'ArrowUp')   { e.preventDefault(); commitEdit(); navigateRow(-1) }
    if (e.key === 'ArrowDown') { e.preventDefault(); commitEdit(); navigateRow(1) }
  }

  return (
    /* eslint-disable instui/no-hardcoded-hex */
    <div
      ref={containerRef}
      tabIndex={hasSubmission ? 0 : -1}
      data-cell-row={rowIdx}
      data-cell-col={colIdx}
      style={{ display: 'flex', alignItems: 'center', gap: 8, outline: 'none' }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setFocused(false)
          if (editing) commitEdit()
        }
      }}
      onKeyDown={handleContainerKey}
    >
      {/* Info icon — left, visible on hover/focus */}
      <button
        type="button"
        tabIndex={-1}
        title="Grade details (i)"
        onClick={e => { e.stopPropagation(); onInfo() }}
        style={{
          display: 'flex', padding: 2, borderRadius: 4, background: 'none', border: 'none',
          cursor: 'pointer', color: '#8d959f', flexShrink: 0,
          visibility: showControls ? 'visible' : 'hidden',
        }}
      >
        <InfoInstUIIcon size="x-small" />
      </button>

      {/* Score / input / status */}
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localScore}
          onChange={e => setLocalScore(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleInputKey}
          style={{
            width: 52, fontSize: 13, fontWeight: 700, textAlign: 'center',
            border: '2px solid #0E68B3', borderRadius: 4, padding: '2px 4px',
            fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none',
          }}
        />
      ) : cell.status === 'missing' ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 10, background: PILL.missing.bg, color: PILL.missing.color, whiteSpace: 'nowrap' }}>
          Missing
        </span>
      ) : cell.status === 'excused' ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 10, background: PILL.excused.bg, color: PILL.excused.color, whiteSpace: 'nowrap' }}>
          Excused
        </span>
      ) : displayScore !== undefined ? (
        <span
          role="button"
          tabIndex={-1}
          onClick={startEdit}
          style={{ fontSize: 13, fontWeight: 700, color: justSaved ? '#03893D' : '#273540', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: 3, outline: focused && !editing ? '2px solid #0E68B3' : 'none', outlineOffset: 2 }}
        >
          {displayScore}
          <span style={{ fontWeight: 400, fontSize: 11, color: '#586874' }}>/{cell.max}</span>
          {cell.status === 'late' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 10, background: PILL.late.bg, color: PILL.late.color, whiteSpace: 'nowrap' }}>
              Late
            </span>
          )}
          {getResubmitted(studentId, colIdx) && (
            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 10, background: PILL.resubmitted.bg, color: PILL.resubmitted.color, whiteSpace: 'nowrap' }}>
              Resubmitted
            </span>
          )}
        </span>
      ) : hasSubmission ? (
        // Submitted but ungraded — click to enter grade
        <span
          role="button"
          tabIndex={-1}
          onClick={startEdit}
          style={{ fontSize: 13, color: '#8d959f', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: 3, outline: focused && !editing ? '2px solid #0E68B3' : 'none', outlineOffset: 2 }}
        >
          —/{cell.max}
        </span>
      ) : (
        <span style={{ color: '#586874', fontSize: 13 }}>—</span>
      )}

      {/* Grade button — right, visible on hover/focus */}
      <button
        type="button"
        tabIndex={-1}
        title="Open grading (g)"
        onClick={e => { e.stopPropagation(); onExpand() }}
        style={{
          fontSize: 11, fontWeight: 700,
          background: '#0E68B3',
          color: '#fff', border: 'none', padding: '3px 10px', borderRadius: 4,
          cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
          visibility: showControls ? 'visible' : 'hidden',
        }}
      >
        Grade
      </button>
    </div>
    /* eslint-enable instui/no-hardcoded-hex */
  )
}

// ── GradeCell ─────────────────────────────────────────────────────────────────
// Wraps <td> + ScoreBadge, owns the cell-level hover state so the full cell
// area (including padding) triggers the hover highlight and button reveal.

function GradeCell(props: Omit<React.ComponentProps<typeof ScoreBadge>, 'externalHovered'>) {
  const [cellHovered, setCellHovered] = useState(false)
  /* eslint-disable instui/no-hardcoded-hex */
  return (
    <td
      style={{
        padding: '10px 16px',
        background: cellHovered ? '#EBF5FF' : 'transparent',
        transition: 'background 0.1s',
      }}
      onMouseEnter={() => setCellHovered(true)}
      onMouseLeave={() => setCellHovered(false)}
    >
      <ScoreBadge {...props} externalHovered={cellHovered} />
    </td>
  )
  /* eslint-enable instui/no-hardcoded-hex */
}

// ── GradeTray ──────────────────────────────────────────────────────────────────

function GradeTray({
  student, assignmentIdx, onClose, border, containerBg,
}: {
  student: StudentData
  assignmentIdx: number
  onClose: () => void
  border: string
  containerBg: string
}) {
  const assignment = ASSIGNMENTS[assignmentIdx]
  const cell       = student.cells[assignmentIdx]
  const score      = cell.score
  const scorePct   = score !== undefined ? Math.round((score / cell.max) * 100) : null

  const isUnposted = ASSIGNMENTS[assignmentIdx].unposted
  const statusPillColor = ({ graded: isUnposted ? 'primary' : 'success', missing: 'error', late: 'warning', ungraded: 'primary', excused: 'primary' } as const)[cell.status]
  const statusLabel     = ({ graded: isUnposted ? 'Unposted' : 'Posted', missing: 'Missing', late: 'Late', ungraded: null, excused: 'Excused' } as const)[cell.status]

  return (
    <Tray
      label="Grade details"
      open
      onDismiss={onClose}
      placement="end"
      size="x-small"
      shouldCloseOnDocumentClick
      themeOverride={{ padding: '0' } as object}
    >
      <View as="div" height="100%" display="block" background="primary" themeOverride={{ backgroundPrimary: containerBg }}>

        <View as="div" display="block" borderWidth="0 0 small 0" padding="medium">
          <Flex alignItems="start" gap="small" justifyItems="space-between">
            <div style={{ minWidth: 0, flex: 1 }}>
              <Flex alignItems="center" gap="x-small">
                <Avatar name={student.name} size="x-small" />
                <Text weight="bold" size="small">{student.name}</Text>
              </Flex>
              <View as="div" display="block" margin="xx-small 0 0 0">
                <Text size="x-small" color="secondary">{assignment.name}</Text>
              </View>
            </div>
            <IconButton screenReaderLabel="Close" color="secondary" size="small" withBackground={false} withBorder={false} renderIcon={<XInstUIIcon />} onClick={onClose} />
          </Flex>
        </View>

        <View as="div" display="block" borderWidth="0 0 small 0" padding="medium">
          <View as="div" display="block" margin="0 0 x-small 0">
            <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Score</Text>
          </View>
          <Flex alignItems="end" gap="x-small" margin="0 0 x-small 0">
            {score !== undefined ? (
              <>
                <Text size="x-large" weight="bold">{score}</Text>
                <Text color="secondary">/ {cell.max}</Text>
                <Text size="x-small" color="secondary">({scorePct}%)</Text>
              </>
            ) : (
              <Text size="x-large" weight="bold" color="secondary">—</Text>
            )}
          </Flex>
          {statusLabel && <Pill color={statusPillColor}>{statusLabel}</Pill>}
          {cell.submittedAt && (
            <View as="div" display="block" margin="x-small 0 0 0">
              <Flex alignItems="center" gap="xx-small">
                <ClockInstUIIcon size="x-small" color="mutedColor" />
                <Text size="x-small" color="secondary">Submitted {cell.submittedAt}</Text>
              </Flex>
            </View>
          )}
        </View>

        {score !== undefined && assignment.hasRubric && (
          <View as="div" display="block" borderWidth="0 0 small 0" padding="medium">
            <View as="div" display="block" margin="0 0 small 0">
              <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Rubric</Text>
            </View>
            {RUBRIC_TEMPLATE.map((criterion, i) => {
              const r   = seededRand(student.id.charCodeAt(1) * 17 + i * 31)
              const pts = criterion.levels[Math.floor(r * criterion.levels.length)].pts
              return (
                <View as="div" display="block" margin="0 0 small 0" key={criterion.id}>
                  <Flex alignItems="center" justifyItems="space-between" margin="0 0 xx-small 0">
                    <Text size="small">{criterion.label}</Text>
                    <Text size="small" weight="bold">{pts}/{criterion.points}</Text>
                  </Flex>
                  {/* eslint-disable instui/no-hardcoded-hex */}
                  <div style={{ height: 6, borderRadius: 999, overflow: 'hidden', background: border }}>
                    <div style={{ height: '100%', borderRadius: 999, background: '#0770A3', width: `${Math.round((pts / criterion.points) * 100)}%` }} />
                  </div>
                  {/* eslint-enable instui/no-hardcoded-hex */}
                </View>
              )
            })}
          </View>
        )}

        <View as="div" display="block" padding="medium">
          <View as="div" display="block" margin="0 0 small 0">
            <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">History</Text>
          </View>
          <Flex direction="column" gap="x-small">
            {score !== undefined && (
              <Flex alignItems="center" justifyItems="space-between">
                <Text size="small" color="secondary">Graded</Text>
                <Text size="small" weight="bold">{score} / {cell.max}</Text>
              </Flex>
            )}
            {cell.submittedAt && (
              <Flex alignItems="center" justifyItems="space-between">
                <Text size="small" color="secondary">Submitted</Text>
                <Text size="small">{cell.submittedAt}</Text>
              </Flex>
            )}
            <Flex alignItems="center" justifyItems="space-between">
              <Text size="small" color="secondary">Due</Text>
              <Text size="small">{assignment.dueLabel}</Text>
            </Flex>
            <Flex alignItems="center" justifyItems="space-between">
              <Text size="small" color="secondary">Points possible</Text>
              <Text size="small">{cell.max}</Text>
            </Flex>
          </Flex>
        </View>

      </View>
    </Tray>
  )
}

// ── GradebookPrototype ─────────────────────────────────────────────────────────

export default function GradebookPrototype({ isDark, onToggleTheme }: PrototypeProps) {
  const navigate = useNavigate()
  const { sharedTokens } = useComputedTheme()
  /* eslint-disable instui/no-hardcoded-hex */
  const border      = sharedTokens.stroke.baseColor      ?? '#c7cdd1'
  const containerBg = sharedTokens.background.containerColor ?? '#ffffff'
  const pageBg      = sharedTokens.background.pageColor  ?? '#f5f7f8'
  const mutedBg     = sharedTokens.background.mutedColor ?? '#f5f7f8'
  /* eslint-enable instui/no-hardcoded-hex */

  useEffect(() => {
    const prev = document.title
    document.title = 'MVP Gradebook'
    return () => { document.title = prev }
  }, [])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const saved = sessionStorage.getItem('mvp-gradebook-scroll')
    if (saved && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = parseInt(saved, 10)
    }
  }, [])

  const [search, setSearch]           = useState('')
  const [sortBy, setSortBy]           = useState<string>('name')

  const [gradingVersion, setGradingVersion] = useState(0)
  const [infoTray, setInfoTray]             = useState<{ studentId: string; assignmentIdx: number } | null>(null)
  const [settingsTrayOpen, setSettingsTrayOpen]   = useState(false)

  const [filterStatus, setFilterStatus]     = useState('all')
  const [filterSection, setFilterSection]   = useState('all')
  const [filterGroup, setFilterGroup]       = useState('all')
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  const [exportMsg, setExportMsg] = useState<string | null>(null)
  const exportMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function triggerExport(format: 'csv' | 'xlsx') {
    if (exportMsgTimer.current) clearTimeout(exportMsgTimer.current)
    setExportMsg(`Downloaded gradebook.${format}`)
    exportMsgTimer.current = setTimeout(() => setExportMsg(null), 3000)
  }

  function openTray(studentId: string, assignmentIdx: number) {
    setInfoTray({ studentId, assignmentIdx })
  }

  // ── At-risk detection ──
  const BELOW_C = new Set(['D+', 'D', 'D−', 'F'])
  // Marcus Williams (s6), Laura Andersen (s13), and William Foster (s24) are
  // excluded from at-risk highlighting.
  const AT_RISK_EXCLUDED = new Set(['s6', 's13', 's24'])
  const AT_RISK = STUDENTS.filter(s => {
    if (AT_RISK_EXCLUDED.has(s.id)) return false
    if (!BELOW_C.has(s.currentGrade)) return false
    return (
      s.cells.some(c => c.status === 'missing') ||
      s.cells.filter(c => c.status === 'graded' && c.score !== undefined && pct(c.score, c.max) < 70).length >= 2
    )
  })
  const atRiskIds = new Set(AT_RISK.map(s => s.id))

  const ungradedCountByAssignment = useMemo(() =>
    ASSIGNMENTS.map((_, aIdx) =>
      STUDENTS.filter(s => needsGradingLive(s.id, aIdx)).length
    ),
  [gradingVersion])

  const activeFilterCount = [filterStatus !== 'all', filterSection !== 'all', filterGroup !== 'all'].filter(Boolean).length

  const filteredSorted = [...STUDENTS]
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => filterSection === 'all' || s.section === filterSection)
    .filter(s => {
      if (filterStatus === 'all') return true
      return s.cells.some(c => {
        if (filterStatus === 'graded')   return c.score !== undefined
        if (filterStatus === 'ungraded') return c.score === undefined && !!c.submittedAt
        return c.status === filterStatus
      })
    })
    .filter(s => {
      if (filterGroup === 'all') return true
      return s.cells.some((c, aIdx) => {
        const n = ASSIGNMENTS[aIdx].name.toLowerCase()
        const inGroup =
          filterGroup === 'labs'     ? n.includes('lab') :
          filterGroup === 'readings' ? (n.includes('reading') || n.includes('response')) :
          filterGroup === 'essays'   ? (!n.includes('lab') && !n.includes('reading') && !n.includes('response') && ASSIGNMENTS[aIdx].modality !== 'quiz') :
          false
        return inGroup && (c.score !== undefined || !!c.submittedAt)
      })
    })
    .sort((a, b) => {
      if (sortBy === 'grade' || sortBy === 'grade-asc') {
        const pa = STUDENT_DEFS.find(s => s.id === a.id)?.perf ?? 0
        const pb = STUDENT_DEFS.find(s => s.id === b.id)?.perf ?? 0
        return sortBy === 'grade' ? pb - pa : pa - pb
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name)
      }
      if (sortBy === 'risk') {
        const ra = atRiskIds.has(a.id) ? 0 : 1
        const rb = atRiskIds.has(b.id) ? 0 : 1
        if (ra !== rb) return ra - rb
      }
      return a.name.localeCompare(b.name)
    })

  function classAvgCell(aIdx: number): CellData {
    const graded = STUDENTS.map(s => s.cells[aIdx]).filter(c => c.status === 'graded' && c.score !== undefined)
    const avg = graded.length > 0
      ? Math.round(graded.reduce((sum, c) => sum + c.score!, 0) / graded.length)
      : undefined
    return avg !== undefined
      ? { submission: 'has-submission', score: avg, max: ASSIGNMENTS[aIdx].pts, status: 'graded' }
      : { submission: 'no-submission', max: ASSIGNMENTS[aIdx].pts, status: 'ungraded' }
  }

  const trayStudent = infoTray ? STUDENTS.find(s => s.id === infoTray.studentId) ?? null : null
  return (
    <View as="div" height="100vh" overflowX="hidden" overflowY="hidden" background="secondary" themeOverride={{ backgroundSecondary: pageBg }} display="block">
      <Flex height="100%" width="100%" alignItems="stretch" padding="0 0 small 0">

        {/* ── SideNavBar ── */}
        <View as="div" height="100%" padding="0 0 small 0" display="block">
          <SideNavBar label="Main navigation" toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}>
            <SideNavBar.Item icon={<IconCanvasLogoSolid size="medium" />} label={<ScreenReaderContent>Canvas</ScreenReaderContent>} href="#" themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }} />
            <SideNavBar.Item icon={<Avatar name="Ms. Trame" size="x-small" />} label="Account" href="#" />
            <SideNavBar.Item icon={<ShieldUserInstUIIcon />} label="Admin" href="#" />
            <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" />
            <SideNavBar.Item icon={<BookTextInstUIIcon />} label="Courses" href="#" selected />
            <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
            <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
            <SideNavBar.Item icon={<ClockInstUIIcon />} label="History" href="#" />
            <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
            <SideNavBar.Item icon={isDark ? <SparklesInstUIIcon /> : <SparklesInstUIIcon />} label="Theme" onClick={onToggleTheme} />
          </SideNavBar>
        </View>

        {/* ── Main content ── */}
        <Flex.Item shouldGrow shouldShrink overflowX="hidden" overflowY="hidden">
          <div
            ref={scrollContainerRef}
            style={{ height: '100%', overflowX: 'hidden', overflowY: 'auto' }}
            onScroll={() => {
              if (scrollContainerRef.current) {
                sessionStorage.setItem('mvp-gradebook-scroll', String(scrollContainerRef.current.scrollTop))
              }
            }}
          >
          <Flex direction="column">

            {/* ── Breadcrumb + toggle + cog — matches workspace.mvp layout ── */}
            <View as="div" display="block" padding="x-small 0" margin="0 small 0 0">
              <Flex alignItems="center" justifyItems="space-between">
                <Breadcrumb label="Navigation">
                  <Breadcrumb.Link href="#">Courses</Breadcrumb.Link>
                  <Breadcrumb.Link href="#">BIOL-412</Breadcrumb.Link>
                  <Breadcrumb.Link>Grades</Breadcrumb.Link>
                </Breadcrumb>
                <Flex alignItems="center" gap="x-small">
                  {/* eslint-disable instui/no-hardcoded-hex */}
                  <div style={{ display: 'flex', overflow: 'hidden', borderRadius: 9999, border: `1px solid ${border}`, width: 'fit-content' }}>
                    {(['Gradebook', 'Speedgrader'] as const).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (opt === 'Speedgrader') {
                            try {
                              const pos = sessionStorage.getItem('mvp-workspace-pos')
                              const p = pos ? JSON.parse(pos) : null
                              navigate(p ? `/gradebook-workspace-mvp?s=${p.s}&a=${p.a}` : '/gradebook-workspace-mvp')
                            } catch {
                              navigate('/gradebook-workspace-mvp')
                            }
                          }
                        }}
                        style={{
                          padding: '6px 20px', fontSize: 13, border: 'none', cursor: 'pointer',
                          transition: 'background 0.15s', fontFamily: 'inherit',
                          background: opt === 'Gradebook' ? '#273540' : 'transparent',
                          color: opt === 'Gradebook' ? '#fff' : '#273540',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {/* eslint-enable instui/no-hardcoded-hex */}
                  <IconButton
                    screenReaderLabel="Grading settings"
                    color="secondary"
                    size="small"
                    withBackground={false}
                    withBorder={false}
                    renderIcon={<SettingsInstUIIcon />}
                    onClick={() => setSettingsTrayOpen(true)}
                  />
                </Flex>
              </Flex>
            </View>

            {/* ── Page content ── */}
            <View as="div" padding="0 x-small 0 0" display="block">
              <Heading level="h1" margin="0 0 medium 0">Traditional Gradebook</Heading>

              <Flex direction="column" gap="medium">

                {/* Filters */}
                <Flex alignItems="center" justifyItems="space-between">
                  <Flex alignItems="end" gap="small" wrap="no-wrap">
                    <TextInput renderLabel={<ScreenReaderContent>Search students</ScreenReaderContent>} placeholder="Search students…" value={search} onChange={(_e, value) => setSearch(value)} renderBeforeInput={<SearchInstUIIcon />} shouldNotWrap width="220px" />
                    <SimpleSelect renderLabel={<ScreenReaderContent>Sort students</ScreenReaderContent>} value={sortBy} onChange={(_e, { value }) => setSortBy(value as string)} width="200px">
                      <SimpleSelect.Option id="name"      value="name">Sort: Name A–Z</SimpleSelect.Option>
                      <SimpleSelect.Option id="name-desc" value="name-desc">Sort: Name Z–A</SimpleSelect.Option>
                      <SimpleSelect.Option id="grade"     value="grade">Sort: Grade high–low</SimpleSelect.Option>
                      <SimpleSelect.Option id="grade-asc" value="grade-asc">Sort: Grade low–high</SimpleSelect.Option>
                    </SimpleSelect>
                    {/* eslint-disable instui/no-hardcoded-hex */}
                    <div style={{ position: 'relative' }}>
                      <Button
                        color={activeFilterCount > 0 ? 'primary' : 'secondary'}
                        onClick={() => setFilterPanelOpen(v => !v)}
                      >
                        {activeFilterCount > 0 ? `Filters · ${activeFilterCount}` : 'Filters'}
                      </Button>

                      {/* Floating filter panel */}
                      {filterPanelOpen && (() => {
                        const chipStyle = (active: boolean) => ({
                          padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 as const,
                          border: `1px solid ${active ? '#0E68B3' : border}`,
                          background: active ? '#0E68B3' : mutedBg,
                          color: active ? '#fff' : '#586874',
                          cursor: 'pointer' as const, fontFamily: 'inherit', whiteSpace: 'nowrap' as const,
                        })
                        const grpLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#586874', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }
                        const grpWrap: React.CSSProperties  = { marginBottom: 16 }
                        const chipRow: React.CSSProperties  = { display: 'flex', flexWrap: 'wrap', gap: 6 }
                        return (
                          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200, minWidth: 460, background: containerBg, border: `1px solid ${border}`, borderRadius: sharedTokens.borderRadius.card.md, padding: '16px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#273540' }}>Filter Students</span>
                              {activeFilterCount > 0 && (
                                <button type="button" style={{ fontSize: 12, color: '#0E68B3', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }} onClick={() => { setFilterStatus('all'); setFilterSection('all'); setFilterGroup('all') }}>Clear all</button>
                              )}
                            </div>

                            <div style={grpWrap}>
                              <div style={grpLabel}>Submission Status</div>
                              <div style={chipRow}>
                                {([['all','All'],['ungraded','Ungraded'],['graded','Graded'],['late','Late'],['missing','Missing'],['excused','Excused']] as const).map(([val, label]) => (
                                  <button key={val} type="button" style={chipStyle(filterStatus === val)} onClick={() => setFilterStatus(val)}>{label}</button>
                                ))}
                              </div>
                            </div>

                            <div style={grpWrap}>
                              <div style={grpLabel}>Section</div>
                              <div style={chipRow}>
                                {([['all','All Sections'],['Section A','Section A'],['Section B','Section B'],['Section C','Section C']] as const).map(([val, label]) => (
                                  <button key={val} type="button" style={chipStyle(filterSection === val)} onClick={() => setFilterSection(val)}>{label}</button>
                                ))}
                              </div>
                            </div>

                            <div style={grpWrap}>
                              <div style={grpLabel}>Assignment Group</div>
                              <div style={chipRow}>
                                {([['all','All Groups'],['essays','Essays'],['labs','Lab Reports'],['readings','Readings']] as const).map(([val, label]) => (
                                  <button key={val} type="button" style={chipStyle(filterGroup === val)} onClick={() => setFilterGroup(val)}>{label}</button>
                                ))}
                              </div>
                            </div>

                            <div style={{ marginTop: 0, paddingTop: 12, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 12, color: '#586874' }}>{filteredSorted.length} of {STUDENTS.length} students shown</span>
                              <button type="button" style={{ fontSize: 12, fontWeight: 700, background: '#0E68B3', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => setFilterPanelOpen(false)}>Done</button>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                    {/* eslint-enable instui/no-hardcoded-hex */}
                  </Flex>
                  <Flex alignItems="center" gap="small">
                    {exportMsg && (
                      <Flex alignItems="center" gap="xx-small">
                        <CheckInstUIIcon size="x-small" color="accentGreenColor" />
                        <Text size="small" color="success">{exportMsg}</Text>
                      </Flex>
                    )}
                    <Menu
                      label="Export gradebook"
                      placement="bottom end"
                      trigger={<Button color="secondary" size="medium">Export</Button>}
                      onSelect={(_e, value) => triggerExport(value as 'csv' | 'xlsx')}
                    >
                      <Menu.Item value="csv">CSV (.csv)</Menu.Item>
                      <Menu.Item value="xlsx">Excel (.xlsx)</Menu.Item>
                    </Menu>
                  </Flex>
                </Flex>

                {/* Badge table */}
                <View as="div" display="block" background="primary" themeOverride={{ backgroundPrimary: containerBg }} borderWidth="small" borderRadius={sharedTokens.borderRadius.card.md} shadow="resting" overflowX="auto">
                  {/* eslint-disable instui/no-style-border */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: mutedBg, borderBottom: `1px solid ${border}` }}>
                        <th style={{ position: 'sticky', left: 0, zIndex: 2, background: mutedBg, padding: '10px 20px', fontSize: 11, fontWeight: 600, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: `1px solid ${border}`, minWidth: 220 }}>Student</th>
                        {ASSIGNMENTS.map((a, aIdx) => (
                          <th key={a.id} style={{ padding: '10px 16px', background: mutedBg, minWidth: 160, verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#09508c' }}>{a.name}</span>
                              <span style={{ fontSize: 11, color: '#8d959f' }}>{a.dueLabel} · {a.pts} pts</span>
                              {a.pastDue && (
                                <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                                  {(() => {
                                    const needsGrading = ungradedCountByAssignment[aIdx] > 0
                                    const firstUngraded = needsGrading ? STUDENTS.find(s => needsGradingLive(s.id, aIdx))?.id : undefined
                                    const target = firstUngraded
                                      ? `/gradebook-workspace-mvp?s=${firstUngraded}&a=${aIdx}`
                                      : `/gradebook-workspace-mvp?a=${aIdx}`
                                    const baseStyle = { display: 'inline-flex', alignItems: 'center', padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 10, whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', fontFamily: 'inherit' } as const
                                    return needsGrading
                                      ? <button type="button" onClick={() => navigate(target)} style={{ ...baseStyle, background: '#FDE8D4', color: '#CF4A00' }}>{ungradedCountByAssignment[aIdx]} need grading</button>
                                      : <button type="button" onClick={() => navigate(target)} style={{ ...baseStyle, background: '#D6ECD9', color: '#03893D' }}>All graded</button>
                                  })()}
                                  {a.unposted && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', fontSize: 10, fontWeight: 700, borderRadius: 10, background: '#D0E8FF', color: '#0770A3', whiteSpace: 'nowrap' }}>{a.unpostedCount} unposted</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </th>
                        ))}
                        <th style={{ position: 'sticky', right: 0, zIndex: 2, background: mutedBg, padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', minWidth: 80, boxShadow: '-4px 0 8px rgba(0,0,0,0.06)' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSorted.map((student, sIdx) => {
                        const isAtRisk = atRiskIds.has(student.id)
                        const rowBg = isAtRisk ? '#fffbeb' : containerBg
                        return (
                          <tr key={student.id} style={{ background: rowBg, borderBottom: `1px solid ${border}` }}>
                              <td style={{ position: 'sticky', left: 0, zIndex: 1, background: rowBg, padding: '10px 14px', borderRight: `1px solid ${border}`, minWidth: 220 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <Avatar name={student.name} size="x-small" />
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* eslint-disable instui/no-hardcoded-hex */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <span style={{ fontSize: 13, fontWeight: 700, color: '#273540' }}>{student.name}</span>
                                      {isAtRisk && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', color: '#CF4A00', flexShrink: 0 }}>
                                          <OctagonAlertInstUIIcon size="x-small" />
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#586874', marginTop: 1 }}>{student.section}</div>
                                    {/* eslint-enable instui/no-hardcoded-hex */}
                                  </div>
                                </div>
                              </td>
                              {student.cells.map((cell, cIdx) => (
                                <GradeCell
                                  key={cIdx}
                                  cell={cell}
                                  onExpand={() => navigate(`/gradebook-workspace-mvp?s=${student.id}&a=${cIdx}`)}
                                  onInfo={() => openTray(student.id, cIdx)}
                                  rowIdx={sIdx}
                                  colIdx={cIdx}
                                  studentId={student.id}
                                  version={gradingVersion}
                                  onScoreChange={() => setGradingVersion(v => v + 1)}
                                />
                              ))}
                              <td style={{ position: 'sticky', right: 0, zIndex: 1, background: rowBg, padding: '10px 16px', textAlign: 'center', minWidth: 80, boxShadow: '-4px 0 8px rgba(0,0,0,0.06)' }}>
                                <span style={{ fontSize: 18, fontWeight: 700, color: GRADE_COLORS[student.currentGrade] ?? '#475569' }}>{student.currentGrade}</span>
                              </td>
                            </tr>
                        )
                      })}

                      {/* Class average row */}
                      <tr style={{ background: mutedBg }}>
                        <td style={{ position: 'sticky', left: 0, zIndex: 1, background: mutedBg, padding: '10px 20px', borderRight: `1px solid ${border}`, minWidth: 220 }}>
                          <Text size="small" weight="bold" color="secondary">Class Average</Text>
                        </td>
                        {ASSIGNMENTS.map((_, aIdx) => (
                          <td key={aIdx} style={{ padding: '10px 16px', background: mutedBg }}>
                            <ScoreBadge cell={classAvgCell(aIdx)} onExpand={() => {}} onInfo={() => {}} studentId="" rowIdx={-1} colIdx={aIdx} version={gradingVersion} />
                          </td>
                        ))}
                        <td style={{ position: 'sticky', right: 0, zIndex: 1, background: mutedBg, padding: '10px 16px', textAlign: 'center', minWidth: 80, boxShadow: '-4px 0 8px rgba(0,0,0,0.06)' }}>
                          <Text size="small" weight="bold" color="secondary">C+</Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* eslint-enable instui/no-style-border */}
                </View>


              </Flex>
            </View>
          </Flex>
          </div>
        </Flex.Item>
      </Flex>

      {trayStudent && infoTray && (
        <GradeTray student={trayStudent} assignmentIdx={infoTray.assignmentIdx} onClose={() => setInfoTray(null)} border={border} containerBg={containerBg} />
      )}

      <GradebookSettingsTray open={settingsTrayOpen} onClose={() => setSettingsTrayOpen(false)} />

    </View>
  )
}
