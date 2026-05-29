/**
 * Screen-reader-only summary of a timeline.
 *
 * The horizontal and vertical timelines paint the date data with absolute-
 * positioned dots and connectors, which a screen reader can't follow. This
 * renders the same information as a plain ordered list, visually hidden but
 * fully read aloud, so the two prototypes stay accessible.
 */
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import type { TimelineItem } from './model'
import { fmtShort, fmtWithWeekday } from './dates'

export function TimelineSrList({ items }: { items: TimelineItem[] }) {
  return (
    <ScreenReaderContent>
      <ol>
        {items.map((item) => {
          const moved = item.movedDays !== 0
          const audience = item.base ? '' : ` for ${item.audience}`
          const flag = item.landsOnOffDay
            ? `, lands on ${item.landsOnOffDay.label}`
            : item.landsOnWeekend
              ? ', lands on a weekend'
              : ''
          return (
            <li key={item.key}>
              {item.name}
              {audience}:{' '}
              {moved
                ? `moved from ${fmtShort(item.originalDue)} to ${fmtWithWeekday(item.shiftedDue)}`
                : `due ${fmtWithWeekday(item.shiftedDue)}`}
              {flag}
            </li>
          )
        })}
      </ol>
    </ScreenReaderContent>
  )
}
