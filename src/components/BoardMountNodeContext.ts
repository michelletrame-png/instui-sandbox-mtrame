import { createContext, useContext } from 'react'

export const BoardMountNodeContext = createContext<HTMLElement | null>(null)

export function useBoardMountNode(): HTMLElement | null {
  return useContext(BoardMountNodeContext)
}
