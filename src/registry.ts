import { lazy } from 'react'
import type { ComponentType } from 'react'

export type PrototypeStatus = 'WIP' | 'In Review' | 'Archived' | 'Complete' | 'Reference' | 'Template'

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
    id: 'agent-screens',
    title: 'Agent Screens',
    path: '/agent-screens',
    createdAt: '2026-05-01',
    status: 'WIP',
    component: lazy(() => import('./prototypes/agent-screens')),
  },
  {
    id: 'agent-shell',
    title: 'Agent Shell',
    path: '/agent-shell',
    createdAt: '2026-04-28',
    status: 'WIP',
    component: lazy(() => import('./prototypes/agent-shell')),
  },
  {
    id: 'learner-dashboard',
    title: 'Learner Dashboard',
    path: '/learner-dashboard',
    createdAt: '2026-04-30',
    status: 'WIP',
    component: lazy(() => import('./prototypes/learner-dashboard')),
  },
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
    status: 'Template',
    component: lazy(() => import('./templates/CanvasPage').then(m => ({ default: m.CanvasPage }))),
  },
  {
    id: 'spec-sheet',
    title: 'Spec Sheet',
    path: '/spec-sheet',
    createdAt: '2026-05-01',
    status: 'Template',
    component: lazy(() => import('./templates/SpecSheet')),
  },
  {
    id: 'blank',
    title: 'Blank',
    path: '/blank',
    createdAt: '2026-05-01',
    status: 'Template',
    component: lazy(() => import('./templates/Blank')),
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
