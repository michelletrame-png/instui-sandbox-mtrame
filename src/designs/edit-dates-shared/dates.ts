/**
 * dates.ts — small date utilities shared by the edit-dates prototypes.
 * Everything works on ISO strings; days are treated in local time. No external
 * date library so the fixture stays dependency-free.
 */

import type { NonInstructionalRange } from './data'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function parse(iso: string): Date {
  return new Date(iso)
}

/** YYYY-MM-DD for a Date (local). */
export function toDayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Add whole days to an ISO timestamp, preserving the time-of-day. */
export function addDays(iso: string, n: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return toLocalIso(d, iso)
}

/** Re-serialize a Date to the same shape as the source ISO (keeps the time). */
function toLocalIso(d: Date, sourceIso: string): string {
  const timePart = sourceIso.includes('T') ? sourceIso.slice(sourceIso.indexOf('T')) : 'T00:00:00'
  return `${toDayKey(d)}${timePart}`
}

/** Whole calendar days from a→b (b - a). */
export function daysBetween(aIso: string, bIso: string): number {
  const a = new Date(aIso)
  const b = new Date(bIso)
  a.setHours(0, 0, 0, 0)
  b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY)
}

/** 0..1 position of a date within [start, end]. Clamped. */
export function fractionWithin(iso: string, startIso: string, endIso: string): number {
  const total = daysBetween(startIso, endIso) || 1
  const offset = daysBetween(startIso, iso)
  return Math.min(1, Math.max(0, offset / total))
}

export function isWeekend(iso: string): boolean {
  const day = new Date(iso).getDay()
  return day === 0 || day === 6
}

/** Returns the matching off-day range for a date, or null. */
export function offDayFor(iso: string, ranges: NonInstructionalRange[]): NonInstructionalRange | null {
  const key = toDayKey(new Date(iso))
  return ranges.find((r) => key >= r.start && key <= r.end) ?? null
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** "Sep 2" */
export function fmtShort(iso: string): string {
  const d = new Date(iso)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** "Wed, Sep 2" */
export function fmtWithWeekday(iso: string): string {
  const d = new Date(iso)
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** "Aug 24 – Dec 11, 2026" */
export function fmtRange(startIso: string, endIso: string): string {
  const s = new Date(startIso)
  const e = new Date(endIso)
  return `${MONTHS[s.getMonth()]} ${s.getDate()} – ${MONTHS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`
}

/** "moved forward 7 days" / "moved back 3 days" / "unchanged" */
export function describeShift(days: number): string {
  if (days === 0) return 'unchanged'
  const dir = days > 0 ? 'forward' : 'back'
  const n = Math.abs(days)
  return `moved ${dir} ${n} ${n === 1 ? 'day' : 'days'}`
}

export { MONTHS, WEEKDAYS }
