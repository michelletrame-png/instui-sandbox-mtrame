import { useState } from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Text } from '@instructure/ui-text/latest'
import { Menu } from '@instructure/ui-menu/latest'
import type { PlacementPropValues } from '@instructure/ui-position'

const PLACEMENTS: PlacementPropValues[] = [
  'bottom start',
  'bottom end',
  'top start',
  'top end',
  'end center',
  'start center',
]

function MenuVariant({ placement }: { placement: PlacementPropValues }) {
  const [last, setLast] = useState<string | null>(null)
  return (
    <Flex direction="column" gap="x-small" alignItems="center">
      <Menu
        placement={placement}
        trigger={<Button size="small">{placement}</Button>}
        onSelect={(_e, val) => setLast(String(val))}
      >
        <Menu.Item value="alpha">Alpha</Menu.Item>
        <Menu.Item value="beta">Beta</Menu.Item>
        <Menu.Item value="gamma">Gamma</Menu.Item>
        <Menu.Separator />
        <Menu.Item value="delta">Delta</Menu.Item>
      </Menu>
      <Text size="x-small" color="secondary">
        {last ? `→ ${last}` : ' '}
      </Text>
    </Flex>
  )
}

export function MenuPlacementsBoard() {
  return (
    <View as="div" padding="x-large" height="100%" display="block">
      <Flex wrap="wrap" gap="xx-large" justifyItems="center" alignItems="center" height="100%">
        {PLACEMENTS.map(p => (
          <MenuVariant key={p} placement={p} />
        ))}
      </Flex>
    </View>
  )
}
