/**
 * ShiftControl.tsx — the single gesture that drives the timeline prototypes:
 * "move every date by N days." Stepper plus week presets and a reset.
 */
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { MinusInstUIIcon, PlusInstUIIcon, RotateCcwInstUIIcon } from '@instructure/ui-icons'
import { describeShift } from './dates'

type ShiftControlProps = {
  shiftDays: number
  onChange: (next: number) => void
}

export function ShiftControl({ shiftDays, onChange }: ShiftControlProps) {
  const { sharedTokens } = useComputedTheme()
  const moved = shiftDays !== 0

  return (
    <View
      as="div"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.md}
      shadow="resting"
      padding="medium"
      display="block"
    >
      <Flex gap="medium" alignItems="center" wrap="wrap">
        <Flex.Item shouldGrow shouldShrink>
          <Text weight="bold" as="div">
            Shift every date
          </Text>
          <Text size="small" color="secondary" as="div">
            Slide the whole schedule, then fine-tune anything that needs it.
          </Text>
        </Flex.Item>

        <Flex.Item>
          <Flex gap="small" alignItems="center">
            <IconButton
              screenReaderLabel="One day earlier"
              renderIcon={<MinusInstUIIcon />}
              onClick={() => onChange(shiftDays - 1)}
            />
            <View as="div" width="9rem" textAlign="center">
              <Text size="large" weight="bold" as="div">
                {shiftDays > 0 ? `+${shiftDays}` : shiftDays} days
              </Text>
              <Text size="x-small" color="secondary" as="div">
                {describeShift(shiftDays)}
              </Text>
            </View>
            <IconButton
              screenReaderLabel="One day later"
              renderIcon={<PlusInstUIIcon />}
              onClick={() => onChange(shiftDays + 1)}
            />
          </Flex>
        </Flex.Item>

        <Flex.Item>
          <Flex gap="x-small" alignItems="center">
            <Button size="small" onClick={() => onChange(shiftDays - 7)}>
              −1 week
            </Button>
            <Button size="small" onClick={() => onChange(shiftDays + 7)}>
              +1 week
            </Button>
            <Button
              size="small"
              renderIcon={<RotateCcwInstUIIcon />}
              interaction={moved ? 'enabled' : 'disabled'}
              onClick={() => onChange(0)}
            >
              Reset
            </Button>
          </Flex>
        </Flex.Item>
      </Flex>
    </View>
  )
}
