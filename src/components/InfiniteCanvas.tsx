import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

const MIN_SCALE = 0.3
const MAX_SCALE = 1.5
const NAV_HEIGHT = 44

import { InfiniteCanvasContext, type CanvasTool } from './InfiniteCanvasContext'

type Transform = { x: number; y: number; scale: number }
type Tool = CanvasTool

const DARK = {
  canvasBg: '#1a1d21',
  dotColor: '#2d3035',
  navBg: '#0d0f12',
  navBorder: 'rgba(255,255,255,0.07)',
}

const LIGHT = {
  canvasBg: '#d8dce2',
  dotColor: '#c0c5cc',
  navBg: '#e8eaed',
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
  const initialY = 20
  const [transform, setTransform] = useState<Transform>({ x: 40, y: initialY, scale: initialScale })
  const transformRef = useRef<Transform>({ x: 40, y: initialY, scale: initialScale })
  const [tool, setTool] = useState<Tool>('select')
  const toolRef = useRef<Tool>('select')
  const [zoomInput, setZoomInput] = useState(String(Math.round(initialScale * 100)))
  const [tempPan, setTempPan] = useState(false)
  const tempPanRef = useRef(false)
  const tempPanKeysRef = useRef<Set<string>>(new Set())
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

  const centerOnSize = useCallback((contentWidth: number, contentHeight: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const PADDING = 60
    const fitScale = Math.min(
      (rect.width - PADDING * 2) / contentWidth,
      (rect.height - PADDING * 2) / contentHeight,
      1,
    )
    const newScale = Math.max(MIN_SCALE, fitScale)
    const newTx = (rect.width - contentWidth * newScale) / 2
    const newTy = (rect.height - contentHeight * newScale) / 2
    sync({ x: newTx, y: newTy, scale: newScale })
  }, [sync])

  const orientToBoard = useCallback((boardId: string, scale?: number) => {
    if (!containerRef.current || !layerRef.current) return
    const boardEl = layerRef.current.querySelector(`[data-board-id="${boardId}"]`) as HTMLElement | null
    if (!boardEl) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const boardRect = boardEl.getBoundingClientRect()
    const { x: tx, y: ty, scale: s } = transformRef.current
    const bCenterX = (boardRect.left + boardRect.width / 2 - containerRect.left - tx) / s
    const bCenterY = (boardRect.top + boardRect.height / 2 - containerRect.top - ty) / s
    const PADDING = 80
    const boardUnscaledW = boardRect.width / s
    const boardUnscaledH = boardRect.height / s
    const fitScale = Math.min(
      (containerRect.width - PADDING * 2) / boardUnscaledW,
      (containerRect.height - PADDING * 2) / boardUnscaledH,
      1,
    )
    const newScale = Math.max(MIN_SCALE, scale ?? fitScale)
    const newTx = containerRect.width / 2 - bCenterX * newScale
    const newTy = containerRect.height / 2 - bCenterY * newScale
    sync({ x: newTx, y: newTy, scale: newScale })
  }, [sync])

  // Orient to ?board=si-bi on initial load (works for both inline and placeholder elements)
  useEffect(() => {
    const boardId = new URLSearchParams(window.location.search).get('board')
    if (!boardId) return
    requestAnimationFrame(() => orientToBoard(boardId))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function enterTempPan(key: string) {
      if (tempPanKeysRef.current.has(key)) return
      tempPanKeysRef.current.add(key)
      tempPanRef.current = true
      setTempPan(true)
      if (containerRef.current) containerRef.current.style.cursor = 'grab'
    }
    function exitTempPan(key: string) {
      tempPanKeysRef.current.delete(key)
      if (tempPanKeysRef.current.size === 0) {
        tempPanRef.current = false
        panRef.current.active = false
        setTempPan(false)
        if (containerRef.current) {
          containerRef.current.style.cursor = toolRef.current === 'hand' ? 'grab' : ''
        }
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
      if (e.code === 'Space') { e.preventDefault(); enterTempPan('Space') }
      else if (e.key === 'Shift') enterTempPan('Shift')
      else if (e.key === 'Control') enterTempPan('Control')
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === 'Space') exitTempPan('Space')
      else if (e.key === 'Shift') exitTempPan('Shift')
      else if (e.key === 'Control') exitTempPan('Control')
    }
    function onBlur() {
      if (tempPanKeysRef.current.size > 0) {
        tempPanKeysRef.current.clear()
        tempPanRef.current = false
        panRef.current.active = false
        setTempPan(false)
        if (containerRef.current) {
          containerRef.current.style.cursor = toolRef.current === 'hand' ? 'grab' : ''
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onMouseDown(e: MouseEvent) {
      const active = document.activeElement as HTMLElement | null
      if (active && active !== document.body) active.blur()
      const isMiddle = e.button === 1
      if (isMiddle) {
        e.preventDefault()
        tempPanKeysRef.current.add('middle')
        tempPanRef.current = true
        setTempPan(true)
        panRef.current = { active: true, startX: e.clientX, startY: e.clientY }
        el!.style.cursor = 'grabbing'
        return
      }
      if (!tempPanRef.current && toolRef.current !== 'hand') return
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
    function onMouseUp(e: MouseEvent) {
      if (e.button === 1) {
        tempPanKeysRef.current.delete('middle')
        if (tempPanKeysRef.current.size === 0) {
          tempPanRef.current = false
          setTempPan(false)
        }
      }
      if (panRef.current.active) {
        panRef.current.active = false
        el!.style.cursor = tempPanRef.current || toolRef.current === 'hand' ? 'grab' : ''
        setTransform({ ...transformRef.current })
      }
    }
    function applyWheel(clientX: number, clientY: number, deltaX: number, deltaY: number, zoom: boolean, shift: boolean) {
      const t = transformRef.current
      if (zoom) {
        const rect = el!.getBoundingClientRect()
        const cx = clientX - rect.left
        const cy = clientY - rect.top
        // Continuous factor so trackpad pinch (many small deltas) feels smooth.
        // Math.exp(-deltaY * 0.006) gives ~18% per mouse-wheel notch (deltaY≈100)
        // and ~0.6% per trackpad frame (deltaY≈2), both at the right feel.
        const factor = Math.exp(-deltaY * 0.006)
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * factor))
        const k = newScale / t.scale
        applyTransform({
          x: cx + (t.x - cx) * k,
          y: cy + (t.y - cy) * k,
          scale: newScale,
        })
      } else if (shift) {
        applyTransform({ ...t, x: t.x - (deltaX !== 0 ? deltaX : deltaY) })
      } else {
        applyTransform({ ...t, x: t.x - deltaX, y: t.y - deltaY })
      }
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault()
      applyWheel(e.clientX, e.clientY, e.deltaX, e.deltaY, e.ctrlKey || e.metaKey, e.shiftKey)
    }
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const msg = e.data as { type: string; deltaX?: number; deltaY?: number; clientX?: number; clientY?: number; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean }
      const iframe = () => Array.from(document.querySelectorAll('iframe')).find(f => f.contentWindow === e.source)
      if (msg.type === 'embed:wheel') {
        const r = iframe()?.getBoundingClientRect()
        if (!r) return
        applyWheel(r.left + (msg.clientX ?? 0), r.top + (msg.clientY ?? 0), msg.deltaX ?? 0, msg.deltaY ?? 0, !!(msg.ctrlKey || msg.metaKey), !!msg.shiftKey)
      } else if (msg.type === 'embed:middledown') {
        // Convert iframe-local coords to parent-doc coords once at drag start.
        // getBoundingClientRect is safe here — the iframe hasn't moved yet this tick.
        // We do NOT call setTempPan: that triggers a React re-render which sets
        // pointerEvents:none on the iframe, causing window.mousemove to also fire
        // and double-pan the canvas.
        const r = iframe()?.getBoundingClientRect()
        if (!r) return
        // iframe clientX/Y are in the iframe's own pixel space; multiply by canvas
        // scale to convert to screen coords (at s=1 this is a no-op).
        const s = transformRef.current.scale
        panRef.current = { active: true, startX: r.left + (msg.clientX ?? 0) * s, startY: r.top + (msg.clientY ?? 0) * s }
        el!.style.cursor = 'grabbing'
      } else if (msg.type === 'embed:middlemove') {
        if (!panRef.current.active) return
        // getBoundingClientRect here reflects the iframe's position AFTER the
        // previous frame's applyTransform — correct delta for this frame.
        const r = iframe()?.getBoundingClientRect()
        if (!r) return
        const s = transformRef.current.scale
        const px = r.left + (msg.clientX ?? 0) * s
        const py = r.top + (msg.clientY ?? 0) * s
        const t = transformRef.current
        applyTransform({ ...t, x: t.x + px - panRef.current.startX, y: t.y + py - panRef.current.startY })
        panRef.current.startX = px
        panRef.current.startY = py
      } else if (msg.type === 'embed:middleup') {
        panRef.current.active = false
        el!.style.cursor = tempPanRef.current || toolRef.current === 'hand' ? 'grab' : ''
        setTransform({ ...transformRef.current })
      }
    }

    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('message', onMessage)
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('message', onMessage)
    }
  }, [sync, applyTransform])

  const bgStyle: React.CSSProperties = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }

  const navStyle: React.CSSProperties = {
    flexShrink: 0,
    height: NAV_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px 0 16px',
    backgroundColor: palette.navBg,
    borderBottom: `1px solid ${palette.navBorder}`,
    boxSizing: 'border-box',
    transition: 'background-color 0.2s, border-color 0.2s',
  }

  const canvasAreaStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: palette.canvasBg,
    backgroundImage: `radial-gradient(circle, ${palette.dotColor} 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    transition: 'background-color 0.2s, background-image 0.2s',
  }

  const sepStyle: React.CSSProperties = {
    width: 1,
    height: 18,
    backgroundColor: palette.navBorder,
    flexShrink: 0,
    margin: '0 4px',
  }

  const contextValue = useMemo(() => ({
    tool: tempPan ? 'hand' as const : tool,
    orientToBoard,
    centerOnSize,
  }), [tempPan, tool, orientToBoard, centerOnSize])

  const layerStyle: React.CSSProperties = {
    ...LAYER_STYLE,
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
  }

  return (
    <div style={bgStyle}>
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
            withBorder={tool === 'hand' || tempPan}
            size="small"
          />
          <IconButton
            renderIcon={<MousePointer2InstUIIcon />}
            screenReaderLabel="Select tool"
            onClick={() => selectTool('select')}
            withBackground={false}
            withBorder={tool === 'select' && !tempPan}
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
      <div ref={containerRef} style={canvasAreaStyle}>
        <InfiniteCanvasContext.Provider value={contextValue}>
          <div ref={layerRef} style={layerStyle}>{children}</div>
        </InfiniteCanvasContext.Provider>
      </div>
    </div>
  )
}
