import { SpecSheet } from '../../components/SpecSheet'
import { MenuPlacementsBoard } from './frames/menu-placements'
import { PopoverBoard } from './frames/popover'
import { SelectBoard } from './frames/select'
import type { PrototypeProps } from '../../registry'

export default function PopupTest(_: PrototypeProps) {
  return (
    <SpecSheet
      title="Popup Positioning Test"
      description="Verifies that InstUI overlay components position correctly inside the spec iframe. Before the fix, all menus centered on the trigger regardless of placement."
      sections={[
        {
          title: 'Menu',
          description: 'Each button should open its menu at the labeled placement — not centered.',
          boards: [
            {
              width: 640,
              height: 520,
              caption: 'Placement variants',
              content: <MenuPlacementsBoard />,
              playable: true,
            },
          ],
        },
        {
          title: 'Popover',
          description: 'Each button opens a popover at the labeled placement.',
          boards: [
            {
              width: 640,
              height: 400,
              caption: 'Placement variants',
              content: <PopoverBoard />,
              playable: true,
            },
          ],
        },
        {
          title: 'Select',
          description: 'Dropdown should open below the trigger.',
          boards: [
            {
              width: 640,
              height: 300,
              caption: 'SimpleSelect',
              content: <SelectBoard />,
            },
          ],
        },
      ]}
    />
  )
}
