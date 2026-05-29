/**
 * SummaryBar.tsx — plain-language read-out of what the current shift does.
 * The trust mechanism: the user sees the consequences before saving.
 */
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { CircleCheckInstUIIcon, TriangleAlertInstUIIcon } from '@instructure/ui-icons'
import { describeShift } from './dates'
import type { Summary } from './model'

function Chip({ tone, label }: { tone: 'warning' | 'success'; label: string }) {
  const { sharedTokens } = useComputedTheme()
  const bg = tone === 'warning' ? sharedTokens.background.accentHoney : sharedTokens.background.successColor
  const stroke = tone === 'warning' ? sharedTokens.stroke.accentHoney : sharedTokens.stroke.successColor
  return (
    <View
      as="span"
      display="inline-block"
      background="primary"
      themeOverride={{ backgroundPrimary: bg }}
      borderRadius="pill"
      padding="xx-small small"
    >
      <Flex gap="xx-small" alignItems="center" display="inline-flex">
        {tone === 'warning' ? (
          <TriangleAlertInstUIIcon size="xs" themeOverride={{ color: stroke } as object} />
        ) : (
          <CircleCheckInstUIIcon size="xs" themeOverride={{ color: stroke } as object} />
        )}
        <Text size="small">{label}</Text>
      </Flex>
    </View>
  )
}

export function SummaryBar({ summary }: { summary: Summary }) {
  const { sharedTokens } = useComputedTheme()
  const { movedCount, shiftDays, weekendCount, offDayCount } = summary

  return (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.mutedColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      padding="small medium"
      display="block"
    >
      <Flex gap="small" alignItems="center" wrap="wrap">
        <Flex.Item shouldGrow shouldShrink>
          {movedCount === 0 ? (
            <Text>Nothing has changed yet. Adjust the shift to see a preview.</Text>
          ) : (
            <Text>
              <Text weight="bold">{movedCount} assignments</Text> {describeShift(shiftDays)}.
            </Text>
          )}
        </Flex.Item>
        {weekendCount > 0 && (
          <Flex.Item>
            <Chip tone="warning" label={`${weekendCount} land on a weekend`} />
          </Flex.Item>
        )}
        {offDayCount > 0 && (
          <Flex.Item>
            <Chip tone="warning" label={`${offDayCount} land on a day off`} />
          </Flex.Item>
        )}
        {movedCount > 0 && weekendCount === 0 && offDayCount === 0 && (
          <Flex.Item>
            <Chip tone="success" label="All clear" />
          </Flex.Item>
        )}
      </Flex>
    </View>
  )
}
