/**
 * Edit assignment dates — Term remap concept (the "completely different" one).
 *
 * Instead of nudging individual dates, you frame the task as mapping the old
 * term onto a new one. Set the new term's start and end, mark the days off on a
 * calendar, and every assignment is re-spaced proportionally so the rhythm of
 * the course carries over. A before/after review list spells out each change in
 * plain language so saving feels safe. This directly serves the most common
 * real task: reusing a course in a new term with a different academic calendar.
 */
import { useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { Grid } from '@instructure/ui-grid/latest'
import {
  MinusInstUIIcon,
  PlusInstUIIcon,
  ArrowRightInstUIIcon,
  TriangleAlertInstUIIcon,
  CircleCheckInstUIIcon,
} from '@instructure/ui-icons'
import type { PrototypeProps } from '../../registry'
import { Shell } from '../edit-dates-shared/Shell'
import { ASSIGNMENTS, SOURCE_TERM, TARGET_TERM, TARGET_OFF_DAYS } from '../edit-dates-shared/data'
import type { NonInstructionalRange } from '../edit-dates-shared/data'
import { computeRemap } from '../edit-dates-shared/model'
import { addDays, fmtShort, fmtWithWeekday, fmtRange, toDayKey, WEEKDAYS, MONTHS } from '../edit-dates-shared/dates'

/** Expand the seeded break ranges into a day-keyed label map. */
function expandOffDays(ranges: NonInstructionalRange[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const r of ranges) {
    let cur = `${r.start}T00:00:00`
    while (toDayKey(new Date(cur)) <= r.end) {
      map[toDayKey(new Date(cur))] = r.label
      cur = addDays(cur, 1)
    }
  }
  return map
}

export default function EditDatesRemap({ isDark, onToggleTheme }: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const [targetStart, setTargetStart] = useState(TARGET_TERM.start)
  const [targetEnd, setTargetEnd] = useState(TARGET_TERM.end)
  const [offDayMap, setOffDayMap] = useState<Record<string, string>>(() => expandOffDays(TARGET_OFF_DAYS))

  const c = {
    surface: sharedTokens.background.containerColor,
    muted: sharedTokens.background.mutedColor,
    line: sharedTokens.stroke.mutedColor,
    accent: sharedTokens.stroke.accentBlue,
    accentBg: sharedTokens.background.accentBlue,
    off: sharedTokens.background.accentHoney,
    offLine: sharedTokens.stroke.accentHoney,
  }

  const offRanges: NonInstructionalRange[] = Object.entries(offDayMap).map(([day, label]) => ({
    id: day,
    label,
    start: day,
    end: day,
  }))

  const { items, summary, scalePct } = computeRemap(ASSIGNMENTS, SOURCE_TERM, targetStart, targetEnd, offRanges)

  // count of assignments landing on each day, for calendar dots
  const dotCount: Record<string, number> = {}
  for (const it of items) {
    const key = toDayKey(new Date(it.remappedDue))
    dotCount[key] = (dotCount[key] ?? 0) + 1
  }

  const toggleOffDay = (dayKey: string) => {
    setOffDayMap((prev) => {
      const next = { ...prev }
      if (next[dayKey]) delete next[dayKey]
      else next[dayKey] = 'Day off'
      return next
    })
  }

  // months the target term spans
  const monthList: { year: number; month: number }[] = []
  {
    const cur = new Date(`${targetStart}T00:00:00`)
    cur.setDate(1)
    const last = new Date(`${targetEnd}T00:00:00`)
    while (cur <= last) {
      monthList.push({ year: cur.getFullYear(), month: cur.getMonth() })
      cur.setMonth(cur.getMonth() + 1)
    }
  }

  const scaleText =
    scalePct === 0
      ? 'Same length as the old term'
      : scalePct > 0
        ? `Stretched ${scalePct}% to fit a longer term`
        : `Compressed ${Math.abs(scalePct)}% to fit a shorter term`

  const actions = (
    <Flex gap="small">
      <Button onClick={() => { setTargetStart(TARGET_TERM.start); setTargetEnd(TARGET_TERM.end) }}>Cancel</Button>
      <Button color="primary">Save {summary.totalCount} dates</Button>
    </Flex>
  )

  return (
    <Shell
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      subtitle="Map this course onto a new term and review every change before you save."
      actions={actions}
    >
      {/* term mapping controls */}
      <View
        as="div"
        background="primary"
        themeOverride={{ backgroundPrimary: c.surface }}
        borderRadius={sharedTokens.borderRadius.card.md}
        shadow="resting"
        padding="medium"
        display="block"
      >
        <Flex gap="large" alignItems="center" wrap="wrap">
          <Flex.Item>
            <Text size="small" color="secondary" as="div">From</Text>
            <Text weight="bold" as="div">{SOURCE_TERM.name}</Text>
            <Text size="small" color="secondary" as="div">{fmtRange(SOURCE_TERM.start, SOURCE_TERM.end)}</Text>
          </Flex.Item>

          <Flex.Item>
            <ArrowRightInstUIIcon size="sm" themeOverride={{ color: c.line } as object} />
          </Flex.Item>

          <Flex.Item shouldGrow shouldShrink>
            <Text size="small" color="secondary" as="div">To a new term</Text>
            <Flex gap="large" wrap="wrap" margin="xx-small 0 0 0">
              <DateStepper label="Term starts" value={targetStart} onChange={setTargetStart} />
              <DateStepper label="Term ends" value={targetEnd} onChange={setTargetEnd} />
            </Flex>
            <Text size="small" color="secondary" as="div">{scaleText}</Text>
          </Flex.Item>
        </Flex>
      </View>

      <Grid colSpacing="medium" rowSpacing="medium" startAt="large">
        <Grid.Row>
          {/* calendar */}
          <Grid.Col width={{ large: 7 }}>
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
                <Flex.Item shouldGrow>
                  <Heading level="h2" variant="titleCardRegular" margin="0">New term calendar</Heading>
                </Flex.Item>
                <LegendSwatch color={c.accentBg} label="Assignment due" />
                <LegendSwatch color={c.off} label="Day off — select to toggle" />
              </Flex>

              <Flex direction="column" gap="medium">
                {monthList.map(({ year, month }) => (
                  <MonthGrid
                    key={`${year}-${month}`}
                    year={year}
                    month={month}
                    targetStart={targetStart}
                    targetEnd={targetEnd}
                    offDayMap={offDayMap}
                    dotCount={dotCount}
                    onToggle={toggleOffDay}
                    c={c}
                  />
                ))}
              </Flex>
            </View>
          </Grid.Col>

          {/* before / after review */}
          <Grid.Col width={{ large: 5 }}>
            <View
              as="div"
              background="primary"
              themeOverride={{ backgroundPrimary: c.surface }}
              borderRadius={sharedTokens.borderRadius.card.lg}
              shadow="resting"
              padding="medium"
              display="block"
            >
              <Heading level="h2" variant="titleCardRegular" margin="0 0 x-small 0">Review changes</Heading>
              <Flex gap="small" alignItems="center" margin="0 0 small 0" wrap="wrap">
                <Text size="small" color="secondary">{summary.totalCount} dates remapped</Text>
                {summary.weekendCount + summary.offDayCount > 0 ? (
                  <Flex gap="xx-small" alignItems="center" display="inline-flex">
                    <TriangleAlertInstUIIcon size="xs" themeOverride={{ color: c.offLine } as object} />
                    <Text size="small" color="secondary">{summary.weekendCount + summary.offDayCount} need a look</Text>
                  </Flex>
                ) : (
                  <Flex gap="xx-small" alignItems="center" display="inline-flex">
                    <CircleCheckInstUIIcon size="xs" themeOverride={{ color: sharedTokens.stroke.successColor } as object} />
                    <Text size="small" color="secondary">All clear</Text>
                  </Flex>
                )}
              </Flex>

              <Flex direction="column" gap="x-small">
                {items.map((item) => {
                  const flagged = item.landsOnWeekend || !!item.landsOnOffDay
                  return (
                    <View
                      key={item.key}
                      as="div"
                      background="primary"
                      themeOverride={{ backgroundPrimary: c.muted }}
                      borderRadius="medium"
                      padding="small"
                      display="block"
                    >
                      <Text weight="bold" size="small" as="div">{item.name}</Text>
                      {!item.base && (
                        <Text size="x-small" color="secondary" as="div">{item.audience}</Text>
                      )}
                      <Flex gap="x-small" alignItems="center" margin="xx-small 0 0 0" wrap="wrap">
                        <Text size="small">
                          <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{fmtShort(item.originalDue)}</span>
                        </Text>
                        <ArrowRightInstUIIcon size="xs" themeOverride={{ color: c.line } as object} />
                        <Text size="small" weight="bold">{fmtWithWeekday(item.remappedDue)}</Text>
                      </Flex>
                      {flagged && (
                        <Flex gap="xx-small" alignItems="center" margin="xx-small 0 0 0">
                          <TriangleAlertInstUIIcon size="xs" themeOverride={{ color: c.offLine } as object} />
                          <Text size="x-small" color="secondary">
                            Lands on {item.landsOnOffDay ? item.landsOnOffDay.label : 'a weekend'}
                          </Text>
                        </Flex>
                      )}
                    </View>
                  )
                })}
              </Flex>
            </View>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </Shell>
  )
}

type Palette = {
  surface: string
  muted: string
  line: string
  accent: string
  accentBg: string
  off: string
  offLine: string
}

function DateStepper({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const iso = `${value}T00:00:00`
  const step = (n: number) => onChange(addDays(iso, n).slice(0, 10))
  return (
    <Flex.Item>
      <Text size="x-small" color="secondary" as="div">{label}</Text>
      <Flex gap="x-small" alignItems="center">
        <IconButton size="small" screenReaderLabel={`${label}: one week earlier`} renderIcon={<MinusInstUIIcon />} onClick={() => step(-7)} />
        <View as="div" width="6.5rem" textAlign="center">
          <Text weight="bold" as="div">{fmtShort(iso)}</Text>
          <Text size="x-small" color="secondary" as="div">{WEEKDAYS[new Date(iso).getDay()]}</Text>
        </View>
        <IconButton size="small" screenReaderLabel={`${label}: one week later`} renderIcon={<PlusInstUIIcon />} onClick={() => step(7)} />
      </Flex>
    </Flex.Item>
  )
}

function MonthGrid({
  year,
  month,
  targetStart,
  targetEnd,
  offDayMap,
  dotCount,
  onToggle,
  c,
}: {
  year: number
  month: number
  targetStart: string
  targetEnd: string
  offDayMap: Record<string, string>
  dotCount: Record<string, number>
  onToggle: (k: string) => void
  c: Palette
}) {
  const first = new Date(year, month, 1)
  const leading = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <View as="div" display="block">
      <Text weight="bold" size="small" as="div">{MONTHS[month]} {year}</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginTop: '6px' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
          <div key={`h${i}`} style={{ textAlign: 'center' }}>
            <Text size="x-small" color="secondary">{w}</Text>
          </div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`b${i}`} />
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const inTerm = key >= targetStart && key <= targetEnd
          const isOff = !!offDayMap[key]
          const weekday = new Date(year, month, d).getDay()
          const isWeekend = weekday === 0 || weekday === 6
          const count = dotCount[key] ?? 0
          const bg = isOff ? c.off : count > 0 ? c.accentBg : isWeekend ? c.muted : 'transparent'
          return (
            <button
              key={key}
              type="button"
              onClick={() => onToggle(key)}
              disabled={!inTerm}
              aria-pressed={isOff}
              aria-label={`${MONTHS[month]} ${d}${isOff ? ', day off' : ''}${count > 0 ? `, ${count} due` : ''}`}
              style={{
                position: 'relative',
                height: '38px',
                border: 'none',
                borderRadius: '6px',
                background: bg,
                cursor: inTerm ? 'pointer' : 'default',
                opacity: inTerm ? 1 : 0.35,
                padding: 0,
              }}
            >
              <span style={{ position: 'absolute', top: '3px', left: '5px' }}>
                <Text size="x-small">{d}</Text>
              </span>
              {count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: c.accent,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </View>
  )
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <Flex gap="xx-small" alignItems="center" display="inline-flex">
      <div style={{ width: '16px', height: '12px', borderRadius: '3px', background: color }} />
      <Text size="small" color="secondary">{label}</Text>
    </Flex>
  )
}
