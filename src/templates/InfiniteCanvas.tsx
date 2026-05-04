import React, { useCallback, useEffect, useRef, useState } from 'react'

const MIN_SCALE = 0.05
const MAX_SCALE = 5
const NAV_HEIGHT = 44

type Transform = { x: number; y: number; scale: number }

const DARK = {
  canvasBg: '#1a1d21',
  dotColor: '#2d3035',
  navBg: 'rgba(13, 15, 18, 0.9)',
  navBorder: 'rgba(255,255,255,0.07)',
  navText: '#d8dde3',
  btnBorder: 'rgba(255,255,255,0.12)',
  btnBg: 'rgba(255,255,255,0.06)',
  btnColor: '#b0b8c2',
  hudBg: 'rgba(0,0,0,0.45)',
  hudColor: '#8a9199',
}

const LIGHT = {
  canvasBg: '#d8dce2',
  dotColor: '#c0c5cc',
  navBg: 'rgba(246, 247, 249, 0.92)',
  navBorder: 'rgba(0,0,0,0.09)',
  navText: '#2c3540',
  btnBorder: 'rgba(0,0,0,0.14)',
  btnBg: 'rgba(0,0,0,0.05)',
  btnColor: '#4a5568',
  hudBg: 'rgba(0,0,0,0.18)',
  hudColor: '#4a5568',
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
  gap: 8,
}

const NAV_TITLE_GROUP_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
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
  const spaceRef = useRef(false)
  const panRef = useRef<{ active: boolean; startX: number; startY: number }>({ active: false, startX: 0, startY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const sync = useCallback((t: Transform) => {
    transformRef.current = t
    setTransform(t)
  }, [])

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
        if (containerRef.current) containerRef.current.style.cursor = ''
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
      if (!spaceRef.current) return
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
      sync({ ...t, x: t.x + dx, y: t.y + dy })
    }
    function onMouseUp() {
      if (panRef.current.active) {
        panRef.current.active = false
        el!.style.cursor = spaceRef.current ? 'grab' : ''
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
        sync({
          x: cx + (t.x - cx) * k,
          y: cy + (t.y - cy) * k,
          scale: newScale,
        })
      } else if (e.shiftKey) {
        sync({ ...t, x: t.x - (e.deltaX !== 0 ? e.deltaX : e.deltaY) })
      } else {
        sync({ ...t, x: t.x - e.deltaX, y: t.y - e.deltaY })
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
  }, [sync])

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
    padding: '0 16px',
    backgroundColor: palette.navBg,
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${palette.navBorder}`,
    boxSizing: 'border-box',
    transition: 'background-color 0.2s, border-color 0.2s',
  }

  const navTitleStyle: React.CSSProperties = {
    color: palette.navText,
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 500,
    letterSpacing: 0.1,
    userSelect: 'none',
    transition: 'color 0.2s',
  }

  const toggleBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 6,
    border: `1px solid ${palette.btnBorder}`,
    backgroundColor: palette.btnBg,
    color: palette.btnColor,
    cursor: 'pointer',
    padding: 0,
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
  }

  const hudStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: palette.hudBg,
    color: palette.hudColor,
    fontSize: 12,
    fontFamily: 'monospace',
    padding: '4px 8px',
    borderRadius: 4,
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'background-color 0.2s, color 0.2s',
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
            <a href={backTo} style={{ ...toggleBtnStyle, textDecoration: 'none', fontSize: 16, lineHeight: 1 }} title="Back">←</a>
          )}
          <span style={navTitleStyle}>{title ?? ''}</span>
        </div>

        <div style={NAV_ACTIONS_STYLE}>
          {onToggleTheme && (
            <button style={toggleBtnStyle} onClick={onToggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
        </div>
      </nav>
      <div style={layerStyle}>{children}</div>
      <div style={hudStyle}>{Math.round(transform.scale * 100)}%</div>
    </div>
  )
}
