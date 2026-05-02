import React from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { InfiniteCanvas } from './InfiniteCanvas'
import type { PrototypeProps } from '../registry'

export type SpecBoard = {
  width: number
  height: number
  caption?: string
  notes?: string
  content?: React.ReactNode
}

export type SpecSection = {
  title: string
  description?: string
  boards: SpecBoard[]
}

function Separator() {
  const { sharedTokens } = useComputedTheme()
  return (
    <View
      as="div"
      display="block"
      borderWidth="small 0 0 0"
      borderColor="primary"
      themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }}
      margin="large 0"
    />
  )
}

export function SpecSheet({
  title,
  description,
  sections,
}: {
  title: string
  description?: string
  sections: SpecSection[]
}) {
  const { sharedTokens } = useComputedTheme()

  return (
    <View
      as="div"
      display="block"
      background="primary"
      themeOverride={{ backgroundPrimary: sharedTokens.background.containerColor }}
      borderRadius={sharedTokens.borderRadius.card.lg}
      shadow="resting"
      padding="xx-large"
    >
        <Flex direction="column" gap="large">

          {/* Page header */}
          <Flex direction="column" gap="x-small">
            <Heading level="h1" variant="titlePageDesktop" margin="0">{title}</Heading>
            {description && <Text size="descriptionPage">{description}</Text>}
          </Flex>

          <Separator />

          {/* Sections */}
          {sections.map((section, si) => (
            <React.Fragment key={si}>
              <Flex direction="column" gap="xx-large">

                {/* Section header */}
                <Flex direction="column" gap="x-small">
                  <Heading level="h2" margin="0">{section.title}</Heading>
                  {section.description && (
                    <Text size="content" color="secondary">{section.description}</Text>
                  )}
                </Flex>

                {/* Artboard row — horizontal, non-wrapping */}
                <Flex gap="xx-large" alignItems="start">
                  {section.boards.map((board, bi) => (
                    <Flex.Item key={bi} shouldShrink={false}>
                      <Flex direction="column" gap="medium" width={`${board.width}px`}>

                        {/* Board number + title */}
                        <Heading level="h3" margin="0">
                          {si + 1}.{bi}{board.caption ? ` ${board.caption}` : ''}
                        </Heading>

                        {/* Artboard frame */}
                        <View
                          as="div"
                          width={`${board.width}px`}
                          height={`${board.height}px`}
                          background="primary"
                          themeOverride={{
                            backgroundPrimary: sharedTokens.background.containerColor,
                            borderColorPrimary: sharedTokens.stroke.mutedColor,
                          }}
                          borderWidth="small"
                          borderColor="primary"
                          borderRadius={sharedTokens.borderRadius.card.sm}
                          shadow="resting"
                          display="block"
                          overflowX="hidden"
                          overflowY="hidden"
                        >
                          <div style={{ width: board.width, height: board.height, overflow: 'hidden', position: 'relative' }}>
                            {board.content ?? (
                              <View
                                as="div"
                                display="block"
                                height="100%"
                                background="primary"
                                themeOverride={{ backgroundPrimary: sharedTokens.background.inverseColor }}
                              />
                            )}
                          </div>
                        </View>

                        {/* Notes */}
                        {board.notes && (
                          <Text size="content" color="secondary">{board.notes}</Text>
                        )}

                      </Flex>
                    </Flex.Item>
                  ))}
                </Flex>

              </Flex>

              {si < sections.length - 1 && <Separator />}
            </React.Fragment>
          ))}

        </Flex>
    </View>
  )
}

export default function SpecSheetTemplate({ isDark, onToggleTheme }: PrototypeProps) {
  return (
    <InfiniteCanvas title="Spec Sheet" isDark={isDark} onToggleTheme={onToggleTheme}>
      <SpecSheet
        title="Component name"
        description="Brief description of the component or feature being spec'd out. Replace this with your own."
        sections={[
          {
            title: 'Desktop',
            description: 'Desktop browser at 1280px viewport width',
            boards: [
              { width: 1280, height: 800, caption: 'Default state' },
              { width: 1280, height: 800, caption: 'Expanded state' },
              { width: 1280, height: 800, caption: 'Empty state', notes: 'Shown when there is no data to display.' },
            ],
          },
          {
            title: 'Mobile',
            description: 'Mobile viewport at 390px width',
            boards: [
              { width: 390, height: 844, caption: 'Default state' },
              { width: 390, height: 844, caption: 'Expanded state' },
            ],
          },
        ]}
      />
    </InfiniteCanvas>
  )
}
