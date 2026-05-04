import { lazy } from 'react'
import type { ComponentType } from 'react'

export type PrototypeCategory = 'Spec' | 'Prototype' | 'Template' | 'Reference'
export type PrototypeStatus = 'WIP' | 'In Review' | 'Complete' | 'Archived'

export type PrototypeProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export type PrototypeMeta = {
  id: string
  title: string
  path: string
  createdAt: string
  category: PrototypeCategory
  status?: PrototypeStatus
  component: ComponentType<PrototypeProps>
}

export const prototypes: PrototypeMeta[] = [
  {
    id: 'agent-screens',
    title: 'Agent Screens',
    path: '/agent-screens',
    createdAt: '2026-05-01',
    category: 'Spec',
    status: 'WIP',
    component: lazy(() => import('./prototypes/agent-screens')),
  },
  {
    id: 'agent-shell',
    title: 'Agent Shell',
    path: '/agent-shell',
    createdAt: '2026-04-28',
    category: 'Prototype',
    status: 'WIP',
    component: lazy(() => import('./prototypes/agent-shell')),
  },
  {
    id: 'learner-overview',
    title: 'Learner Overview',
    path: '/learner-overview',
    createdAt: '2026-04-30',
    category: 'Reference',
    component: lazy(() => import('./references/learner-overview')),
  },
  {
    id: 'hello-world',
    title: 'Hello World',
    path: '/hello-world',
    createdAt: '2026-04-28',
    category: 'Prototype',
    status: 'WIP',
    component: lazy(() => import('./prototypes/hello-world')),
  },
  {
    id: 'canvas-page',
    title: 'Canvas Page',
    path: '/canvas-page',
    createdAt: '2026-04-27',
    category: 'Template',
    component: lazy(() => import('./templates/CanvasPage').then(m => ({ default: m.CanvasPage }))),
  },
  {
    id: 'spec-sheet',
    title: 'Spec Sheet',
    path: '/spec-sheet',
    createdAt: '2026-05-01',
    category: 'Template',
    component: lazy(() => import('./templates/SpecSheet')),
  },
  {
    id: 'blank',
    title: 'Blank',
    path: '/blank',
    createdAt: '2026-05-01',
    category: 'Template',
    component: lazy(() => import('./templates/Blank')),
  },
  {
    id: 'kitchen-sink',
    title: 'Kitchen Sink',
    path: '/kitchen-sink',
    createdAt: '2026-04-27',
    category: 'Reference',
    component: lazy(() => import('./references/kitchen-sink')),
  },
]
