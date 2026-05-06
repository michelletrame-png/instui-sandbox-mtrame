import { Suspense, useState, useEffect } from 'react'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { Spinner } from '@instructure/ui-spinner/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { View } from '@instructure/ui-view/latest'
import { Text } from '@instructure/ui-text/latest'
import { prototypes } from './registry'
import { THEMES, type ThemeKey } from './themes'

const params = new URLSearchParams(window.location.search)
const specId = params.get('spec') ?? ''
const initialThemeParam = params.get('theme') ?? 'light'
const initialThemeKey: ThemeKey =
  initialThemeParam in THEMES ? (initialThemeParam as ThemeKey) : 'light'

const SpecComponent = prototypes.find(p => p.id === specId)?.component ?? null

type ParentMessage =
  | { type: 'embed:theme'; themeKey: ThemeKey; isDark: boolean }
  | { type: 'embed:tool'; tool: string }

function postToParent(msg: Record<string, unknown>) {
  window.parent.postMessage(msg, window.location.origin)
}

function getBoardRects(): Record<string, { x: number; y: number; width: number; height: number }> {
  const result: Record<string, { x: number; y: number; width: number; height: number }> = {}
  document.querySelectorAll<HTMLElement>('[data-board-id]').forEach(el => {
    const key = el.getAttribute('data-board-id')!
    const r = el.getBoundingClientRect()
    result[key] = { x: r.x, y: r.y, width: r.width, height: r.height }
  })
  return result
}

export default function EmbedApp() {
  const [themeKey, setThemeKey] = useState<ThemeKey>(initialThemeKey)
  // eslint-disable-next-line instui/no-theme-name-detection -- theme state management, not color selection
  const [isDark, setIsDark] = useState(initialThemeKey === 'dark')

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const msg = e.data as ParentMessage
      if (msg.type === 'embed:theme' && msg.themeKey in THEMES) {
        setThemeKey(msg.themeKey)
        setIsDark(msg.isDark)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    postToParent({ type: 'embed:ready' })

    const reportSize = () => {
      postToParent({
        type: 'embed:size',
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        boardRects: getBoardRects(),
      })
    }

    const tid = setTimeout(reportSize, 150)
    const observer = new ResizeObserver(() => reportSize())
    observer.observe(document.documentElement)

    return () => {
      clearTimeout(tid)
      observer.disconnect()
    }
  }, [])

  return (
    <InstUISettingsProvider theme={THEMES[themeKey].theme}>
      {SpecComponent == null ? (
        <View as="div" padding="medium">
          <Text>Unknown spec: {specId}</Text>
        </View>
      ) : (
        <Suspense
          fallback={
            <Flex justifyItems="center" alignItems="center" height="100vh">
              <Spinner renderTitle="Loading" size="large" />
            </Flex>
          }
        >
          <SpecComponent isDark={isDark} onToggleTheme={() => {}} />
        </Suspense>
      )}
    </InstUISettingsProvider>
  )
}
