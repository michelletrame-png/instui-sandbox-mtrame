import { canvas, canvasHighContrast, dark, light } from '@instructure/ui-themes'

export const THEMES = {
  light: { label: 'Light', theme: light },
  canvas: { label: 'Canvas', theme: canvas },
  dark: { label: 'Dark', theme: dark },
  canvasHighContrast: { label: 'High Contrast', theme: canvasHighContrast },
} as const

export type ThemeKey = keyof typeof THEMES
