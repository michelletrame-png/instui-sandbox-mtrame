/* eslint-disable instui/no-hardcoded-hex */
import { useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { Tray } from '@instructure/ui-tray/latest'
import { View } from '@instructure/ui-view/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { IconButton } from '@instructure/ui-buttons/latest'
import {
  XInstUIIcon,
  InfoInstUIIcon,
  ChevronRightInstUIIcon,
  CheckInstUIIcon,
} from '@instructure/ui-icons'

type GradeRow     = { id: number; grade: string; minPct: string }
type CustomScheme = { id: number; name: string; rows: GradeRow[] }
const DEFAULT_ROWS: GradeRow[] = [
  { id: 1, grade: 'A',  minPct: '94' },
  { id: 2, grade: 'B',  minPct: '80' },
  { id: 3, grade: 'C',  minPct: '70' },
  { id: 4, grade: 'D',  minPct: '60' },
  { id: 5, grade: 'F',  minPct: '0'  },
]

export function GradebookSettingsTray({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { sharedTokens } = useComputedTheme()
  const border      = sharedTokens.stroke.baseColor          ?? '#c7cdd1'
  const containerBg = sharedTokens.background.containerColor ?? '#ffffff'
  const mutedBg     = sharedTokens.background.mutedColor     ?? '#f5f7f8'

  const [settingsPanel, setSettingsPanel] = useState<string | null>(null)

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
  const [activeSchemeId, setActiveSchemeId] = useState<'default' | number>('default')
  const [customSchemes, setCustomSchemes]   = useState<CustomScheme[]>([])
  const [schemeNextId, setSchemeNextId]     = useState(1)
  const [creatingScheme, setCreatingScheme] = useState(false)
  const [newSchemeName, setNewSchemeName]   = useState('')
  const [newSchemeRows, setNewSchemeRows]   = useState<GradeRow[]>(DEFAULT_ROWS)
  const [rowNextId, setRowNextId]           = useState(6)

  // Submission Policies
  const [autoDeductLate, setAutoDeductLate]         = useState(true)
  const [lateDeductPct, setLateDeductPct]           = useState('10')
  const [lateDeductInterval, setLateDeductInterval] = useState('Day')
  const [lateLowestGrade, setLateLowestGrade]       = useState('50')
  const [autoAssignMissing, setAutoAssignMissing]   = useState(false)
  const [missingGradePct, setMissingGradePct]       = useState('0')

  // Posting Policies
  const [coursePostPolicy, setCoursePostPolicy] = useState<'automatic' | 'manual'>('manual')
  const [postFor, setPostFor]                   = useState<'everyone' | 'graded'>('graded')
  const [postSection, setPostSection]           = useState('all')
  const [postConfirmed, setPostConfirmed]       = useState(false)

  // Gradebook Settings
  const [columnSortOrder, setColumnSortOrder]     = useState('due-date')
  const [showUnpublished, setShowUnpublished]     = useState(false)
  const [showTotalColumn, setShowTotalColumn]     = useState(true)
  const [totalColumnSticky, setTotalColumnSticky] = useState(true)
  const [hideGradeTotals, setHideGradeTotals]     = useState(false)

  function dismiss() {
    onClose()
    setSettingsPanel(null)
    setCreatingScheme(false)
  }

  return (
    <Tray
      label="Grading Configuration"
      open={open}
      onDismiss={dismiss}
      placement="end"
      size="small"
      shouldCloseOnDocumentClick
      themeOverride={{ padding: '0' } as object}
    >
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
            <IconButton screenReaderLabel="Close" color="secondary" size="small" withBackground={false} withBorder={false} renderIcon={<XInstUIIcon />} onClick={dismiss} />
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', height: 'calc(100% - 53px)' }}>

          {/* Menu list */}
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

          {/* Assignment Group Weights */}
          {settingsPanel === 'Assignment Group Weights' && (() => {
            const totalWeight = assignmentGroups.reduce((sum, g) => sum + (parseFloat(g.weight) || 0), 0)
            const weightError = weightingEnabled && Math.round(totalWeight) !== 100
            return (
              <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px 32px', gap: 8, paddingBottom: 6, borderBottom: `1px solid ${border}` }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Group</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#8d959f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</span>
                      <span />
                    </div>
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

          {/* Grading Schemes */}
          {settingsPanel === 'Grading Schemes' && !creatingScheme && (
            <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#576773' }}>Active scheme</span>
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

              <button
                type="button"
                onClick={() => { setNewSchemeName(''); setNewSchemeRows(DEFAULT_ROWS); setRowNextId(6); setCreatingScheme(true) }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', fontSize: 13, fontWeight: 600, color: '#0770a3', background: 'none', border: `1px dashed #0770a3`, borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
              >
                + Add new grading scheme
              </button>
            </div>
          )}

          {settingsPanel === 'Grading Schemes' && creatingScheme && (
            <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
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

          {/* Submission Policies */}
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

          {/* Posting Policies */}
          {settingsPanel === 'Posting Policies' && (
            <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#576773', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course Posting Policy</div>
                <div style={{ fontSize: 12, color: '#576773' }}>Sets the default posting behavior for all assignments in this course. Individual assignments can override this setting.</div>
                {([
                  { value: 'automatic' as const, label: 'Automatic', desc: 'Grades are visible to students as soon as they are entered in the gradebook.' },
                  { value: 'manual'    as const, label: 'Manual',    desc: 'Grades are hidden from students by default. You must explicitly post grades to make them visible.' },
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

              <div style={{ borderTop: `1px solid ${border}` }} />

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

          {/* Gradebook Settings */}
          {settingsPanel === 'Gradebook Settings' && (
            <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
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
    </Tray>
  )
}
