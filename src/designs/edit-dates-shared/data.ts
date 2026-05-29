/**
 * data.ts — shared fixture for the "Edit assignment dates" reimagining.
 *
 * The assignment shape mirrors the real Canvas API contract so all three
 * prototypes read realistic data and could later swap to the live endpoint:
 *
 *   load: GET  /api/v1/courses/:id/assignments?include[]=all_dates&include[]=can_edit
 *   save: PUT  /api/v1/courses/:id/assignments/bulk_update
 *         body: [{ id, all_dates: [{ id, base, due_at, unlock_at, lock_at }] }]
 *
 * `base: true` is the "Everyone" date; other entries are section/group/student
 * overrides. Non-instructional ranges (breaks / days off) are NOT a Canvas
 * concept — they're a prototype affordance. This is an international tool, so we
 * don't ship a holiday database; the user marks days off themselves and we just
 * acknowledge where they fall.
 */

export type DateField = 'due_at' | 'unlock_at' | 'lock_at'

export interface OverrideDates {
  id: string
  /** true = the "Everyone" date; false = a section/group/student override */
  base: boolean
  /** "Everyone", "Section 2", "Group A", "3 students", etc. */
  title: string
  due_at: string | null
  unlock_at: string | null
  lock_at: string | null
}

export interface Assignment {
  id: string
  name: string
  can_edit: boolean
  all_dates: OverrideDates[]
}

export interface NonInstructionalRange {
  id: string
  label: string
  /** inclusive YYYY-MM-DD */
  start: string
  /** inclusive YYYY-MM-DD */
  end: string
}

export interface Term {
  id: string
  name: string
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
}

/** Helper so the fixture reads cleanly: 11:59pm local on the given day. */
function due(day: string): string {
  return `${day}T23:59:00`
}
function open(day: string): string {
  return `${day}T00:00:00`
}

/** The term this course currently lives in. */
export const SOURCE_TERM: Term = {
  id: 'term-fall-2026',
  name: 'Fall 2026',
  start: '2026-08-24',
  end: '2026-12-11',
}

/** A plausible "next" term to remap into (different shape, different breaks). */
export const TARGET_TERM: Term = {
  id: 'term-spring-2027',
  name: 'Spring 2027',
  start: '2027-01-11',
  end: '2027-05-07',
}

/** Days off in the source term. User-marked, not from a holiday database. */
export const SOURCE_OFF_DAYS: NonInstructionalRange[] = [
  { id: 'off-1', label: 'Labor Day', start: '2026-09-07', end: '2026-09-07' },
  { id: 'off-2', label: 'Fall break', start: '2026-10-15', end: '2026-10-16' },
  { id: 'off-3', label: 'Thanksgiving break', start: '2026-11-25', end: '2026-11-27' },
]

/** Days off in the target term (used by the remap prototype). */
export const TARGET_OFF_DAYS: NonInstructionalRange[] = [
  { id: 'toff-1', label: 'MLK Day', start: '2027-01-18', end: '2027-01-18' },
  { id: 'toff-2', label: 'Presidents Day', start: '2027-02-15', end: '2027-02-15' },
  { id: 'toff-3', label: 'Spring break', start: '2027-03-15', end: '2027-03-19' },
]

/**
 * Twelve assignments spread across the source term. Two carry section
 * overrides so the prototypes can show how differentiated dates behave.
 */
export const ASSIGNMENTS: Assignment[] = [
  {
    id: '101',
    name: 'Syllabus quiz',
    can_edit: true,
    all_dates: [
      { id: 'b101', base: true, title: 'Everyone', unlock_at: open('2026-08-24'), due_at: due('2026-08-28'), lock_at: due('2026-08-30') },
    ],
  },
  {
    id: '102',
    name: 'Reading response 1',
    can_edit: true,
    all_dates: [
      { id: 'b102', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-09-04'), lock_at: null },
    ],
  },
  {
    id: '103',
    name: 'Lab report: Osmosis',
    can_edit: true,
    all_dates: [
      { id: 'b103', base: true, title: 'Everyone', unlock_at: open('2026-09-08'), due_at: due('2026-09-14'), lock_at: due('2026-09-16') },
    ],
  },
  {
    id: '104',
    name: 'Problem set 2',
    can_edit: true,
    all_dates: [
      { id: 'b104', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-09-21'), lock_at: null },
      { id: 'o104a', base: false, title: 'Section 2', unlock_at: null, due_at: due('2026-09-23'), lock_at: null },
    ],
  },
  {
    id: '105',
    name: 'Group project proposal',
    can_edit: true,
    all_dates: [
      { id: 'b105', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-09-28'), lock_at: null },
    ],
  },
  {
    id: '106',
    name: 'Midterm exam',
    can_edit: true,
    all_dates: [
      { id: 'b106', base: true, title: 'Everyone', unlock_at: open('2026-10-12'), due_at: due('2026-10-14'), lock_at: due('2026-10-14') },
    ],
  },
  {
    id: '107',
    name: 'Reading response 2',
    can_edit: true,
    all_dates: [
      { id: 'b107', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-10-23'), lock_at: null },
    ],
  },
  {
    id: '108',
    name: 'Lab report: Genetics',
    can_edit: true,
    all_dates: [
      { id: 'b108', base: true, title: 'Everyone', unlock_at: open('2026-10-26'), due_at: due('2026-11-02'), lock_at: due('2026-11-04') },
    ],
  },
  {
    id: '109',
    name: 'Problem set 3',
    can_edit: true,
    all_dates: [
      { id: 'b109', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-11-13'), lock_at: null },
      { id: 'o109a', base: false, title: '4 students', unlock_at: null, due_at: due('2026-11-16'), lock_at: null },
    ],
  },
  {
    id: '110',
    name: 'Group project draft',
    can_edit: true,
    all_dates: [
      { id: 'b110', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-11-23'), lock_at: null },
    ],
  },
  {
    id: '111',
    name: 'Peer review',
    can_edit: true,
    all_dates: [
      { id: 'b111', base: true, title: 'Everyone', unlock_at: open('2026-11-30'), due_at: due('2026-12-02'), lock_at: due('2026-12-03') },
    ],
  },
  {
    id: '112',
    name: 'Final project',
    can_edit: true,
    all_dates: [
      { id: 'b112', base: true, title: 'Everyone', unlock_at: null, due_at: due('2026-12-10'), lock_at: due('2026-12-11') },
    ],
  },
]
