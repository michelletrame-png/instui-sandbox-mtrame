/**
 * Edit assignment dates — Vertical timeline concept.
 *
 * Same mental model as the horizontal version, rotated so time flows top →
 * bottom and the page scrolls vertically — which is far safer for accessibility
 * than horizontal scrolling. The axis carries true date spacing and day-off
 * bands; assignment cards sit to the right, packed into columns so they never
 * overlap, each connected back to its real date on the axis. Moved dates leave
 * a ghost on the axis with a connector along it.
 */
import { useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { TriangleAlertInstUIIcon } from '@instructure/ui-icons'
import type { PrototypeProps } from '../../registry'
import { Shell } from '../edit-dates-shared/Shell'
import { ShiftControl } from '../edit-dates-shared/ShiftControl'
import { SummaryBar } from '../edit-dates-shared/SummaryBar'
import { TimelineSrList } from '../edit-dates-shared/TimelineSrList'
import { ASSIGNMENTS, SOURCE_OFF_DAYS, SOURCE_TERM } from '../edit-dates-shared/data'
import { computeTimeline, packLanes } from '../edit-dates-shared/model'
import { fmtShort, fmtWithWeekday, fractionWithin, daysBetween, toDayKey, MONTHS } from '../edit-dates-shared/dates'

const PX_PER_DAY = 13
const PAD_TOP = 16
const AXIS_X = 84
const CARD_W = 188
const COL_GAP = 12

export default function EditDatesVertical({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const [shiftDays, setShiftDays] = useState(0)

  const { items, summary } = computeTimeline(ASSIGNMENTS, shiftDays, SOURCE_OFF_DAYS)

  const c = {
    surface: sharedTokens.background.containerColor,
    muted: sharedTokens.background.mutedColor,
    line: sharedTokens.stroke.mutedColor,
    accent: sharedTokens.stroke.accentBlue,
    accentBg: sharedTokens.background.accentBlue,
    off: sharedTokens.background.accentHoney,
    offLine: sharedTokens.stroke.accentHoney,
  }

  // Window covers the term plus anything pushed outside it.
  const windowDates = [SOURCE_TERM.start, SOURCE_TERM.end, ...items.flatMap((i) => [i.originalDue, i.shiftedDue])]
  const windowTimes = windowDates.map((d) => new Date(d).getTime())
  const winStart = new Date(Math.min(...windowTimes))
  winStart.setDate(winStart.getDate() - 3)
  const winEnd = new Date(Math.max(...windowTimes))
  winEnd.setDate(winEnd.getDate() + 3)
  const startIso = `${toDayKey(winStart)}T00:00:00`
  const endIso = `${toDayKey(winEnd)}T00:00:00`

  const trackHeight = Math.max(daysBetween(startIso, endIso), 1) * PX_PER_DAY
  const yPx = (iso: string) => PAD_TOP + fractionWithin(iso, startIso, endIso) * trackHeight

  // Pack cards into columns so close dates don't overlap.
  const minGap = 70 / trackHeight
  const cols = packLanes(items.map((i) => fractionWithin(i.shiftedDue, startIso, endIso)), minGap)
  const canvasHeight = trackHeight + PAD_TOP * 2

  // Month ticks down the axis.
  const months: { label: string; top: number }[] = []
  const cursor = new Date(startIso)
  cursor.setDate(1)
  while (cursor <= winEnd) {
    months.push({ label: MONTHS[cursor.getMonth()], top: yPx(`${toDayKey(cursor)}T00:00:00`) })
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
      subtitle="Scroll top to bottom through the term — no sideways scrolling."
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
        <TimelineSrList items={items} />

        <View as="div" position="relative" display="block" height={`${canvasHeight}px`}>
          {/* off-day bands */}
          {SOURCE_OFF_DAYS.map((r) => {
            const top = yPx(`${r.start}T00:00:00`)
            const bottom = yPx(`${r.end}T23:59:59`)
            return (
              <div
                key={r.id}
                style={{
                  position: 'absolute',
                  left: `${AXIS_X - 8}px`,
                  right: 0,
                  top: `${top}px`,
                  height: `${Math.max(bottom - top, 8)}px`,
                  background: c.off,
                  borderRadius: '6px',
                }}
              >
                <div style={{ position: 'absolute', top: 2, right: 8 }}>
                  <Text size="x-small" color="secondary">
                    {r.label}
                  </Text>
                </div>
              </div>
            )
          })}

          {/* axis */}
          <div style={{ position: 'absolute', top: `${PAD_TOP}px`, bottom: `${PAD_TOP}px`, left: `${AXIS_X}px`, width: '2px', background: c.line }} />

          {/* month labels left of axis */}
          {months.map((m, idx) => (
            <div key={idx} style={{ position: 'absolute', top: `${m.top}px`, left: 0, width: `${AXIS_X - 12}px`, textAlign: 'right', transform: 'translateY(-50%)' }}>
              <Text size="x-small" color="secondary">
                {m.label}
              </Text>
            </div>
          ))}

          {/* markers + cards */}
          {items.map((item, i) => {
            const y = yPx(item.shiftedDue)
            const oy = yPx(item.originalDue)
            const moved = item.movedDays !== 0
            const flagged = item.landsOnWeekend || !!item.landsOnOffDay
            const dotColor = flagged ? c.offLine : moved ? c.accent : c.line
            const cardLeft = AXIS_X + 28 + cols[i] * (CARD_W + COL_GAP)
            return (
              <div key={item.key}>
                {/* movement along the axis (old → new) */}
                {moved && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${AXIS_X}px`,
                      top: `${Math.min(y, oy)}px`,
                      height: `${Math.abs(y - oy)}px`,
                      width: '2px',
                      background: c.accent,
                      opacity: 0.5,
                      transform: 'translateX(-50%)',
                    }}
                  />
                )}
                {/* ghost dot at original date */}
                {moved && (
                  <div
                    style={{
                      position: 'absolute',
                      left: `${AXIS_X}px`,
                      top: `${oy}px`,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: `2px solid ${c.line}`,
                      background: c.surface,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                {/* connector axis → card */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${AXIS_X}px`,
                    top: `${y}px`,
                    width: `${cardLeft - AXIS_X}px`,
                    height: '2px',
                    background: dotColor,
                    opacity: 0.5,
                    transform: 'translateY(-50%)',
                  }}
                />
                {/* dot on axis at new date */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${AXIS_X}px`,
                    top: `${y}px`,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: dotColor,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                {/* card */}
                <div style={{ position: 'absolute', left: `${cardLeft}px`, top: `${y}px`, width: `${CARD_W}px`, transform: 'translateY(-50%)' }}>
                  <View
                    as="div"
                    background="primary"
                    themeOverride={{ backgroundPrimary: moved ? c.accentBg : c.muted }}
                    borderRadius="medium"
                    padding="x-small small"
                    display="block"
                  >
                    <Text size="small" weight="bold" as="div">
                      {item.name}
                    </Text>
                    <Text size="x-small" as="div">
                      {moved ? (
                        <>
                          <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{fmtShort(item.originalDue)}</span>
                          {'  →  '}
                          {fmtWithWeekday(item.shiftedDue)}
                        </>
                      ) : (
                        fmtWithWeekday(item.shiftedDue)
                      )}
                    </Text>
                    {!item.base && (
                      <Text size="x-small" color="secondary" as="div">
                        {item.audience}
                      </Text>
                    )}
                    {flagged && (
                      <Flex gap="xx-small" alignItems="center" margin="xx-small 0 0 0">
                        <TriangleAlertInstUIIcon size="xs" themeOverride={{ color: c.offLine } as object} />
                        <Text size="x-small" color="secondary">
                          {item.landsOnOffDay ? item.landsOnOffDay.label : 'Weekend'}
                        </Text>
                      </Flex>
                    )}
                  </View>
                </div>
              </div>
            )
          })}
        </View>
      </View>
    </Shell>
  )
}
