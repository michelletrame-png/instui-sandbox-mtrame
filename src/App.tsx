import { useState } from 'react'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { canvas, canvasHighContrast, dark, light } from '@instructure/ui-themes'
import { Showcase } from './references/Showcase'

const THEMES = {
  light: { label: 'Light', theme: light },
  canvas: { label: 'Canvas', theme: canvas },
  dark: { label: 'Dark', theme: dark },
  canvasHighContrast: { label: 'High Contrast', theme: canvasHighContrast },
} as const

type ThemeKey = keyof typeof THEMES

export default function App() {
  const [themeKey, setThemeKey] = useState<ThemeKey>('light')

  const themeNames = Object.values(THEMES).map((t) => t.label)
  const themeName = THEMES[themeKey].label

  const currentTheme = THEMES[themeKey].theme
  const pageBackground = (currentTheme as any).newTheme?.semantics?.color?.background?.page ?? '#ffffff'

  return (
    <InstUISettingsProvider theme={currentTheme}>
      <div style={{ backgroundColor: pageBackground, minHeight: '100vh' }}>
      <Showcase
        themeName={themeName}
        themeNames={themeNames}
        onThemeChange={(name) => {
          const entry = Object.entries(THEMES).find(([, t]) => t.label === name)
          if (entry) setThemeKey(entry[0] as ThemeKey)
        }}
      />
      </div>
    </InstUISettingsProvider>
  )
}
