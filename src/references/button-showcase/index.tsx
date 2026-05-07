import { useComputedTheme } from '@instructure/emotion'
import { SpecSheet } from '../../components/SpecSheet'
import type { PrototypeProps } from '../../registry'
import { variantsFrame } from './frames/variants'
import { sizesFrame } from './frames/sizes'

const frameSources = import.meta.glob('./frames/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export default function ButtonShowcase(_: PrototypeProps) {
  const { sharedTokens } = useComputedTheme()
  const ctx = { sharedTokens }

  return (
    <SpecSheet
      title="Button Showcase"
      description="Visual reference for InstUI Button colors, variants, and sizes."
      basePath="src/references/button-showcase"
      frameSources={frameSources}
      sections={[
        {
          title: 'Colors & Variants',
          description: 'All color + variant combinations at medium size.',
          boards: [
            {
              width: 600,
              caption: 'All variants',
              content: variantsFrame(ctx),
              frame: 'variants',
            },
          ],
        },
        {
          title: 'Sizes',
          description: 'Size progression with filled and ghost variants.',
          boards: [
            {
              width: 600,
              caption: 'Size comparison',
              content: sizesFrame(ctx),
              frame: 'sizes',
            },
          ],
        },
      ]}
    />
  )
}
