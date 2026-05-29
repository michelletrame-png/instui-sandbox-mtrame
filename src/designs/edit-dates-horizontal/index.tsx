/**
 * Edit assignment dates — Horizontal timeline concept.
 *
 * The whole term reads left → right and fits the container width (no horizontal
 * scroll). Each assignment is a marker on the time axis; shifting dates slides
 * every marker, leaving a faint "ghost" at the old spot with a connector to the
 * new one. Days off appear as quiet shaded bands so a shift that lands on a
 * break is obvious. Reads from the shared fixture shaped like the Canvas API.
 */
import { useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import type { PrototypeProps } from '../../registry'
import { Shell } from '../edit-dates-shared/Shell'
import { ShiftControl } from '../edit-dates-shared/ShiftControl'
import { SummaryBar } from '../edit-dates-shared/SummaryBar'
import { TimelineSrList } from '../edit-dates-shared/TimelineSrList'
import { ASSIGNMENTS, SOURCE_OFF_DAYS, SOURCE_TERM } from '../edit-dates-shared/data'
import { computeTimeline, packLanes } from '../edit-dates-shared/model'
import { fmtShort, fractionWithin, toDayKey, MONTHS } from '../edit-dates-shared/dates'

const LANE_GAP = 70
const BASELINE = 44
const STEM_BASE = 16

export default function EditDatesHorizontal({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const [shiftDays, setShiftDays] = useState(0)

  // React Compiler is enabled, so these plain computations are auto-memoized.
  const { items, summary } = computeTimeline(ASSIGNMENTS, shiftDays, SOURCE_OFF_DAYS)

  const c = {
    surface: sharedTokens.background.containerColor,
    muted: sharedTokens.background.mutedColor,
    line: sharedTokens.stroke.mutedColor,
    base: sharedTokens.stroke.baseColor,
    accent: sharedTokens.stroke.accentBlue,
    accentBg: sharedTokens.background.accentBlue,
    off: sharedTokens.background.accentHoney,
    offLine: sharedTokens.stroke.accentHoney,
  }

  // Window covers the term plus any dates pushed outside it, padded a few days.
  const windowDates = [
    SOURCE_TERM.start,
    SOURCE_TERM.end,
    ...items.flatMap((i) => [i.originalDue, i.shiftedDue]),
  ]
  const windowTimes = windowDates.map((d) => new Date(d).getTime())
  const winStart = new Date(Math.min(...windowTimes))
  winStart.setDate(winStart.getDate() - 3)
  const winEnd = new Date(Math.max(...windowTimes))
  winEnd.setDate(winEnd.getDate() + 3)
  const startIso = `${toDayKey(winStart)}T00:00:00`
  const endIso = `${toDayKey(winEnd)}T00:00:00`

  const pct = (iso: string) => fractionWithin(iso, startIso, endIso) * 100

  const lanes = packLanes(items.map((i) => fractionWithin(i.shiftedDue, startIso, endIso)), 0.13)
  const maxLane = lanes.length ? Math.max(...lanes) : 0
  const canvasHeight = BASELINE + STEM_BASE + maxLane * LANE_GAP + 96

  // Month tick marks within the window.
  const months: { label: string; left: number }[] = []
  const cursor = new Date(startIso)
  cursor.setDate(1)
  while (cursor <= winEnd) {
    months.push({ label: MONTHS[cursor.getMonth()], left: pct(`${toDayKey(cursor)}T00:00:00`) })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  const actions = (
    <Flex gap="small">
      <Button onClick={() => setShiftDays(0)}>Cancel</Button>
      <Button color="primary" interaction={shiftDays === 0 ? 'disabled' : 'enabled'}>
        Save {summary.movedCount > 0 ? `${summary.movedCount} changes` : ''}
      </Button>
    </Flex>
  )

  return (
    <Shell
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      subtitle="See the whole term at a glance and slide dates into place."
      actions={actions}
    >
      <ShiftControl shiftDays={shiftDays} onChange={setShiftDays} />
      <SummaryBar summary={summary} />

      <View
        as="div"
        background="primary"
        themeOverride={{ backgroundPrimary: c.surface }}
        borderRadius={sharedTokens.borderRadius.card.lg}
        shadow="resting"
        padding="medium"
        display="block"
      >
        <Flex gap="medium" alignItems="center" margin="0 0 small 0" wrap="wrap">
          <LegendDot color={c.accent} label="New date" filled />
          <LegendDot color={c.line} label="Original date" />
          <LegendSwatch color={c.off} label="Day off" />
        </Flex>

        <TimelineSrList items={items} />

        <View as="div" position="relative" display="block" height={`${canvasHeight}px`} overflowX="hidden">
          {/* inner track inset from edges so first/last markers stay on screen */}
          <View as="div" position="relative" display="block" height="100%" margin="0 large">
            {/* off-day bands */}
            {SOURCE_OFF_DAYS.map((r) => {
              const left = pct(`${r.start}T00:00:00`)
              const right = pct(`${r.end}T23:59:59`)
              return (
                <div
                  key={r.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: `${BASELINE - 6}px`,
                    left: `${left}%`,
                    width: `${Math.max(right - left, 0.6)}%`,
                    background: c.off,
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ position: 'absolute', top: 4, left: 6, whiteSpace: 'nowrap' }}>
                    <Text size="x-small" color="secondary">
                      {r.label}
                    </Text>
                  </div>
                </div>
              )
            })}

            {/* baseline */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${BASELINE}px`,
                height: '2px',
                background: c.line,
              }}
            />

            {/* month ticks */}
            {months.map((m, idx) => (
              <div key={idx} style={{ position: 'absolute', bottom: `${BASELINE - 26}px`, left: `${m.left}%`, transform: 'translateX(-50%)' }}>
                <Text size="x-small" color="secondary">
                  {m.label}
                </Text>
              </div>
            ))}

            {/* markers */}
            {items.map((item, i) => {
              const x = pct(item.shiftedDue)
              const ox = pct(item.originalDue)
              const stem = STEM_BASE + lanes[i] * LANE_GAP
              const moved = item.movedDays !== 0
              const flagged = item.landsOnWeekend || !!item.landsOnOffDay
              const dotColor = flagged ? c.offLine : moved ? c.accent : c.line
              return (
                <div key={item.key}>
                  {/* connector old → new */}
                  {moved && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: `${BASELINE + 0.5}px`,
                        left: `${Math.min(x, ox)}%`,
                        width: `${Math.abs(x - ox)}%`,
                        height: '2px',
                        background: c.accent,
                        opacity: 0.5,
                      }}
                    />
                  )}
                  {/* ghost dot (original) */}
                  {moved && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: `${BASELINE - 3}px`,
                        left: `${ox}%`,
                        transform: 'translateX(-50%)',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: `2px solid ${c.line}`,
                        background: c.surface,
                      }}
                    />
                  )}
                  {/* stem */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: `${BASELINE}px`,
                      height: `${stem}px`,
                      left: `${x}%`,
                      width: '2px',
                      background: dotColor,
                      transform: 'translateX(-50%)',
                      opacity: 0.55,
                    }}
                  />
                  {/* new dot */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: `${BASELINE - 4}px`,
                      left: `${x}%`,
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: dotColor,
                    }}
                  />
                  {/* label card */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: `${BASELINE + stem}px`,
                      left: `${x}%`,
                      transform: 'translateX(-50%)',
                      width: '150px',
                    }}
                  >
                    <View
                      as="div"
                      background="primary"
                      themeOverride={{ backgroundPrimary: moved ? c.accentBg : c.muted }}
                      borderRadius="medium"
                      padding="x-small small"
                      display="block"
                    >
                      <Text size="x-small" weight="bold" as="div">
                        {item.name}
                      </Text>
                      <Text size="x-small" as="div">
                        {moved ? (
                          <>
                            <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{fmtShort(item.originalDue)}</span>
                            {'  →  '}
                            {fmtShort(item.shiftedDue)}
                          </>
                        ) : (
                          fmtShort(item.shiftedDue)
                        )}
                      </Text>
                      {!item.base && (
                        <Text size="x-small" color="secondary" as="div">
                          {item.audience}
                        </Text>
                      )}
                    </View>
                  </div>
                </div>
              )
            })}
          </View>
        </View>
      </View>
    </Shell>
  )
}

function LegendDot({ color, label, filled }: { color: string; label: string; filled?: boolean }) {
  return (
    <Flex gap="xx-small" alignItems="center" display="inline-flex">
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: filled ? color : 'transparent',
          border: `2px solid ${color}`,
        }}
      />
      <Text size="small" color="secondary">
        {label}
      </Text>
    </Flex>
  )
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <Flex gap="xx-small" alignItems="center" display="inline-flex">
      <div style={{ width: '16px', height: '12px', borderRadius: '3px', background: color }} />
      <Text size="small" color="secondary">
        {label}
      </Text>
    </Flex>
  )
}
