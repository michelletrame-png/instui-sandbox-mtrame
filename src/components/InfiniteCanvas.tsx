import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@instructure/ui-buttons/latest'
import { Text } from '@instructure/ui-text/latest'
import { TextInput } from '@instructure/ui-text-input/latest'
import { ScreenReaderContent } from '@instructure/ui-a11y-content'
import {
  SunInstUIIcon,
  MoonInstUIIcon,
  ZoomInInstUIIcon,
  ZoomOutInstUIIcon,
  ArrowLeftInstUIIcon,
  HandInstUIIcon,
  MousePointer2InstUIIcon,
} from '@instructure/ui-icons'

const MIN_SCALE = 0.05
const MAX_SCALE = 5
const NAV_HEIGHT = 44

import { InfiniteCanvasContext, type CanvasTool } from './InfiniteCanvasContext'

type Transform = { x: number; y: number; scale: number }
type Tool = CanvasTool

const DARK = {
  canvasBg: '#1a1d21',
  dotColor: '#2d3035',
  navBg: 'rgba(13, 15, 18, 0.9)',
  navBorder: 'rgba(255,255,255,0.07)',
}

const LIGHT = {
  canvasBg: '#d8dce2',
  dotColor: '#c0c5cc',
  navBg: 'rgba(246, 247, 249, 0.92)',
  navBorder: 'rgba(0,0,0,0.09)',
}

const LAYER_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  transformOrigin: '0 0',
  willChange: 'transform',
}

const NAV_ACTIONS_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}

const NAV_TITLE_GROUP_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
}


export function InfiniteCanvas({
  children,
  initialScale = 1,
  title,
  isDark,
  onToggleTheme,
  backTo,
}: {
  children: React.ReactNode
  initialScale?: number
  title?: string
  isDark?: boolean
  onToggleTheme?: () => void
  backTo?: string
}) {
  const palette = isDark ? DARK : LIGHT
  const initialY = NAV_HEIGHT + 20
  const [transform, setTransform] = useState<Transform>({ x: 40, y: initialY, scale: initialScale })
  const transformRef = useRef<Transform>({ x: 40, y: initialY, scale: initialScale })
  const [tool, setTool] = useState<Tool>('hand')
  const toolRef = useRef<Tool>('hand')
  const [zoomInput, setZoomInput] = useState(String(Math.round(initialScale * 100)))
  const spaceRef = useRef(false)
  const panRef = useRef<{ active: boolean; startX: number; startY: number }>({ active: false, startX: 0, startY: 0 })
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  // Apply transform directly to DOM — no React re-render on every frame
  const applyTransform = useCallback((t: Transform) => {
    transformRef.current = t
    if (layerRef.current) {
      layerRef.current.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.scale})`
    }
    // Throttle React state update (for zoom input display) to one rAF
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        setZoomInput(String(Math.round(transformRef.current.scale * 100)))
      })
    }
  }, [])

  const sync = useCallback((t: Transform) => {
    applyTransform(t)
    setTransform(t)
    setZoomInput(String(Math.round(t.scale * 100)))
  }, [applyTransform])

  const zoomBy = useCallback((factor: number) => {
    const el = containerRef.current
    const t = transformRef.current
    const cx = el ? el.getBoundingClientRect().width / 2 : 0
    const cy = el ? el.getBoundingClientRect().height / 2 : 0
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * factor))
    const k = newScale / t.scale
    sync({ x: cx + (t.x - cx) * k, y: cy + (t.y - cy) * k, scale: newScale })
  }, [sync])

  const selectTool = useCallback((t: Tool) => {
    toolRef.current = t
    setTool(t)
    if (containerRef.current) {
      containerRef.current.style.cursor = t === 'hand' ? 'grab' : ''
    }
  }, [])

  // Sync cursor when tool changes (e.g. on initial mount)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = tool === 'hand' ? 'grab' : ''
    }
  }, [tool])

  // Orient to a specific board when ?board=si-bi is in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const boardId = params.get('board')
    if (!boardId) return
    requestAnimationFrame(() => {
      if (!containerRef.current || !layerRef.current) return
      const boardEl = layerRef.current.querySelector(`[data-board-id="${boardId}"]`) as HTMLElement | null
      if (!boardEl) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const boardRect = boardEl.getBoundingClientRect()
      const { x: tx, y: ty, scale: s } = transformRef.current
      // Compute board center in unscaled layer coordinates
      const bCenterX = (boardRect.left + boardRect.width / 2 - containerRect.left - tx) / s
      const bCenterY = (boardRect.top + boardRect.height / 2 - containerRect.top - ty) / s
      // Fit board in viewport with padding, capped at 1x (never zoom in)
      const PADDING = 80
      const boardUnscaledW = boardRect.width / s
      const boardUnscaledH = boardRect.height / s
      const fitScale = Math.min(
        (containerRect.width - PADDING * 2) / boardUnscaledW,
        (containerRect.height - NAV_HEIGHT - PADDING * 2) / boardUnscaledH,
        1,
      )
      const newScale = Math.max(MIN_SCALE, fitScale)
      // Center board in visible area (below nav bar) at new scale
      const newTx = containerRect.width / 2 - bCenterX * newScale
      const newTy = (containerRect.height + NAV_HEIGHT) / 2 - bCenterY * newScale
      sync({ x: newTx, y: newTy, scale: newScale })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' && !e.repeat) {
        const active = document.activeElement
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
        e.preventDefault()
        spaceRef.current = true
        if (containerRef.current) containerRef.current.style.cursor = 'grab'
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === 'Space') {
        spaceRef.current = false
        panRef.current.active = false
        if (containerRef.current) {
          containerRef.current.style.cursor = toolRef.current === 'hand' ? 'grab' : ''
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onMouseDown(e: MouseEvent) {
      const active = document.activeElement as HTMLElement | null
      if (active && active !== document.body) active.blur()
      if (!spaceRef.current && toolRef.current !== 'hand') return
      e.preventDefault()
      panRef.current = { active: true, startX: e.clientX, startY: e.clientY }
      el!.style.cursor = 'grabbing'
    }
    function onMouseMove(e: MouseEvent) {
      if (!panRef.current.active) return
      const dx = e.clientX - panRef.current.startX
      const dy = e.clientY - panRef.current.startY
      panRef.current.startX = e.clientX
      panRef.current.startY = e.clientY
      const t = transformRef.current
      applyTransform({ ...t, x: t.x + dx, y: t.y + dy })
    }
    function onMouseUp() {
      if (panRef.current.active) {
        panRef.current.active = false
        el!.style.cursor = spaceRef.current || toolRef.current === 'hand' ? 'grab' : ''
        // Commit final position to React state (needed for zoom buttons etc.)
        setTransform({ ...transformRef.current })
      }
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const t = transformRef.current
      if (e.ctrlKey || e.metaKey) {
        const rect = el!.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * factor))
        const k = newScale / t.scale
        applyTransform({
          x: cx + (t.x - cx) * k,
          y: cy + (t.y - cy) * k,
          scale: newScale,
        })
      } else if (e.shiftKey) {
        applyTransform({ ...t, x: t.x - (e.deltaX !== 0 ? e.deltaX : e.deltaY) })
      } else {
        applyTransform({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY })
      }
    }

    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [sync, applyTransform])

  const bgStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: palette.canvasBg,
    backgroundImage: `radial-gradient(circle, ${palette.dotColor} 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    transition: 'background-color 0.2s, background-image 0.2s',
  }

  const navStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: NAV_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px 0 16px',
    backgroundColor: palette.navBg,
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${palette.navBorder}`,
    boxSizing: 'border-box',
    transition: 'background-color 0.2s, border-color 0.2s',
  }

  const sepStyle: React.CSSProperties = {
    width: 1,
    height: 18,
    backgroundColor: palette.navBorder,
    flexShrink: 0,
    margin: '0 4px',
  }

  const layerStyle: React.CSSProperties = {
    ...LAYER_STYLE,
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
  }

  return (
    <div ref={containerRef} style={bgStyle}>
      <nav style={navStyle}>
        <div style={NAV_TITLE_GROUP_STYLE}>
          {backTo && (
            <IconButton
              renderIcon={<ArrowLeftInstUIIcon />}
              screenReaderLabel="Back"
              withBackground={false}
              withBorder={false}
              size="small"
              onClick={() => navigate(backTo)}
            />
          )}
          {title && <Text size="small" weight="bold">{title}</Text>}
        </div>

        <div style={NAV_ACTIONS_STYLE}>
          <IconButton
            renderIcon={<HandInstUIIcon />}
            screenReaderLabel="Pan tool"
            onClick={() => selectTool('hand')}
            withBackground={false}
            withBorder={tool === 'hand'}
            size="small"
          />
          <IconButton
            renderIcon={<MousePointer2InstUIIcon />}
            screenReaderLabel="Select tool"
            onClick={() => selectTool('select')}
            withBackground={false}
            withBorder={tool === 'select'}
            size="small"
          />

          <div style={sepStyle} />

          <IconButton
            renderIcon={<ZoomOutInstUIIcon />}
            screenReaderLabel="Zoom out"
            onClick={() => zoomBy(1 / 1.25)}
            withBackground={false}
            withBorder={false}
            size="small"
          />
          <TextInput
            renderLabel={<ScreenReaderContent>Zoom level</ScreenReaderContent>}
            size="small"
            width="60px"
            value={zoomInput}
            onChange={(_e, value) => setZoomInput(value)}
            onBlur={() => {
              const parsed = parseFloat(zoomInput.replace('%', ''))
              if (!isNaN(parsed)) {
                const el = containerRef.current
                const t = transformRef.current
                const cx = el ? el.getBoundingClientRect().width / 2 : 0
                const cy = el ? el.getBoundingClientRect().height / 2 : 0
                const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, parsed / 100))
                const k = newScale / t.scale
                sync({ x: cx + (t.x - cx) * k, y: cy + (t.y - cy) * k, scale: newScale })
              } else {
                setZoomInput(String(Math.round(transformRef.current.scale * 100)))
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              if (e.key === 'Escape') {
                setZoomInput(String(Math.round(transformRef.current.scale * 100)))
                ;(e.target as HTMLInputElement).blur()
              }
            }}
          />
          <IconButton
            renderIcon={<ZoomInInstUIIcon />}
            screenReaderLabel="Zoom in"
            onClick={() => zoomBy(1.25)}
            withBackground={false}
            withBorder={false}
            size="small"
          />

          <div style={sepStyle} />

          {onToggleTheme && (
            <IconButton
              renderIcon={isDark ? <SunInstUIIcon /> : <MoonInstUIIcon />}
              screenReaderLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={onToggleTheme}
              withBackground={false}
              withBorder={false}
              size="small"
            />
          )}
        </div>
      </nav>
      <InfiniteCanvasContext.Provider value={{ tool }}>
        <div ref={layerRef} style={layerStyle}>{children}</div>
      </InfiniteCanvasContext.Provider>
    </div>
  )
}
