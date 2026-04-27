import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { canvas, canvasHighContrast, dark, light } from '@instructure/ui-themes'
import { useComputedTheme } from '@instructure/emotion'
import { CanvasPage } from './CanvasPage'
import { Showcase } from './references/Showcase'

function ScrollbarStyle() {
  const { sharedTokens } = useComputedTheme()
  useEffect(() => {
    const el = document.createElement('style')
    el.id = 'instui-scrollbar'
    el.textContent = `
      ::-webkit-scrollbar { width: 6px; height: 6px; }
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

  return (
    <InstUISettingsProvider theme={currentTheme}>
      <ScrollbarStyle />
      <Routes>
        <Route
          path="/"
          element={
            <CanvasPage
              isDark={themeKey === 'dark'}
              onToggleTheme={() => setThemeKey(prev => prev === 'dark' ? 'light' : 'dark')}
            />
          }
        />
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
      </Routes>
    </InstUISettingsProvider>
  )
}
