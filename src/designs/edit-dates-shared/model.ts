/**
 * model.ts — derives the "before vs after" picture for the timeline prototypes.
 *
 * Given the source assignments, a whole-day shift, and the marked days off, it
 * produces one flat list of due-date markers (one per override that has a due
 * date) plus a plain-language summary. Both timeline prototypes render from this
 * so they stay consistent.
 */
import type { Assignment, NonInstructionalRange, Term } from './data'
import { addDays, daysBetween, isWeekend, offDayFor } from './dates'

export interface TimelineItem {
  key: string
  assignmentId: string
  overrideId: string
  name: string
  /** "Everyone", "Section 2", … */
  audience: string
  base: boolean
  originalDue: string
  shiftedDue: string
  /** + = later, − = earlier (equals the shift, but kept per-item for clarity) */
  movedDays: number
  landsOnWeekend: boolean
  landsOnOffDay: NonInstructionalRange | null
}

export interface Summary {
  totalCount: number
  movedCount: number
  shiftDays: number
  weekendCount: number
  offDayCount: number
}

export interface ComputedTimeline {
  items: TimelineItem[]
  summary: Summary
}

export function computeTimeline(
  assignments: Assignment[],
  shiftDays: number,
  offDays: NonInstructionalRange[],
): ComputedTimeline {
  const items: TimelineItem[] = []

  for (const a of assignments) {
    for (const o of a.all_dates) {
      if (!o.due_at) continue
      const shiftedDue = shiftDays === 0 ? o.due_at : addDays(o.due_at, shiftDays)
      items.push({
        key: `${a.id}:${o.id}`,
        assignmentId: a.id,
        overrideId: o.id,
        name: a.name,
        audience: o.title,
        base: o.base,
        originalDue: o.due_at,
        shiftedDue,
        movedDays: shiftDays,
        landsOnWeekend: isWeekend(shiftedDue),
        landsOnOffDay: offDayFor(shiftedDue, offDays),
      })
    }
  }

  items.sort((x, y) => x.shiftedDue.localeCompare(y.shiftedDue))

  const summary: Summary = {
    totalCount: items.length,
    movedCount: shiftDays === 0 ? 0 : items.length,
    shiftDays,
    weekendCount: items.filter((i) => i.landsOnWeekend).length,
    offDayCount: items.filter((i) => i.landsOnOffDay).length,
  }

  return { items, summary }
}

export interface RemapItem {
  key: string
  assignmentId: string
  overrideId: string
  name: string
  audience: string
  base: boolean
  originalDue: string
  remappedDue: string
  movedDays: number
  landsOnWeekend: boolean
  landsOnOffDay: NonInstructionalRange | null
}

export interface RemapResult {
  items: RemapItem[]
  summary: Summary
  /** % change in term length: +6 = new term is 6% longer than the old one. */
  scalePct: number
}

/**
 * Maps each source date proportionally into the target term. A date one third
 * of the way through the old term lands one third of the way through the new
 * one, so the rhythm of the course is preserved even when the calendar shape
 * changes between terms.
 */
export function computeRemap(
  assignments: Assignment[],
  source: Term,
  targetStart: string,
  targetEnd: string,
  offDays: NonInstructionalRange[],
): RemapResult {
  const sourceSpan = Math.max(daysBetween(source.start, source.end), 1)
  const targetSpan = Math.max(daysBetween(targetStart, targetEnd), 1)
  const items: RemapItem[] = []

  for (const a of assignments) {
    for (const o of a.all_dates) {
      if (!o.due_at) continue
      const frac = daysBetween(source.start, o.due_at) / sourceSpan
      const offset = Math.round(frac * targetSpan)
      const remappedDue = addDays(`${targetStart}${o.due_at.slice(o.due_at.indexOf('T'))}`, offset)
      items.push({
        key: `${a.id}:${o.id}`,
        assignmentId: a.id,
        overrideId: o.id,
        name: a.name,
        audience: o.title,
        base: o.base,
        originalDue: o.due_at,
        remappedDue,
        movedDays: daysBetween(o.due_at, remappedDue),
        landsOnWeekend: isWeekend(remappedDue),
        landsOnOffDay: offDayFor(remappedDue, offDays),
      })
    }
  }

  items.sort((x, y) => x.remappedDue.localeCompare(y.remappedDue))

  const summary: Summary = {
    totalCount: items.length,
    movedCount: items.filter((i) => i.movedDays !== 0).length,
    shiftDays: 0,
    weekendCount: items.filter((i) => i.landsOnWeekend).length,
    offDayCount: items.filter((i) => i.landsOnOffDay).length,
  }

  const scalePct = Math.round(((targetSpan - sourceSpan) / sourceSpan) * 100)

  return { items, summary, scalePct }
}

/** Greedy lane packing so markers near each other don't collide. */
export function packLanes(fractions: number[], minGap: number): number[] {
  const laneLastFrac: number[] = []
  const lanes: number[] = []
  // process in time order while remembering original index
  const order = fractions.map((f, i) => ({ f, i })).sort((a, b) => a.f - b.f)
  for (const { f, i } of order) {
    let lane = laneLastFrac.findIndex((last) => f - last >= minGap)
    if (lane === -1) {
      lane = laneLastFrac.length
      laneLastFrac.push(f)
    } else {
      laneLastFrac[lane] = f
    }
    lanes[i] = lane
  }
  return lanes
}
