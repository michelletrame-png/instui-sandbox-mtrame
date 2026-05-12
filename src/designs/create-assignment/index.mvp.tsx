/* eslint-disable instui/no-hardcoded-hex */
import React from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { SideNavBar } from '@instructure/ui-side-nav-bar/latest'
import { Avatar } from '@instructure/ui-avatar/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  LayoutDashboardInstUIIcon, BookTextInstUIIcon, CalendarDaysInstUIIcon,
  InboxInstUIIcon, CircleHelpInstUIIcon, SparklesInstUIIcon,
  ChevronDownInstUIIcon, ChevronRightInstUIIcon, XInstUIIcon,
  SettingsInstUIIcon, MoreHorizontalInstUIIcon,
  BoldInstUIIcon, ItalicInstUIIcon, UnderlineInstUIIcon,
  LinkInstUIIcon, ImageInstUIIcon, CodeInstUIIcon, Maximize2InstUIIcon,
  GripVerticalInstUIIcon, KeyboardInstUIIcon, AlignLeftInstUIIcon,
  ListInstUIIcon, IndentInstUIIcon, CheckInstUIIcon,
  FileTextInstUIIcon, ShieldInstUIIcon, LockInstUIIcon,
  PlusInstUIIcon, CheckCheckInstUIIcon,
  FilePlusInstUIIcon, PenLineInstUIIcon,
  AlignJustifyInstUIIcon, CopyInstUIIcon,
  EyeInstUIIcon,
  ClipboardListInstUIIcon, FolderOpenInstUIIcon, MessageCircleInstUIIcon, RocketInstUIIcon,
  IconCanvasLogoSolid,
} from '@instructure/ui-icons'
import type { PrototypeProps } from '../../registry'

// ── Mock data ─────────────────────────────────────────────────────────────────

const ASSIGNMENT_GROUPS = [
  'Essays', 'Homework', 'In-class Activities',
  'Participation', 'Quizzes', 'Projects', 'Final Exam',
]

// ── Shared helpers ────────────────────────────────────────────────────────────


function MiniSelect({ label, value, options, onChange, disabled = false }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState({ top: 0, left: 0, width: 0 })
  const ref = React.useRef<HTMLDivElement>(null)
  const btnRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open || disabled) return
    function handler(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open, disabled])

  function toggle() {
    if (disabled) return
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    setOpen(v => !v)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} ref={ref}>
      <label style={{ fontSize: 13, fontWeight: 500, color: disabled ? '#9aa5ae' : '#273540' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <button ref={btnRef} type="button" onClick={toggle} disabled={disabled} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '8px 12px', borderRadius: 12, textAlign: 'left',
          background: disabled ? '#f5f7f8' : '#fff',
          border: `1.2px solid ${disabled ? '#d7dade' : open ? '#2b7abc' : '#6a7883'}`,
          boxShadow: open && !disabled ? '0 0 0 3px rgba(43,122,188,0.12)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}>
          <span style={{ fontSize: 13, color: disabled ? '#9aa5ae' : '#273540' }}>{value}</span>
          <span style={{ display: 'flex', flexShrink: 0, color: disabled ? '#9aa5ae' : '#273540', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <ChevronDownInstUIIcon size="x-small" />
          </span>
        </button>
        {open && !disabled && (
          <div style={{
            position: 'fixed', top: pos.top, left: pos.left, width: pos.width,
            zIndex: 9999, background: '#fff', border: '1px solid #d7dade',
            borderRadius: 12, boxShadow: '0 4px 12px rgba(39,53,64,0.12)', overflow: 'hidden',
          }}>
            {options.map(opt => (
              <button key={opt} type="button" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 16px', fontSize: 13, textAlign: 'left',
                border: 'none', background: 'transparent', cursor: 'pointer', color: '#273540',
              }}
                onPointerDown={e => { e.preventDefault(); onChange(opt); setOpen(false) }}
              >
                {opt}
                {opt === value && <span style={{ display: 'flex', color: '#2b7abc', flexShrink: 0 }}><CheckInstUIIcon size="x-small" /></span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Coming Soon badge ─────────────────────────────────────────────────────────

function ComingSoonBadge({ label = 'Coming in V2' }: { label?: string } = {}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 7px',
      borderRadius: 9999, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
      textTransform: 'uppercase' as const,
      background: '#f5f7f8', color: '#6a7883', border: '1px solid #d7dade',
    }}>
      {label}
    </span>
  )
}

// ── Editable title ────────────────────────────────────────────────────────────

function EditableTitle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function startEdit() { setDraft(value); setEditing(true); setTimeout(() => inputRef.current?.select(), 0) }
  function commit() { onChange(draft.trim() || 'Untitled coursework'); setEditing(false) }

  if (editing) {
    return (
      <input ref={inputRef} autoFocus
        style={{ fontSize: 20, fontWeight: 600, background: 'transparent', outline: 'none', border: 'none', borderBottom: '2px solid #2b7abc', minWidth: 0, width: '100%', maxWidth: 448, color: '#273540' }}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: '#273540', margin: 0 }}>{value}</h1>
      <button type="button" onClick={startEdit} title="Edit title" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
        borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer',
      }}>
        <span style={{ display: 'flex', color: '#273540' }}><PenLineInstUIIcon size="x-small" /></span>
      </button>
    </div>
  )
}

// ── RCE ───────────────────────────────────────────────────────────────────────

const RCE_MENUS = ['Edit', 'View', 'Insert', 'Format', 'Tools', 'Table']

function RichContentEditor() {
  const [wordCount, setWordCount] = React.useState(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #c7cdd1', borderRadius: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 12px', borderBottom: '1px solid #e8eaec', flexWrap: 'wrap' }}>
        {RCE_MENUS.map(m => (
          <button key={m} style={{ fontSize: 15, background: 'transparent', border: 'none', cursor: 'pointer', color: '#2d3b45' }}>{m}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 12px', borderBottom: '1px solid #e8eaec', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer', color: '#2d3b45', userSelect: 'none' }}>
          12pt <span style={{ display: 'flex' }}><ChevronDownInstUIIcon size="x-small" /></span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer', color: '#2d3b45', userSelect: 'none' }}>
          Paragraph <span style={{ display: 'flex' }}><ChevronDownInstUIIcon size="x-small" /></span>
        </span>
        <div style={{ width: 1, height: 24, background: '#8b969e' }} />
        {[BoldInstUIIcon, ItalicInstUIIcon, UnderlineInstUIIcon].map((Icon, i) => (
          <button key={i} style={{ display: 'flex', padding: 4, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Icon size="x-small" />
          </button>
        ))}
        <div style={{ width: 1, height: 24, background: '#8b969e' }} />
        {[LinkInstUIIcon, ImageInstUIIcon].map((Icon, i) => (
          <button key={i} style={{ display: 'flex', padding: 4, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Icon size="x-small" />
          </button>
        ))}
        <div style={{ width: 1, height: 24, background: '#8b969e' }} />
        {[AlignLeftInstUIIcon, ListInstUIIcon, IndentInstUIIcon].map((Icon, i) => (
          <button key={i} style={{ display: 'flex', padding: 4, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Icon size="x-small" />
          </button>
        ))}
      </div>
      <textarea
        style={{ width: '100%', resize: 'none', padding: '8px 12px', fontSize: 15, border: 'none', outline: 'none', background: '#fff', color: '#2d3b45', minHeight: 160, boxSizing: 'border-box' }}
        placeholder="Form text"
        onChange={e => setWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length)}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '8px 12px', borderTop: '1px solid #e8eaec' }}>
        <span style={{ display: 'flex', color: '#2d3b45' }}><KeyboardInstUIIcon size="x-small" /></span>
        <div style={{ width: 1, height: 20, background: '#8b969e' }} />
        <span style={{ fontSize: 13, color: '#2d3b45' }}>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
        <div style={{ width: 1, height: 20, background: '#8b969e' }} />
        {[CodeInstUIIcon, Maximize2InstUIIcon, GripVerticalInstUIIcon].map((Icon, i) => (
          <button key={i} style={{ display: 'flex', padding: 2, border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Icon size="x-small" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Grading tab ───────────────────────────────────────────────────────────────

type OnlineOptions = { textEntry: boolean; websiteUrl: boolean; fileUploads: boolean; mediaRecording: boolean }

function CheckRow({ label, checked, onChange, note }: {
  label: string; checked: boolean; onChange: () => void; note?: string
}) {
  return (
    <button type="button" onClick={onChange} style={{
      display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', padding: '12px 16px',
      textAlign: 'left', border: 'none', cursor: 'pointer', background: 'transparent',
      borderBottom: '1px solid #e8eaec',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16,
        marginTop: 2, borderRadius: 3, flexShrink: 0,
        border: checked ? 'none' : '1.5px solid #6a7883',
        background: checked ? '#2b7abc' : 'transparent',
      }}>
        {checked && <span style={{ display: 'flex', color: '#fff' }}><CheckInstUIIcon size="x-small" /></span>}
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#273540' }}>{label}</div>
        {note && <div style={{ fontSize: 11, marginTop: 2, color: '#6a7883' }}>{note}</div>}
      </div>
    </button>
  )
}

function GradingTab({ rubricActive, rubricTotalPoints, rubricNotForGrading, validateRef }: { rubricActive: boolean; rubricTotalPoints: number; rubricNotForGrading: boolean; validateRef?: React.MutableRefObject<(() => boolean) | null> }) {
  const [points, setPoints] = React.useState('10')
  const [displayScore, setDisplayScore] = React.useState('Letter Grade')
  const [assignmentGroup, setAssignmentGroup] = React.useState('Essays')
  const [doNotCount, setDoNotCount] = React.useState(false)
  const [submissionType, setSubmissionType] = React.useState('online')
  const [onlineOptions, setOnlineOptions] = React.useState<OnlineOptions>({ textEntry: true, websiteUrl: false, fileUploads: true, mediaRecording: false })
  const [allowedExtensions, setAllowedExtensions] = React.useState('')
  const [attemptsExpanded, setAttemptsExpanded] = React.useState(false)
  const [submissionsBeforeDue, setSubmissionsBeforeDue] = React.useState('Unlimited')
  const [numberOfAttempts, setNumberOfAttempts] = React.useState('3')
  const [policiesExpanded, setPoliciesExpanded] = React.useState(false)
  const [gradePosting, setGradePosting] = React.useState<'Automatic' | 'Manual' | 'Scheduled'>('Manual')
  const [gradePostingSchedule, setGradePostingSchedule] = React.useState('')
  const [pointsError, setPointsError] = React.useState(false)
  const [rubricClickError, setRubricClickError] = React.useState(false)
  const [onlineOptionsError, setOnlineOptionsError] = React.useState(false)
  const onlineOptionsRef = React.useRef<HTMLDivElement>(null)

  const isCompleteIncomplete = displayScore === 'Complete/Incomplete'
  const gradingDefaultsSummary =
    submissionsBeforeDue !== 'Limited' ? 'Unlimited submissions' : `Limited submissions before due date`
  const policiesSummary = `Grade posting: ${gradePosting}`

  const noOnlineOptionSelected = submissionType === 'online' && !Object.values(onlineOptions).some(Boolean)

  React.useEffect(() => {
    if (validateRef) {
      validateRef.current = () => {
        if (noOnlineOptionSelected) {
          setOnlineOptionsError(true)
          onlineOptionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return false
        }
        return true
      }
    }
  }) // eslint-disable-line react-hooks/exhaustive-deps

  // Clear error when a valid selection is made
  React.useEffect(() => {
    if (!noOnlineOptionSelected) setOnlineOptionsError(false)
  }, [noOnlineOptionSelected])

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#273540', margin: 0 }}>Grading &amp; Submission</h1>
        <p style={{ fontSize: 13, color: '#6a7883', margin: 0 }}>Define how this assignment will be graded and what submission types are accepted</p>
      </div>

      {/* Score */}
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e8eaec' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8eaec' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#273540', margin: 0 }}>Score</h2>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: (rubricActive && !rubricNotForGrading || isCompleteIncomplete) ? '#9aa5ae' : '#273540' }}>Points</label>
              {isCompleteIncomplete ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    onClick={() => setPointsError(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 12, cursor: 'not-allowed', background: '#f5f7f8', border: `1.2px solid ${pointsError ? '#c51827' : '#d7dade'}`, boxShadow: pointsError ? '0 0 0 3px rgba(197,24,39,0.1)' : 'none' }}>
                    <span style={{ fontSize: 13, color: '#9aa5ae', letterSpacing: 2 }}>——</span>
                  </div>
                  {pointsError && (
                    <p style={{ fontSize: 11, color: '#c51827', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Complete/incomplete assignments don't have points
                    </p>
                  )}
                </div>
              ) : rubricActive && !rubricNotForGrading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div
                    onClick={() => setRubricClickError(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 12, cursor: 'not-allowed', background: '#f5f7f8', border: `1.2px solid ${rubricClickError ? '#c51827' : '#d7dade'}`, boxShadow: rubricClickError ? '0 0 0 3px rgba(197,24,39,0.1)' : 'none' }}>
                    <span style={{ display: 'flex', color: '#9aa5ae', flexShrink: 0 }}><LockInstUIIcon size="x-small" /></span>
                    <span style={{ fontSize: 13, color: '#9aa5ae' }}>{rubricTotalPoints}</span>
                  </div>
                  {rubricClickError ? (
                    <p style={{ fontSize: 11, color: '#c51827', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Return to the rubric screen to edit assignment points
                    </p>
                  ) : (
                    <p style={{ fontSize: 11, fontStyle: 'italic', color: '#6a7883', margin: 0 }}>Score determined by rubric</p>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <input type="number" min={0} value={points} onChange={e => setPoints(e.target.value)}
                    style={{ padding: '8px 12px', fontSize: 13, borderRadius: 12, border: '1.2px solid #6a7883', color: '#273540', background: '#fff', outline: 'none' }} />
                  {rubricActive && rubricNotForGrading && (
                    <p style={{ fontSize: 11, fontStyle: 'italic', color: '#6a7883', margin: 0 }}>Rubric is not used for grading — set points manually</p>
                  )}
                </div>
              )}
            </div>
            <MiniSelect label="Display score as" value={displayScore} options={['Number', 'Percentage', 'Letter Grade', 'Complete/Incomplete']} onChange={v => { setDisplayScore(v); setPointsError(false) }} />
          </div>
          <button type="button" onClick={() => setDoNotCount(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 3, flexShrink: 0,
              border: doNotCount ? 'none' : '1.5px solid #6a7883', background: doNotCount ? '#2b7abc' : 'transparent',
            }}>
              {doNotCount && <span style={{ display: 'flex', color: '#fff' }}><CheckInstUIIcon size="x-small" /></span>}
            </div>
            <span style={{ fontSize: 13, color: '#273540' }}>Do not count this assignment towards the final grade</span>
          </button>
        </div>
      </div>

      {/* Assignment Group */}
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e8eaec' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8eaec' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#273540', margin: 0 }}>Assignment Group</h2>
        </div>
        <div style={{ padding: 16 }}>
          <MiniSelect
            label="Assignment group"
            value={assignmentGroup}
            options={ASSIGNMENT_GROUPS}
            onChange={setAssignmentGroup}
          />
        </div>
      </div>

      {/* Submission types */}
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e8eaec' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8eaec' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#273540', margin: 0 }}>Submission types</h2>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', overflow: 'hidden', borderRadius: 9999, border: '1px solid #d7dade', width: 'fit-content' }}>
            {(['online', 'external', 'on-paper', 'none'] as const).map(type => (
              <button key={type} type="button" onClick={() => setSubmissionType(type)} style={{
                padding: '6px 20px', fontSize: 13, border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                background: submissionType === type ? '#273540' : 'transparent',
                color: submissionType === type ? '#fff' : '#273540',
              }}>
                {type === 'online' ? 'Online' : type === 'external' ? 'External tool' : type === 'on-paper' ? 'On paper' : 'No submission'}
              </button>
            ))}
          </div>
          {submissionType === 'online' && (
            <div ref={onlineOptionsRef}>
              <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${onlineOptionsError ? '#c51827' : '#e8eaec'}`, boxShadow: onlineOptionsError ? '0 0 0 3px rgba(197,24,39,0.1)' : 'none' }}>
              <div style={{ padding: '8px 16px', borderBottom: `1px solid ${onlineOptionsError ? '#f5c2c7' : '#e8eaec'}`, background: onlineOptionsError ? '#fff5f5' : '#f9f9f9' }}>
                <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: onlineOptionsError ? '#c51827' : '#6a7883' }}>Online submission options</span>
              </div>
              <CheckRow label="Text entry" checked={onlineOptions.textEntry} onChange={() => setOnlineOptions(o => ({ ...o, textEntry: !o.textEntry }))} />
              <CheckRow label="Website URL" checked={onlineOptions.websiteUrl} onChange={() => setOnlineOptions(o => ({ ...o, websiteUrl: !o.websiteUrl }))} />
              <CheckRow label="Media recording" checked={onlineOptions.mediaRecording} onChange={() => setOnlineOptions(o => ({ ...o, mediaRecording: !o.mediaRecording }))} />
              <CheckRow label="File upload(s)" checked={onlineOptions.fileUploads} onChange={() => setOnlineOptions(o => ({ ...o, fileUploads: !o.fileUploads }))} />
              {onlineOptions.fileUploads && (
                <div style={{ padding: '12px 16px 14px 44px', borderBottom: '1px solid #e8eaec', background: '#fafafa' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#576773', marginBottom: 6 }}>
                    Allowed file types <span style={{ fontWeight: 400, color: '#9aa5ae' }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={allowedExtensions}
                    onChange={e => setAllowedExtensions(e.target.value)}
                    placeholder="e.g. pdf, docx, png"
                    style={{ width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 8, border: '1px solid #d7dade', outline: 'none', color: '#273540', background: '#fff', boxSizing: 'border-box' as const }}
                  />
                  <p style={{ fontSize: 11, color: '#9aa5ae', margin: '5px 0 0' }}>Enter extensions separated by commas. Leave blank to allow all file types.</p>
                </div>
              )}
            </div>
            {onlineOptionsError && (
              <p style={{ fontSize: 12, color: '#c51827', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                At least one online submission type must be selected
              </p>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Grading Defaults */}
      {!attemptsExpanded ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 16, background: '#f5f7f8', border: '1px solid #e8eaec' }}>
          <span style={{ display: 'flex', color: '#576773', flexShrink: 0, marginTop: 2 }}><FileTextInstUIIcon size="x-small" /></span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6a7883' }}>Grading Defaults</span>
            <p style={{ fontSize: 13, color: '#273540', margin: 0 }}>{gradingDefaultsSummary}</p>
          </div>
          <button type="button" onClick={() => setAttemptsExpanded(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ display: 'flex', color: '#576773' }}><PenLineInstUIIcon size="x-small" /></span>
          </button>
        </div>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e8eaec' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e8eaec' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#273540', margin: 0 }}>Grading Defaults</h2>
            <button type="button" onClick={() => setAttemptsExpanded(false)} style={{ fontSize: 12, fontWeight: 500, color: '#2b7abc', border: 'none', background: 'transparent', cursor: 'pointer' }}>Done</button>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#576773', margin: 0 }}>Attempts</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <MiniSelect label="Submissions before due date" value={submissionsBeforeDue} options={['Unlimited', 'Limited']} onChange={setSubmissionsBeforeDue} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: submissionsBeforeDue !== 'Limited' ? '#9aa5ae' : '#273540' }}>Number of attempts</label>
                <input type="number" min={1} value={submissionsBeforeDue !== 'Limited' ? '' : numberOfAttempts}
                  onChange={e => setNumberOfAttempts(e.target.value)} disabled={submissionsBeforeDue !== 'Limited'} placeholder="—"
                  style={{ padding: '8px 12px', fontSize: 13, borderRadius: 12, border: `1.2px solid ${submissionsBeforeDue !== 'Limited' ? '#d7dade' : '#6a7883'}`, background: submissionsBeforeDue !== 'Limited' ? '#f5f7f8' : '#fff', color: submissionsBeforeDue !== 'Limited' ? '#9aa5ae' : '#273540', cursor: submissionsBeforeDue !== 'Limited' ? 'not-allowed' : 'text', outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade posting policies */}
      {!policiesExpanded ? (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 16, background: '#f5f7f8', border: '1px solid #e8eaec' }}>
          <span style={{ display: 'flex', color: '#576773', flexShrink: 0, marginTop: 2 }}><ShieldInstUIIcon size="x-small" /></span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6a7883' }}>Grade posting policies</span>
            <p style={{ fontSize: 13, color: '#273540', margin: 0 }}>{policiesSummary}</p>
          </div>
          <button type="button" onClick={() => setPoliciesExpanded(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ display: 'flex', color: '#576773' }}><PenLineInstUIIcon size="x-small" /></span>
          </button>
        </div>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid #e8eaec' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e8eaec' }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: '#273540', margin: 0 }}>Grade posting policies</h2>
            <button type="button" onClick={() => setPoliciesExpanded(false)} style={{ fontSize: 12, fontWeight: 500, color: '#2b7abc', border: 'none', background: 'transparent', cursor: 'pointer' }}>Done</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {([
              { value: 'Automatic', label: 'Automatic', hint: 'Grades posted when entered' },
              { value: 'Manual',    label: 'Manual',    hint: 'Grades hidden until manual release' },
              { value: 'Scheduled', label: 'Scheduled', hint: 'Choose a day and time to release grades' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGradePosting(opt.value)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', border: 'none', borderBottom: '1px solid #e8eaec', background: gradePosting === opt.value ? '#f0f6fc' : 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1, border: `2px solid ${gradePosting === opt.value ? '#0770a3' : '#6a7883'}`, background: gradePosting === opt.value ? '#0770a3' : 'transparent' }}>
                  {gradePosting === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>{opt.label}</span>
                  <span style={{ fontSize: 12, color: '#6a7883' }}>{opt.hint}</span>
                </div>
              </button>
            ))}
            {gradePosting === 'Scheduled' && (
              <div style={{ padding: '14px 16px' }}>
                <DateField label="Release grades on" value={gradePostingSchedule} onChange={setGradePostingSchedule} />
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

function PillSelector({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>{label}</label>
      <div style={{ display: 'flex', overflow: 'hidden', borderRadius: 9999, border: '1px solid #d7dade', width: 'fit-content' }}>
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onChange(opt)} style={{
            padding: '6px 20px', fontSize: 13, border: 'none', cursor: 'pointer',
            transition: 'background 0.15s', fontFamily: 'inherit',
            background: value === opt ? '#273540' : 'transparent',
            color: value === opt ? '#fff' : '#273540',
          }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Rubric tab ────────────────────────────────────────────────────────────────

type V1Rating = { id: string; name: string; desc: string; pts: number }
type V1Criterion = { id: string; name: string; desc: string; ratings: V1Rating[]; maxPts?: number }

function rangeLabel(ratings: V1Rating[], ratingId: string, useDecimals = false): string {
  const sorted = [...ratings].sort((a, b) => b.pts - a.pts)
  const idx = sorted.findIndex(r => r.id === ratingId)
  if (idx < 0) return ''
  const top = sorted[idx].pts
  if (idx === sorted.length - 1) return top === 0 ? '0' : `0 – ${top}`
  if (useDecimals) {
    const lb = sorted[idx + 1].pts + 0.01
    return `${Number.isInteger(lb) ? lb : lb.toFixed(2)} – ${top}`
  }
  const lb = sorted[idx + 1].pts + 1
  return `${lb} – ${top}`
}

const V1_INITIAL_CRITERIA: V1Criterion[] = [
  { id: 'c1', name: 'Sample Criterion', desc: 'Sample Description', maxPts: 20, ratings: [
    { id: 'r1', name: 'Excellent',  desc: 'Sample description of excellent work',   pts: 20 },
    { id: 'r2', name: 'Proficient', desc: 'Sample description of proficient work',  pts: 15 },
    { id: 'r3', name: 'Developing', desc: 'Sample description of developing work',  pts: 10 },
    { id: 'r4', name: 'Beginning',  desc: 'Sample description of beginning work',   pts: 5  },
  ]},
]

function findRatingForScore(ratings: V1Rating[], score: number): V1Rating | null {
  const sorted = [...ratings].sort((a, b) => b.pts - a.pts)
  for (let i = 0; i < sorted.length; i++) {
    const isLast = i === sorted.length - 1
    const bottom = isLast ? 0 : sorted[i + 1].pts
    if (isLast ? (score >= 0 && score <= sorted[i].pts) : (score > bottom && score <= sorted[i].pts)) {
      return sorted[i]
    }
  }
  return null
}

function RubricPreview({ criteria, displayType, ratingOrder, hideTotal, scoring, organization, rubricType, useDecimals }: {
  criteria: V1Criterion[]
  displayType: string
  ratingOrder: string
  hideTotal: boolean
  scoring: string
  organization: string
  rubricType: string
  useDecimals: boolean
}) {
  const [selectedIndices, setSelectedIndices] = React.useState<Record<string, number>>({})
  const [scoreInputs, setScoreInputs] = React.useState<Record<string, string>>({})
  const showLevels = organization === 'Levels'
  const showFreeScore = scoring === 'Scored' && organization === 'Written Feedback Only'
  const showPts = scoring === 'Scored' && showLevels && displayType !== 'no-points'
  const totalPts = criteria.reduce((sum, c) => {
    if (showFreeScore) return sum + (c.maxPts ?? 0)
    return sum + (c.ratings.length > 0 ? Math.max(...c.ratings.map(r => r.pts)) : 0)
  }, 0)

  const instructorScore = criteria.reduce((sum, crit) => {
    if (rubricType === 'ranges' || showFreeScore) {
      const score = parseFloat(scoreInputs[crit.id] ?? '')
      return sum + (isNaN(score) ? 0 : score)
    }
    const display = ratingOrder === 'high-to-low' ? crit.ratings : [...crit.ratings].reverse()
    const idx = Math.min(selectedIndices[crit.id] ?? 0, display.length - 1)
    return sum + (display[idx]?.pts ?? 0)
  }, 0)

  return (
    <div style={{ borderRadius: 8, overflow: 'hidden', background: '#fff', boxShadow: '0 10px 24.5px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.1)', fontSize: 14, fontFamily: 'Lato, sans-serif' }}>

      {/* Header — white bg, "Rubric" 22px bold dark, #bdbdbd line below */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#2d3b45', lineHeight: 1.27 }}>Rubric</span>
          <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'default', color: '#2d3b45' }}>
            <XInstUIIcon size="x-small" />
          </button>
        </div>
        <div style={{ height: 1, background: '#bdbdbd', margin: '0 -16px' }} />
      </div>

      {/* Body — 12px horizontal padding, 24px gap between sections */}
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* View toggle — always visible */}
        <div style={{ paddingTop: 12 }}>
          <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', border: '1px solid #c7cdd1', borderRadius: 4, background: '#fff', cursor: 'default', fontSize: 14, color: '#2d3b45', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 12 }}>⊞</span>
            <span>Horizontal</span>
            <span style={{ fontSize: 10 }}>▾</span>
          </button>
        </div>

        {/* Instructor Score row */}
        {scoring === 'Scored' && (
        <div style={{ position: 'relative' as const, height: 48, borderRadius: 4, border: '1px solid #c7cdd1', background: '#f5f5f5', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#2d3b45', padding: '0 12px' }}>Instructor Score</span>
          {showPts && (
            <div style={{ position: 'absolute' as const, right: 0, top: 0, bottom: 0, background: '#0b874b', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' as const }}>
                {hideTotal ? '—' : `${instructorScore} pts`}
              </span>
            </div>
          )}
        </div>
        )}

        {/* Criteria list */}
        {criteria.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#6a7883', margin: 0 }}>No criteria yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {criteria.map((crit, ci) => {
              const displayRatings = ratingOrder === 'high-to-low' ? crit.ratings : [...crit.ratings].reverse()

              // Determine selected rating — score-input-driven for ranges, click-driven otherwise
              let selectedRating: V1Rating | null = null
              let selectedIdx = -1
              if (rubricType === 'ranges') {
                const raw = scoreInputs[crit.id] ?? ''
                const score = parseFloat(raw)
                if (!isNaN(score)) {
                  selectedRating = findRatingForScore(crit.ratings, score)
                  selectedIdx = selectedRating ? displayRatings.findIndex(r => r.id === selectedRating!.id) : -1
                }
              } else {
                selectedIdx = Math.min(selectedIndices[crit.id] ?? 0, displayRatings.length - 1)
                selectedRating = displayRatings[selectedIdx] ?? null
              }

              const maxPts = showFreeScore
                ? (crit.maxPts ?? 0)
                : (crit.ratings.length > 0 ? Math.max(...crit.ratings.map(r => r.pts)) : 0)
              const rawScore = scoreInputs[crit.id] ?? ''
              const parsedScore = parseFloat(rawScore)
              const isNonInteger = !useDecimals && rawScore !== '' && !isNaN(parsedScore) && !Number.isInteger(parsedScore)
              const scoreOutOfRange = rawScore !== '' && !isNaN(parsedScore) && (parsedScore < 0 || parsedScore > maxPts)

              return (
                <React.Fragment key={crit.id}>
                  {ci > 0 && <div style={{ height: 1, background: '#c7cdd1', margin: '12px -12px' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Criterion name + description */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#2d3b45', lineHeight: 1.5 }}>
                        {crit.name || <span style={{ color: '#9aa5ae', fontStyle: 'italic', fontWeight: 400 }}>Untitled criterion</span>}
                      </span>
                      {crit.desc && (
                        <span style={{ fontSize: 16, fontWeight: 400, color: '#2d3b45', lineHeight: 1.5 }}>{crit.desc}</span>
                      )}
                    </div>

                    {showFreeScore ? (
                      /* Scored + Written Feedback Only — free-form score input, no level cards */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 14, fontWeight: 700, color: '#2d3b45', lineHeight: 1.5 }}>
                          Score <span style={{ fontSize: 13, fontWeight: 400, color: '#6a7883' }}>(0 – {maxPts} pts)</span>
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={scoreInputs[crit.id] ?? ''}
                          onChange={e => setScoreInputs(prev => ({ ...prev, [crit.id]: e.target.value }))}
                          placeholder="Enter score…"
                          style={{ width: 120, fontSize: 14, padding: '7px 10px', borderRadius: 6, border: '1px solid #c7cdd1', outline: 'none', color: '#2d3b45', fontFamily: 'inherit' }}
                        />
                      </div>
                    ) : rubricType === 'ranges' ? (
                      <>
                        {/* Score input */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 14, fontWeight: 700, color: (scoreOutOfRange || isNonInteger) ? '#c51827' : '#2d3b45', lineHeight: 1.5 }}>
                            Score <span style={{ fontSize: 13, fontWeight: 400, color: (scoreOutOfRange || isNonInteger) ? '#c51827' : '#6a7883' }}>(0 – {maxPts} pts)</span>
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={maxPts}
                            step={useDecimals ? 'any' : 1}
                            value={rawScore}
                            onChange={e => setScoreInputs(prev => ({ ...prev, [crit.id]: e.target.value }))}
                            placeholder="Enter score…"
                            style={{ width: 120, fontSize: 14, padding: '7px 10px', borderRadius: 6, border: `1px solid ${(scoreOutOfRange || isNonInteger) ? '#c51827' : '#c7cdd1'}`, outline: 'none', color: '#2d3b45', fontFamily: 'inherit', boxShadow: (scoreOutOfRange || isNonInteger) ? '0 0 0 2px rgba(197,24,39,0.15)' : 'none' }}
                          />
                          {scoreOutOfRange && (
                            <span style={{ fontSize: 12, color: '#c51827', lineHeight: 1.4 }}>
                              Score must be between 0 and {maxPts} pts
                            </span>
                          )}
                          {isNonInteger && !scoreOutOfRange && (
                            <span style={{ fontSize: 12, color: '#c51827', lineHeight: 1.4 }}>
                              Score must be a whole number
                            </span>
                          )}
                        </div>

                        {showLevels && (selectedRating ? (
                          /* Score entered — show only the matching level */
                          <div style={{ borderRadius: 8, border: '3px solid #2d3b45', background: '#fff', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#6a7883', marginBottom: 2 }}>{rangeLabel(crit.ratings, selectedRating.id, useDecimals)}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#2d3b45', lineHeight: 1.43 }}>
                              {selectedRating.name || <span style={{ color: '#9aa5ae', fontStyle: 'italic' }}>Untitled</span>}
                            </span>
                            {selectedRating.desc && (
                              <span style={{ fontSize: 14, fontWeight: 400, color: '#2d3b45', lineHeight: 1.43 }}>{selectedRating.desc}</span>
                            )}
                          </div>
                        ) : (
                          /* No score yet — show all levels as reference */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {displayRatings.map(rating => (
                              <div key={rating.id} style={{ borderRadius: 6, border: '1px solid #c7cdd1', background: '#fff', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#6a7883' }}>{rangeLabel(crit.ratings, rating.id, useDecimals)}</span>
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#2d3b45', lineHeight: 1.43 }}>
                                  {rating.name || <span style={{ color: '#9aa5ae', fontStyle: 'italic', fontWeight: 400 }}>Untitled</span>}
                                </span>
                                {rating.desc && (
                                  <span style={{ fontSize: 13, fontWeight: 400, color: '#2d3b45', lineHeight: 1.43 }}>{rating.desc}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {/* Selected rating card (Frame 195) */}
                        {showLevels && selectedRating && displayType !== 'no-points' && (
                          <div style={{ borderRadius: 8, border: '3px solid #2d3b45', background: '#fff', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#2d3b45', lineHeight: 1.43 }}>
                              {selectedRating.name || <span style={{ color: '#9aa5ae', fontStyle: 'italic' }}>Untitled</span>}
                            </span>
                            {selectedRating.desc && (
                              <span style={{ fontSize: 14, fontWeight: 400, color: '#2d3b45', lineHeight: 1.43 }}>{selectedRating.desc}</span>
                            )}
                          </div>
                        )}

                        {/* Rating buttons row */}
                        {showLevels && displayRatings.length > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                            {displayRatings.map((rating, ri) => {
                              const isSelected = ri === selectedIdx
                              const n = displayRatings.length
                              const buttonLabel = scoring === 'Unscored'
                                ? (ratingOrder === 'high-to-low' ? n - 1 - ri : ri)
                                : rating.pts
                              return (
                                <button
                                  key={rating.id}
                                  type="button"
                                  onClick={() => setSelectedIndices(prev => ({ ...prev, [crit.id]: ri }))}
                                  style={{ position: 'relative' as const, width: 58, height: 58, borderRadius: 6, border: '1px solid #c7cdd1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', padding: 0 }}
                                >
                                  <div style={{ position: 'absolute' as const, inset: 5, borderRadius: 6, border: isSelected ? '3px solid #2d3b45' : '1px solid #c7cdd1', pointerEvents: 'none' as const }} />
                                  <span style={{ fontSize: 16, fontWeight: 700, color: '#2d3b45', position: 'relative' as const, zIndex: 1 }}>
                                    {buttonLabel}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </>
                    )}

                    {/* Comment input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#2d3b45', lineHeight: 1.5 }}>Comment</span>
                      <div style={{ height: 28, borderRadius: 4, border: '1px solid #c7cdd1', background: '#fff' }} />
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        )}

        {/* Bottom line + footer total */}
        <div style={{ height: 1, background: '#c7cdd1', margin: '0 -12px' }} />
        {showPts && !hideTotal && criteria.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 12 }}>
            <span style={{ fontSize: 14, color: '#2d3b45' }}>— /{totalPts}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function RubricTab({ onTotalPointsChange, onUseForGradingChange }: { onTotalPointsChange?: (pts: number) => void; onUseForGradingChange?: (v: boolean) => void }) {
  const [rubricName, setRubricName] = React.useState('Essay Evaluation Rubric')
  const [scoring, setScoring] = React.useState('Scored')
  const [organization, setOrganization] = React.useState('Levels')
  const [rubricType, setRubricType] = React.useState('set-points')
  const [displayType] = React.useState('full')
  const [ratingOrder, setRatingOrder] = React.useState('high-to-low')
  const [scored] = React.useState(true)
  const [useForGrading, setUseForGrading] = React.useState(false)
  const [postMastery, setPostMastery] = React.useState(false)
  const [hideTotal, setHideTotal] = React.useState(false)
  const [useDecimals, setUseDecimals] = React.useState(false)
  const [advancedOpen, setAdvancedOpen] = React.useState(false)
  const [aiExpanded, setAiExpanded] = React.useState(false)
  const [aiGenerating, setAiGenerating] = React.useState(false)
  const [aiLevel, setAiLevel] = React.useState('High School')
  const [aiCriteriaCount, setAiCriteriaCount] = React.useState(4)
  const [aiRatingsCount, setAiRatingsCount] = React.useState(4)
  const [aiTotalPts, setAiTotalPts] = React.useState(100)
  const [aiOutcome, setAiOutcome] = React.useState('')
  const [aiAdditional, setAiAdditional] = React.useState('')
  const [criteria, setCriteria] = React.useState<V1Criterion[]>(V1_INITIAL_CRITERIA)

  const totalPts = criteria.reduce((sum, c) => {
    if (organization === 'Written Feedback Only') return sum + (c.maxPts ?? 0)
    return sum + (c.ratings.length > 0 ? Math.max(...c.ratings.map(r => r.pts)) : 0)
  }, 0)

  React.useEffect(() => { onTotalPointsChange?.(totalPts) }, [totalPts]) // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { onUseForGradingChange?.(useForGrading) }, [useForGrading]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateCriterion(id: string, patch: Partial<V1Criterion>) {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }
  function updateRating(critId: string, ratingId: string, patch: Partial<V1Rating>) {
    setCriteria(prev => prev.map(c => c.id === critId
      ? { ...c, ratings: c.ratings.map(r => r.id === ratingId ? { ...r, ...patch } : r) }
      : c
    ))
  }
  function removeRating(critId: string, ratingId: string) {
    setCriteria(prev => prev.map(c => c.id === critId
      ? { ...c, ratings: c.ratings.filter(r => r.id !== ratingId) }
      : c
    ))
  }
  function addRating(critId: string) {
    setCriteria(prev => prev.map(c => {
      if (c.id !== critId) return c
      const maxPts = c.ratings.length > 0 ? Math.max(...c.ratings.map(r => r.pts)) : 1
      return { ...c, ratings: [...c.ratings, { id: `r${Date.now()}`, name: 'New Rating', desc: '', pts: Math.max(0, maxPts - 1) }] }
    }))
  }
  function removeCriterion(id: string) { setCriteria(prev => prev.filter(c => c.id !== id)) }
  function duplicateCriterion(id: string) {
    const ts = Date.now()
    setCriteria(prev => {
      const idx = prev.findIndex(c => c.id === id)
      if (idx < 0) return prev
      const copy = { ...prev[idx], id: `c${ts}`, ratings: prev[idx].ratings.map((r, i) => ({ ...r, id: `${ts}r${i}` })) }
      return [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]
    })
  }
  function duplicateRating(critId: string, ratingId: string) {
    const ts = Date.now()
    setCriteria(prev => prev.map(c => {
      if (c.id !== critId) return c
      const idx = c.ratings.findIndex(r => r.id === ratingId)
      if (idx < 0) return c
      const copy = { ...c.ratings[idx], id: `${ts}r` }
      return { ...c, ratings: [...c.ratings.slice(0, idx + 1), copy, ...c.ratings.slice(idx + 1)] }
    }))
  }
  function addCriterion() {
    const ts = Date.now()
    setCriteria(prev => [...prev, {
      id: `c${ts}`, name: '', desc: '', maxPts: 0, ratings: [
        { id: `${ts}r1`, name: '', desc: '', pts: 20 },
        { id: `${ts}r2`, name: '', desc: '', pts: 15 },
        { id: `${ts}r3`, name: '', desc: '', pts: 10 },
        { id: `${ts}r4`, name: '', desc: '', pts: 5  },
      ],
    }])
  }

  async function handleGenerate() {
    setAiGenerating(true)
    await new Promise(r => setTimeout(r, 1400))
    const ts = Date.now()
    setCriteria([
      { id: `${ts}1`, name: 'Thesis & Argument', desc: '', ratings: [
        { id: 'r1', name: 'Excellent',  desc: 'Original, nuanced thesis anchors a compelling, well-sustained argument.', pts: 4 },
        { id: 'r2', name: 'Proficient', desc: 'Clear thesis addresses the prompt and is consistently supported.',         pts: 3 },
        { id: 'r3', name: 'Developing', desc: 'Thesis is present but vague; support is limited or inconsistent.',        pts: 2 },
        { id: 'r4', name: 'Beginning',  desc: 'No clear thesis is presented; argument is not evident.',                  pts: 1 },
      ]},
      { id: `${ts}2`, name: 'Use of Evidence', desc: '', ratings: [
        { id: 'r1', name: 'Excellent',  desc: 'Evidence is compelling, deeply analyzed, and expertly cited throughout.', pts: 4 },
        { id: 'r2', name: 'Proficient', desc: 'Relevant evidence supports the thesis; citations mostly correct.',         pts: 3 },
        { id: 'r3', name: 'Developing', desc: 'Evidence is present but not well analyzed or integrated.',                pts: 2 },
        { id: 'r4', name: 'Beginning',  desc: 'Little or no evidence is used; citations absent.',                        pts: 1 },
      ]},
      { id: `${ts}3`, name: 'Organization & Flow', desc: '', ratings: [
        { id: 'r1', name: 'Excellent',  desc: 'Logical progression with smooth transitions; ideas connect clearly.',     pts: 4 },
        { id: 'r2', name: 'Proficient', desc: 'Clear structure; most transitions work effectively.',                     pts: 3 },
        { id: 'r3', name: 'Developing', desc: 'Some structure evident but organization is inconsistent.',                pts: 2 },
        { id: 'r4', name: 'Beginning',  desc: 'Little or no discernible organization.',                                  pts: 1 },
      ]},
      { id: `${ts}4`, name: 'Writing Mechanics', desc: '', ratings: [
        { id: 'r1', name: 'Excellent',  desc: 'Virtually error-free; writing enhances communication.',                   pts: 4 },
        { id: 'r2', name: 'Proficient', desc: 'Minor errors that do not interfere with meaning.',                        pts: 3 },
        { id: 'r3', name: 'Developing', desc: 'Noticeable errors that sometimes obscure meaning.',                       pts: 2 },
        { id: 'r4', name: 'Beginning',  desc: 'Frequent errors that significantly impede understanding.',                pts: 1 },
      ]},
    ])
    setAiGenerating(false)
    setAiExpanded(false)
  }

  const orderedRatingsFor = (c: V1Criterion) =>
    ratingOrder === 'high-to-low' ? c.ratings : [...c.ratings].reverse()

  const checkboxItems = scoring === 'Unscored' ? [] : [
    { key: 'grading',    label: "Don't use for grading",        value: useForGrading, toggle: () => setUseForGrading(v => !v) },
    { key: 'mastery',    label: "Don't post to Mastery",        value: postMastery,   toggle: () => setPostMastery(v => !v)   },
    { key: 'hideTotal',  label: 'Hide score total',             value: hideTotal,     toggle: () => setHideTotal(v => !v)     },
    ...(rubricType === 'ranges' ? [{ key: 'decimals', label: 'Use decimals with ranges', value: useDecimals, toggle: () => setUseDecimals(v => !v) }] : []),
  ]

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

    {/* ── Left: builder ── */}
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 64px', display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Rubric name */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6a7883', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>
          Rubric Name <span style={{ color: '#c51827' }}>*</span>
        </label>
        <input
          style={{ width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 8, border: '1px solid #c7cdd1', outline: 'none', color: '#273540', boxSizing: 'border-box' as const }}
          value={rubricName}
          onChange={e => setRubricName(e.target.value)}
        />
      </div>

      {/* Selectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
          <PillSelector
            label="Scoring"
            value={scoring}
            options={['Scored', 'Unscored']}
            onChange={v => { setScoring(v); if (v === 'Unscored') setRubricType('set-points') }}
          />
          <PillSelector
            label="Organization"
            value={organization}
            options={['Levels', 'Written Feedback Only']}
            onChange={setOrganization}
          />
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' as const }}>
          {scoring === 'Scored' && organization === 'Levels' && <PillSelector
            label="Score Type"
            value={rubricType === 'ranges' ? 'Ranges' : 'Set Points'}
            options={['Set Points', 'Ranges']}
            onChange={v => setRubricType(v === 'Ranges' ? 'ranges' : 'set-points')}
          />}
          {organization === 'Levels' && <PillSelector
            label="Rating Order"
            value={ratingOrder === 'high-to-low' ? 'High → Low' : 'Low → High'}
            options={['High → Low', 'Low → High']}
            onChange={v => setRatingOrder(v === 'High → Low' ? 'high-to-low' : 'low-to-high')}
          />}
        </div>
      </div>

      {/* Advanced options */}
      {checkboxItems.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#273540', fontFamily: 'inherit' }}
          >
            <span style={{ display: 'flex', transition: 'transform 0.15s', transform: advancedOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              <ChevronRightInstUIIcon size="x-small" />
            </span>
            Advanced options
          </button>
          {advancedOpen && (
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px 28px', marginTop: 10, paddingLeft: 4 }}>
              {checkboxItems.map(({ key, label, value, toggle }) => (
                <label key={key} onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, userSelect: 'none' as const }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 16, height: 16, borderRadius: 3, flexShrink: 0, cursor: 'pointer',
                      border: value ? 'none' : '1.5px solid #6a7883',
                      background: value ? '#2b7abc' : 'transparent',
                    }}
                  >
                    {value && <span style={{ display: 'flex', color: '#fff' }}><CheckInstUIIcon size="x-small" /></span>}
                  </div>
                  <span style={{ color: '#273540' }}>{label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Generator panel — shown when expanded */}
      {aiExpanded && (
        <div style={{ borderRadius: 12, border: '1px solid #C5AEE8', background: 'linear-gradient(135deg, #F3EEFF 0%, #EEF5FF 100%)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#273540' }}>Rubric Generator</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <MiniSelect
              label="Grade Level"
              value={aiLevel}
              options={['Elementary', 'Middle School', 'High School', 'Undergraduate', 'Graduate']}
              onChange={setAiLevel}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>Number of Criteria</label>
              <input type="number" min={1} max={10} value={aiCriteriaCount}
                onChange={e => setAiCriteriaCount(parseInt(e.target.value) || 4)}
                style={{ padding: '8px 12px', fontSize: 13, borderRadius: 12, border: '1.2px solid #6a7883', color: '#273540', background: '#fff', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>Number of Ratings</label>
              <input type="number" min={2} max={6} value={aiRatingsCount}
                onChange={e => setAiRatingsCount(parseInt(e.target.value) || 4)}
                style={{ padding: '8px 12px', fontSize: 13, borderRadius: 12, border: '1.2px solid #6a7883', color: '#273540', background: '#fff', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>Total Points</label>
              <input type="number" min={1} value={aiTotalPts}
                onChange={e => setAiTotalPts(parseInt(e.target.value) || 100)}
                style={{ padding: '8px 12px', fontSize: 13, borderRadius: 12, border: '1.2px solid #6a7883', color: '#273540', background: '#fff', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>Standard / Outcome Information</label>
            <textarea
              style={{ width: '100%', borderRadius: 8, border: '1px solid #d7dade', padding: '8px 12px', fontSize: 13, resize: 'none', outline: 'none', color: '#273540', minHeight: 68, boxSizing: 'border-box' as const }}
              placeholder="Paste a standard or outcome description to align the rubric..."
              value={aiOutcome} onChange={e => setAiOutcome(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#273540' }}>Additional Prompt Information</label>
            <textarea
              style={{ width: '100%', borderRadius: 8, border: '1px solid #d7dade', padding: '8px 12px', fontSize: 13, resize: 'none', outline: 'none', color: '#273540', minHeight: 68, boxSizing: 'border-box' as const }}
              placeholder="Any other details to guide the AI (topic, focus areas, assignment context)..."
              value={aiAdditional} onChange={e => setAiAdditional(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button" onClick={handleGenerate} disabled={aiGenerating}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #944fb3, #027887)', border: 'none', cursor: aiGenerating ? 'wait' : 'pointer', opacity: aiGenerating ? 0.7 : 1 }}
            >
              {aiGenerating
                ? <>✨ Generating…</>
                : <>✨ Generate Criteria</>
              }
            </button>
            <button
              type="button" onClick={() => setAiExpanded(false)} disabled={aiGenerating}
              style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, border: '1px solid #d7dade', background: '#fff', cursor: 'pointer', color: '#273540' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Criteria list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {criteria.map((crit, ci) => {
          const maxPts = crit.ratings.length > 0 ? Math.max(...crit.ratings.map(r => r.pts)) : 0
          const displayRatings = orderedRatingsFor(crit)
          return (
            <div key={crit.id} style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #d7dade', background: '#fff' }}>
              {/* Criterion header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e8eaec', background: '#f5f7f8' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#6a7883', textTransform: 'uppercase' as const, letterSpacing: '0.04em', marginBottom: 4 }}>Criterion {ci + 1}</div>
                    <input
                      style={{ width: '100%', fontSize: 14, fontWeight: 700, border: '1px solid #c7cdd1', borderRadius: 6, padding: '7px 10px', background: '#fff', outline: 'none', color: '#273540', boxSizing: 'border-box' as const }}
                      value={crit.name} placeholder="Criterion name"
                      onChange={e => updateCriterion(crit.id, { name: e.target.value })}
                    />
                  </div>
                  {scored && scoring === 'Scored' && organization === 'Levels' && (
                    <div style={{ fontSize: 12, color: '#6a7883', whiteSpace: 'nowrap' as const, paddingTop: 20, flexShrink: 0 }}>
                      {rubricType === 'ranges' ? `Top: ${maxPts} pts` : `Max: ${maxPts} pts`}
                    </div>
                  )}
                  {scoring === 'Scored' && organization === 'Written Feedback Only' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2, flexShrink: 0 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: '#6a7883', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>Max pts</label>
                      <input
                        type="number"
                        min={0}
                        style={{ width: 72, fontSize: 13, border: '1px solid #c7cdd1', borderRadius: 6, padding: '6px 8px', outline: 'none', color: '#273540', background: '#fff', boxSizing: 'border-box' as const }}
                        value={crit.maxPts ?? 0}
                        onChange={e => updateCriterion(crit.id, { maxPts: Math.max(0, Number(e.target.value)) })}
                      />
                    </div>
                  )}
                  <button
                    type="button" onClick={() => duplicateCriterion(crit.id)}
                    title="Duplicate criterion"
                    style={{ display: 'flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', marginTop: 18, color: '#6a7883', flexShrink: 0 }}
                  >
                    <span style={{ display: 'flex' }}><CopyInstUIIcon size="x-small" /></span>
                  </button>
                  <button
                    type="button" onClick={() => removeCriterion(crit.id)}
                    title="Delete criterion"
                    style={{ display: 'flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', marginTop: 18, color: '#6a7883', flexShrink: 0 }}
                  >
                    <span style={{ display: 'flex' }}><XInstUIIcon size="x-small" /></span>
                  </button>
                </div>
                <textarea
                  style={{ width: '100%', fontSize: 13, borderRadius: 6, border: '1px solid #c7cdd1', padding: '7px 10px', resize: 'none' as const, minHeight: 48, outline: 'none', color: '#273540', background: '#fff', boxSizing: 'border-box' as const }}
                  placeholder="Criteria description (optional)" rows={2}
                  value={crit.desc}
                  onChange={e => updateCriterion(crit.id, { desc: e.target.value })}
                />
              </div>
              {/* Ratings — hidden when Written Feedback Only */}
              {organization === 'Levels' && <div>
                {displayRatings.map(rating => (
                  <div key={rating.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px', borderBottom: '1px solid #f0f1f2' }}>
                    {scored && displayType !== 'no-points' && scoring === 'Scored' && organization === 'Levels' && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <div style={{ padding: '3px 8px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: '#1d354f', color: '#fff', whiteSpace: 'nowrap' as const }}>
                          {rubricType === 'ranges' ? rangeLabel(crit.ratings, rating.id, useDecimals) : `${rating.pts} pts`}
                        </div>
                        <input
                          type="number" min={0}
                          style={{ width: 52, fontSize: 12, borderRadius: 6, border: '1px solid #d7dade', padding: '4px 6px', textAlign: 'center' as const, outline: 'none', color: '#273540' }}
                          value={rating.pts}
                          onChange={e => updateRating(crit.id, rating.id, { pts: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    )}
                    <span style={{ display: 'flex', color: '#c7cdd1', cursor: 'grab', marginTop: 6, flexShrink: 0 }}>
                      <GripVerticalInstUIIcon size="x-small" />
                    </span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <input
                        style={{ width: '100%', fontSize: 13, fontWeight: 500, border: '1px solid #d7dade', borderRadius: 6, padding: '6px 10px', outline: 'none', color: '#273540', boxSizing: 'border-box' as const }}
                        value={rating.name} placeholder="Rating name"
                        onChange={e => updateRating(crit.id, rating.id, { name: e.target.value })}
                      />
                      <textarea
                        style={{ width: '100%', fontSize: 12, border: '1px solid #d7dade', borderRadius: 6, padding: '6px 10px', resize: 'none' as const, outline: 'none', color: '#273540', lineHeight: 1.5, boxSizing: 'border-box' as const }}
                        rows={2} placeholder="Describe this rating level..."
                        value={rating.desc}
                        onChange={e => updateRating(crit.id, rating.id, { desc: e.target.value })}
                      />
                    </div>
                    <button
                      type="button" onClick={() => duplicateRating(crit.id, rating.id)}
                      title="Duplicate rating"
                      style={{ display: 'flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', marginTop: 4, color: '#9aa5ae', flexShrink: 0 }}
                    >
                      <span style={{ display: 'flex' }}><CopyInstUIIcon size="x-small" /></span>
                    </button>
                    <button
                      type="button" onClick={() => removeRating(crit.id, rating.id)}
                      title="Delete rating"
                      style={{ display: 'flex', padding: 4, border: 'none', background: 'transparent', cursor: 'pointer', marginTop: 4, color: '#9aa5ae', flexShrink: 0 }}
                    >
                      <span style={{ display: 'flex' }}><XInstUIIcon size="x-small" /></span>
                    </button>
                  </div>
                ))}
                <div style={{ padding: '10px 16px' }}>
                  <button type="button" onClick={() => addRating(crit.id)} style={{ fontSize: 13, color: '#0770a3', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                    + Add Rating Level
                  </button>
                </div>
              </div>}
            </div>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
        <button type="button" onClick={addCriterion} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 13, border: '1px solid #d7dade', background: '#fff', cursor: 'pointer', color: '#273540' }}>
          <span style={{ display: 'flex' }}><PlusInstUIIcon size="x-small" /></span> Draft New Criterion
        </button>
        <button
          type="button"
          onClick={() => setAiExpanded(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, fontSize: 13, border: '1px solid #d7dade', background: aiExpanded ? '#f3eeff' : '#fff', cursor: 'pointer', color: '#273540' }}
        >
          <span style={{ display: 'flex', color: '#944fb3' }}><SparklesInstUIIcon size="x-small" /></span>
          Auto-Generate Criteria
        </button>
        <button type="button" disabled style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 13, border: '1px solid #e8eaec', background: '#f5f7f8', cursor: 'not-allowed', color: '#9aa5ae' }}>
          + Create From Outcome <span style={{ marginLeft: 6 }}><ComingSoonBadge /></span>
        </button>
        <div style={{ flex: 1 }} />
        {scored && !hideTotal && (
          <div style={{ fontSize: 14, fontWeight: 700, color: '#273540' }}>Total: {totalPts} pts</div>
        )}
      </div>
    </div>
    </div>

    {/* ── Right: rubric reference panel ── */}
    <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e8eaec', overflowY: 'auto', background: '#f5f7f8' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8eaec', background: '#fff', flexShrink: 0 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#273540', margin: '0 0 2px' }}>Live Preview</h3>
        <p style={{ fontSize: 12, color: '#6a7883', margin: 0, lineHeight: 1.4 }}>Updates as you build</p>
      </div>
      <div style={{ padding: '16px', flex: 1 }}>
        <RubricPreview
          criteria={criteria}
          displayType={displayType}
          ratingOrder={ratingOrder}
          hideTotal={hideTotal}
          scoring={scoring}
          organization={organization}
          rubricType={rubricType}
          useDecimals={useDecimals}
        />
      </div>
    </div>

    </div>
  )
}


// ── Assign tab ────────────────────────────────────────────────────────────────

function DateField({ label, value, onChange, hint }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string
}) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 500, color: '#273540' }}>{label}</label>
      {hint && <p style={{ fontSize: 12, color: '#6a7883', margin: 0 }}>{hint}</p>}
      <input
        type="datetime-local"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding: '10px 12px', fontSize: 14, borderRadius: 12, outline: 'none', color: value ? '#273540' : '#9aa5ae',
          border: `1.2px solid ${focused ? '#2b7abc' : '#6a7883'}`,
          boxShadow: focused ? '0 0 0 3px rgba(43,122,188,0.12)' : 'none',
          background: '#fff', cursor: 'pointer', width: '100%', boxSizing: 'border-box' as const,
        }}
      />
    </div>
  )
}

const ASSIGN_SUGGESTIONS = [
  'Everyone', 'Section 1', 'Section 2', 'Section 3',
  'Mastery Track', 'Honors Track',
  'Student: Alex Johnson', 'Student: Maria Garcia', 'Student: James Lee',
  'Student: Priya Patel', 'Student: Sam Rivera',
]

type AssignEntry = {
  id: string
  assignTo: string[]
  dueDate: string
  availableFrom: string
  availableUntil: string
}

function AssigneeField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [query, setQuery] = React.useState('')
  const [focused, setFocused] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  const suggestions = React.useMemo(() => {
    if (!query.trim()) return ASSIGN_SUGGESTIONS.filter(s => !value.includes(s)).slice(0, 8)
    const q = query.toLowerCase()
    return ASSIGN_SUGGESTIONS.filter(s => !value.includes(s) && s.toLowerCase().includes(q)).slice(0, 8)
  }, [query, value])

  const showDropdown = focused && suggestions.length > 0

  React.useEffect(() => {
    if (!focused) return
    function handler(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setFocused(false); setQuery('') }
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [focused])

  function add(s: string) {
    onChange([...value.filter(v => v !== 'Everyone'), s])
    setQuery('')
  }

  function remove(s: string) {
    const next = value.filter(v => v !== s)
    onChange(next.length === 0 ? ['Everyone'] : next)
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#273540' }}>For</label>
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
          padding: '8px 10px', borderRadius: 12, minHeight: 42,
          border: `1.2px solid ${focused ? '#2b7abc' : '#6a7883'}`,
          boxShadow: focused ? '0 0 0 3px rgba(43,122,188,0.12)' : 'none',
          background: '#fff', cursor: 'text', transition: 'border-color 0.15s',
        }} onClick={() => setFocused(true)}>
          {value.map(v => (
            <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px 2px 10px', borderRadius: 9999, fontSize: 13, fontWeight: 500, background: v === 'Everyone' ? '#e8f1fb' : '#f0f6fc', color: '#0770a3', border: '1px solid #b8d4ed' }}>
              {v}
              {v !== 'Everyone' && (
                <button type="button" onPointerDown={e => { e.preventDefault(); remove(v) }} style={{ display: 'flex', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: '#0770a3' }}>
                  <XInstUIIcon size="x-small" />
                </button>
              )}
            </span>
          ))}
          <input
            style={{ flex: 1, minWidth: 80, fontSize: 13, border: 'none', outline: 'none', background: 'transparent', color: '#273540' }}
            placeholder={value.length === 0 ? 'Search students, sections, or groups…' : ''}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
          />
        </div>
        {showDropdown && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 4, zIndex: 50, background: '#fff', border: '1px solid #d7dade', borderRadius: 12, boxShadow: '0 4px 12px rgba(39,53,64,0.12)', overflow: 'hidden' }}>
            {suggestions.map(s => (
              <button key={s} type="button" onPointerDown={e => { e.preventDefault(); add(s) }} style={{ display: 'flex', width: '100%', padding: '10px 14px', fontSize: 13, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', color: '#273540' }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AssignEntryCard({ entry, canRemove, onChange, onRemove }: {
  entry: AssignEntry
  canRemove: boolean
  onChange: (patch: Partial<AssignEntry>) => void
  onRemove: () => void
}) {
  const hasConflict = entry.availableFrom && entry.availableUntil && entry.availableFrom >= entry.availableUntil
  const dueBeforeOpen = entry.dueDate && entry.availableFrom && entry.dueDate < entry.availableFrom
  const dueAfterClose = entry.dueDate && entry.availableUntil && entry.dueDate > entry.availableUntil

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, borderRadius: 16, background: '#f9f9f9', border: '1px solid #e8eaec' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <AssigneeField value={entry.assignTo} onChange={v => onChange({ assignTo: v })} />
        </div>
        {canRemove && (
          <button type="button" onClick={onRemove} title="Remove" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', border: '1px solid #d7dade', background: '#fff', cursor: 'pointer', flexShrink: 0, marginTop: 22, color: '#6a7883' }}>
            <XInstUIIcon size="x-small" />
          </button>
        )}
      </div>

      <DateField label="Due date" value={entry.dueDate} onChange={v => onChange({ dueDate: v })} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DateField label="Available from" value={entry.availableFrom} onChange={v => onChange({ availableFrom: v })} />
        <DateField label="Available until" value={entry.availableUntil} onChange={v => onChange({ availableUntil: v })} />
      </div>

      {dueBeforeOpen && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fff8e1', border: '1px solid #f5c842' }}>
          <span style={{ fontSize: 13, color: '#7a5c00' }}>Due date is before the available from date.</span>
        </div>
      )}
      {dueAfterClose && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fff8e1', border: '1px solid #f5c842' }}>
          <span style={{ fontSize: 13, color: '#7a5c00' }}>Due date is after the available until date — late submissions will not be accepted.</span>
        </div>
      )}
      {hasConflict && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <span style={{ fontSize: 13, color: '#991b1b' }}>Available until must be after available from.</span>
        </div>
      )}
    </div>
  )
}

function AssignTab({ entries, onUpdate, onRemove, onAdd }: {
  entries: AssignEntry[]
  onUpdate: (id: string, patch: Partial<AssignEntry>) => void
  onRemove: (id: string) => void
  onAdd: () => void
}) {

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#273540', margin: 0 }}>Assign</h1>
        <p style={{ fontSize: 13, color: '#6a7883', margin: 0 }}>Set due dates and availability for students, sections, or groups</p>
      </div>

      {entries.map((entry, i) => (
        <AssignEntryCard
          key={entry.id}
          entry={entry}
          canRemove={i > 0}
          onChange={patch => onUpdate(entry.id, patch)}
          onRemove={() => onRemove(entry.id)}
        />
      ))}

      <button type="button" onClick={onAdd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', borderRadius: 16, border: '1.5px dashed #b8c3cc', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#0770a3', transition: 'background 0.15s, border-color 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f0f6fc'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#0770a3' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#b8c3cc' }}
      >
        <PlusInstUIIcon size="x-small" />
        Assign to another person or group
      </button>
    </div>
  )
}

// ── Publish tab ───────────────────────────────────────────────────────────────

function PublishTab({ availableFrom, onPublish, onViewCoursework }: { availableFrom: string; onPublish: () => void; onViewCoursework: () => void }) {
  const [choice, setChoice] = React.useState<'idle' | 'published' | 'draft'>('idle')

  const now = new Date().toISOString().slice(0, 16)
  const availableInFuture = availableFrom && availableFrom > now
  const availableLabel = availableFrom
    ? new Date(availableFrom).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
    : ''

  if (choice !== 'idle') {
    const published = choice === 'published'
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 16px' }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eaec', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '56px 48px', textAlign: 'center', maxWidth: 440, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: published ? '#ecfdf5' : '#f0f6fc', margin: '0 auto 20px' }}>
            <span style={{ display: 'flex', color: published ? '#1d6621' : '#0770a3' }}>
              {published ? <CheckCheckInstUIIcon size="medium" /> : <FileTextInstUIIcon size="medium" />}
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: published ? '#1d6621' : '#273540', margin: '0 0 8px' }}>
            {published ? 'Assignment published!' : 'Draft saved!'}
          </h2>
          <p style={{ fontSize: 14, color: '#6a7883', lineHeight: 1.6, margin: '0 0 32px' }}>
            {published
              ? (availableInFuture
                  ? `Your assignment is live and will become visible to students on ${availableLabel}.`
                  : 'Your assignment is now live. Students have been notified based on their preferences.')
              : 'Your assignment has been saved as a draft. You can publish it any time from the Coursework list.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button type="button" onClick={() => setChoice('idle')} style={{ padding: '9px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: '#273540', background: '#fff', border: '1px solid #d7dade', cursor: 'pointer' }}>
              {published ? 'Back to assignment' : 'Keep editing'}
            </button>
            <button type="button" onClick={onViewCoursework} style={{ padding: '9px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: '#fff', background: '#1d354f', border: 'none', cursor: 'pointer' }}>
              View in Coursework
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 16px 64px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: '#273540', margin: 0 }}>{"You're ready to go."}</h1>
        <p style={{ fontSize: 13, color: '#6a7883', margin: 0 }}>{"Choose how you'd like to save this assignment."}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Publish now */}
        <button
          type="button"
          onClick={() => { setChoice('published'); onPublish() }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 14, padding: '36px 28px', borderRadius: 16, cursor: 'pointer', textAlign: 'center',
            border: '2px solid #0770a3', background: '#0770a3', color: '#fff',
            boxShadow: '0 2px 8px rgba(7,112,163,0.25)', transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#055f8a'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(7,112,163,0.35)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0770a3'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(7,112,163,0.25)' }}
        >
          <span style={{ display: 'flex', color: '#fff' }}><RocketInstUIIcon size="large" /></span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 17, fontWeight: 700 }}>Publish now</span>
            <span style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.5 }}>
              {availableInFuture
                ? `Students will see this assignment on ${availableLabel}, based on the availability date you set.`
                : "Students can see and submit the assignment immediately. They'll be notified based on their preferences."}
            </span>
          </div>
        </button>

        {/* Save as draft */}
        <button
          type="button"
          onClick={() => setChoice('draft')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 14, padding: '36px 28px', borderRadius: 16, cursor: 'pointer', textAlign: 'center',
            border: '2px solid #d7dade', background: '#fff', color: '#273540',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6a7883'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(39,53,64,0.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d7dade'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
        >
          <span style={{ display: 'flex', color: '#6a7883' }}><FileTextInstUIIcon size="large" /></span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#273540' }}>Save as draft</span>
            <span style={{ fontSize: 13, color: '#6a7883', lineHeight: 1.5 }}>{"Students won't see this assignment until you publish it. Come back to review and go live when you're ready."}</span>
          </div>
        </button>
      </div>

      {/* Note */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 10, background: '#fff8e1', border: '1px solid #f5c842' }}>
        <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>⚠</span>
        <p style={{ fontSize: 13, color: '#7a5c00', margin: 0, lineHeight: 1.5 }}>
          <strong>Heads up:</strong> Students will be notified about the due date when you publish. Make sure your availability window is set correctly in the Assign tab before going live.
        </p>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

const TABS = ['Instructions', 'Rubric', 'Grading', 'Assign', 'Publish']

export default function CreateAssignment({ onToggleTheme }: PrototypeProps) {
  const { semantics } = useComputedTheme()
  const fontBase    = semantics?.fontFamily?.base    ?? 'Atkinson Hyperlegible Next, "Helvetica Neue", Helvetica, Arial, sans-serif'
  const fontHeading = semantics?.fontFamily?.heading ?? 'Inclusive Sans, "Helvetica Neue", Helvetica, Arial, sans-serif'

  const [navOpen, setNavOpen] = React.useState(false)
  const [courseworkType, setCourseworkType] = React.useState('Assignment')
  const [title, setTitle] = React.useState('Untitled coursework')
  const [activeTab, setActiveTab] = React.useState('Instructions')
  const [rubricView, setRubricView] = React.useState<'landing' | 'create' | 'use-existing' | 'edit-existing' | 'none'>('landing')
  const [rubricTotalPoints, setRubricTotalPoints] = React.useState(0)
  const [rubricNotForGrading, setRubricNotForGrading] = React.useState(false)
  const gradingValidateRef = React.useRef<(() => boolean) | null>(null)
  const rubricActive = rubricView === 'create' || rubricView === 'use-existing' || rubricView === 'edit-existing'
  const [showDiscardRubricModal, setShowDiscardRubricModal] = React.useState(false)
  const [assignEntries, setAssignEntries] = React.useState<AssignEntry[]>([
    { id: 'default', assignTo: ['Everyone'], dueDate: '', availableFrom: '', availableUntil: '' },
  ])

  function updateAssignEntry(id: string, patch: Partial<AssignEntry>) {
    setAssignEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
  }
  function removeAssignEntry(id: string) {
    setAssignEntries(prev => prev.filter(e => e.id !== id))
  }
  function addAssignEntry() {
    setAssignEntries(prev => [...prev, { id: `entry-${Date.now()}`, assignTo: [], dueDate: '', availableFrom: '', availableUntil: '' }])
  }

  const earliestAvailableFrom = assignEntries.map(e => e.availableFrom).filter(Boolean).sort()[0] ?? ''
  const [isPublished, setIsPublished] = React.useState(false)
  const [showCourseworkView, setShowCourseworkView] = React.useState(false)

  const sideNav = navOpen && (
    <div style={{ height: '100vh', paddingBottom: 8, flexShrink: 0 }}>
      <SideNavBar label="Main navigation" toggleLabel={{ expandedLabel: 'Minimize navigation', minimizedLabel: 'Expand navigation' }}>
        <SideNavBar.Item icon={<IconCanvasLogoSolid size="medium" />} label={<ScreenReaderContent>Canvas</ScreenReaderContent>} href="#" themeOverride={{ contentPadding: '1em 0.375rem 1em 0.375rem' }} />
        <SideNavBar.Item icon={<Avatar name="Sally" src={`${import.meta.env.BASE_URL}sally.png`} size="x-small" />} label="Account" href="#" />
        <SideNavBar.Item icon={<LayoutDashboardInstUIIcon />} label="Dashboard" href="#" />
        <SideNavBar.Item icon={<BookTextInstUIIcon />} label="Courses" href="#" selected />
        <SideNavBar.Item icon={<CalendarDaysInstUIIcon />} label="Calendar" href="#" />
        <SideNavBar.Item icon={<InboxInstUIIcon />} label="Inbox" href="#" />
        <SideNavBar.Item icon={<CircleHelpInstUIIcon />} label="Help" href="#" />
        <SideNavBar.Item icon={<SparklesInstUIIcon />} label="Theme" onClick={onToggleTheme} />
      </SideNavBar>
    </div>
  )

  if (showCourseworkView) {
    const COURSE_MODULES = [
      { id: 'm1', name: 'Week 1: Introduction to Rhetoric',     items: 4 },
      { id: 'm2', name: 'Week 2: Argumentative Writing',        items: 5 },
      { id: 'm3', name: 'Week 3: Research Methods',             items: 3 },
    ]
    type CWItem = { id: string; title: string; type: 'assignment' | 'page'; highlight?: boolean }
    const moduleItems: CWItem[] = [
      { id: 'i1', title: 'Defining Rhetoric: Core Principles',   type: 'page'       },
      { id: 'i2', title: 'Rhetorical Appeals: Ethos, Pathos, Logos', type: 'page'   },
      { id: 'i3', title: title,                                   type: 'assignment', highlight: true },
      { id: 'i4', title: 'Reflection: Rhetoric in Daily Life',   type: 'page'       },
    ]

    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f2f4f4', fontFamily: fontBase }}>
        {sideNav}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>

          {/* Course header — matches FTUX Grading */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '0 24px', gap: 16, height: 64, background: '#f2f4f4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 32, height: 32, background: '#1d354f', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                <span style={{ color: '#fff', display: 'flex' }}><PlusInstUIIcon size="x-small" /></span>
              </button>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: '#273540', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: fontHeading }}>
                Artificial Intelligence Ethics
              </h1>
              {isPublished
                ? <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, flexShrink: 0, background: '#ecfdf5', color: '#1d6621', border: '1px solid #b7eacb' }}>Published</span>
                : <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, flexShrink: 0, background: '#ddecf3', color: '#77360b' }}>Not published</span>
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {(['Grades', 'People', 'Outcomes', 'Apps'] as const).map(label => (
                <button key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#d5e2f6', color: '#1d354f' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Tabs card */}
            <div style={{ borderRadius: 16, flexShrink: 0, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(35,68,101,0.1), 0 2px 3.5px rgba(35,68,101,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', height: 52 }}>
                <button style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 14, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', color: '#273540' }}>
                  Modules
                  <div style={{ position: 'absolute', bottom: 0, left: 16, right: 16, height: 4, background: '#334450', borderRadius: '2px 2px 0 0' }} />
                </button>
                <button style={{ display: 'flex', alignItems: 'center', padding: '0 20px', fontSize: 14, border: 'none', background: 'transparent', cursor: 'pointer', color: '#586874' }}>
                  Course details
                </button>
              </div>
            </div>

            {/* Collapsed modules above active one */}
            {COURSE_MODULES.filter(m => m.name !== 'Week 1: Introduction to Rhetoric').slice(0, 1).map(m => (
              <div key={m.id} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(35,68,101,0.1), 0 2px 3.5px rgba(35,68,101,0.1)' }}>
                <div style={{ padding: '12px 16px', background: '#586874', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{ padding: 4, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
                      <ChevronRightInstUIIcon size="small" />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{m.items} items</span>
                </div>
              </div>
            ))}

            {/* Active module card — matches FTUX exactly */}
            <div style={{ borderRadius: 16, overflow: 'visible', flexShrink: 0, background: '#fff', boxShadow: '0 1px 2px rgba(35,68,101,0.1), 0 2px 3.5px rgba(35,68,101,0.1)' }}>
              <div style={{ padding: '12px 16px', background: '#586874', borderRadius: '16px 16px 0 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{ padding: 4, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
                      <ChevronDownInstUIIcon size="small" />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Week 1: Introduction to Rhetoric</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, fontSize: 14, fontWeight: 500, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.9)' }}>
                      <PlusInstUIIcon size="x-small" />
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                      <SettingsInstUIIcon size="x-small" />
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}>
                      <MoreHorizontalInstUIIcon size="x-small" />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, paddingLeft: 32 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{moduleItems.length} items</span>
                </div>
              </div>
              <div>
                {moduleItems.map((item, i) => {
                  const isAssignment = item.type === 'assignment'
                  const Icon      = isAssignment ? ClipboardListInstUIIcon : FileTextInstUIIcon
                  const iconBg    = item.highlight ? '#e8f1fb' : isAssignment ? '#fce8e8' : '#e8f0f8'
                  const iconColor = item.highlight ? '#0770a3' : isAssignment ? '#c54396' : '#2b7abc'
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: i === moduleItems.length - 1 ? 'none' : '1px solid #e8eaec', background: item.highlight ? '#f0f6fc' : 'transparent' }}>
                      <span style={{ color: '#c7cacd', flexShrink: 0, display: 'flex' }}><GripVerticalInstUIIcon size="x-small" /></span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, flexShrink: 0, width: 28, height: 28, background: iconBg }}>
                        <span style={{ color: iconColor, display: 'flex' }}><Icon size="x-small" /></span>
                      </div>
                      <span style={{ flex: 1, fontSize: 14, color: item.highlight ? '#0770a3' : '#273540', fontWeight: item.highlight ? 600 : 400 }}>{item.title}</span>
                      {item.highlight
                        ? (isPublished
                            ? <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, flexShrink: 0, background: '#ecfdf5', color: '#1d6621', border: '1px solid #b7eacb' }}>Published</span>
                            : <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, flexShrink: 0, background: '#f5f7f8', color: '#576773', border: '1px solid #d7dade' }}>Unpublished</span>)
                        : <span style={{ background: '#e8eaec', color: '#586874', fontSize: 12, padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>Optional</span>
                      }
                      {item.highlight && (
                        <button type="button" onClick={() => setShowCourseworkView(false)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500, border: '1px solid #d7dade', background: '#fff', cursor: 'pointer', color: '#273540', flexShrink: 0 }}>
                          <PenLineInstUIIcon size="x-small" /> Edit
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Remaining collapsed modules */}
            {COURSE_MODULES.filter(m => m.name !== 'Week 1: Introduction to Rhetoric').slice(1).map(m => (
              <div key={m.id} style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 2px rgba(35,68,101,0.1), 0 2px 3.5px rgba(35,68,101,0.1)' }}>
                <div style={{ padding: '12px 16px', background: '#586874', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button style={{ padding: 4, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)', display: 'flex' }}>
                      <ChevronRightInstUIIcon size="small" />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{m.items} items</span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f2f4f4', fontFamily: fontBase }}>
      {sideNav}

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '0 16px', gap: 12, height: 52, background: '#fff', borderBottom: '1px solid #e8eaec' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button title="Menu" onClick={() => setNavOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', border: 'none', background: navOpen ? '#e8eaec' : 'transparent', cursor: 'pointer' }}>
                <span style={{ display: 'flex', color: '#273540' }}><AlignJustifyInstUIIcon size="small" /></span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#273540', fontFamily: fontHeading }}>Create Coursework: {title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 12, padding: '2px 12px', borderRadius: 4, background: '#e0ebf5', color: '#273540' }}>Draft saved</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 9999, fontSize: 13, border: '1px solid #d7dade', color: '#273540', background: '#fff', cursor: 'pointer' }}>
              <span style={{ display: 'flex' }}><CopyInstUIIcon size="x-small" /></span> Copy link
            </button>
            <button title="Help" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <span style={{ display: 'flex', color: '#273540' }}><CircleHelpInstUIIcon size="small" /></span>
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: `url(${import.meta.env.BASE_URL}sally.png) center/cover`, border: '1px solid #e8eaec' }} />
          </div>
        </div>

        {/* Tab bar / progress indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '0 16px', height: 56, background: '#fff', borderBottom: '1px solid #e8eaec' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {TABS.map((tab, i) => {
              const activeIdx = TABS.indexOf(activeTab)
              const isActive = tab === activeTab
              const isComplete = isPublished && tab === 'Publish' ? true : i < activeIdx
              const dotBg = isComplete ? '#1d6621' : isActive ? '#0770a3' : '#fff'
              const dotBorder = isComplete ? '#1d6621' : isActive ? '#0770a3' : '#c7cdd1'
              const dotColor = isComplete || isActive ? '#fff' : '#6a7883'
              const labelColor = isActive ? '#0770a3' : isComplete ? '#273540' : '#6a7883'
              const labelWeight = isActive ? 600 : isComplete ? 500 : 400

              return (
                <React.Fragment key={tab}>
                  {i > 0 && (
                    <div style={{ width: 24, height: 1.5, background: i <= activeIdx ? '#0770a3' : '#d7dade', flexShrink: 0, transition: 'background 0.2s' }} />
                  )}
                  <button
                    onClick={() => { setActiveTab(tab); if (tab !== 'Rubric' && !rubricActive) setRubricView('landing') }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8 }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: dotBg, border: `2px solid ${dotBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s, border-color 0.2s',
                    }}>
                      {isComplete
                        ? <span style={{ display: 'flex', color: '#fff' }}><CheckInstUIIcon size="x-small" /></span>
                        : <span style={{ fontSize: 11, fontWeight: 700, color: dotColor, lineHeight: 1 }}>{i + 1}</span>
                      }
                    </div>
                    <span style={{ fontSize: 13, fontWeight: labelWeight, color: labelColor, whiteSpace: 'nowrap', transition: 'color 0.2s' }}>{tab}</span>
                  </button>
                </React.Fragment>
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 9999, fontSize: 13, border: '1px solid #d7dade', color: '#273540', background: '#fff', cursor: 'pointer' }}>
              <span style={{ display: 'flex' }}><EyeInstUIIcon size="x-small" /></span> View as student
            </button>
            {isPublished ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 9999, background: '#1d6621', color: '#fff' }}>
                <span style={{ display: 'flex' }}><CheckInstUIIcon size="x-small" /></span> Published
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 9999, background: '#f5f7f8', color: '#576773', border: '1px solid #d7dade' }}>
                Unpublished
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: (activeTab === 'Rubric' && rubricView === 'create') ? 'hidden' : 'auto', overflowX: 'hidden', display: (activeTab === 'Rubric' && rubricView === 'create') ? 'flex' : 'block', flexDirection: 'column' }}>
          <div style={{ display: activeTab === 'Instructions' ? 'block' : 'none' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <EditableTitle value={title} onChange={setTitle} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 16, background: '#f9f9f9', border: '1px solid #e8eaec' }}>
                <style>{`[data-coursework-grid] svg { stroke-width: 1.25 !important; }`}</style>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#273540', margin: 0 }}>Coursework Type</h2>

                {/* Type grid — MVP: Assignment active, Quiz + Discussion coming in V2 */}
                <div data-coursework-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {/* Assignment — fully active */}
                  <button type="button" onClick={() => setCourseworkType('Assignment')} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                    padding: '14px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    border: `2px solid ${courseworkType === 'Assignment' ? '#0770a3' : '#d7dade'}`,
                    background: courseworkType === 'Assignment' ? '#e8f1fb' : '#fff',
                    boxShadow: courseworkType === 'Assignment' ? '0 1px 4px rgba(7,112,163,0.15)' : 'none',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}>
                    <span style={{ display: 'flex', color: courseworkType === 'Assignment' ? '#0770a3' : '#8d959f' }}><ClipboardListInstUIIcon size="small" /></span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: courseworkType === 'Assignment' ? '#0770a3' : '#273540', lineHeight: 1.3 }}>Assignment</span>
                    <span style={{ fontSize: 12, color: '#6a7883', lineHeight: 1.4 }}>Students submit work via text, file upload, URL, or media</span>
                  </button>

                  {/* Quiz — Coming in V2 */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                    padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: '2px solid #e8eaec', background: '#f9f9f9', cursor: 'not-allowed', opacity: 0.75,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', color: '#c7cdd1' }}><RocketInstUIIcon size="small" /></span>
                      <ComingSoonBadge />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#9aa5ae', lineHeight: 1.3 }}>Quiz</span>
                    <span style={{ fontSize: 12, color: '#9aa5ae', lineHeight: 1.4 }}>Auto-graded questions: multiple choice, true/false, fill-in</span>
                  </div>

                  {/* Discussion — Coming in V2 */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                    padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: '2px solid #e8eaec', background: '#f9f9f9', cursor: 'not-allowed', opacity: 0.75,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', color: '#c7cdd1' }}><MessageCircleInstUIIcon size="small" /></span>
                      <ComingSoonBadge />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#9aa5ae', lineHeight: 1.3 }}>Discussion</span>
                    <span style={{ fontSize: 12, color: '#9aa5ae', lineHeight: 1.4 }}>Graded discussion with threaded replies, reactions, and groups</span>
                  </div>

                  {/* Portfolio — Later in the roadmap */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                    padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: '2px solid #e8eaec', background: '#f9f9f9', cursor: 'not-allowed', opacity: 0.75,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', color: '#c7cdd1' }}><FolderOpenInstUIIcon size="small" /></span>
                      <ComingSoonBadge label="Later in the roadmap" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#9aa5ae', lineHeight: 1.3 }}>Portfolio</span>
                    <span style={{ fontSize: 12, color: '#9aa5ae', lineHeight: 1.4 }}>Students curate and reflect on a collection of their work</span>
                  </div>

                  {/* Worksheet/Problem Set — Later in the roadmap */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                    padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: '2px solid #e8eaec', background: '#f9f9f9', cursor: 'not-allowed', opacity: 0.75,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', color: '#c7cdd1' }}><FileTextInstUIIcon size="small" /></span>
                      <ComingSoonBadge label="Later in the roadmap" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#9aa5ae', lineHeight: 1.3 }}>Worksheet/Problem Set</span>
                    <span style={{ fontSize: 12, color: '#9aa5ae', lineHeight: 1.4 }}>Structured problems or questions students complete and submit</span>
                  </div>

                  {/* AI Conversation — Later in the roadmap */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                    padding: '14px 16px', borderRadius: 12, textAlign: 'left',
                    border: '2px solid #e8eaec', background: '#f9f9f9', cursor: 'not-allowed', opacity: 0.75,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ display: 'flex', color: '#c7cdd1' }}><SparklesInstUIIcon size="small" /></span>
                      <ComingSoonBadge label="Later in the roadmap" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#9aa5ae', lineHeight: 1.3 }}>AI Conversation</span>
                    <span style={{ fontSize: 12, color: '#9aa5ae', lineHeight: 1.4 }}>Students engage in a guided dialogue with an AI to demonstrate learning</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, borderRadius: 16, background: '#f9f9f9', border: '1px solid #e8eaec' }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#273540', margin: 0 }}>Instructions</h2>
                <RichContentEditor />
              </div>
            </div>
          </div>
          <div style={{ display: activeTab === 'Grading' ? 'block' : 'none' }}>
            <GradingTab rubricActive={rubricActive} rubricTotalPoints={rubricTotalPoints} rubricNotForGrading={rubricNotForGrading} validateRef={gradingValidateRef} />
          </div>
          {activeTab === 'Rubric' && rubricView === 'landing' && (
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 16px', display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <h1 style={{ fontSize: 20, fontWeight: 600, color: '#273540', margin: 0 }}>Rubric</h1>
                <p style={{ fontSize: 13, color: '#6a7883', margin: 0 }}>Choose how you'd like to set up the rubric for this assignment</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {([
                  { id: 'use-existing',  icon: FolderOpenInstUIIcon,    label: 'Use an existing rubric',  desc: "Find and attach a rubric you've already created in this course or institution", muted: false },
                  { id: 'create',        icon: FilePlusInstUIIcon,       label: 'Create a new rubric',     desc: 'Build a rubric from scratch or let AI generate one based on this assignment',  muted: false },
                  { id: 'edit-existing', icon: PenLineInstUIIcon,        label: 'Edit an existing rubric', desc: 'Start from a saved rubric and customize it for this assignment',               muted: false },
                  { id: 'none',          icon: XInstUIIcon,              label: 'No rubric',               desc: 'Skip rubric grading — this assignment will be graded without a rubric',        muted: true  },
                ] as const).map(({ id, icon: Icon, label, desc, muted }) => (
                  <button key={id} type="button" onClick={() => {
                    if (id === 'none') {
                      setRubricView('none')
                      setActiveTab(TABS[TABS.indexOf('Rubric') + 1])
                    } else {
                      setRubricView(id)
                    }
                  }} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 16, padding: '20px 20px',
                    borderRadius: 16, border: '1.5px solid #d7dade', background: '#fff',
                    cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = muted ? '#9aa5ae' : '#0770a3'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 6px rgba(7,112,163,0.08)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d7dade'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: muted ? '#f5f7f8' : '#f0f6fc', flexShrink: 0 }}>
                      <span style={{ display: 'flex', color: muted ? '#9aa5ae' : '#0770a3' }}><Icon size="small" /></span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: muted ? '#6a7883' : '#273540' }}>{label}</span>
                      <span style={{ fontSize: 13, color: '#6a7883', lineHeight: 1.5 }}>{desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {rubricView === 'create' && (
            <div style={{ display: activeTab === 'Rubric' ? 'flex' : 'none', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
              <RubricTab onTotalPointsChange={setRubricTotalPoints} onUseForGradingChange={setRubricNotForGrading} />
            </div>
          )}
          {activeTab === 'Rubric' && (rubricView === 'use-existing' || rubricView === 'edit-existing') && (
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <p style={{ fontSize: 15, color: '#6a7883', margin: 0 }}>{rubricView === 'use-existing' ? 'Use an existing rubric' : 'Edit an existing rubric'} — coming soon</p>
              <button type="button" onClick={() => setRubricView('landing')} style={{ fontSize: 13, color: '#0770a3', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Back to options</button>
            </div>
          )}
          {activeTab === 'Rubric' && rubricView === 'none' && (
            <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: '#f5f7f8', border: '1px solid #e8eaec' }}>
                <span style={{ display: 'flex', color: '#9aa5ae' }}><XInstUIIcon size="small" /></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#273540', margin: 0 }}>No rubric</p>
                <p style={{ fontSize: 13, color: '#6a7883', margin: 0 }}>This assignment will be graded without a rubric.</p>
              </div>
              <button type="button" onClick={() => setRubricView('landing')} style={{ fontSize: 13, color: '#0770a3', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Change rubric option</button>
            </div>
          )}
          {activeTab === 'Assign' && <AssignTab entries={assignEntries} onUpdate={updateAssignEntry} onRemove={removeAssignEntry} onAdd={addAssignEntry} />}
          {activeTab === 'Publish' && <PublishTab availableFrom={earliestAvailableFrom} onPublish={() => setIsPublished(true)} onViewCoursework={() => setShowCourseworkView(true)} />}
        </div>

        {/* Discard rubric confirmation modal */}
        {showDiscardRubricModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(39,53,64,0.5)' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px 32px', maxWidth: 400, width: '100%', margin: '0 16px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 8px 32px rgba(39,53,64,0.18)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: '#273540', margin: 0 }}>Discard rubric?</h2>
                <p style={{ fontSize: 13, color: '#6a7883', margin: 0, lineHeight: 1.5 }}>Your rubric will not be saved and this assignment will be graded without one. This can't be undone.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowDiscardRubricModal(false)} style={{ padding: '8px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: '#273540', background: 'transparent', border: '1px solid #d7dade', cursor: 'pointer' }}>Keep editing</button>
                <button type="button" onClick={() => {
                  setShowDiscardRubricModal(false)
                  setRubricView('none')
                  const i = TABS.indexOf('Rubric')
                  if (i < TABS.length - 1) setActiveTab(TABS[i + 1])
                }} style={{ padding: '8px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 600, color: '#fff', background: '#c51827', border: 'none', cursor: 'pointer' }}>Discard rubric</button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation footer */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#fff', borderTop: '1px solid #e8eaec' }}>
          <button onClick={() => { const i = TABS.indexOf(activeTab); if (i > 0) { const prev = TABS[i - 1]; setActiveTab(prev); if (prev !== 'Rubric' && !rubricActive) setRubricView('landing') } }} style={{ padding: '8px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: '#273540', background: 'transparent', border: '1px solid #d7dade', cursor: TABS.indexOf(activeTab) === 0 ? 'default' : 'pointer', opacity: TABS.indexOf(activeTab) === 0 ? 0 : 1, pointerEvents: TABS.indexOf(activeTab) === 0 ? 'none' : 'auto' }}>Back</button>
          <div style={{ display: 'flex', gap: 10 }}>
            {activeTab === 'Rubric' && rubricView === 'create' && (
              <button type="button" onClick={() => setShowDiscardRubricModal(true)} style={{ padding: '8px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: '#c51827', background: 'transparent', border: '1px solid #c51827', cursor: 'pointer' }}>Discard Rubric</button>
            )}
            <button onClick={() => { if (activeTab === 'Grading' && gradingValidateRef.current && !gradingValidateRef.current()) return; const i = TABS.indexOf(activeTab); if (i < TABS.length - 1) { const next = TABS[i + 1]; setActiveTab(next); if (next !== 'Rubric' && !rubricActive) setRubricView('landing') } }} style={{ padding: '8px 20px', borderRadius: 9999, fontSize: 13, fontWeight: 500, color: '#fff', background: '#1d354f', border: 'none', cursor: 'pointer', opacity: TABS.indexOf(activeTab) === TABS.length - 1 ? 0 : 1, pointerEvents: TABS.indexOf(activeTab) === TABS.length - 1 ? 'none' : 'auto' }}>{activeTab === 'Rubric' && rubricView === 'create' ? 'Save and Next' : 'Next'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
