import { useState } from 'react'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'

const OPTIONS = [
  { id: 'apples', label: 'Apples' },
  { id: 'bananas', label: 'Bananas' },
  { id: 'cherries', label: 'Cherries' },
  { id: 'dates', label: 'Dates' },
  { id: 'elderberries', label: 'Elderberries' },
]

export function SelectBoard() {
  const [value, setValue] = useState('apples')

  return (
    <View as="div" padding="x-large" height="100%" display="block">
      <Flex justifyItems="center" alignItems="center" height="100%">
        <View as="div" display="block" width="280px">
          <SimpleSelect
            renderLabel="Favorite fruit"
            value={value}
            onChange={(_e, { value: v }) => setValue(String(v))}
          >
            {OPTIONS.map(o => (
              <SimpleSelect.Option key={o.id} id={o.id} value={o.id}>
                {o.label}
              </SimpleSelect.Option>
            ))}
          </SimpleSelect>
        </View>
      </Flex>
    </View>
  )
}
