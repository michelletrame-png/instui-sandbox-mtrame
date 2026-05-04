import { useState, useEffect, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { canvas, canvasHighContrast, dark, light } from '@instructure/ui-themes'
import { useComputedTheme } from '@instructure/emotion'
import { Spinner } from '@instructure/ui-spinner/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Home } from './Home'
import { Showcase } from './references/Showcase'
import { InfiniteCanvas } from './templates/InfiniteCanvas'
import { prototypes } from './registry'
import type { PrototypeMeta, ViewMode } from './registry'

function resolveViewMode(p: PrototypeMeta): ViewMode {
  if (p.viewMode !== undefined) return p.viewMode
  if (p.category === 'Spec') return 'spec'
  return 'prototype'
}

function ScrollbarStyle() {
  const { sharedTokens } = useComputedTheme()
  useEffect(() => {
    const el = document.createElement('style')
    el.id = 'instui-scrollbar'
    el.textContent = `
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${sharedTokens.stroke.mutedColor}; border-radius: 999px; }
      ::-webkit-scrollbar-thumb:hover { background: ${sharedTokens.stroke.baseColor}; }
      * { scrollbar-width: thin; scrollbar-color: ${sharedTokens.stroke.mutedColor} transparent; }
    `
    document.getElementById('instui-scrollbar')?.remove()
    document.head.appendChild(el)
    return () => el.remove()
  }, [sharedTokens])
  return null
}

const THEMES = {
  light: { label: 'Light', theme: light },
  canvas: { label: 'Canvas', theme: canvas },
  dark: { label: 'Dark', theme: dark },
  canvasHighContrast: { label: 'High Contrast', theme: canvasHighContrast },
} as const

type ThemeKey = keyof typeof THEMES

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('light')

  const currentTheme = THEMES[themeKey].theme
  const themeNames = Object.keys(THEMES) as ThemeKey[]
  // eslint-disable-next-line instui/no-theme-name-detection -- theme state management, not color selection
  const isDark = themeKey === 'dark'
  // eslint-disable-next-line instui/no-theme-name-detection -- theme toggle logic
  const onToggleTheme = () => setThemeKey(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <InstUISettingsProvider theme={currentTheme}>
      <ScrollbarStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/showcase"
          element={
            <Showcase
              themeName={themeKey}
              themeNames={themeNames}
              onThemeChange={(name) => setThemeKey(name as ThemeKey)}
            />
          }
        />
        {prototypes.map(p => {
          const viewMode = resolveViewMode(p)
          const inner = (
            <Suspense fallback={
              <Flex justifyItems="center" alignItems="center" height="100vh">
                <Spinner renderTitle="Loading" size="large" />
              </Flex>
            }>
              <p.component isDark={isDark} onToggleTheme={onToggleTheme} />
            </Suspense>
          )
          const element = viewMode === 'spec'
            ? <InfiniteCanvas title={p.title} isDark={isDark} onToggleTheme={onToggleTheme} backTo="/" initialScale={0.6}>{inner}</InfiniteCanvas>
            : inner
          return <Route key={p.id} path={p.path} element={element} />
        })}
      </Routes>
    </InstUISettingsProvider>
  )
}
