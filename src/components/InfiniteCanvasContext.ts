import { createContext } from 'react'

export type CanvasTool = 'hand' | 'select'

export const InfiniteCanvasContext = createContext<{
  tool: CanvasTool
  orientToBoard?: (boardId: string) => void
  centerOnSize?: (width: number, height: number) => void
}>({ tool: 'hand' })
