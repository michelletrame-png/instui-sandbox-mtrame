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
  ChevronRightInstUIIcon,
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
  const [settingsPanel, setSettingsPanel]         = useState<string | null>(null)

  // ── Grading configuration state ──
  // Assignment Group Weights
  const [weightingEnabled, setWeightingEnabled] = useState(true)
  const [assignmentGroups, setAssignmentGroups] = useState([
    { id: 1, name: 'Essays',       weight: '40' },
    { id: 2, name: 'Lab Reports',  weight: '35' },
    { id: 3, name: 'Readings',     weight: '25' },
  ])
  const [agNextId, setAgNextId] = useState(4)
  // Grading Schemes
  const [showScoresAs, setShowScoresAs] = useState('Percentages')
  type GradeRow    = { id: number; grade: string; minPct: string }
  type CustomScheme = { id: number; name: string; rows: GradeRow[] }
  const DEFAULT_ROWS: GradeRow[] = [
    { id: 1, grade: 'A',  minPct: '94' },
    { id: 2, grade: 'B',  minPct: '80' },
    { id: 3, grade: 'C',  minPct: '70' },
    { id: 4, grade: 'D',  minPct: '60' },
    { id: 5, grade: 'F',  minPct: '0'  },
  ]
  const [activeSchemeId, setActiveSchemeId]   = useState<'default' | number>('default')
  const [customSchemes, setCustomSchemes]     = useState<CustomScheme[]>([])
  const [schemeNextId, setSchemeNextId]       = useState(1)
  const [creatingScheme, setCreatingScheme]   = useState(false)
  const [newSchemeName, setNewSchemeName]     = useState('')
  const [newSchemeRows, setNewSchemeRows]     = useState<GradeRow[]>(DEFAULT_ROWS)
  const [rowNextId, setRowNextId]             = useState(6)
  // Visibility / student-view
  const [hideGradeTotals, setHideGradeTotals]       = useState(false)

  // Late Policies
  const [autoDeductLate, setAutoDeductLate]         = useState(true)
  const [lateDeductPct, setLateDeductPct]           = useState('10')
  const [lateDeductInterval, setLateDeductInterval] = useState('Day')
  const [lateLowestGrade, setLateLowestGrade]       = useState('50')
  // Missing Policies
  const [autoAssignMissing, setAutoAssignMissing]   = useState(false)
  const [missingGradePct, setMissingGradePct]       = useState('0')
  // Posting Policies
  const [coursePostPolicy, setCoursePostPolicy] = useState<'automatic' | 'manual'>('manual')
  const [postFor, setPostFor]                   = useState<'everyone' | 'graded'>('graded')
  const [postSection, setPostSection]           = useState('all')
  const [postConfirmed, setPostConfirmed]       = useState(false)
  // Gradebook Settings (visual/display)
  const [columnSortOrder, setColumnSortOrder]         = useState('due-date')
  const [showUnpublished, setShowUnpublished]         = useState(false)
  const [showTotalColumn, setShowTotalColumn]         = useState(true)
  const [totalColumnSticky, setTotalColumnSticky]     = useState(true)

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

      <Tray
        label="Grading Configuration"
        open={settingsTrayOpen}
        onDismiss={() => { setSettingsTrayOpen(false); setSettingsPanel(null); setCreatingScheme(false) }}
        placement="end"
        size="small"
        shouldCloseOnDocumentClick
        themeOverride={{ padding: '0' } as object}
      >
        {/* eslint-disable instui/no-hardcoded-hex */}
        <View as="div" height="100%" display="block" background="primary" themeOverride={{ backgroundPrimary: containerBg }}>

          {/* ── Header ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
            {(settingsPanel || creatingScheme) && (
              <button
                type="button"
                onClick={() => creatingScheme ? setCreatingScheme(false) : setSettingsPanel(null)}
                style={{ display: 'flex', alignItems: 'center', padding: 4, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 4, color: '#576773', flexShrink: 0 }}
              >
                <span style={{ display: 'flex', transform: 'rotate(180deg)' }}><ChevronRightInstUIIcon size="x-small" /></span>
              </button>
            )}
            <Heading level="h3" margin="0" as="h2">
              {creatingScheme ? 'New Grading Scheme' : (settingsPanel ?? 'Grading Configuration')}
            </Heading>
            <div style={{ marginLeft: 'auto' }}>
              <IconButton screenReaderLabel="Close" color="secondary" size="small" withBackground={false} withBorder={false} renderIcon={<XInstUIIcon />} onClick={() => { setSettingsTrayOpen(false); setSettingsPanel(null) }} />
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div style={{ overflowY: 'auto', height: 'calc(100% - 53px)' }}>

            {/* ── Menu list ── */}
            {!settingsPanel && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  'Assignment Group Weights',
                  'Grading Schemes',
                  'Submission Policies',
                  'Posting Policies',
                  'Gradebook Settings',
                ].map((item, i, arr) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSettingsPanel(item)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 20px', background: 'none', border: 'none',
                      borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
                      color: '#273540', textAlign: 'left', width: '100%',
                    }}
                  >
                    {item}
                    <ChevronRightInstUIIcon size="x-small" color="secondary" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Assignment Group Weights ── */}
            {settingsPanel === 'Assignment Group Weights' && (() => {
              const totalWeight = assignmentGroups.reduce((sum, g) => sum + (parseFloat(g.weight) || 0), 0)
              const weightError = weightingEnabled && Math.round(totalWeight) !== 100
              return (
                <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Toggle row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Weight final grade by assignment group</div>
                      <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Each group contributes a set percentage to the overall grade.</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={weightingEnabled}
                      onClick={() => setWeightingEnabled(v => !v)}
                      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: weightingEnabled ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s' }}
                    >
                      <span style={{ position: 'absolute', top: 3, left: weightingEnabled ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                    </button>
                  </div>

                  {weightingEnabled && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Table header */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px 32px', gap: 8, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</span>
                        <span />
                      </div>

                      {/* Rows */}
                      {assignmentGroups.map(g => (
                        <div key={g.id} style={{ display: 'grid', gridTemplateColumns: '1fr 96px 32px', gap: 8, alignItems: 'center' }}>
                          <input
                            type="text"
                            value={g.name}
                            onChange={e => setAssignmentGroups(prev => prev.map(x => x.id === g.id ? { ...x, name: e.target.value } : x))}
                            style={{ fontSize: 13, padding: '6px 8px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                          />
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={g.weight}
                              onChange={e => setAssignmentGroups(prev => prev.map(x => x.id === g.id ? { ...x, weight: e.target.value } : x))}
                              style={{ fontSize: 13, padding: '6px 28px 6px 8px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'right' }}
                            />
                            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#576773', pointerEvents: 'none' }}>%</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAssignmentGroups(prev => prev.filter(x => x.id !== g.id))}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', color: '#8d959f' }}
                          >
                            <XInstUIIcon size="x-small" />
                          </button>
                        </div>
                      ))}

                      {/* Total + error */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: `1px solid ${border}` }}>
                        <button
                          type="button"
                          onClick={() => { setAssignmentGroups(prev => [...prev, { id: agNextId, name: 'New Group', weight: '0' }]); setAgNextId(v => v + 1) }}
                          style={{ fontSize: 13, color: '#0770a3', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0 }}
                        >
                          + Add group
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 700, color: weightError ? '#c54040' : '#03893D' }}>
                          Total: {totalWeight}%
                        </span>
                      </div>
                      {weightError && (
                        <div style={{ fontSize: 12, color: '#c54040', background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 6, padding: '8px 12px' }}>
                          {totalWeight < 100
                            ? `Add ${+(100 - totalWeight).toFixed(2)}% more to reach 100%.`
                            : `Remove ${+(totalWeight - 100).toFixed(2)}% to reach 100%.`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* ── Grading Schemes ── */}
            {settingsPanel === 'Grading Schemes' && !creatingScheme && (
              <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Show scores as */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Show scores as</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={showScoresAs}
                      onChange={e => setShowScoresAs(e.target.value)}
                      style={{ appearance: 'none', width: '100%', fontSize: 14, padding: '8px 32px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: containerBg, color: '#273540', cursor: 'pointer', outline: 'none' }}
                    >
                      {['Points', 'Percentages'].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', display: 'flex', color: '#576773' }}><ChevronRightInstUIIcon size="x-small" /></span>
                  </div>
                </div>

                {/* Scheme list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Active scheme</span>

                  {/* Default scheme */}
                  {[{ id: 'default' as const, name: 'Default Canvas Grading', rows: [['A','94–100%'],['A−','90–93%'],['B+','87–89%'],['B','84–86%'],['B−','80–83%'],['C+','77–79%'],['C','74–76%'],['C−','70–73%'],['D','60–69%'],['F','0–59%']] }, ...customSchemes.map(s => ({ id: s.id, name: s.name, rows: s.rows.map(r => [r.grade, `${r.minPct}%+`]) }))].map(scheme => {
                    const isActive = activeSchemeId === scheme.id
                    return (
                      <div key={String(scheme.id)} style={{ border: `2px solid ${isActive ? '#0770a3' : border}`, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', background: isActive ? '#e8f1fb' : containerBg }} onClick={() => setActiveSchemeId(scheme.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: isActive ? `1px solid #b8d4ef` : `1px solid ${border}`, background: isActive ? '#d0e6f8' : mutedBg }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${isActive ? '#0770a3' : border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0770a3' }} />}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#273540' }}>{scheme.name}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '8px 14px', gap: '2px 0' }}>
                          {(scheme.rows as string[][]).map(([grade, range]) => (
                            <div key={grade} style={{ display: 'contents' }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#273540', padding: '2px 0' }}>{grade}</span>
                              <span style={{ fontSize: 12, color: '#576773', padding: '2px 0', textAlign: 'right' }}>{range}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Add new scheme button */}
                <button
                  type="button"
                  onClick={() => { setNewSchemeName(''); setNewSchemeRows(DEFAULT_ROWS); setRowNextId(6); setCreatingScheme(true) }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#0770a3', background: 'none', border: `1px dashed #0770a3`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
                >
                  + Add new grading scheme
                </button>
              </div>
            )}

            {/* ── New Grading Scheme form ── */}
            {settingsPanel === 'Grading Schemes' && creatingScheme && (
              <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Scheme name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Scheme name</label>
                  <input
                    type="text"
                    placeholder="e.g. Honors Grading"
                    value={newSchemeName}
                    onChange={e => setNewSchemeName(e.target.value)}
                    style={{ fontSize: 14, padding: '8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Grade rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px 32px', gap: 8, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Min %</span>
                    <span />
                  </div>
                  {newSchemeRows.map(row => (
                    <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 96px 32px', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        value={row.grade}
                        placeholder="A"
                        onChange={e => setNewSchemeRows(prev => prev.map(r => r.id === row.id ? { ...r, grade: e.target.value } : r))}
                        style={{ fontSize: 13, padding: '6px 8px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                      />
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={row.minPct}
                          placeholder="0"
                          onChange={e => setNewSchemeRows(prev => prev.map(r => r.id === row.id ? { ...r, minPct: e.target.value } : r))}
                          style={{ fontSize: 13, padding: '6px 28px 6px 8px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'right' }}
                        />
                        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#576773', pointerEvents: 'none' }}>%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewSchemeRows(prev => prev.filter(r => r.id !== row.id))}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', color: '#8d959f' }}
                      >
                        <XInstUIIcon size="x-small" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setNewSchemeRows(prev => [...prev, { id: rowNextId, grade: '', minPct: '' }]); setRowNextId(v => v + 1) }}
                    style={{ fontSize: 13, color: '#0770a3', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0, textAlign: 'left' }}
                  >
                    + Add grade
                  </button>
                </div>

                {/* Save / Cancel */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 4, borderTop: `1px solid ${border}` }}>
                  <button
                    type="button"
                    onClick={() => setCreatingScheme(false)}
                    style={{ fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 4, border: `1px solid ${border}`, background: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#273540' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSchemeName.trim()) return
                      const id = schemeNextId
                      setCustomSchemes(prev => [...prev, { id, name: newSchemeName.trim(), rows: newSchemeRows }])
                      setSchemeNextId(v => v + 1)
                      setActiveSchemeId(id)
                      setCreatingScheme(false)
                    }}
                    style={{ fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 4, border: 'none', background: newSchemeName.trim() ? '#0770a3' : '#c7cdd1', color: '#fff', cursor: newSchemeName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                  >
                    Save scheme
                  </button>
                </div>
              </div>
            )}

            {/* ── Late Policies ── */}
            {settingsPanel === 'Submission Policies' && (
              <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Late Submissions</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Automatically deduct points</div>
                    <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Deduct a percentage from late submissions.</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoDeductLate}
                    onClick={() => setAutoDeductLate(v => !v)}
                    style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: autoDeductLate ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s', marginTop: 2 }}
                  >
                    <span style={{ position: 'absolute', top: 3, left: autoDeductLate ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                  </button>
                </div>
                {autoDeductLate && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Deduction</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={lateDeductPct}
                          onChange={e => setLateDeductPct(e.target.value)}
                          style={{ width: '100%', fontSize: 14, padding: '8px 28px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#576773', pointerEvents: 'none' }}>%</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Per</label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={lateDeductInterval}
                          onChange={e => setLateDeductInterval(e.target.value)}
                          style={{ appearance: 'none', width: '100%', fontSize: 14, padding: '8px 32px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: containerBg, color: '#273540', cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="Hour">Hour</option>
                          <option value="Day">Day</option>
                        </select>
                        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', display: 'flex', color: '#576773' }}><ChevronRightInstUIIcon size="x-small" /></span>
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Lowest possible grade</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={lateLowestGrade}
                          onChange={e => setLateLowestGrade(e.target.value)}
                          style={{ width: '100%', fontSize: 14, padding: '8px 28px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                        />
                        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#576773', pointerEvents: 'none' }}>%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ borderTop: `1px solid ${border}` }} />

                <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Missing Submissions</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Auto-assign missing submission grade</div>
                    <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Automatically set a grade for submissions marked missing.</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoAssignMissing}
                    onClick={() => setAutoAssignMissing(v => !v)}
                    style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: autoAssignMissing ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s', marginTop: 2 }}
                  >
                    <span style={{ position: 'absolute', top: 3, left: autoAssignMissing ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                  </button>
                </div>
                {autoAssignMissing && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Grade assigned</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={missingGradePct}
                        onChange={e => setMissingGradePct(e.target.value)}
                        style={{ width: '100%', fontSize: 14, padding: '8px 28px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: 'transparent', color: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#576773', pointerEvents: 'none' }}>%</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Posting Policies ── */}
            {settingsPanel === 'Posting Policies' && (
              <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Course-level policy */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Posting Policy</div>
                  <div style={{ fontSize: 12, color: '#576773' }}>Sets the default posting behavior for all assignments in this course. Individual assignments can override this setting.</div>
                  {([
                    {
                      value: 'automatic' as const,
                      label: 'Automatic',
                      desc: 'Grades are visible to students as soon as they are entered in the gradebook.',
                    },
                    {
                      value: 'manual' as const,
                      label: 'Manual',
                      desc: 'Grades are hidden from students by default. You must explicitly post grades to make them visible.',
                    },
                  ]).map(opt => {
                    const active = coursePostPolicy === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCoursePostPolicy(opt.value)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
                          border: `2px solid ${active ? '#0770a3' : border}`,
                          borderRadius: 8, cursor: 'pointer', background: active ? '#e8f1fb' : containerBg,
                          fontFamily: 'inherit', textAlign: 'left', width: '100%',
                          transition: 'border-color 0.12s, background 0.12s',
                        }}
                      >
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${active ? '#0770a3' : '#8d959f'}`, flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0770a3' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#273540', marginBottom: 2 }}>{opt.label}</div>
                          <div style={{ fontSize: 12, color: '#576773', lineHeight: 1.4 }}>{opt.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', background: mutedBg, borderRadius: 6, border: `1px solid ${border}` }}>
                    <InfoInstUIIcon size="x-small" color="secondary" />
                    <div style={{ fontSize: 12, color: '#576773', lineHeight: 1.4 }}>Anonymous assignments are always set to <strong>Manual</strong> to prevent accidental grade disclosure before grading is complete.</div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: `1px solid ${border}` }} />

                {/* Post grades action */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Post Grades Now</div>
                  <div style={{ fontSize: 12, color: '#576773' }}>Immediately release hidden grades to students. Choose which students and which section to post for.</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Post for</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {([['everyone', 'Everyone'], ['graded', 'Graded only']] as const).map(([val, lbl]) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPostFor(val)}
                          style={{
                            flex: 1, padding: '7px 0', fontSize: 13, fontWeight: 600, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
                            border: `1px solid ${postFor === val ? '#0770a3' : border}`,
                            background: postFor === val ? '#e8f1fb' : containerBg,
                            color: postFor === val ? '#0770a3' : '#576773',
                            transition: 'border-color 0.12s, background 0.12s',
                          }}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                    {postFor === 'graded' && (
                      <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Only students who have received a grade will have their grades posted.</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Section</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={postSection}
                        onChange={e => setPostSection(e.target.value)}
                        style={{ appearance: 'none', width: '100%', fontSize: 14, padding: '8px 32px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: containerBg, color: '#273540', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="all">All Sections</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', display: 'flex', color: '#576773' }}><ChevronRightInstUIIcon size="x-small" /></span>
                    </div>
                  </div>

                  {postConfirmed ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#f0fdf4', border: '1px solid #6ee7b7', borderRadius: 6 }}>
                      <CheckInstUIIcon size="x-small" color="success" />
                      <span style={{ fontSize: 13, color: '#03893d', fontWeight: 600 }}>Grades posted successfully.</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setPostConfirmed(true); setTimeout(() => setPostConfirmed(false), 3000) }}
                      style={{ padding: '9px 0', fontSize: 14, fontWeight: 600, borderRadius: 6, border: 'none', background: '#0770a3', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
                    >
                      Post Grades
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* ── Gradebook Settings ── */}
            {settingsPanel === 'Gradebook Settings' && (
              <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Column organization */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Column Organization</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Sort columns by</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={columnSortOrder}
                        onChange={e => setColumnSortOrder(e.target.value)}
                        style={{ appearance: 'none', width: '100%', fontSize: 14, padding: '8px 32px 8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: containerBg, color: '#273540', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="due-date">Due Date</option>
                        <option value="assignment-name">Assignment Name (A–Z)</option>
                        <option value="assignment-group">Assignment Group</option>
                        <option value="points">Points Possible</option>
                      </select>
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none', display: 'flex', color: '#576773' }}><ChevronRightInstUIIcon size="x-small" /></span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${border}` }} />

                {/* Unpublished assignments */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignments</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Show unpublished assignments</div>
                      <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Display assignments that have not yet been published to students. They appear with a dashed border in the gradebook.</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showUnpublished}
                      onClick={() => setShowUnpublished(v => !v)}
                      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: showUnpublished ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s', marginTop: 2 }}
                    >
                      <span style={{ position: 'absolute', top: 3, left: showUnpublished ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${border}` }} />

                {/* Total column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Column</div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Show total column</div>
                      <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Display the overall course grade column on the right side of the gradebook.</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={showTotalColumn}
                      onClick={() => setShowTotalColumn(v => !v)}
                      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: showTotalColumn ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s', marginTop: 2 }}
                    >
                      <span style={{ position: 'absolute', top: 3, left: showTotalColumn ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                    </button>
                  </div>

                  {showTotalColumn && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, paddingLeft: 12, borderLeft: `2px solid ${border}` }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Sticky total column</div>
                        <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Pin the total column to the right edge so it stays visible while scrolling horizontally.</div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={totalColumnSticky}
                        onClick={() => setTotalColumnSticky(v => !v)}
                        style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: totalColumnSticky ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s', marginTop: 2 }}
                      >
                        <span style={{ position: 'absolute', top: 3, left: totalColumnSticky ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: `1px solid ${border}` }} />

                {/* Student view */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student View</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#273540' }}>Hide grade totals from students</div>
                      <div style={{ fontSize: 12, color: '#576773', marginTop: 2 }}>Students will only see assignment scores, not their overall course grade.</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={hideGradeTotals}
                      onClick={() => setHideGradeTotals(v => !v)}
                      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', flexShrink: 0, background: hideGradeTotals ? '#0770a3' : '#c7cdd1', position: 'relative', transition: 'background 0.15s', marginTop: 2 }}
                    >
                      <span style={{ position: 'absolute', top: 3, left: hideGradeTotals ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', display: 'block' }} />
                    </button>
                  </div>
                </div>

              </div>
            )}


          </div>
        </View>
        {/* eslint-enable instui/no-hardcoded-hex */}
      </Tray>
    </View>
  )
}
