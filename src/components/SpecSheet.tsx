import React, { useCallback, useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { FileTextInstUIIcon, CodeInstUIIcon, RefreshCwInstUIIcon, LinkInstUIIcon } from '@instructure/ui-icons'
import { Modal } from '@instructure/ui-modal/latest'
import { InfiniteCanvas } from './InfiniteCanvas'
import type { PrototypeProps } from '../registry'

// When SpecSheet runs inside the spec iframe, modals must render in the parent
// document so they layer above the canvas chrome. We detect this once at module
// load time — it never changes within a session.
const isEmbedded = window.parent !== window

export type CopyEntry = {
  label: string
  text: string
}

export type FrameCtx = {
  sharedTokens: ReturnType<typeof useComputedTheme>['sharedTokens']
}

// RULE: frame files must stay flat and in sync.
//
// Each board's `content` comes from a plain frame function (no hooks, no sub-components).
// Each board's `code` export is a JSX string that must exactly match what `content` renders —
// same props, same structure, same copy. If you change the frame, update its code export too.
// Reviewers will compare them side by side; silent drift is the failure mode to prevent.
//
// One frame per file. One code export per file. Both live together so they stay in sync.
export type SpecBoard = {
  width: number
  height?: number
  caption?: string
  notes?: string
  content?: React.ReactNode
  code?: string
  copy?: CopyEntry[]
  playable?: boolean
}

export type SpecSection = {
  title: string
  description?: string
  boards: SpecBoard[]
}

function toSheetsTsv(screenLabel: string, entries: CopyEntry[]): string {
  return ['Screen\tLabel\tText', ...entries.map(e => `${screenLabel}\t${e.label}\t${e.text}`)].join('\n')
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
  const [codeModal, setCodeModal] = useState<{ caption?: string; code: string } | null>(null)
  const [copyModal, setCopyModal] = useState<{ caption?: string; screenLabel: string; copy: CopyEntry[] } | null>(null)
  const [playKeys, setPlayKeys] = useState<Record<string, number>>({})

  const replay = useCallback((key: string) => {
    setPlayKeys(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
  }, [])

  return (
    <>
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

                {/* Artboard row */}
                <Flex gap="xx-large" alignItems="start">
                  {section.boards.map((board, bi) => {
                    const boardKey = `${si}-${bi}`
                    const playKey = playKeys[boardKey] ?? 0
                    return (
                      <Flex.Item key={bi} shouldShrink={false}>
                        <div data-board-id={boardKey}>
                        <Flex direction="column" gap="medium" width={`${board.width}px`}>

                          {/* Board number + caption */}
                          <Heading level="h3" margin="0">
                            {si + 1}.{bi}{board.caption ? ` ${board.caption}` : ''}
                          </Heading>

                          {/* Artboard frame */}
                          <View
                            as="div"
                            display="block"
                            width={`${board.width}px`}
                            borderWidth="small"
                            borderColor="primary"
                            themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }}
                            borderRadius="0"
                            shadow="resting"
                            overflowX="hidden"
                            {...(board.height !== undefined ? {
                              height: `${board.height}px`,
                              overflowY: 'hidden' as const,
                            } : {})}
                          >
                            <div key={playKey} style={{ width: '100%', ...(board.height !== undefined ? { height: '100%' } : {}) }}>
                              {board.content ?? (
                                <View
                                  as="div"
                                  display="block"
                                  background="primary"
                                  themeOverride={{ backgroundPrimary: sharedTokens.background.inverseColor }}
                                  {...(board.height !== undefined ? { height: '100%' } : { minHeight: '200px' })}
                                />
                              )}
                            </div>
                          </View>

                          {/* Action buttons */}
                          <Flex gap="x-small">
                            <Button
                              size="small"
                              withBackground={false}
                              renderIcon={<LinkInstUIIcon />}
                              onClick={() => {
                                const url = new URL(window.location.href)
                                url.searchParams.set('board', boardKey)
                                navigator.clipboard.writeText(url.toString())
                              }}
                            >
                              Copy link
                            </Button>
                            {board.playable && (
                              <Button
                                size="small"
                                withBackground={false}
                                renderIcon={<RefreshCwInstUIIcon />}
                                onClick={() => replay(boardKey)}
                              >
                                Replay
                              </Button>
                            )}
                            {board.copy && (
                              <Button
                                size="small"
                                withBackground={false}
                                renderIcon={<FileTextInstUIIcon />}
                                onClick={() => {
                                  const screenLabel = `${si + 1}.${bi}${board.caption ? ` ${board.caption}` : ''}`
                                  if (isEmbedded) {
                                    window.parent.postMessage(
                                      { type: 'embed:open-copy-modal', caption: board.caption, screenLabel, copy: board.copy! },
                                      window.location.origin,
                                    )
                                  } else {
                                    setCopyModal({ caption: board.caption, screenLabel, copy: board.copy! })
                                  }
                                }}
                              >
                                UX Copy
                              </Button>
                            )}
                            {board.code && (
                              <Button
                                size="small"
                                withBackground={false}
                                renderIcon={<CodeInstUIIcon />}
                                onClick={() => {
                                  if (isEmbedded) {
                                    window.parent.postMessage(
                                      { type: 'embed:open-code-modal', caption: board.caption, code: board.code! },
                                      window.location.origin,
                                    )
                                  } else {
                                    setCodeModal({ caption: board.caption, code: board.code! })
                                  }
                                }}
                              >
                                InstUI Source
                              </Button>
                            )}
                          </Flex>

                          {/* Notes */}
                          {board.notes && (
                            <Text size="content" color="secondary">{board.notes}</Text>
                          )}

                        </Flex>
                        </div>
                      </Flex.Item>
                    )
                  })}
                </Flex>

              </Flex>

              {si < sections.length - 1 && <Separator />}
            </React.Fragment>
          ))}

        </Flex>
      </View>

      {/* Code modal */}
      <Modal
        open={codeModal !== null}
        onDismiss={() => setCodeModal(null)}
        label={codeModal?.caption ? `Code: ${codeModal.caption}` : 'Code'}
        size="large"
      >
        <Modal.Header>
          <Flex alignItems="center" justifyItems="space-between">
            <Heading level="h2" margin="0">{codeModal?.caption ?? 'Code'}</Heading>
            <CloseButton screenReaderLabel="Close" onClick={() => setCodeModal(null)} />
          </Flex>
        </Modal.Header>
        <Modal.Body>
          <View
            as="div"
            display="block"
            background="secondary"
            themeOverride={{ backgroundSecondary: sharedTokens.background.pageColor }}
            borderRadius="0"
            padding="medium"
          >
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {codeModal?.code}
            </pre>
          </View>
        </Modal.Body>
        <Modal.Footer>
          <Flex justifyItems="end" gap="small">
            <Button onClick={() => navigator.clipboard.writeText(codeModal?.code ?? '')}>Copy</Button>
            <Button color="primary" onClick={() => setCodeModal(null)}>Done</Button>
          </Flex>
        </Modal.Footer>
      </Modal>

      {/* Copy doc modal */}
      <Modal
        open={copyModal !== null}
        onDismiss={() => setCopyModal(null)}
        label={copyModal?.caption ? `Copy doc: ${copyModal.caption}` : 'Copy doc'}
        size="medium"
      >
        <Modal.Header>
          <Flex alignItems="center" justifyItems="space-between">
            <Heading level="h2" margin="0">{copyModal?.caption ?? 'Copy doc'}</Heading>
            <CloseButton screenReaderLabel="Close" onClick={() => setCopyModal(null)} />
          </Flex>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" gap="none">
            {copyModal?.copy.map((entry, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <View
                    as="div"
                    display="block"
                    borderWidth="small 0 0 0"
                    borderColor="primary"
                    themeOverride={{ borderColorPrimary: sharedTokens.stroke.mutedColor }}
                  />
                )}
                <Flex gap="medium" alignItems="start" padding="small none">
                  <View as="div" display="block" minWidth="180px">
                    <Text size="small" color="secondary">{entry.label}</Text>
                  </View>
                  <Text size="small">{entry.text}</Text>
                </Flex>
              </React.Fragment>
            ))}
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Flex justifyItems="end" gap="small">
            <Button onClick={() => navigator.clipboard.writeText(toSheetsTsv(copyModal?.screenLabel ?? '', copyModal?.copy ?? []))}>Copy for Sheets</Button>
            <Button color="primary" onClick={() => setCopyModal(null)}>Done</Button>
          </Flex>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default function SpecSheetTemplate({ isDark, onToggleTheme }: PrototypeProps) {
  return (
    <InfiniteCanvas title="Spec Sheet" isDark={isDark} onToggleTheme={onToggleTheme} backTo="/">
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
