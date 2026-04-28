import { lazy } from 'react'
import type { ComponentType } from 'react'

export type PrototypeStatus = 'WIP' | 'In Review' | 'Archived' | 'Complete' | 'Reference'

export type PrototypeProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export type PrototypeMeta = {
  id: string
  title: string
  path: string
  createdAt: string
  status: PrototypeStatus
  component: ComponentType<PrototypeProps>
}

export const prototypes: PrototypeMeta[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    path: '/hello-world',
    createdAt: '2026-04-28',
    status: 'WIP',
    component: lazy(() => import('./prototypes/hello-world')),
  },
  {
    id: 'canvas-page',
    title: 'Canvas Page',
    path: '/canvas-page',
    createdAt: '2026-04-27',
    status: 'Reference',
    component: lazy(() => import('./references/canvas-page')),
  },
  {
    id: 'kitchen-sink',
    title: 'Kitchen Sink',
    path: '/kitchen-sink',
    createdAt: '2026-04-27',
    status: 'Reference',
    component: lazy(() => import('./references/kitchen-sink')),
  },
]
