import { useState } from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Text } from '@instructure/ui-text/latest'
import { Popover } from '@instructure/ui-popover/latest'
import type { PlacementPropValues } from '@instructure/ui-position'

const PLACEMENTS: PlacementPropValues[] = [
  'bottom center',
  'top center',
  'end center',
  'start center',
]

function PopoverVariant({ placement }: { placement: PlacementPropValues }) {
  const [show, setShow] = useState(false)
  return (
    <Popover
      placement={placement}
      isShowingContent={show}
      onShowContent={() => setShow(true)}
      onHideContent={() => setShow(false)}
      on="click"
      screenReaderLabel="Popover"
      renderTrigger={<Button size="small">{placement}</Button>}
    >
      <View as="div" padding="small" display="block">
        <Text size="small">Popover at {placement}</Text>
      </View>
    </Popover>
  )
}

export function PopoverBoard() {
  return (
    <View as="div" padding="x-large" height="100%" display="block">
      <Flex wrap="wrap" gap="xx-large" justifyItems="center" alignItems="center" height="100%">
        {PLACEMENTS.map(p => (
          <PopoverVariant key={p} placement={p} />
        ))}
      </Flex>
    </View>
  )
}
