import { CaretLeft, CaretRight, MagnifyingGlassMinus, MagnifyingGlassPlus, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MIN_SCALE = 1
const MAX_SCALE = 4
const DOUBLE_TAP_MS = 300
const SWIPE_PX = 60

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export default function Lightbox({ images, index, alt, onClose, onIndexChange }) {
  const open = index !== null && index >= 0
  return createPortal(
    <AnimatePresence>
      {open && (
        <LightboxView images={images} index={index} alt={alt} onClose={onClose} onIndexChange={onIndexChange} />
      )}
    </AnimatePresence>,
    document.body,
  )
}

function LightboxView({ images, index, alt, onClose, onIndexChange }) {
  const stageRef = useRef(null)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const lastTap = useRef(0)
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [swipeX, setSwipeX] = useState(0)
  const count = images.length

  const reset = () => setView({ scale: 1, x: 0, y: 0 })

  const go = useCallback(
    (delta) => {
      if (count < 2) return
      setView({ scale: 1, x: 0, y: 0 })
      onIndexChange((index + delta + count) % count)
    },
    [count, index, onIndexChange],
  )

  const clampPan = useCallback((scale, x, y) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return { scale, x, y }
    const maxX = ((scale - 1) * rect.width) / 2
    const maxY = ((scale - 1) * rect.height) / 2
    return { scale, x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) }
  }, [])

  const zoomTo = useCallback(
    (scale) => {
      const s = clamp(scale, MIN_SCALE, MAX_SCALE)
      setView((v) => (s === 1 ? { scale: 1, x: 0, y: 0 } : clampPan(s, v.x, v.y)))
    },
    [clampPan],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [go, onClose])

  function onWheel(e) {
    zoomTo(view.scale * (e.deltaY < 0 ? 1.2 : 1 / 1.2))
  }

  function onPointerDown(e) {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Capture is only an enhancement; gestures still work from the stage's own events.
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    setDragging(true)
    const pts = [...pointers.current.values()]
    if (pts.length === 2) {
      gesture.current = {
        type: 'pinch',
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
        scale: view.scale,
      }
    } else if (pts.length === 1) {
      gesture.current = {
        type: view.scale > 1 ? 'pan' : 'swipe',
        startX: e.clientX,
        startY: e.clientY,
        x: view.x,
        y: view.y,
        moved: false,
      }
    }
  }

  function onPointerMove(e) {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return
    if (g.type === 'pinch') {
      const pts = [...pointers.current.values()]
      if (pts.length < 2) return
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      zoomTo((g.scale * dist) / g.dist)
      return
    }
    const dx = e.clientX - g.startX
    const dy = e.clientY - g.startY
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) g.moved = true
    if (g.type === 'pan') setView((v) => clampPan(v.scale, g.x + dx, g.y + dy))
    else if (count > 1) setSwipeX(dx)
  }

  function onPointerUp(e) {
    pointers.current.delete(e.pointerId)
    const g = gesture.current
    if (pointers.current.size > 0) {
      // One finger lifted mid-pinch: continue as a pan from the remaining finger.
      const [p] = [...pointers.current.values()]
      gesture.current = { type: 'pan', startX: p.x, startY: p.y, x: view.x, y: view.y, moved: true }
      return
    }
    setDragging(false)
    gesture.current = null
    if (!g) return

    if (g.type === 'swipe') {
      const dx = e.clientX - g.startX
      setSwipeX(0)
      if (Math.abs(dx) > SWIPE_PX) {
        go(dx < 0 ? 1 : -1)
        return
      }
    }

    if (!g.moved && g.type !== 'pinch') {
      const now = Date.now()
      if (now - lastTap.current < DOUBLE_TAP_MS) {
        lastTap.current = 0
        if (view.scale > 1) reset()
        else zoomTo(2.5)
      } else {
        lastTap.current = now
      }
    }
  }

  const btn =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:opacity-30'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt}, photo ${index + 1} of ${count}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <span className="text-sm tabular-nums text-white/70">{count > 1 ? `${index + 1} / ${count}` : ''}</span>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => zoomTo(view.scale / 1.5)} disabled={view.scale <= 1} aria-label="Zoom out">
            <MagnifyingGlassMinus size={20} />
          </button>
          <button type="button" className={btn} onClick={() => zoomTo(view.scale * 1.5)} disabled={view.scale >= MAX_SCALE} aria-label="Zoom in">
            <MagnifyingGlassPlus size={20} />
          </button>
          <button type="button" className={btn} onClick={onClose} aria-label="Close">
            <X size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className={`relative flex-1 touch-none select-none overflow-hidden ${
          view.scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          key={images[index]}
          src={images[index]}
          alt={alt}
          draggable={false}
          className="absolute inset-0 m-auto max-h-full max-w-[calc(100%-1.5rem)] rounded-2xl"
          style={{
            transform: `translate(${view.x + swipeX}px, ${view.y}px) scale(${view.scale})`,
            transition: dragging ? 'none' : 'transform 0.25s ease-out',
          }}
        />
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${btn} absolute left-3 top-1/2 hidden -translate-y-1/2 md:flex`}
            onClick={() => go(-1)}
            aria-label="Previous photo"
          >
            <CaretLeft size={22} weight="bold" />
          </button>
          <button
            type="button"
            className={`${btn} absolute right-3 top-1/2 hidden -translate-y-1/2 md:flex`}
            onClick={() => go(1)}
            aria-label="Next photo"
          >
            <CaretRight size={22} weight="bold" />
          </button>
        </>
      )}

      <p className="px-4 pb-4 pt-2 text-center text-xs text-white/50">
        {view.scale > 1 ? 'Drag to look around. Double-tap to reset.' : 'Pinch, scroll, or double-tap to zoom.'}
      </p>
    </motion.div>
  )
}
