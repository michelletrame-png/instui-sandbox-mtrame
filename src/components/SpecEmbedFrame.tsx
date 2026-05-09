import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { Modal } from '@instructure/ui-modal/latest'
import { InfiniteCanvasContext } from './InfiniteCanvasContext'
import type { ThemeKey } from '../themes'
import type { CopyEntry } from './SpecSheet'

type BoardRect = { x: number; y: number; width: number; height: number }

type IframeMessage =
  | { type: 'embed:ready' }
  | { type: 'embed:size'; width: number; height: number; boardRects: Record<string, BoardRect> }
  | { type: 'embed:open-code-modal'; caption?: string; code: string }
  | { type: 'embed:open-copy-modal'; caption?: string; screenLabel: string; copy: CopyEntry[] }

function toSheetsTsv(screenLabel: string, entries: CopyEntry[]): string {
  return ['Screen\tKind\tLabel\tText', ...entries.map(e => `${screenLabel}\t${e.kind}\t${e.label}\t${e.text}`)].join('\n')
}

export function SpecEmbedFrame({
  specId,
  themeKey,
  isDark,
}: {
  specId: string
  themeKey: ThemeKey
  isDark: boolean
}) {
  const { tool, orientToBoard, centerOnSize } = useContext(InfiniteCanvasContext)
  const { sharedTokens } = useComputedTheme()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeWidth, setIframeWidth] = useState(800)
  const [iframeHeight, setIframeHeight] = useState(600)
  const [boardRects, setBoardRects] = useState<Record<string, BoardRect>>({})
  const [codeModal, setCodeModal] = useState<{ caption?: string; code: string } | null>(null)
  const [copyModal, setCopyModal] = useState<{ caption?: string; screenLabel: string; copy: CopyEntry[] } | null>(null)

  // Store pending ?board= param — orientation fires after iframe reports its board rects
  const pendingBoardOrient = useRef<string | null>(
    new URLSearchParams(window.location.search).get('board'),
  )
  const hasAutocentered = useRef(false)

  // Center on default iframe dimensions immediately so the loading spinner is centered
  useEffect(() => {
    centerOnSize?.(iframeWidth, iframeHeight)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-time mount centering
  }, [])

  // After boardRects are committed to DOM, orient to ?board= param or center on real size.
  // Runs in a useEffect (not inside the message handler) so placeholder divs exist in the DOM
  // by the time orientToBoard queries for them.
  useEffect(() => {
    if (Object.keys(boardRects).length === 0) return
    const boardKey = pendingBoardOrient.current
    if (boardKey && orientToBoard) {
      pendingBoardOrient.current = null
      hasAutocentered.current = true
      orientToBoard(boardKey)
    } else if (!hasAutocentered.current) {
      hasAutocentered.current = true
      if (boardRects['0-0'] && orientToBoard) {
        orientToBoard('0-0', 0.6)
      } else {
        centerOnSize?.(iframeWidth, iframeHeight)
      }
    }
  }, [boardRects, iframeWidth, iframeHeight, orientToBoard, centerOnSize])

  const sendToIframe = useCallback((msg: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin)
  }, [])

  // Push theme/tool into iframe whenever they change
  useEffect(() => {
    sendToIframe({ type: 'embed:theme', themeKey, isDark })
  }, [themeKey, isDark, sendToIframe])

  useEffect(() => {
    sendToIframe({ type: 'embed:tool', tool })
  }, [tool, sendToIframe])

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const msg = e.data as IframeMessage
      switch (msg.type) {
        case 'embed:ready':
          // Sync current state immediately after iframe load
          sendToIframe({ type: 'embed:theme', themeKey, isDark })
          sendToIframe({ type: 'embed:tool', tool })
          break

        case 'embed:size': {
          setIframeWidth(msg.width)
          setIframeHeight(msg.height)
          setBoardRects(msg.boardRects)
          break
        }

        case 'embed:open-code-modal':
          setCodeModal({ caption: msg.caption, code: msg.code })
          break

        case 'embed:open-copy-modal':
          setCopyModal({ caption: msg.caption, screenLabel: msg.screenLabel, copy: msg.copy })
          break
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [sendToIframe, themeKey, isDark, tool, orientToBoard, centerOnSize])

  const src = `${import.meta.env.BASE_URL}embed.html?spec=${encodeURIComponent(specId)}&theme=${encodeURIComponent(themeKey)}`

  return (
    <>
      {/* Container sized to full iframe content — placeholders enable InfiniteCanvas board orientation */}
      <div style={{ position: 'relative', width: iframeWidth, height: iframeHeight, contain: 'layout paint' }}>
        <iframe
          ref={iframeRef}
          src={src}
          width={iframeWidth}
          height={iframeHeight}
          // eslint-disable-next-line instui/no-style-border -- native <iframe>, no View equivalent
          style={{ display: 'block', borderWidth: 0, pointerEvents: tool === 'hand' ? 'none' : 'auto' }}
          title={`Spec: ${specId}`}
        />
        {/* Transparent board placeholders so InfiniteCanvas.orientToBoard can find data-board-id elements */}
        {Object.entries(boardRects).map(([key, rect]) => (
          <div
            key={key}
            data-board-id={key}
            style={{
              position: 'absolute',
              left: rect.x,
              top: rect.y,
              width: rect.width,
              height: rect.height,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>

      {/* Code modal — rendered in parent so it layers above the canvas chrome */}
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
            {/* eslint-disable-next-line instui/no-style-layout -- <pre> browser reset, no View equivalent */}
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

      {/* Copy doc modal — rendered in parent so it layers above the canvas chrome */}
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
                  <View as="div" display="block" minWidth="100px">
                    <Text size="x-small" color="secondary" weight="bold">{entry.kind}</Text>
                  </View>
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
