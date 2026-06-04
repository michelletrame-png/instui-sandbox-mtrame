import { useState, useEffect } from 'react'
import { useComputedTheme } from '@instructure/emotion'
import { Tray } from '@instructure/ui-tray/latest'
import { View } from '@instructure/ui-view/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button, IconButton } from '@instructure/ui-buttons/latest'
import { TextArea } from '@instructure/ui-text-area/latest'
import { SimpleSelect } from '@instructure/ui-simple-select/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import { XInstUIIcon, PlusInstUIIcon } from '@instructure/ui-icons'
import { COMMENT_LIB, COMMENT_FOLDERS, type CommentEntry } from './data'

const CUSTOM_KEY = 'mvp-comment-lib-custom'

type CustomStore = Record<string, CommentEntry[]>

function loadCustom(): CustomStore {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? JSON.parse(raw) as CustomStore : {}
  } catch {
    return {}
  }
}

function saveCustom(store: CustomStore) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(store))
}

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

  const [scope,    setScope]  = useState<'all' | 'assignment' | 'course'>('all')
  const [folder,   setFolder] = useState<string>('all')
  const [selected, setSel]    = useState<string[]>([])
  const [custom,   setCustom] = useState<CustomStore>(() => loadCustom())

  // Add-comment form state
  const [adding,       setAdding]       = useState(false)
  const [newText,      setNewText]      = useState('')
  const [newFolder,    setNewFolder]    = useState<string>('encouragement')

  // Reset state when tray opens
  useEffect(() => {
    if (open) { setScope('all'); setFolder('all'); setSel([]); setAdding(false); setNewText(''); setNewFolder('encouragement') }
  }, [open])

  function mergedFolder(id: string): CommentEntry[] {
    return [...(COMMENT_LIB[id] ?? []), ...(custom[id] ?? [])]
  }

  // Folder ids considered "assignment-scoped" — everything else counts as course-scoped
  const ASSIGNMENT_FOLDERS = new Set<string>(['assignment'])
  function inScope(folderId: string): boolean {
    if (scope === 'all') return true
    if (scope === 'assignment') return ASSIGNMENT_FOLDERS.has(folderId)
    return !ASSIGNMENT_FOLDERS.has(folderId)
  }

  const allInScope = COMMENT_FOLDERS
    .filter(f => f.id !== 'all' && inScope(f.id))
    .flatMap(f => mergedFolder(f.id))
  const visible = folder === 'all'
    ? allInScope
    : (inScope(folder) ? mergedFolder(folder) : [])

  function toggle(id: string) {
    setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function handleInsert() {
    const texts = visible.filter(c => selected.includes(c.id)).map(c => c.text)
    onInsert(texts.join('\n\n'))
    onClose()
  }

  function handleSaveNew() {
    const text = newText.trim()
    if (!text) return
    const entry: CommentEntry = { id: `u${Date.now()}`, text }
    const next: CustomStore = { ...custom, [newFolder]: [...(custom[newFolder] ?? []), entry] }
    setCustom(next)
    saveCustom(next)
    setAdding(false)
    setNewText('')
    setFolder(newFolder)
  }

  return (
    <Tray
      open={open}
      label="Comment Library"
      placement="end"
      size="medium"
      shouldCloseOnDocumentClick
      onDismiss={onClose}
    >
      <View as="div" display="block" height="100vh">
        <Flex direction="column" height="100%">
          {/* Header */}
          {/* eslint-disable instui/no-style-border */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          {/* eslint-enable instui/no-style-border */}
            <Flex alignItems="start" justifyItems="space-between" gap="small" margin="0 0 small 0">
              <Heading level="h2" margin="0">Comment Library</Heading>
              <IconButton
                screenReaderLabel="Close comment library"
                color="secondary"
                size="small"
                withBackground={false}
                withBorder={false}
                onClick={onClose}
                renderIcon={<XInstUIIcon />}
              />
            </Flex>
            <SimpleSelect
              renderLabel={<ScreenReaderContent>Comment scope</ScreenReaderContent>}
              value={scope}
              onChange={(_e, { value }) => { setScope(value as 'all' | 'assignment' | 'course'); setFolder('all'); setSel([]) }}
            >
              <SimpleSelect.Option id="sc-all" value="all">All comments</SimpleSelect.Option>
              <SimpleSelect.Option id="sc-assignment" value="assignment">Comments for this assignment</SimpleSelect.Option>
              <SimpleSelect.Option id="sc-course" value="course">Comments for this course</SimpleSelect.Option>
            </SimpleSelect>
          </div>

          {/* Body */}
          <Flex.Item shouldGrow shouldShrink>
            {/* eslint-disable instui/no-style-border */}
            <div style={{ display: 'flex', height: '100%' }}>
            {/* eslint-enable instui/no-style-border */}
              {/* Folder sidebar */}
              {/* eslint-disable instui/no-style-border */}
              <div style={{ width: 180, flexShrink: 0, background: mutedBg, borderRight: `1px solid ${border}`, padding: '12px 8px', overflowY: 'auto' }}>
              {/* eslint-enable instui/no-style-border */}
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
                      background: folder === f.id ? accentBlue : 'transparent',
                      /* eslint-disable instui/no-hardcoded-hex */
                      color: folder === f.id ? '#fff' : 'inherit',
                      /* eslint-enable instui/no-hardcoded-hex */
                      fontWeight: folder === f.id ? 700 : 400,
                      transition: 'background 0.1s',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Comment list */}
              {/* eslint-disable instui/no-style-border */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', background: containerBg }}>
              {/* eslint-enable instui/no-style-border */}
                <Flex alignItems="center" justifyItems="space-between" margin="0 0 small 0">
                  <Text size="small" color="secondary">
                    {visible.length} comment{visible.length !== 1 ? 's' : ''} · Click to select
                  </Text>
                  {!adding && (
                    <Button size="small" renderIcon={<PlusInstUIIcon />} onClick={() => setAdding(true)}>
                      Add comment
                    </Button>
                  )}
                </Flex>

                {adding && (
                  /* eslint-disable instui/no-style-border */
                  <div style={{ padding: 12, border: `1px solid ${border}`, borderRadius: 6, marginBottom: 12, background: mutedBg }}>
                  {/* eslint-enable instui/no-style-border */}
                    <View as="div" display="block" margin="0 0 small 0">
                      <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">New comment</Text>
                    </View>
                    <TextArea
                      label={<ScreenReaderContent>Comment text</ScreenReaderContent>}
                      placeholder="Write a reusable comment…"
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      height="80px"
                      resize="none"
                    />
                    <View as="div" display="block" margin="x-small 0 0 0">
                      <SimpleSelect
                        renderLabel="Save to folder"
                        value={newFolder}
                        onChange={(_e, { value }) => setNewFolder(value as string)}
                      >
                        {COMMENT_FOLDERS.filter(f => f.id !== 'all').map(f => (
                          <SimpleSelect.Option key={f.id} id={`nf-${f.id}`} value={f.id}>{f.label}</SimpleSelect.Option>
                        ))}
                      </SimpleSelect>
                    </View>
                    <View as="div" display="block" margin="small 0 0 0">
                      <Flex gap="x-small" justifyItems="end">
                        <Button size="small" onClick={() => { setAdding(false); setNewText('') }}>Cancel</Button>
                        <Button size="small" color="primary" onClick={handleSaveNew} interaction={newText.trim() ? 'enabled' : 'disabled'}>
                          Save to library
                        </Button>
                      </Flex>
                    </View>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {visible.length === 0
                    ? (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Text color="secondary" size="small">No comments match.</Text>
                      </div>
                    )
                    : visible.map(c => {
                      const isSel = selected.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggle(c.id)}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '10px 12px',
                            border: isSel ? `2px solid ${accentBlue}` : `1px solid ${border}`,
                            borderRadius: 4, cursor: 'pointer',
                            /* eslint-disable instui/no-hardcoded-hex */
                            background: isSel ? '#E8F1FB' : containerBg,
                            /* eslint-enable instui/no-hardcoded-hex */
                            fontFamily: 'inherit', fontSize: 13, lineHeight: '1.5',
                            color: 'inherit', transition: 'border-color 0.12s, background 0.12s',
                          }}
                        >
                          {isSel && (
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
          </Flex.Item>

          {/* Footer */}
          {/* eslint-disable instui/no-style-border */}
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}`, background: containerBg, flexShrink: 0 }}>
          {/* eslint-enable instui/no-style-border */}
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
          </div>
        </Flex>
      </View>
    </Tray>
  )
}
