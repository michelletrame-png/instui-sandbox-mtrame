import { useCallback, useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import createCache, { type EmotionCache } from '@emotion/cache'
import { CacheProvider, InstUISettingsProvider, useTheme } from '@instructure/emotion'
import { BoardMountNodeContext } from './BoardMountNodeContext'
import { patchBoardIframeBCR } from './patchPortal'

// Minimal iframe document — no styles bleed in from the parent page.
// Each board gets its own React root and emotion cache scoped to its document.
const FRAME_HTML = [
  '<!DOCTYPE html><html><head><meta charset="utf-8">',
  '<style>*,*::before,*::after{box-sizing:border-box}',
  'html,body,#root{margin:0;padding:0;overflow:hidden;height:100%}</style>',
  '</head><body><div id="root"></div></body></html>',
].join('')

export function BoardFrame({
  width,
  height,
  pointerEvents = 'auto',
  children,
}: {
  width: number
  height?: number
  pointerEvents?: 'auto' | 'none'
  children: React.ReactNode
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const reactRootRef = useRef<Root | null>(null)
  const cacheRef = useRef<EmotionCache | null>(null)
  const bodyRef = useRef<HTMLElement | null>(null)

  const theme = useTheme()
  const latestRef = useRef({ children, theme })
  useEffect(() => { latestRef.current = { children, theme } })

  const flush = useCallback(() => {
    if (!reactRootRef.current || !cacheRef.current) return
    const { children: c, theme: t } = latestRef.current
    reactRootRef.current.render(
      <CacheProvider value={cacheRef.current}>
        <InstUISettingsProvider theme={t}>
          <BoardMountNodeContext.Provider value={bodyRef.current}>
            {c}
          </BoardMountNodeContext.Provider>
        </InstUISettingsProvider>
      </CacheProvider>
    )
  }, [])

  const onLoad = useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const container = doc.getElementById('root')
    if (!container) return
    cacheRef.current = createCache({ key: 'board', container: doc.head })
    bodyRef.current = doc.body
    patchBoardIframeBCR(iframeRef.current!)
    reactRootRef.current = createRoot(container)
    flush()
  }, [flush])

  useEffect(() => { flush() })

  useEffect(() => {
    return () => { reactRootRef.current?.unmount() }
  }, [])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={FRAME_HTML}
      width={width}
      height={height ?? 600}
      style={{ display: 'block', pointerEvents }}
      onLoad={onLoad}
      title="Board frame"
    />
  )
}
