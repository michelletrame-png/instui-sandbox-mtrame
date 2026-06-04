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
import { XInstUIIcon, PlusInstUIIcon, EditInstUIIcon, TrashInstUIIcon, SettingsInstUIIcon, CheckInstUIIcon } from '@instructure/ui-icons'
import { COMMENT_LIB, COMMENT_FOLDERS, type CommentEntry } from './data'

const CUSTOM_KEY        = 'mvp-comment-lib-custom'
const FOLDERS_KEY       = 'mvp-comment-lib-folders'  // { renames, deleted, custom }
const UNSORTED_ID       = 'unsorted'
const UNSORTED_LABEL    = 'Unsorted'
const ASSIGNMENT_SET    = new Set<string>(['assignment'])

type CustomStore  = Record<string, CommentEntry[]>
type CustomFolder = { id: string; label: string }
type FolderStore  = {
  renames:  Record<string, string>
  deleted:  string[]
  custom:   CustomFolder[]
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
  const [folder,   setFolder]  = useState<string>('all')
  const [selected, setSel]     = useState<string[]>([])
  const [custom,   setCustom]  = useState<CustomStore>(() => loadCustom())
  const [folders,  setFolders] = useState<FolderStore>(() => loadFolders())

  // Add-comment form
  const [adding,    setAdding]    = useState(false)
  const [newText,   setNewText]   = useState('')
  const [newFolder, setNewFolder] = useState<string>('encouragement')

  // Manage-folders mode + rename inline state
  const [managing,    setManaging]    = useState(false)
  const [renamingId,  setRenamingId]  = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    if (open) {
      setScope('all'); setFolder('all'); setSel([])
      setAdding(false); setNewText(''); setNewFolder('encouragement')
      setManaging(false); setRenamingId(null); setRenameValue(''); setNewFolderName('')
    }
  }, [open])

  // ── Effective folder list ──
  // Built-in folders (minus user-deleted) + custom folders + unsorted (if populated)
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

  function commentsIn(id: string): CommentEntry[] {
    if (id === UNSORTED_ID) return custom[UNSORTED_ID] ?? []
    return [...(COMMENT_LIB[id] ?? []), ...(custom[id] ?? [])]
  }
  const unsortedCount = (custom[UNSORTED_ID] ?? []).length
  const unsortedItem: EffectiveFolder[] = unsortedCount > 0
    ? [{ id: UNSORTED_ID, label: UNSORTED_LABEL, isBuiltIn: false, canEdit: false }]
    : []

  const effectiveFolders: EffectiveFolder[] = [...builtInList, ...customList, ...unsortedItem]
  // If the active folder no longer exists (e.g. it was deleted), fall back to "all"
  useEffect(() => {
    if (folder !== 'all' && !effectiveFolders.some(f => f.id === folder)) setFolder('all')
  }, [effectiveFolders, folder])

  function inScope(folderId: string): boolean {
    if (scope === 'all') return true
    if (scope === 'assignment') return ASSIGNMENT_SET.has(folderId)
    return !ASSIGNMENT_SET.has(folderId)
  }

  const allInScope = effectiveFolders.filter(f => inScope(f.id)).flatMap(f => commentsIn(f.id))
  const visible = folder === 'all'
    ? allInScope
    : (inScope(folder) ? commentsIn(folder) : [])

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
    setCustom(next); saveCustom(next)
    setAdding(false); setNewText('')
    setFolder(newFolder)
  }

  // ── Folder CRUD ──
  function startRename(id: string, currentLabel: string) {
    setRenamingId(id); setRenameValue(currentLabel)
  }
  function commitRename() {
    if (!renamingId) return
    const label = renameValue.trim()
    if (!label) { setRenamingId(null); return }
    if (renamingId.startsWith('u-folder-')) {
      // Custom folder: update its label in place
      const next: FolderStore = {
        ...folders,
        custom: folders.custom.map(f => f.id === renamingId ? { ...f, label } : f),
      }
      setFolders(next); saveFolders(next)
    } else {
      // Built-in folder: record as override
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
    // Move custom comments under this folder → unsorted
    const nextCustom: CustomStore = { ...custom }
    const moving = nextCustom[id] ?? []
    if (moving.length > 0) {
      nextCustom[UNSORTED_ID] = [...(nextCustom[UNSORTED_ID] ?? []), ...moving]
    }
    delete nextCustom[id]
    setCustom(nextCustom); saveCustom(nextCustom)

    // Update folder bookkeeping
    let next: FolderStore = folders
    if (id.startsWith('u-folder-')) {
      next = { ...folders, custom: folders.custom.filter(f => f.id !== id) }
    } else {
      next = { ...folders, deleted: Array.from(new Set([...folders.deleted, id])) }
    }
    setFolders(next); saveFolders(next)

    if (folder === id) setFolder('all')
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

  // Save-to-folder options for the add-comment form: every effective folder except Unsorted (which is a fallback only)
  const saveTargets = effectiveFolders.filter(f => f.id !== UNSORTED_ID)

  return (
    <Tray
      open={open}
      label="Comment Library"
      placement="end"
      size="small"
      themeOverride={width ? { smallWidth: `${width}px` } : undefined}
      shouldCloseOnDocumentClick
      onDismiss={onClose}
    >
      <View as="div" display="block" height="100vh">
        <Flex direction="column" height="100%">
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
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
            <div style={{ display: 'flex', height: '100%' }}>
              {/* Folder sidebar */}
              <div style={{ width: 200, flexShrink: 0, background: mutedBg, borderRight: `1px solid ${border}`, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Sidebar header: Manage toggle */}
                <Flex alignItems="center" justifyItems="space-between" margin="0 0 x-small 0">
                  <Text size="x-small" weight="bold" transform="uppercase" letterSpacing="expanded" color="secondary">Folders</Text>
                  <IconButton
                    screenReaderLabel={managing ? 'Done managing folders' : 'Manage folders'}
                    size="small"
                    color={managing ? 'primary' : 'secondary'}
                    withBackground={false}
                    withBorder={false}
                    renderIcon={managing ? <CheckInstUIIcon /> : <SettingsInstUIIcon />}
                    onClick={() => { setManaging(v => !v); setRenamingId(null) }}
                  />
                </Flex>

                {/* All comments — not editable */}
                <button
                  type="button"
                  onClick={() => { setFolder('all'); setSel([]) }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '7px 10px', borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 13, border: 'none',
                    background: folder === 'all' ? accentBlue : 'transparent',
                    color: folder === 'all' ? '#fff' : 'inherit',
                    fontWeight: folder === 'all' ? 700 : 400,
                  }}
                >
                  All Comments
                </button>

                {effectiveFolders.map(f => {
                  const isActive = folder === f.id
                  const isRenaming = renamingId === f.id
                  return (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                          onClick={() => { if (!managing) { setFolder(f.id); setSel([]) } }}
                          style={{
                            flex: 1, textAlign: 'left',
                            padding: '7px 10px', borderRadius: 4, cursor: managing ? 'default' : 'pointer',
                            fontFamily: 'inherit', fontSize: 13, border: 'none',
                            background: isActive && !managing ? accentBlue : 'transparent',
                            color: isActive && !managing ? '#fff' : 'inherit',
                            fontWeight: isActive ? 700 : 400,
                            minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}
                          title={f.label}
                        >
                          {f.label}{f.id === UNSORTED_ID ? ` (${unsortedCount})` : ''}
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
                  )
                })}

                {/* New folder field — visible only in manage mode */}
                {managing && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${border}` }}>
                    <input
                      type="text"
                      placeholder="New folder…"
                      value={newFolderName}
                      onChange={e => setNewFolderName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addNewFolder() }}
                      style={{ flex: 1, fontSize: 13, padding: '6px 8px', border: `1px solid ${border}`, borderRadius: 4, fontFamily: 'inherit', background: '#fff', color: 'inherit', outline: 'none', boxSizing: 'border-box', minWidth: 0 }}
                    />
                    <IconButton
                      screenReaderLabel="Add folder"
                      size="small"
                      color="primary"
                      withBackground={false}
                      withBorder={false}
                      renderIcon={<PlusInstUIIcon />}
                      onClick={addNewFolder}
                      interaction={newFolderName.trim() ? 'enabled' : 'disabled'}
                    />
                  </div>
                )}
              </div>

              {/* Comment list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', background: containerBg }}>
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
                  <div style={{ padding: 12, border: `1px solid ${border}`, borderRadius: 6, marginBottom: 12, background: mutedBg }}>
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
                        {saveTargets.map(f => (
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
              </div>
            </div>
          </Flex.Item>

          {/* Footer */}
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}`, background: containerBg, flexShrink: 0 }}>
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
