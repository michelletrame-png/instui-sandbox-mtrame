import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { Popover } from '@instructure/ui-popover/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { Breadcrumb } from '@instructure/ui-breadcrumb/latest'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  LayoutDashboardInstUIIcon,
  BookTextInstUIIcon,
  CalendarDaysInstUIIcon,
  InboxInstUIIcon,
  CircleHelpInstUIIcon,
  ClockInstUIIcon,
  ShieldUserInstUIIcon,
  SparklesInstUIIcon,
  CheckInstUIIcon,

  SendInstUIIcon,
  SettingsInstUIIcon,
  ChevronLeftInstUIIcon,
  ChevronRightInstUIIcon,
  ChevronDownInstUIIcon,
  IconCanvasLogoSolid,
  LibraryInstUIIcon,
  Mic2InstUIIcon,
  VideoInstUIIcon,
} from '@instructure/ui-icons'
import {
  type CellData, type Comment,
  STUDENTS, ASSIGNMENTS, RUBRIC_TEMPLATE, RUBRIC_MAX, ESSAY_CONTENT,
  seededRubricState, getScore, setScore, getStatus, setStatus, getRubricState, setRubricState,
} from './data'
import { CommentLibraryModal } from './CommentLibraryModal'
import type { PrototypeProps } from '../../registry'

// ── Submission viewer ──────────────────────────────────────────────────────────

function EssayViewer({ assignmentId, containerBg }: { assignmentId: string; containerBg: string }) {
  const body = ESSAY_CONTENT[assignmentId]
  if (!body) return (
    /* eslint-disable instui/no-style-border */
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
      <BookTextInstUIIcon size="large" color="mutedColor" />
      <Text color="secondary" size="small">No preview available for this submission type.</Text>
    </div>
    /* eslint-enable instui/no-style-border */
  )
  return (
    /* eslint-disable instui/no-style-border */
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 32px' }}>
      <View as="div" display="block" background="primary" themeOverride={{ backgroundPrimary: containerBg }} borderRadius="large" padding="x-large" borderWidth="small" shadow="resting">
        <Text size="medium">{body}</Text>
      </View>
    </div>
    /* eslint-enable instui/no-style-border */
  )
}

function SlidesViewer({ studentName, containerBg }: { studentName: string; containerBg: string }) {
  const slides = [
    { n: 1, header: 'TITLE',    title: 'Annotated Bibliography',  body: `Cellular Energetics & Metabolism\n\n${studentName}\nAI Ethics · Spring 2026` },
    { n: 2, header: 'SOURCE 1', title: 'Berg, Tymoczko & Stryer', body: 'Biochemistry, 8th ed. (2015). W.H. Freeman.\n\nFoundational coverage of metabolic pathways, particularly relevant for ATP synthesis and oxidative phosphorylation.' },
    { n: 3, header: 'SOURCE 2', title: 'Alberts et al.',          body: 'Molecular Biology of the Cell, 6th ed. (2014). Garland Science.\n\nChapter 14 covers chemiosmosis and ATP synthase.' },
  ]
  return (
    /* eslint-disable instui/no-style-border */
    <div style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'nowrap', overflowX: 'auto' }}>
        {slides.map(slide => (
          <View key={slide.n} as="div" display="block" background="primary" themeOverride={{ backgroundPrimary: containerBg }} borderWidth="small" borderRadius="large" overflowX="hidden" width="280px">
            {/* eslint-disable instui/no-hardcoded-hex */}
            <div style={{ padding: '5px 14px', background: '#0770A3' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{slide.header}</span>
            </div>
            {/* eslint-enable instui/no-hardcoded-hex */}
            <View as="div" display="block" padding="medium">
              <View as="div" display="block" margin="0 0 x-small 0"><Text weight="bold" size="small">{slide.title}</Text></View>
              <Text size="x-small" color="secondary">{slide.body}</Text>
            </View>
          </View>
        ))}
      </div>
    </div>
    /* eslint-enable instui/no-style-border */
  )
}

function IllustrationViewer({ studentName, border }: { studentName: string; border: string }) {
  const organelles = [
    { name: 'Nucleus',         color: '#3B82F6', bg: '#EFF6FF', note: 'Contains chromatin; coordinates cell activity via mRNA transcription.' },
    { name: 'Mitochondria',    color: '#EF4444', bg: '#FEF2F2', note: 'Site of oxidative phosphorylation; ~30 ATP per glucose.' },
    { name: 'Rough ER',        color: '#10B981', bg: '#F0FDF4', note: 'Ribosome-studded membrane; folds and translocates secretory proteins.' },
    { name: 'Golgi Apparatus', color: '#F59E0B', bg: '#FFFBEB', note: 'Modifies and sorts proteins; packages into transport vesicles.' },
    { name: 'Ribosome',        color: '#8B5CF6', bg: '#F5F3FF', note: 'Translates mRNA into protein; free ribosomes → cytosolic proteins.' },
    { name: 'Lysosome',        color: '#EC4899', bg: '#FFF1F2', note: 'Acid hydrolases digest worn organelles via autophagy.' },
  ]
  return (
    /* eslint-disable instui/no-hardcoded-hex */
    <div style={{ padding: '24px 32px', maxWidth: 720, margin: '0 auto' }}>
      <View as="div" display="block" margin="0 0 small 0">
        <Text weight="bold" size="small">Annotated Cell Diagram — {studentName}</Text>
      </View>
      <div style={{ borderRadius: 12, border: `2px solid ${border}`, padding: 20 }}>
        <Text size="x-small" color="secondary" transform="uppercase" letterSpacing="expanded">── Plasma Membrane ──</Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {organelles.map(org => (
            <div key={org.name} style={{ borderRadius: 8, padding: 10, background: org.bg, borderLeft: `3px solid ${org.color}`, flex: '1 1 calc(33% - 10px)', minWidth: 150 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: org.color }}>{org.name}</div>
              <div style={{ fontSize: 11, color: '#576773', marginTop: 3 }}>{org.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    /* eslint-enable instui/no-hardcoded-hex */
  )
}

function QuizViewer({ containerBg }: { containerBg: string; border?: string }) {
  const questions = [
    { n: 1, text: 'Which ethical framework judges actions solely by their consequences?',  answer: 'Consequentialism',                  correct: true  },
    { n: 2, text: 'Kant\'s categorical imperative requires that moral rules be:',           answer: 'Universalizable',                   correct: true  },
    { n: 3, text: 'Who introduced the concept of the "veil of ignorance"?',               answer: 'Peter Singer',                      correct: false, expected: 'John Rawls' },
    { n: 4, text: 'Virtue ethics focuses primarily on:',                                  answer: 'Character and habit',               correct: true  },
    { n: 5, text: 'What does "autonomy" mean in bioethics?',                              answer: 'Patient self-determination',         correct: true  },
    { n: 6, text: '"The ends justify the means" is most associated with:',                answer: 'Machiavelli / consequentialism',     correct: true  },
    { n: 7, text: 'Deontological ethics is primarily concerned with:',                    answer: 'Feelings and intuition',            correct: false, expected: 'Duties and rules' },
  ]
  const correctCount = questions.filter(q => q.correct).length
  return (
    /* eslint-disable instui/no-hardcoded-hex */
    <div style={{ padding: '24px 32px', maxWidth: 680, margin: '0 auto' }}>
      <View as="div" display="block" margin="0 0 medium 0">
        <Flex alignItems="center" gap="small">
          <Text weight="bold" size="medium">Quiz Results</Text>
          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>{correctCount}/{questions.length} correct</span>
        </Flex>
      </View>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {questions.map(q => (
          <div key={q.n} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${q.correct ? '#6EE7B7' : '#FCA5A5'}`, background: q.correct ? '#F0FDF4' : '#FEF2F2' }}>
            <View as="div" display="block" margin="0 0 xx-small 0">
              <Text size="small" weight="bold">{q.n}. {q.text}</Text>
            </View>
            <Flex alignItems="center" gap="x-small">
              <span style={{ fontSize: 12, color: q.correct ? '#059669' : '#DC2626', fontWeight: 600 }}>{q.correct ? '✓' : '✗'} {q.answer}</span>
              {'expected' in q && !q.correct && <Text size="x-small" color="secondary">· Expected: {q.expected}</Text>}
            </Flex>
          </div>
        ))}
      </div>
      <View as="div" display="block" margin="medium 0 0 0" borderWidth="small" borderRadius="medium" padding="small medium" background="primary" themeOverride={{ backgroundPrimary: containerBg }}>
        <Text size="x-small" color="secondary">Auto-graded · Submitted Apr 18, 11:42 AM</Text>
      </View>
    </div>
    /* eslint-enable instui/no-hardcoded-hex */
  )
}

// ── Student sort helpers ───────────────────────────────────────────────────────

export type StudentSort = 'last-name-asc' | 'last-name-desc' | 'submission-date' | 'status' | 'random' | 'random-by-status'

function getLastName(name: string): string {
  const parts = name.split(' ')
  return parts[parts.length - 1]
}

function submissionSortKey(submittedAt: string | undefined): number {
  if (!submittedAt) return Infinity
  const m = submittedAt.match(/\w+ (\d+), (\d+):(\d+) (AM|PM)/)
  if (!m) return Infinity
  let hour = parseInt(m[2])
  const min  = parseInt(m[3])
  if (m[4] === 'PM' && hour !== 12) hour += 12
  if (m[4] === 'AM' && hour === 12) hour = 0
  return parseInt(m[1]) * 10000 + hour * 100 + min
}

function shuffleArray(arr: number[], seed: number): number[] {
  const result = [...arr]
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 4294967296
  }
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Sort key: ungraded → late → graded → missing → excused (most → least actionable)
function studentSortKey(studentId: string, aIdx: number): number {
  const status = getStatus(studentId, aIdx)
  if (status === 'ungraded') return 0
  if (status === 'late')     return 1
  if (status === 'graded')   return 2
  if (status === 'missing')  return 3
  if (status === 'excused')  return 4
  return 5
}

/* eslint-disable instui/no-hardcoded-hex */
const PICKER_PILL: Record<string, { bg: string; color: string; label: string }> = {
  ungraded: { bg: '#EAECEC', color: '#586874', label: 'Ungraded' },
  late:     { bg: '#FDE8D4', color: '#CF4A00', label: 'Late'     },
  graded:   { bg: '#D6ECD9', color: '#03893D', label: 'Graded'   },
  missing:  { bg: '#FDE8E8', color: '#E62429', label: 'Missing'  },
  excused:  { bg: '#EDE9F8', color: '#6B40CC', label: 'Excused'  },
}
/* eslint-enable instui/no-hardcoded-hex */

function studentStatusPill(studentId: string, aIdx: number) {
  const status = getStatus(studentId, aIdx)
  const pill = PICKER_PILL[status]
  if (!pill) return null
  // Don't show "Ungraded" if the student hasn't submitted yet
  if (status === 'ungraded' && !STUDENTS.find(s => s.id === studentId)?.cells[aIdx].submittedAt) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 6px', fontSize: 10, fontWeight: 700, borderRadius: 10, background: pill.bg, color: pill.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {pill.label}
    </span>
  )
}

// ── StudentPicker ──────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: StudentSort; label: string }[] = [
  { value: 'last-name-asc',    label: 'Name A→Z' },
  { value: 'last-name-desc',   label: 'Name Z→A' },
  { value: 'submission-date',  label: 'By Date' },
  { value: 'status',           label: 'By Status' },
  { value: 'random',           label: 'Random' },
  { value: 'random-by-status', label: 'Random by Status' },
]

function StudentPicker({
  studentIdx, onSelectStudent, studentSort, onSortChange, onReshuffle,
  sortedStudentIndices, assignmentIdx, border, containerBg,
}: {
  studentIdx: number
  onSelectStudent: (idx: number) => void
  studentSort: StudentSort
  onSortChange: (sort: StudentSort) => void
  onReshuffle: () => void
  sortedStudentIndices: number[]
  assignmentIdx: number
  border: string
  containerBg: string
}) {
  const [open, setOpen] = useState(false)

  /* eslint-disable instui/no-hardcoded-hex */
  /* eslint-disable instui/no-style-border */
  return (
    <Popover
      renderTrigger={
        <button
          type="button"
          style={{
            fontSize: 14, fontWeight: 700, border: 'none', background: 'transparent',
            fontFamily: 'inherit', color: 'inherit', cursor: 'pointer', outline: 'none',
            display: 'flex', alignItems: 'center', gap: 4, padding: 0, flexShrink: 0,
          }}
        >
          {STUDENTS[studentIdx].name}
          <ChevronDownInstUIIcon size="x-small" color="secondary" />
        </button>
      }
      on="click"
      isShowingContent={open}
      onShowContent={() => setOpen(true)}
      onHideContent={() => setOpen(false)}
      placement="bottom start"
      shouldCloseOnDocumentClick
      withArrow={false}
      shadow="resting"
    >
      <View as="div" display="block" background="primary" themeOverride={{ backgroundPrimary: containerBg }} width="280px">
        {/* Sort section */}
        <View as="div" display="block" padding="small" borderWidth="0 0 small 0">
          <View as="div" display="block" margin="0 0 x-small 0">
            <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Sort</Text>
          </View>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {SORT_OPTIONS.map(opt => {
              const isActive = studentSort === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.value)
                    if (opt.value.startsWith('random')) onReshuffle()
                  }}
                  style={{
                    padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                    border: `1px solid ${isActive ? '#0770A3' : border}`,
                    background: isActive ? '#EBF5FF' : 'transparent',
                    color: isActive ? '#0770A3' : '#586874',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                  {opt.value.startsWith('random') && isActive ? ' ↺' : ''}
                </button>
              )
            })}
          </div>
        </View>
        {/* Student list */}
        <div style={{ maxHeight: 220, overflowY: 'auto' }}>
          {sortedStudentIndices.map(idx => {
            const isSelected = idx === studentIdx
            return (
              <div
                key={STUDENTS[idx].id}
                role="option"
                aria-selected={isSelected}
                onClick={() => { onSelectStudent(idx); setOpen(false) }}
                style={{
                  padding: '7px 12px', cursor: 'pointer', fontSize: 13,
                  borderLeft: `3px solid ${isSelected ? '#0770A3' : 'transparent'}`,
                  background: isSelected ? '#EBF5FF' : 'transparent',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#0770A3' : 'inherit',
                  boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}
              >
                <span>{STUDENTS[idx].name}</span>
                <span style={{ flexShrink: 0 }}>{studentStatusPill(STUDENTS[idx].id, assignmentIdx)}</span>
              </div>
            )
          })}
        </div>
      </View>
    </Popover>
  )
  /* eslint-enable instui/no-style-border */
  /* eslint-enable instui/no-hardcoded-hex */
}

// ── GradingWorkspace ───────────────────────────────────────────────────────────

export default function GradingWorkspaceMVP({ isDark, onToggleTheme }: PrototypeProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { sharedTokens } = useComputedTheme()

  /* eslint-disable instui/no-hardcoded-hex */
  const border      = sharedTokens.stroke.baseColor          ?? '#c7cdd1'
  const containerBg = sharedTokens.background.containerColor ?? '#ffffff'
  const pageBg      = sharedTokens.background.pageColor      ?? '#f5f7f8'
  const mutedBg     = sharedTokens.background.mutedColor     ?? '#f5f7f8'
  /* eslint-enable instui/no-hardcoded-hex */

  // Read URL params
  const initStudentId     = searchParams.get('s') ?? STUDENTS[0].id
  const initAssignmentIdx = Math.max(0, Math.min(parseInt(searchParams.get('a') ?? '0', 10), ASSIGNMENTS.length - 1))
  const isQueueMode       = searchParams.get('queue') === 'ungraded'

  const initStudentIdx = Math.max(0, STUDENTS.findIndex(s => s.id === initStudentId))

  const [studentIdx, setStudentIdx]             = useState(initStudentIdx)
  const [assignmentIdx, setAssignmentIdx]       = useState(initAssignmentIdx)
  const [studentSort, setStudentSort]           = useState<StudentSort>('last-name-asc')
  const [shuffleSeed, setShuffleSeed]           = useState(() => Math.floor(Math.random() * 99991) + 1)
  const [sidebarAssignment, setSidebarAssignment] = useState<string>(() =>
    isQueueMode ? 'all-ungraded' : ASSIGNMENTS[initAssignmentIdx].id
  )
  const [sidebarTab, setSidebarTab]             = useState<'ungraded' | 'graded' | 'missing'>('ungraded')
  const [sidebarOpen, setSidebarOpen]           = useState(true)
  const [rubric, setRubric]                     = useState<Record<string, number>>({})
  const userModifiedRubricRef = useRef(false)
  const [localScore, setLocalScore]             = useState<string>(() => getScore(initStudentId, initAssignmentIdx)?.toString() ?? '')
  const [gradeSaved, setGradeSaved]             = useState(false)
  const [pendingText, setPendingText]           = useState('')
  const [sendError, setSendError]               = useState(false)
  const [comments, setComments]                 = useState<Comment[]>([])
  const [saved, setSaved]                       = useState(false)
  const [gradingVersion, setGradingVersion]     = useState(0)
  const [libOpen, setLibOpen]                   = useState(false)
  const [mediaMsg, setMediaMsg]                 = useState<string | null>(null)
  const mediaMsgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevStudentIdxRef   = useRef(initStudentIdx)

  // Persist current position so gradebook can return to the same student/assignment
  useEffect(() => {
    sessionStorage.setItem('mvp-workspace-pos', JSON.stringify({
      s: STUDENTS[studentIdx]?.id ?? STUDENTS[0].id,
      a: assignmentIdx,
    }))
  }, [studentIdx, assignmentIdx])

  function showMediaMsg(msg: string) {
    if (mediaMsgTimer.current) clearTimeout(mediaMsgTimer.current)
    setMediaMsg(msg)
    mediaMsgTimer.current = setTimeout(() => setMediaMsg(null), 2500)
  }
  const prevAssignmentIdxRef = useRef(initAssignmentIdx)

  type SidebarItem = { studentIdx: number; assignmentIdx: number; key: string }

  // Build sidebar student list based on selected assignment filter
  const sidebarItems = useMemo((): SidebarItem[] => {
    if (sidebarAssignment === 'all-ungraded') {
      const items: SidebarItem[] = []
      ASSIGNMENTS.forEach((a, aIdx) => {
        if (!a.pastDue) return
        STUDENTS.forEach((s, sIdx) => {
          if (getStatus(s.id, aIdx) === 'ungraded' && s.cells[aIdx].submittedAt) {
            items.push({ studentIdx: sIdx, assignmentIdx: aIdx, key: `${sIdx}-${aIdx}` })
          }
        })
      })
      return items
    }
    const aIdx = ASSIGNMENTS.findIndex(a => a.id === sidebarAssignment)
    if (aIdx < 0) return []
    return STUDENTS.map((_, sIdx) => ({ studentIdx: sIdx, assignmentIdx: aIdx, key: `${sIdx}-${aIdx}` }))
  }, [sidebarAssignment, gradingVersion])

  const filteredSidebarItems = useMemo(() => {
    if (sidebarAssignment === 'all-ungraded') return sidebarItems
    return sidebarItems.filter(item =>
      getStatus(STUDENTS[item.studentIdx].id, item.assignmentIdx) === sidebarTab
    )
  }, [sidebarItems, sidebarTab, sidebarAssignment, gradingVersion])

  // Next ungraded submission after the current position (assignment-major order)
  const nextUngraded = useMemo(() => {
    for (let aIdx = 0; aIdx < ASSIGNMENTS.length; aIdx++) {
      if (!ASSIGNMENTS[aIdx].pastDue) continue
      for (let sIdx = 0; sIdx < STUDENTS.length; sIdx++) {
        if (aIdx < assignmentIdx || (aIdx === assignmentIdx && sIdx <= studentIdx)) continue
        const c = STUDENTS[sIdx].cells[aIdx]
        if (getStatus(STUDENTS[sIdx].id, aIdx) === 'ungraded' && c.submittedAt) {
          return { studentIdx: sIdx, assignmentIdx: aIdx }
        }
      }
    }
    return null
  }, [studentIdx, assignmentIdx, gradingVersion])

  const tabCounts = useMemo(() => {
    if (sidebarAssignment === 'all-ungraded') return null
    const aIdx = ASSIGNMENTS.findIndex(a => a.id === sidebarAssignment)
    if (aIdx < 0) return null
    return {
      ungraded: STUDENTS.filter(s => getStatus(s.id, aIdx) === 'ungraded').length,
      graded:   STUDENTS.filter(s => getStatus(s.id, aIdx) === 'graded').length,
      missing:  STUDENTS.filter(s => getStatus(s.id, aIdx) === 'missing').length,
    }
  }, [sidebarAssignment, gradingVersion])

  const sortedStudentIndices = useMemo(() => {
    const indices = STUDENTS.map((_, i) => i)
    switch (studentSort) {
      case 'last-name-asc':
        return [...indices].sort((a, b) =>
          getLastName(STUDENTS[a].name).localeCompare(getLastName(STUDENTS[b].name))
        )
      case 'last-name-desc':
        return [...indices].sort((a, b) =>
          getLastName(STUDENTS[b].name).localeCompare(getLastName(STUDENTS[a].name))
        )
      case 'submission-date':
        return [...indices].sort((a, b) =>
          submissionSortKey(STUDENTS[a].cells[assignmentIdx].submittedAt) -
          submissionSortKey(STUDENTS[b].cells[assignmentIdx].submittedAt)
        )
      case 'status':
        return [...indices].sort((a, b) => {
          const diff = studentSortKey(STUDENTS[a].id, assignmentIdx) - studentSortKey(STUDENTS[b].id, assignmentIdx)
          return diff !== 0 ? diff : getLastName(STUDENTS[a].name).localeCompare(getLastName(STUDENTS[b].name))
        })
      case 'random':
        return shuffleArray(indices, shuffleSeed)
      case 'random-by-status': {
        const groups: Record<number, number[]> = {}
        indices.forEach(i => {
          const key = studentSortKey(STUDENTS[i].id, assignmentIdx)
          if (!groups[key]) groups[key] = []
          groups[key].push(i)
        })
        return [0, 1, 2, 3, 4, 5].flatMap(key =>
          groups[key]?.length ? shuffleArray(groups[key], shuffleSeed + key) : []
        )
      }
      default:
        return indices
    }
  }, [studentSort, shuffleSeed, assignmentIdx, gradingVersion])

  // Sync assignmentIdx when sidebar assignment dropdown changes to a specific assignment
  useEffect(() => {
    if (sidebarAssignment === 'all-ungraded') return
    const aIdx = ASSIGNMENTS.findIndex(a => a.id === sidebarAssignment)
    if (aIdx >= 0) setAssignmentIdx(aIdx)
  }, [sidebarAssignment])

  const student    = STUDENTS[studentIdx]
  const assignment = ASSIGNMENTS[assignmentIdx]
  const cell: CellData = student.cells[assignmentIdx]

  // Reset grading state when student or assignment changes;
  // mark the previous submission as graded if a score was saved for it
  useEffect(() => {
    const prevSIdx = prevStudentIdxRef.current
    const prevAIdx = prevAssignmentIdxRef.current
    if (prevSIdx !== studentIdx || prevAIdx !== assignmentIdx) {
      const prevStudent = STUDENTS[prevSIdx]
      if (getScore(prevStudent.id, prevAIdx) !== undefined &&
          getStatus(prevStudent.id, prevAIdx) === 'ungraded') {
        setStatus(prevStudent.id, prevAIdx, 'graded')
        setGradingVersion(v => v + 1)
      }
    }
    prevStudentIdxRef.current = studentIdx
    prevAssignmentIdxRef.current = assignmentIdx

    userModifiedRubricRef.current = false
    if (assignment.hasRubric) {
      const stored = getRubricState(student.id, assignmentIdx)
      setRubric(stored !== undefined ? stored
        : getStatus(student.id, assignmentIdx) === 'ungraded' ? {}
        : seededRubricState(student.id))
    } else {
      setRubric({})
    }
    setLocalScore(getScore(student.id, assignmentIdx)?.toString() ?? '')
    setGradeSaved(false)
    setPendingText('')
    setSendError(false)
    setComments([])
    setSaved(false)
  }, [studentIdx, assignmentIdx, student.id])

  // Autosave for non-rubric grade input (debounced)
  useEffect(() => {
    if (assignment.hasRubric) return
    if (localScore === '') {
      const timer = setTimeout(() => {
        setScore(student.id, assignmentIdx, undefined)
        setStatus(student.id, assignmentIdx, 'ungraded')
        setGradeSaved(false)
        setGradingVersion(v => v + 1)
      }, 800)
      return () => clearTimeout(timer)
    }
    if (isNaN(Number(localScore))) return
    const n = Number(localScore)
    const timer = setTimeout(() => {
      setScore(student.id, assignmentIdx, n)
      if (getStatus(student.id, assignmentIdx) === 'ungraded') {
        setStatus(student.id, assignmentIdx, 'graded')
        setGradingVersion(v => v + 1)
      }
      setGradeSaved(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [localScore, assignment.hasRubric])

  // Debounced "Grade saved" indicator for rubric — score is written immediately in selectRubricLevel
  useEffect(() => {
    if (!assignment.hasRubric || !userModifiedRubricRef.current) return
    const timer = setTimeout(() => setSaved(true), 500)
    return () => clearTimeout(timer)
  }, [rubric, assignment.hasRubric])

  function selectRubricLevel(criterionId: string, idx: number) {
    const next = { ...rubric, [criterionId]: idx }
    const newTotal = RUBRIC_TEMPLATE.reduce((sum, c) => {
      const i = next[c.id]
      return sum + (i !== undefined ? c.levels[i].pts : 0)
    }, 0)
    setRubricState(student.id, assignmentIdx, next)
    setScore(student.id, assignmentIdx, newTotal)
    if (getStatus(student.id, assignmentIdx) === 'ungraded') {
      setStatus(student.id, assignmentIdx, 'graded')
      setGradingVersion(v => v + 1)
    }
    setRubric(next)
    userModifiedRubricRef.current = true
  }

  function sendComment() {
    const text = pendingText.trim()
    if (!text) { setSendError(true); return }
    setComments(prev => [...prev, { id: `c${Date.now()}`, author: 'Ms. Trame', role: 'teacher', text, time: 'Just now' }])
    setPendingText('')
    setSendError(false)
  }

  const rubricTotal = RUBRIC_TEMPLATE.reduce((sum, c) => {
    const idx = rubric[c.id]
    return sum + (idx !== undefined ? c.levels[idx].pts : 0)
  }, 0)


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
          <Flex direction="column" height="100%">

            {/* ── Breadcrumb + settings — outside card ── */}
            <View as="div" display="block" padding="x-small 0" margin="0 small 0 0">
              <Flex alignItems="center" justifyItems="space-between">
                <Breadcrumb label="Navigation">
                  <Breadcrumb.Link href="#">Courses</Breadcrumb.Link>
                  <Breadcrumb.Link href="#">BIOL-412</Breadcrumb.Link>
                  <Breadcrumb.Link onClick={() => navigate('/gradebook-mvp')}>Grades</Breadcrumb.Link>
                  <Breadcrumb.Link>{assignment.name}</Breadcrumb.Link>
                </Breadcrumb>
                <Flex alignItems="center" gap="x-small">
                  {/* eslint-disable instui/no-hardcoded-hex */}
                  <div style={{ display: 'flex', overflow: 'hidden', borderRadius: 9999, border: '1px solid #c7cdd1', width: 'fit-content' }}>
                    {(['Gradebook', 'Speedgrader'] as const).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { if (opt === 'Gradebook') navigate('/gradebook-mvp') }}
                        style={{
                          padding: '6px 20px', fontSize: 13, border: 'none', cursor: 'pointer',
                          transition: 'background 0.15s', fontFamily: 'inherit',
                          background: opt === 'Speedgrader' ? '#273540' : 'transparent',
                          color: opt === 'Speedgrader' ? '#fff' : '#273540',
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
                  />
                </Flex>
              </Flex>
            </View>

            {/* ── Card ── */}
            <Flex.Item shouldGrow shouldShrink overflowX="hidden" overflowY="hidden">
          <View as="div" display="block" height="100%" margin="0 small small 0" borderWidth="small" borderRadius={sharedTokens.borderRadius.card.lg} shadow="resting" background="primary" themeOverride={{ backgroundPrimary: containerBg }} overflowX="hidden" overflowY="hidden">
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* ── Body: student sidebar + viewer + grading panel ── */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

              {/* ── Student sidebar — removed for MVP ──────────────────────────────────
                   To restore: delete the `{false && (` line below and its matching
                   `)}` that appears just after the sidebar's closing </div>.
                   ─────────────────────────────────────────────────────────────── */}
              {false && (
              /* eslint-disable instui/no-style-border */
              <div style={{ width: sidebarOpen ? 240 : 48, flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${border}`, background: containerBg, overflow: 'hidden', transition: 'width 0.2s ease' }}>
              {/* eslint-enable instui/no-style-border */}

                {sidebarOpen ? (
                  <>
                    {/* Assignment dropdown + collapse button */}
                    {/* eslint-disable instui/no-style-border */}
                    <div style={{ padding: '10px 12px', borderBottom: `1px solid ${border}`, flexShrink: 0, background: mutedBg }}>
                    {/* eslint-enable instui/no-style-border */}
                      <Flex alignItems="center" justifyItems="space-between" margin="0 0 xx-small 0">
                        <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Assignment</Text>
                        <IconButton
                          screenReaderLabel="Collapse student list"
                          size="small"
                          color="secondary"
                          withBackground={false}
                          withBorder={false}
                          renderIcon={<ChevronLeftInstUIIcon />}
                          onClick={() => setSidebarOpen(false)}
                        />
                      </Flex>
                      {/* eslint-disable instui/no-style-border */}
                      <select
                        value={sidebarAssignment}
                        onChange={e => { setSidebarAssignment(e.target.value); setSidebarTab('ungraded') }}
                        style={{
                          width: '100%', fontSize: 12, padding: '6px 24px 6px 8px',
                          border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit',
                          background: `${containerBg} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23586874'/%3E%3C/svg%3E") no-repeat right 8px center`,
                          appearance: 'none', outline: 'none', cursor: 'pointer', color: 'inherit',
                        }}
                      >
                        <option value="all-ungraded">All Ungraded</option>
                        {ASSIGNMENTS.filter(a => a.pastDue).map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                      {/* eslint-enable instui/no-style-border */}
                    </div>

                    {/* Tabs (hidden in all-ungraded mode) */}
                    {sidebarAssignment !== 'all-ungraded' && (
                      /* eslint-disable instui/no-style-border */
                      <div style={{ display: 'flex', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
                      {/* eslint-enable instui/no-style-border */}
                        {(['ungraded', 'graded', 'missing'] as const).map(tab => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => setSidebarTab(tab)}
                            style={{
                              flex: 1, padding: '8px 4px', border: 'none', borderBottom: `2px solid ${sidebarTab === tab ? '#0770A3' : 'transparent'}`,
                              background: 'none', fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
                              color: sidebarTab === tab ? '#273540' : '#586874', cursor: 'pointer',
                              transition: 'color 0.1s', whiteSpace: 'nowrap',
                            }}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tabCounts && ` (${tabCounts[tab]})`}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Student list */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                      {filteredSidebarItems.length === 0 ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: '#586874' }}>
                          {sidebarTab === 'graded' ? 'No graded submissions.' : sidebarTab === 'missing' ? 'No missing submissions.' : 'All students graded.'}
                        </div>
                      ) : filteredSidebarItems.map(item => {
                        const s = STUDENTS[item.studentIdx]
                        const a = ASSIGNMENTS[item.assignmentIdx]
                        const c = s.cells[item.assignmentIdx]
                        const isActive = item.studentIdx === studentIdx && item.assignmentIdx === assignmentIdx
                        /* eslint-disable instui/no-hardcoded-hex */
                        return (
                          <div
                            key={item.key}
                            onClick={() => { setStudentIdx(item.studentIdx); setAssignmentIdx(item.assignmentIdx) }}
                            style={{
                              padding: '9px 12px', cursor: 'pointer',
                              borderBottom: '1px solid #f0f2f2',
                              borderLeft: isActive ? '3px solid #0770A3' : '3px solid transparent',
                              background: isActive ? '#E8F1FB' : 'transparent',
                              transition: 'background 0.1s',
                              boxSizing: 'border-box',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Avatar name={s.name} size="x-small" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 3 }}>
                                  {sidebarAssignment === 'all-ungraded' && (
                                    <span style={{ fontSize: 10, color: '#586874', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                                  )}
                                  {c.status === 'graded' && (
                                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 8px', background: '#D6ECD9', color: '#03893D' }}>{c.score}/{c.max} pts</span>
                                  )}
                                  {c.status === 'ungraded' && c.submittedAt && (
                                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 8px', background: '#EAECEC', color: '#586874' }}>Ungraded</span>
                                  )}
                                  {c.status === 'late' && (
                                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 8px', background: '#FDE8D4', color: '#CF4A00' }}>Late</span>
                                  )}
                                  {c.status === 'missing' && (
                                    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 8px', background: '#FDE8E8', color: '#E62429' }}>Missing</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                        /* eslint-enable instui/no-hardcoded-hex */
                      })}
                    </div>
                  </>
                ) : (
                  /* Collapsed: expand button + avatar strip */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 8, overflow: 'hidden' }}>
                    <IconButton
                      screenReaderLabel="Expand student list"
                      size="small"
                      color="secondary"
                      withBackground={false}
                      withBorder={false}
                      renderIcon={<ChevronRightInstUIIcon />}
                      onClick={() => setSidebarOpen(true)}
                    />
                    {/* eslint-disable instui/no-hardcoded-hex */}
                    <div style={{ width: '100%', overflowY: 'auto', flex: 1 }}>
                      {filteredSidebarItems.map(item => {
                        const s = STUDENTS[item.studentIdx]
                        const isActive = item.studentIdx === studentIdx && item.assignmentIdx === assignmentIdx
                        return (
                          <div
                            key={item.key}
                            title={s.name}
                            onClick={() => { setStudentIdx(item.studentIdx); setAssignmentIdx(item.assignmentIdx) }}
                            style={{
                              display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 0',
                              cursor: 'pointer', borderLeft: isActive ? '3px solid #0770A3' : '3px solid transparent',
                              background: isActive ? '#E8F1FB' : 'transparent',
                            }}
                          >
                            <Avatar name={s.name} size="x-small" />
                          </div>
                        )
                      })}
                    </div>
                    {/* eslint-enable instui/no-hardcoded-hex */}
                  </div>
                )}
              </div>
              )} {/* end student sidebar false && */}

              {/* Submission viewer */}
              <div style={{ flex: 1, overflowY: 'auto', background: mutedBg }}>

                {/* Submission header strip */}
                {/* eslint-disable instui/no-style-border */}
                <div style={{ padding: '8px 16px', background: containerBg, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* eslint-enable instui/no-style-border */}
                  {/* Student picker — sort + filter + name list in one */}
                  <StudentPicker
                    studentIdx={studentIdx}
                    onSelectStudent={setStudentIdx}
                    studentSort={studentSort}
                    onSortChange={setStudentSort}
                    onReshuffle={() => setShuffleSeed(s => s + 1)}
                    sortedStudentIndices={sortedStudentIndices}
                    assignmentIdx={assignmentIdx}
                    border={border}
                    containerBg={containerBg}
                  />

                  <span style={{ color: border, flexShrink: 0 }}>·</span>

                  {/* Assignment dropdown */}
                  {/* eslint-disable instui/no-style-border */}
                  <select
                    value={assignmentIdx}
                    onChange={e => setAssignmentIdx(Number(e.target.value))}
                    style={{
                      fontSize: 13, fontWeight: 600, border: 'none', background: 'transparent',
                      fontFamily: 'inherit', color: 'inherit', cursor: 'pointer', outline: 'none',
                      minWidth: 0,
                    }}
                  >
                    {ASSIGNMENTS.map((a, idx) => (
                      <option key={a.id} value={idx}>{a.name}</option>
                    ))}
                  </select>
                  {/* eslint-enable instui/no-style-border */}

                  {/* Submission info — right aligned */}
                  <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    {cell.submittedAt ? (
                      <Flex alignItems="center" gap="xx-small">
                        <ClockInstUIIcon size="x-small" color="mutedColor" />
                        <Text size="x-small" color="secondary">Submitted {cell.submittedAt}</Text>
                      </Flex>
                    ) : (
                      <Text size="x-small" color="secondary">Not yet submitted · Due {assignment.dueLabel}</Text>
                    )}
                  </div>
                </div>

                {/* Content */}
                {assignment.modality === 'essay'        && <EssayViewer assignmentId={assignment.id} containerBg={containerBg} />}
                {assignment.modality === 'slides'       && <SlidesViewer studentName={student.name} containerBg={containerBg} />}
                {assignment.modality === 'illustration' && <IllustrationViewer studentName={student.name} border={border} />}
                {assignment.modality === 'quiz'         && <QuizViewer containerBg={containerBg} border={border} />}
              </div>

              {/* ── Grading panel ── */}
              {/* eslint-disable instui/no-style-border */}
              <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${border}`, background: containerBg, overflowY: 'auto' }}>
              {/* eslint-enable instui/no-style-border */}


                {/* Rubric */}
                {/* eslint-disable instui/no-style-border */}
                {assignment.hasRubric && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                {/* eslint-enable instui/no-style-border */}
                  <Flex alignItems="center" justifyItems="space-between" margin="0 0 small 0">
                    <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Rubric</Text>
                    <Button
                      size="small"
                      color="secondary"
                      interaction={nextUngraded ? 'enabled' : 'disabled'}
                      onClick={() => {
                        if (nextUngraded) {
                          setStudentIdx(nextUngraded.studentIdx)
                          setAssignmentIdx(nextUngraded.assignmentIdx)
                        }
                      }}
                    >
                      Next
                    </Button>
                  </Flex>

                  {/* eslint-disable instui/no-hardcoded-hex */}
                  {/* Instructor Score bar */}
                  <div style={{ position: 'relative', background: mutedBg, borderRadius: 6, height: 48, overflow: 'hidden', border: `1px solid ${border}`, marginBottom: 16 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, fontSize: 13, color: '#273540' }}>Instructor Score</span>
                    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: '#0b874b', minWidth: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 14px' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>{rubricTotal} / {RUBRIC_MAX} pts</span>
                    </div>
                  </div>

                  {RUBRIC_TEMPLATE.map(criterion => {
                    const selectedIdx = rubric[criterion.id]
                    return (
                      <View as="div" display="block" margin="0 0 medium 0" key={criterion.id}>
                        <Flex alignItems="start" justifyItems="space-between" margin="0 0 xx-small 0">
                          <Text size="small" weight="bold">{criterion.label}</Text>
                          <Text size="x-small" color="secondary">{criterion.points} pts</Text>
                        </Flex>
                        <View as="div" display="block" margin="0 0 x-small 0">
                          <Text size="x-small" color="secondary">{criterion.description}</Text>
                        </View>
                        <div style={{ display: 'flex', gap: 8, marginBottom: selectedIdx !== undefined ? 8 : 0 }}>
                          {criterion.levels.map((level, idx) => {
                            const isSelected = selectedIdx === idx
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => selectRubricLevel(criterion.id, idx)}
                                style={{
                                  flex: 1, height: 48, minWidth: 0, borderRadius: 6, cursor: 'pointer',
                                  background: containerBg, fontFamily: 'inherit',
                                  border: isSelected ? `3px solid #0770A3` : `1px solid ${border}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  padding: '0 4px',
                                }}
                              >
                                <span style={{ fontSize: criterion.levels.length > 4 ? 14 : 18, fontWeight: 700, color: '#273540' }}>{level.pts}</span>
                              </button>
                            )
                          })}
                        </div>
                        {selectedIdx !== undefined && (
                          <div style={{ borderRadius: 8, border: `3px solid #0770A3`, padding: '10px 14px' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#273540', marginBottom: 3 }}>{criterion.levels[selectedIdx].label}</div>
                            <div style={{ fontSize: 12, color: '#586874' }}>{criterion.levels[selectedIdx].description}</div>
                          </div>
                        )}
                      </View>
                    )
                  })}
                  {/* eslint-enable instui/no-hardcoded-hex */}

                  {/* Total + Save */}
                  <View as="div" display="block" borderWidth="small 0 0 0" padding="medium 0 0 0">
                    <Flex alignItems="center" justifyItems="space-between" margin="0 0 small 0">
                      <Text size="small" weight="bold">Total</Text>
                      <Text size="large" weight="bold">{rubricTotal} / {RUBRIC_MAX} pts</Text>
                    </Flex>
                    {saved && (
                      <Flex alignItems="center" gap="x-small">
                        <CheckInstUIIcon size="x-small" color="accentGreenColor" />
                        <Text size="small" color="success">Grade saved</Text>
                      </Flex>
                    )}
                  </View>
                </div>
                )}


                {/* Feedback */}
                <div style={assignment.hasRubric
                  ? { padding: '16px 20px', flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 1, background: containerBg, borderTop: `1px solid ${border}` }
                  : { padding: '16px 20px', flex: 1 }
                }>
                  <View as="div" display="block" margin="0 0 small 0">
                    <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Feedback</Text>
                  </View>
                  {comments.length > 0 && (
                    <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {comments.map(c => (
                        /* eslint-disable instui/no-hardcoded-hex */
                        <div key={c.id} style={{ padding: 10, borderRadius: 8, background: mutedBg, borderLeft: '3px solid #0770A3' }}>
                          <Flex alignItems="center" justifyItems="space-between" margin="0 0 xx-small 0">
                            <Text size="x-small" weight="bold">{c.author}</Text>
                            <Text size="x-small" color="secondary">{c.time}</Text>
                          </Flex>
                          <Text size="small">{c.text}</Text>
                        </div>
                        /* eslint-enable instui/no-hardcoded-hex */
                      ))}
                    </div>
                  )}
                  {/* Feedback action row */}
                  <Flex gap="x-small" margin="0 0 x-small 0" wrap="wrap">
                    <Button size="small" renderIcon={<LibraryInstUIIcon />} onClick={() => setLibOpen(true)}>
                      Library
                    </Button>
                    <Button size="small" renderIcon={<Mic2InstUIIcon />} onClick={() => showMediaMsg('Audio recording — coming soon')}>
                      Audio
                    </Button>
                    <Button size="small" renderIcon={<VideoInstUIIcon />} onClick={() => showMediaMsg('Video recording — coming soon')}>
                      Video
                    </Button>
                  </Flex>
                  {mediaMsg && (
                    <View as="div" display="block" margin="0 0 x-small 0">
                      <Text size="x-small" color="secondary">{mediaMsg}</Text>
                    </View>
                  )}

                  {/* eslint-disable instui/no-style-border */}
                  <textarea
                    style={{
                      width: '100%', borderRadius: 8, padding: '8px 10px',
                      border: `1px solid ${sendError ? sharedTokens.stroke.errorColor : border}`,
                      fontSize: 13, resize: 'none', outline: 'none', minHeight: 72, fontFamily: 'inherit',
                      color: 'inherit', background: 'transparent', boxSizing: 'border-box',
                    }}
                    placeholder="Write feedback for this student…"
                    value={pendingText}
                    onChange={e => { setPendingText(e.target.value); if (sendError) setSendError(false) }}
                    rows={3}
                  />
                  {/* eslint-enable instui/no-style-border */}
                  {sendError && (
                    <View as="div" display="block" margin="xxx-small 0 0 0">
                      <Text size="x-small" color="danger">Please write a comment before sending.</Text>
                    </View>
                  )}

                  <View as="div" display="block" margin="x-small 0 0 0">
                    <Flex justifyItems="end" gap="x-small">
                      <Button color="secondary" size="small" renderIcon={<SendInstUIIcon />} onClick={sendComment}>
                        Send
                      </Button>
                      <Button
                        color="primary"
                        size="small"
                        renderIcon={pendingText.trim() ? <SendInstUIIcon /> : undefined}
                        onClick={() => {
                          if (pendingText.trim()) sendComment()
                          if (nextUngraded) {
                            setStudentIdx(nextUngraded.studentIdx)
                            setAssignmentIdx(nextUngraded.assignmentIdx)
                          }
                        }}
                      >
                        {pendingText.trim() ? 'Send + Next' : 'Next'}
                      </Button>
                    </Flex>
                  </View>

                  <CommentLibraryModal
                    open={libOpen}
                    onClose={() => setLibOpen(false)}
                    onInsert={text => setPendingText(prev => prev ? `${prev}\n\n${text}` : text)}
                  />
                </div>

                {/* Score / Grade section — non-rubric only, sticky to bottom */}
                {!assignment.hasRubric && (
                  /* eslint-disable instui/no-style-border */
                  <div style={{ position: 'sticky', bottom: 0, width: '100%', boxSizing: 'border-box', padding: '16px 20px', borderTop: `1px solid ${border}`, background: containerBg, flexShrink: 0, zIndex: 1 }}>
                  {/* eslint-enable instui/no-style-border */}
                    <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Grade</Text>
                    {/* eslint-disable instui/no-hardcoded-hex */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <input
                        type="number"
                        min={0}
                        max={cell.max}
                        value={localScore}
                        onChange={e => { setLocalScore(e.target.value); setGradeSaved(false) }}
                        style={{
                          width: 80, height: 44, fontSize: 22, fontWeight: 700, textAlign: 'center',
                          border: `2px solid ${localScore !== '' ? '#0770A3' : border}`,
                          borderRadius: 8, outline: 'none', fontFamily: 'inherit',
                          background: 'transparent', color: 'inherit',
                        }}
                        placeholder="—"
                      />
                      <Text size="medium" color="secondary">/ {cell.max} pts</Text>
                    </div>
                    {/* eslint-enable instui/no-hardcoded-hex */}
                    <Flex alignItems="center" justifyItems="space-between" margin="small 0 0 0">
                      {gradeSaved ? (
                        <Flex alignItems="center" gap="xx-small">
                          <CheckInstUIIcon size="x-small" color="accentGreenColor" />
                          <Text size="x-small" color="success">Saved</Text>
                        </Flex>
                      ) : <span />}
                      <Button
                        size="small"
                        color="primary"
                        interaction={nextUngraded ? 'enabled' : 'disabled'}
                        onClick={() => {
                          if (nextUngraded) {
                            setStudentIdx(nextUngraded.studentIdx)
                            setAssignmentIdx(nextUngraded.assignmentIdx)
                          }
                        }}
                      >
                        Next
                      </Button>
                    </Flex>
                  </div>
                )}

              </div>
            </div>

          </div>
          </View>
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </View>
  )
}
