import { useState } from 'react'
import { InstUISettingsProvider } from '@instructure/ui/latest'
import { canvas, canvasHighContrast, dark, light } from '@instructure/ui-themes'
import { View } from '@instructure/ui-view/latest'
import { Heading } from '@instructure/ui-heading/latest'
import { Text } from '@instructure/ui-text/latest'
import { Button } from '@instructure/ui-buttons/latest'
import { Flex } from '@instructure/ui-flex/latest'
import { CanvasPage } from './CanvasPage'

const THEMES = {
  light: { label: 'Light', theme: light },
  canvas: { label: 'Canvas', theme: canvas },
  dark: { label: 'Dark', theme: dark },
  canvasHighContrast: { label: 'High Contrast', theme: canvasHighContrast },
} as const

type ThemeKey = keyof typeof THEMES

export default function App() {
  const [themeKey] = useState<ThemeKey>('light')

  const currentTheme = THEMES[themeKey].theme
  return (
    <InstUISettingsProvider theme={currentTheme}>
      <View as="div" height="100vh" overflowX="hidden" overflowY="hidden" background="secondary">
        <CanvasPage/>
      </View>
    </InstUISettingsProvider>
  )
}
