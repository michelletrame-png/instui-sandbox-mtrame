import { lazy, ComponentType } from 'react'

export type PrototypeStatus = 'WIP' | 'In Review' | 'Archived' | 'Complete' | 'Reference'

export type PrototypeMeta = {
  id: string
  title: string
  path: string
  createdAt: string
  status: PrototypeStatus
  component: ComponentType<any>
}

export const prototypes: PrototypeMeta[] = [
  {
    id: 'canvas-page',
    title: 'Canvas Page',
    path: '/canvas-page',
    createdAt: '2026-04-27',
    status: 'Reference',
    component: lazy(() => import('./canvas-page')),
  },
  {
    id: 'kitchen-sink',
    title: 'Kitchen Sink',
    path: '/kitchen-sink',
    createdAt: '2026-04-27',
    status: 'Reference',
    component: lazy(() => import('./kitchen-sink')),
  },
]
