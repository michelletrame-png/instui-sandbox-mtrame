import { lazy } from 'react'
import type { ComponentType } from 'react'

export type PrototypeCategory = 'Spec' | 'Prototype' | 'Template' | 'Reference'
export type PrototypeStatus = 'Active' | 'Archived'
export type ViewMode = 'spec' | 'prototype'

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
  viewMode?: ViewMode
  component: ComponentType<PrototypeProps>
}

export const prototypes: PrototypeMeta[] = [
  {
    id: 'edit-dates-horizontal',
    title: 'Edit Dates — Horizontal Timeline',
    path: '/edit-dates-horizontal',
    createdAt: '2026-05-29',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/edit-dates-horizontal')),
  },
  {
    id: 'edit-dates-vertical',
    title: 'Edit Dates — Vertical Timeline',
    path: '/edit-dates-vertical',
    createdAt: '2026-05-29',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/edit-dates-vertical')),
  },
  {
    id: 'edit-dates-remap',
    title: 'Edit Dates — Term Remap',
    path: '/edit-dates-remap',
    createdAt: '2026-05-29',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/edit-dates-remap')),
  },
  {
    id: 'gradebook-mvp',
    title: 'Gradebook MVP',
    path: '/gradebook-mvp',
    createdAt: '2026-05-06',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/gradebook/index.mvp')),
  },
  {
    id: 'gradebook-workspace-mvp',
    title: 'Gradebook Workspace MVP',
    path: '/gradebook-workspace-mvp',
    createdAt: '2026-05-26',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/gradebook/workspace.mvp')),
  },
  {
    id: 'create-assignment-mvp',
    title: 'Create Assignment MVP',
    path: '/create-assignment-mvp',
    createdAt: '2026-05-06',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/create-assignment/index.mvp')),
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
    id: 'button-showcase',
    title: 'Button Showcase',
    path: '/button-showcase',
    createdAt: '2026-05-07',
    category: 'Reference',
    viewMode: 'spec',
    component: lazy(() => import('./references/button-showcase')),
  },
  {
    id: 'hello-world',
    title: 'Hello World',
    path: '/hello-world',
    createdAt: '2026-04-28',
    category: 'Prototype',
    status: 'Active',
    component: lazy(() => import('./designs/hello-world')),
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
    component: lazy(() => import('./components/SpecSheet')),
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
