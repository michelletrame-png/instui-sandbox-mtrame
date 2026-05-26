import { useState, useEffect } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { Modal } from '@instructure/ui-modal/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, CloseButton } from '@instructure/ui-buttons/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { SearchInstUIIcon } from '@instructure/ui-icons'
import { COMMENT_LIB, COMMENT_FOLDERS } from './data'

export function CommentLibraryModal({
  open, onClose, onInsert,
}: {
  open: boolean
  onClose: () => void
  onInsert: (text: string) => void
}) {
  const { sharedTokens } = useComputedTheme()
  /* eslint-disable instui/no-hardcoded-hex */
  const border      = sharedTokens.stroke.baseColor          ?? '#c7cdd1'
  const mutedBg     = sharedTokens.background.mutedColor     ?? '#f5f7f8'
  const containerBg = sharedTokens.background.containerColor ?? '#ffffff'
  const accentBlue  = sharedTokens.stroke.accentBlue         ?? '#0770A3'
  /* eslint-enable instui/no-hardcoded-hex */

  const [query,    setQuery]  = useState('')
  const [folder,   setFolder] = useState<string>('all')
  const [selected, setSel]    = useState<string[]>([])

  // Reset state when modal opens
  useEffect(() => {
    if (open) { setQuery(''); setFolder('all'); setSel([]) }
  }, [open])

  const all     = Object.values(COMMENT_LIB).flat()
  const pool    = folder === 'all' ? all : (COMMENT_LIB[folder] ?? [])
  const visible = query
    ? pool.filter(c => c.text.toLowerCase().includes(query.toLowerCase()))
    : pool

  function toggle(id: string) {
    setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleInsert() {
    const texts = visible.filter(c => selected.includes(c.id)).map(c => c.text)
    onInsert(texts.join('\n\n'))
    onClose()
  }

  return (
    <Modal open={open} onDismiss={onClose} label="Comment Library" size="large">
      <Modal.Header>
        <CloseButton
          placement="end"
          offset="small"
          screenReaderLabel="Close"
          onClick={onClose}
        />
        <Flex direction="column" gap="small">
          <Heading level="h2" margin="0">Comment Library</Heading>
          <TextInput
            renderLabel={<ScreenReaderContent>Search comments</ScreenReaderContent>}
            placeholder="Search comments…"
            value={query}
            onChange={(_e, val) => setQuery(val)}
            renderBeforeInput={<SearchInstUIIcon />}
            shouldNotWrap
          />
        </Flex>
      </Modal.Header>

      <Modal.Body padding="none">
        {/* eslint-disable instui/no-style-border */}
        <div style={{ display: 'flex', height: '55vh', minHeight: 320 }}>
          {/* Folder sidebar */}
          <div style={{ width: 210, flexShrink: 0, background: mutedBg, borderRight: `1px solid ${border}`, padding: '12px 8px', overflowY: 'auto' }}>
            {COMMENT_FOLDERS.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => { setFolder(f.id); setSel([]) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '7px 10px', borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 13, border: 'none',
                  marginBottom: 2,
                  background: folder === f.id
                    ? (f.ai ? '#6B40CC' : accentBlue)
                    : 'transparent',
                  color: folder === f.id
                    ? '#fff'
                    : f.ai ? '#6B40CC' : 'inherit',
                  fontWeight: folder === f.id ? 700 : 400,
                  transition: 'background 0.1s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Comment list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', background: containerBg }}>
            <Text size="small" color="secondary">
              {visible.length} comment{visible.length !== 1 ? 's' : ''} · Click to select
            </Text>
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {visible.length === 0
                ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text color="secondary" size="small">No comments match.</Text>
                  </div>
                )
                : visible.map(c => {
                  const isAI  = c.id.startsWith('ai')
                  const isSel = selected.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggle(c.id)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '10px 12px',
                        border: isSel
                          ? `2px solid ${isAI ? '#6B40CC' : accentBlue}`
                          : `1px solid ${isAI ? '#C4B0F0' : border}`,
                        borderLeft: isAI && !isSel ? `3px solid #C4B0F0` : undefined,
                        borderRadius: 4, cursor: 'pointer',
                        background: isSel
                          ? (isAI ? '#EDE9F8' : '#E8F1FB')
                          : containerBg,
                        fontFamily: 'inherit', fontSize: 13, lineHeight: '1.5',
                        color: 'inherit', transition: 'border-color 0.12s, background 0.12s',
                      }}
                    >
                      {isAI && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#6B40CC', marginBottom: 4 }}>
                          ✦ AI Suggested
                        </div>
                      )}
                      {isSel && !isAI && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: accentBlue, marginBottom: 4 }}>
                          ✓ SELECTED
                        </div>
                      )}
                      {c.text}
                    </button>
                  )
                })
              }
            </div>
          </div>
        </div>
        {/* eslint-enable instui/no-style-border */}
      </Modal.Body>

      <Modal.Footer>
        <Flex gap="small" justifyItems="end">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color="primary"
            onClick={handleInsert}
            interaction={selected.length === 0 ? 'disabled' : 'enabled'}
          >
            Insert {selected.length > 0
              ? `${selected.length} comment${selected.length > 1 ? 's' : ''}`
              : 'comment'}
          </Button>
        </Flex>
      </Modal.Footer>
    </Modal>
  )
}
