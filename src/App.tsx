import { useState, useEffect, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { useComputedTheme } from '@instructure/emotion'
import { Spinner } from '@instructure/ui-spinner/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { Home } from './Home'
import { Showcase } from './references/Showcase'
import { InfiniteCanvas } from './components/InfiniteCanvas'
import { SpecEmbedFrame } from './components/SpecEmbedFrame'
import { prototypes } from './registry'
import { THEMES, type ThemeKey } from './themes'
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

const staticPrototypePath = import.meta.env.VITE_STATIC_PROTOTYPE_PATH as string | undefined

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('light')

  const currentTheme = THEMES[themeKey].theme
  const themeNames = Object.keys(THEMES) as ThemeKey[]
  const isDark = themeKey === 'dark'
  const onToggleTheme = () => setThemeKey(prev => prev === 'dark' ? 'light' : 'dark')

  const loader = (
    <Flex justifyItems="center" alignItems="center" height="100vh">
      <Spinner renderTitle="Loading" size="large" />
    </Flex>
  )

  const prototypeRoute = (p: PrototypeMeta, routePath: string) => {
    const viewMode = resolveViewMode(p)
    const element = viewMode === 'spec'
      ? (
        <Suspense fallback={loader}>
          <InfiniteCanvas title={p.title} themeKey={themeKey} themeNames={themeNames} onThemeChange={setThemeKey} backTo={staticPrototypePath ? undefined : '/'} initialScale={0.6}>
            <SpecEmbedFrame specId={p.id} themeKey={themeKey} isDark={isDark} />
          </InfiniteCanvas>
        </Suspense>
      )
      : <Suspense fallback={loader}><p.component isDark={isDark} onToggleTheme={onToggleTheme} /></Suspense>
    return <Route key={p.id} path={routePath} element={element} />
  }

  return (
    <InstUISettingsProvider theme={currentTheme}>
      <ScrollbarStyle />
      <Routes>
        {staticPrototypePath ? (
          // Static single-prototype export — render directly at root, no sub-routes
          prototypes
            .filter(p => p.path === staticPrototypePath)
            .map(p => prototypeRoute(p, '/'))
        ) : (
          <>
            <Route path="/" element={<Home themeKey={themeKey} themeNames={themeNames} onThemeChange={setThemeKey} />} />
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
            {prototypes.map(p => prototypeRoute(p, p.path))}
          </>
        )}
      </Routes>
    </InstUISettingsProvider>
  )
}
