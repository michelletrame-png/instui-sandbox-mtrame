/* eslint-disable instui/no-hardcoded-hex */
/* eslint-disable instui/no-style-border */
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
import { XInstUIIcon, PlusInstUIIcon, EditInstUIIcon, TrashInstUIIcon, SettingsInstUIIcon, CheckInstUIIcon, ChevronDownInstUIIcon, ChevronRightInstUIIcon, LibraryInstUIIcon } from '@instructure/ui-icons'
import { COMMENT_LIB, COMMENT_FOLDERS, type CommentEntry } from './data'

const CUSTOM_KEY     = 'mvp-comment-lib-custom'
const FOLDERS_KEY    = 'mvp-comment-lib-folders'
const UNSORTED_ID    = 'unsorted'
const UNSORTED_LABEL = 'Unsorted'
const ASSIGNMENT_SET = new Set<string>(['assignment'])

type CustomStore  = Record<string, CommentEntry[]>
type CustomFolder = { id: string; label: string }
type FolderStore  = {
  renames: Record<string, string>
  deleted: string[]
  custom:  CustomFolder[]
}

function loadCustom(): CustomStore {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY)
    return raw ? JSON.parse(raw) as CustomStore : {}
  } catch { return {} }
}
function saveCustom(store: CustomStore) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(store))
}
function loadFolders(): FolderStore {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY)
    return raw ? { renames: {}, deleted: [], custom: [], ...JSON.parse(raw) } : { renames: {}, deleted: [], custom: [] }
  } catch { return { renames: {}, deleted: [], custom: [] } }
}
function saveFolders(store: FolderStore) {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(store))
}

export function CommentLibraryModal({
  open, onClose, onInsert, width,
}: {
  open: boolean
  onClose: () => void
  onInsert: (text: string) => void
  width?: number
}) {
  const { sharedTokens } = useComputedTheme()
  const border      = sharedTokens.stroke.baseColor          ?? '#c7cdd1'
  const mutedBg     = sharedTokens.background.mutedColor     ?? '#f5f7f8'
  const containerBg = sharedTokens.background.containerColor ?? '#ffffff'
  const accentBlue  = sharedTokens.stroke.accentBlue         ?? '#0770A3'

  const [scope,    setScope]   = useState<'all' | 'assignment' | 'course'>('all')
  const [selected, setSel]     = useState<string[]>([])
  const [custom,   setCustom]  = useState<CustomStore>(() => loadCustom())
  const [folders,  setFolders] = useState<FolderStore>(() => loadFolders())
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  const [adding,    setAdding]    = useState(false)
  const [newText,   setNewText]   = useState('')
  const [newFolder, setNewFolder] = useState<string>('encouragement')

  const [managing,      setManaging]      = useState(false)
  const [renamingId,    setRenamingId]    = useState<string | null>(null)
  const [renameValue,   setRenameValue]   = useState('')
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    if (open) {
      setScope('all'); setSel([])
      setAdding(false); setNewText(''); setNewFolder('encouragement')
      setManaging(false); setRenamingId(null); setRenameValue(''); setNewFolderName('')
      setOpenFolders(new Set())
    }
  }, [open])

  // Effective folder list
  type EffectiveFolder = { id: string; label: string; isBuiltIn: boolean; canEdit: boolean }
  const deletedSet = new Set(folders.deleted)
  function displayLabel(id: string, fallback: string): string {
    return folders.renames[id] ?? fallback
  }
  const builtInList: EffectiveFolder[] = COMMENT_FOLDERS
    .filter(f => f.id !== 'all' && !deletedSet.has(f.id))
    .map(f => ({ id: f.id, label: displayLabel(f.id, f.label), isBuiltIn: true, canEdit: true }))
  const customList: EffectiveFolder[] = folders.custom
    .map(f => ({ id: f.id, label: displayLabel(f.id, f.label), isBuiltIn: false, canEdit: true }))

  const hasFolders = builtInList.length + customList.length > 0

  function commentsIn(id: string): CommentEntry[] {
    if (id === UNSORTED_ID) {
      // Custom orphans + seed comments from any deleted built-in folder.
      const orphans = custom[UNSORTED_ID] ?? []
      const fromDeletedBuiltIns = folders.deleted.flatMap(d => COMMENT_LIB[d] ?? [])
      return [...orphans, ...fromDeletedBuiltIns]
    }
    return [...(COMMENT_LIB[id] ?? []), ...(custom[id] ?? [])]
  }
  const unsortedCount = commentsIn(UNSORTED_ID).length
  const unsortedItem: EffectiveFolder[] = (!hasFolders || unsortedCount > 0)
    ? [{ id: UNSORTED_ID, label: UNSORTED_LABEL, isBuiltIn: false, canEdit: false }]
    : []
  const effectiveFolders: EffectiveFolder[] = [...builtInList, ...customList, ...unsortedItem]

  function inScope(folderId: string): boolean {
    // When no real folders exist, Unsorted is the only home and should show in every scope.
    if (folderId === UNSORTED_ID && !hasFolders) return true
    if (scope === 'all') return true
    if (scope === 'assignment') return ASSIGNMENT_SET.has(folderId)
    return !ASSIGNMENT_SET.has(folderId)
  }
  const visibleFolders = effectiveFolders.filter(f => inScope(f.id))

  function toggleSelect(id: string) {
    setSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleFolder(id: string) {
    setOpenFolders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function handleInsert() {
    const allComments = visibleFolders.flatMap(f => commentsIn(f.id))
    const texts = allComments.filter(c => selected.includes(c.id)).map(c => c.text)
    if (texts.length === 0) return
    onInsert(texts.join('\n\n'))
    onClose()
  }

  function handleSaveNew() {
    const text = newText.trim()
    if (!text) return
    const targetId = saveTargets.some(f => f.id === newFolder) ? newFolder : UNSORTED_ID
    const entry: CommentEntry = { id: `u${Date.now()}`, text }
    const next: CustomStore = { ...custom, [targetId]: [...(custom[targetId] ?? []), entry] }
    setCustom(next); saveCustom(next)
    setAdding(false); setNewText('')
    // Auto-open the folder we just saved into so the user sees it
    setOpenFolders(prev => new Set([...prev, targetId]))
  }

  // Folder CRUD
  function startRename(id: string, currentLabel: string) {
    setRenamingId(id); setRenameValue(currentLabel)
  }
  function commitRename() {
    if (!renamingId) return
    const label = renameValue.trim()
    if (!label) { setRenamingId(null); return }
    if (renamingId.startsWith('u-folder-')) {
      const next: FolderStore = { ...folders, custom: folders.custom.map(f => f.id === renamingId ? { ...f, label } : f) }
      setFolders(next); saveFolders(next)
    } else {
      const next: FolderStore = { ...folders, renames: { ...folders.renames, [renamingId]: label } }
      setFolders(next); saveFolders(next)
    }
    setRenamingId(null); setRenameValue('')
  }
  function deleteFolder(id: string) {
    const count = commentsIn(id).length
    if (count > 0) {
      const ok = window.confirm(`Delete this folder? ${count} comment${count > 1 ? 's' : ''} will move to Unsorted.`)
      if (!ok) return
    }
    const nextCustom: CustomStore = { ...custom }
    const moving = nextCustom[id] ?? []
    if (moving.length > 0) {
      nextCustom[UNSORTED_ID] = [...(nextCustom[UNSORTED_ID] ?? []), ...moving]
    }
    delete nextCustom[id]
    setCustom(nextCustom); saveCustom(nextCustom)

    let next: FolderStore = folders
    if (id.startsWith('u-folder-')) {
      next = { ...folders, custom: folders.custom.filter(f => f.id !== id) }
    } else {
      next = { ...folders, deleted: Array.from(new Set([...folders.deleted, id])) }
    }
    setFolders(next); saveFolders(next)

    if (newFolder === id) setNewFolder('encouragement')
  }
  function addNewFolder() {
    const label = newFolderName.trim()
    if (!label) return
    const id = `u-folder-${Date.now()}`
    const next: FolderStore = { ...folders, custom: [...folders.custom, { id, label }] }
    setFolders(next); saveFolders(next)
    setNewFolderName('')
  }

  const saveTargets = effectiveFolders.filter(f => f.id !== UNSORTED_ID)
  const libraryHasAnything = effectiveFolders.some(f => commentsIn(f.id).length > 0)
  const showEmptyState = !managing && !adding && !libraryHasAnything
  const SCOPES: Array<{ id: 'all' | 'assignment' | 'course'; label: string }> = [
    { id: 'all',        label: 'All' },
    { id: 'assignment', label: 'This assignment' },
    { id: 'course',     label: 'This course' },
  ]

  return (
    <Tray
      open={open}
      label="Comment Library"
      placement="end"
      size="small"
      themeOverride={{ padding: '0', ...(width ? { smallWidth: `${width}px` } : {}) } as object}
      shouldCloseOnDocumentClick
      onDismiss={onClose}
    >
      <View as="div" display="block" height="100vh">
        <Flex direction="column" height="100%">
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
            <Flex alignItems="center" justifyItems="space-between" gap="small" margin="0 0 small 0">
              <Heading level="h3" margin="0" as="h2">Comment Library</Heading>
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

            <Flex alignItems="center" justifyItems="space-between" gap="x-small">
              <Flex.Item shouldShrink>
                <div style={{ display: 'flex', gap: 4 }}>
                  {SCOPES.map(s => {
                    const active = scope === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => { setScope(s.id); setSel([]) }}
                        style={{
                          padding: '5px 10px', fontSize: 12, fontWeight: 600, borderRadius: 14,
                          border: `1px solid ${active ? accentBlue : border}`,
                          background: active ? accentBlue : 'transparent',
                          color: active ? '#fff' : 'inherit',
                          cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                        }}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </Flex.Item>
              <IconButton
                screenReaderLabel={managing ? 'Done managing folders' : 'Manage folders'}
                size="small"
                color={managing ? 'primary' : 'secondary'}
                withBorder
                renderIcon={managing ? <CheckInstUIIcon /> : <SettingsInstUIIcon />}
                onClick={() => { setManaging(v => !v); setRenamingId(null) }}
              />
            </Flex>
          </div>

          {/* Body */}
          <Flex.Item shouldGrow shouldShrink>
            <div style={{ padding: '20px 20px', height: '100%', overflowY: 'auto', background: containerBg }}>

              {/* Empty state */}
              {showEmptyState && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 16px' }}>
                  <View as="div" display="block" margin="0 0 small 0">
                    <LibraryInstUIIcon size="medium" color="secondary" />
                  </View>
                  <Heading level="h4" margin="0 0 x-small 0">Your comment library is empty</Heading>
                  <View as="div" display="block" margin="0 0 medium 0">
                    <Text size="small" color="secondary">
                      Save reusable feedback to grade faster. Comments you add here will appear in this tray.
                    </Text>
                  </View>
                  <Button color="primary" renderIcon={<PlusInstUIIcon />} onClick={() => setAdding(true)}>
                    Add your first comment
                  </Button>
                </div>
              )}

              {/* Add comment trigger / form */}
              {!managing && !showEmptyState && (
                adding ? (
                  <div style={{ padding: 12, border: `1px solid ${border}`, borderRadius: 6, marginBottom: 16, background: mutedBg }}>
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
                    {saveTargets.length > 0 ? (
                      <View as="div" display="block" margin="x-small 0 0 0">
                        <SimpleSelect
                          renderLabel="Save to folder"
                          value={saveTargets.some(f => f.id === newFolder) ? newFolder : saveTargets[0].id}
                          onChange={(_e, { value }) => setNewFolder(value as string)}
                        >
                          {saveTargets.map(f => (
                            <SimpleSelect.Option key={f.id} id={`nf-${f.id}`} value={f.id}>{f.label}</SimpleSelect.Option>
                          ))}
                        </SimpleSelect>
                      </View>
                    ) : (
                      <View as="div" display="block" margin="x-small 0 0 0">
                        <Text size="x-small" color="secondary">Will be saved to Unsorted.</Text>
                      </View>
                    )}
                    <View as="div" display="block" margin="small 0 0 0">
                      <Flex gap="x-small" justifyItems="end">
                        <Button size="small" onClick={() => { setAdding(false); setNewText('') }}>Cancel</Button>
                        <Button size="small" color="primary" onClick={handleSaveNew} interaction={newText.trim() ? 'enabled' : 'disabled'}>
                          Save to library
                        </Button>
                      </Flex>
                    </View>
                  </div>
                ) : (
                  <View as="div" display="block" margin="0 0 small 0">
                    <Button size="small" renderIcon={<PlusInstUIIcon />} onClick={() => setAdding(true)}>
                      Add comment
                    </Button>
                  </View>
                )
              )}

              {/* Folder accordions */}
              {!showEmptyState && (
              <Flex direction="column" gap="x-small">
                {visibleFolders.map(f => {
                  const isOpen = openFolders.has(f.id)
                  const isRenaming = renamingId === f.id
                  const folderComments = commentsIn(f.id)
                  const folderSelectedCount = folderComments.filter(c => selected.includes(c.id)).length
                  return (
                    <div key={f.id} style={{ border: `1px solid ${border}`, borderRadius: 6, overflow: 'hidden' }}>
                      {/* Accordion header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: mutedBg, borderBottom: isOpen ? `1px solid ${border}` : 'none' }}>
                        {isRenaming ? (
                          <input
                            autoFocus
                            type="text"
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setRenamingId(null); setRenameValue('') } }}
                            onBlur={commitRename}
                            style={{ flex: 1, fontSize: 13, padding: '6px 8px', border: `1px solid ${accentBlue}`, borderRadius: 4, fontFamily: 'inherit', background: '#fff', color: 'inherit', outline: 'none', boxSizing: 'border-box', minWidth: 0 }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleFolder(f.id)}
                            aria-expanded={isOpen}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8, flex: 1,
                              padding: 0, background: 'transparent', border: 'none',
                              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                              color: 'inherit', minWidth: 0,
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: '#576773' }}>
                              {isOpen ? <ChevronDownInstUIIcon size="x-small" /> : <ChevronRightInstUIIcon size="x-small" />}
                            </span>
                            <Flex.Item shouldGrow shouldShrink>
                              <Text size="small" weight="bold">{f.label}</Text>
                            </Flex.Item>
                            <Text size="x-small" color="secondary">
                              {folderSelectedCount > 0 ? `${folderSelectedCount}/${folderComments.length}` : folderComments.length}
                            </Text>
                          </button>
                        )}
                        {managing && f.canEdit && !isRenaming && (
                          <>
                            <IconButton
                              screenReaderLabel={`Rename ${f.label}`}
                              size="small"
                              color="secondary"
                              withBackground={false}
                              withBorder={false}
                              renderIcon={<EditInstUIIcon />}
                              onClick={() => startRename(f.id, f.label)}
                            />
                            <IconButton
                              screenReaderLabel={`Delete ${f.label}`}
                              size="small"
                              color="danger"
                              withBackground={false}
                              withBorder={false}
                              renderIcon={<TrashInstUIIcon />}
                              onClick={() => deleteFolder(f.id)}
                            />
                          </>
                        )}
                      </div>

                      {/* Accordion content */}
                      {isOpen && (
                        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, background: containerBg }}>
                          {folderComments.length === 0
                            ? <Text size="x-small" color="secondary">No comments in this folder.</Text>
                            : folderComments.map(c => {
                                const isSel = selected.includes(c.id)
                                return (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => toggleSelect(c.id)}
                                    style={{
                                      display: 'block', width: '100%', textAlign: 'left',
                                      padding: '8px 10px',
                                      border: isSel ? `2px solid ${accentBlue}` : `1px solid ${border}`,
                                      borderRadius: 4, cursor: 'pointer',
                                      background: isSel ? '#E8F1FB' : containerBg,
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
                      )}
                    </div>
                  )
                })}

                {visibleFolders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text color="secondary" size="small">No folders in this scope.</Text>
                  </div>
                )}
              </Flex>
              )}

              {/* Add folder field — manage mode only, at the bottom */}
              {managing && (
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <input
                    type="text"
                    placeholder="New folder name…"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addNewFolder() }}
                    style={{ flex: 1, fontSize: 13, padding: '8px 10px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: '#fff', color: 'inherit', outline: 'none', boxSizing: 'border-box', minWidth: 0 }}
                  />
                  <Button
                    size="small"
                    color="primary"
                    renderIcon={<PlusInstUIIcon />}
                    onClick={addNewFolder}
                    interaction={newFolderName.trim() ? 'enabled' : 'disabled'}
                  >
                    Add folder
                  </Button>
                </div>
              )}
            </div>
          </Flex.Item>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}`, background: containerBg, flexShrink: 0 }}>
            <Flex gap="small" justifyItems="end">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="primary"
                onClick={handleInsert}
                interaction={selected.length === 0 || managing ? 'disabled' : 'enabled'}
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
