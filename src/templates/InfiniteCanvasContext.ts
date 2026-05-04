import { createContext } from 'react'

export type CanvasTool = 'hand' | 'select'

export const InfiniteCanvasContext = createContext<{ tool: CanvasTool }>({ tool: 'hand' })
