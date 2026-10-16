import { useEffect, useRef, type RefObject } from 'react'
import styles from './WindField.module.css'
import { windSettings } from './windSettings'

type WindFieldProps = {
  /** Element the current flows around, with strokes concentrated near it (the photo). */
  avoidRef: RefObject<HTMLElement | null>
  /** Element to keep clear: strokes fade out behind it (the text). */
  clearRef: RefObject<HTMLElement | null>
  className?: string
}

type Stroke = { x: number; y: number; vx: number; vy: number; age: number; life: number }

const ALPHA_LEVELS = 12

/**
 * A field of short strokes drifting on a slow, shifting current, like wind
 * over grass. The current bends around the photo, strokes fade behind the
 * text, and nearby strokes swirl around the cursor.
 *
 * Pauses off-screen and in background tabs; draws one still frame for people
 * who prefer reduced motion.
 */
export function WindField({ avoidRef, clearRef, className }: WindFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const settings = windSettings
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionQuery.matches

    let width = 0
    let height = 0
    let strokes: Stroke[] = []
    let raf = 0
    let inView = true
    let lastFrame = performance.now()
    let time = Math.random() * 100
    let color = getComputedStyle(canvas).color
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 }

    // The current: an angle (radians) that mostly points left-to-right and slowly bends.
    function flowAngle(x: number, y: number) {
      const t = time * settings.flowChange
      const nx = x / 320
      const ny = y / 260
      return (
        0.85 * Math.sin(nx * 1.3 + Math.sin(ny * 1.1 + t * 0.21) * 1.6 - t * 0.18) +
        0.45 * Math.sin(ny * 2.2 - nx * 0.7 + t * 0.27)
      )
    }

    function respawn(stroke: Stroke, anyAge: boolean) {
      stroke.x = Math.random() * width
      stroke.y = Math.random() * height
      stroke.life = 6 + Math.random() * 8
      stroke.age = anyAge ? Math.random() * stroke.life : 0
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      color = getComputedStyle(canvas!).color

      const spacing = width < 720 ? settings.mobileSpacing : settings.spacing
      const count = Math.round((width * height) / (spacing * spacing))
      strokes = Array.from({ length: count }, () => {
        const stroke = { x: 0, y: 0, vx: 1, vy: 0, age: 0, life: 1 }
        respawn(stroke, true)
        return stroke
      })
      render(0)
    }

    // Element boxes in canvas coordinates, read every frame (cheap, and stays right during reveals/scroll).
    function boxOf(ref: RefObject<HTMLElement | null>, origin: DOMRect) {
      const el = ref.current
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top }
    }

    function render(dt: number) {
      const origin = canvas!.getBoundingClientRect()
      const avoid = boxOf(avoidRef, origin)
      const clear = boxOf(clearRef, origin)

      // Photo as an ellipse slightly larger than its box.
      const obstacle = avoid && {
        cx: (avoid.left + avoid.right) / 2,
        cy: (avoid.top + avoid.bottom) / 2,
        rx: (avoid.right - avoid.left) / 2 + 18,
        ry: (avoid.bottom - avoid.top) / 2 + 18,
      }

      // Fade the whole field as the visitor scrolls down toward the photo grid.
      const scrollFade = 1 - 0.75 * Math.min(1, Math.max(0, window.scrollY / (height * 0.7)))
      const radius = settings.cursorRadius
      const swirl = settings.cursorStrength * pointer.strength
      const buckets: Stroke[][] = Array.from({ length: ALPHA_LEVELS }, () => [])
      const lengths = new Map<Stroke, number>()

      for (const s of strokes) {
        const angle = flowAngle(s.x, s.y)
        let vx = Math.cos(angle)
        let vy = Math.sin(angle)
        let density = 0.4

        if (obstacle) {
          const dx = (s.x - obstacle.cx) / obstacle.rx
          const dy = (s.y - obstacle.cy) / obstacle.ry
          const d = Math.hypot(dx, dy) || 0.001
          if (d < 1.7) {
            // Turn toward the tangent so the current flows around the photo.
            let tx = -dy / d
            let ty = dx / d
            if (tx * vx + ty * vy < 0) {
              tx = -tx
              ty = -ty
            }
            const w = Math.min(1, (1.7 - d) / 0.7)
            vx = vx * (1 - w) + tx * w
            vy = vy * (1 - w) + ty * w
            if (d < 1) {
              // Nudge strokes that drift inside back out to the edge.
              s.x = obstacle.cx + (dx / d) * obstacle.rx
              s.y = obstacle.cy + (dy / d) * obstacle.ry
            }
          }
          // Strongest in a ring around the photo, quieter further out.
          density = 0.35 + 0.65 * Math.exp(-((d - 1.25) ** 2) / 0.35)
        }

        let lengthBoost = 0
        if (swirl > 0.01 && radius > 0) {
          const dx = s.x - pointer.x
          const dy = s.y - pointer.y
          const f = Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius)) * swirl
          if (f > 0.01) {
            const dist = Math.hypot(dx, dy) || 1
            let tx = -dy / dist
            let ty = dx / dist
            if (tx * vx + ty * vy < 0) {
              tx = -tx
              ty = -ty
            }
            vx = vx * (1 - f) + tx * f
            vy = vy * (1 - f) + ty * f
            lengthBoost = f
          }
        }

        const norm = Math.hypot(vx, vy) || 1
        s.vx = vx / norm
        s.vy = vy / norm

        if (dt > 0) {
          const speed = settings.speed * (1 + lengthBoost * 0.8)
          s.x += s.vx * speed * dt
          s.y += s.vy * speed * dt
          s.age += dt
          if (s.age > s.life || s.x < -20 || s.x > width + 20 || s.y < -20 || s.y > height + 20) respawn(s, false)
        }

        // Fade in at birth and out at end of life so strokes never pop.
        const lifeFade = reduceMotion ? 1 : Math.min(1, s.age / 1.2, (s.life - s.age) / 1.2)

        let clearFade = 1
        if (clear) {
          // Distance outside the text box; strokes behind the text nearly vanish.
          const ox = Math.max(clear.left - s.x, 0, s.x - clear.right)
          const oy = Math.max(clear.top - s.y, 0, s.y - clear.bottom)
          clearFade = 0.08 + 0.92 * Math.min(1, Math.hypot(ox, oy) / 48)
        }

        const alpha = settings.maxOpacity * density * lifeFade * clearFade * scrollFade * (1 + lengthBoost * 0.6)
        const level = Math.min(ALPHA_LEVELS - 1, Math.floor((alpha / settings.maxOpacity) * ALPHA_LEVELS))
        if (level <= 0) continue
        buckets[level].push(s)
        lengths.set(s, settings.length * (1 + lengthBoost * 0.6))
      }

      // Draw in a few batches by opacity level instead of one call per stroke.
      ctx!.clearRect(0, 0, width, height)
      ctx!.strokeStyle = color
      ctx!.lineWidth = 1
      ctx!.lineCap = 'round'
      buckets.forEach((bucket, level) => {
        if (bucket.length === 0) return
        ctx!.globalAlpha = Math.min(1, ((level + 0.5) / ALPHA_LEVELS) * settings.maxOpacity)
        ctx!.beginPath()
        for (const s of bucket) {
          const half = (lengths.get(s) ?? settings.length) / 2
          ctx!.moveTo(s.x - s.vx * half, s.y - s.vy * half)
          ctx!.lineTo(s.x + s.vx * half, s.y + s.vy * half)
        }
        ctx!.stroke()
      })
      ctx!.globalAlpha = 1
    }

    function frame(now: number) {
      const dt = Math.min((now - lastFrame) / 1000, 0.05)
      lastFrame = now
      time += dt
      pointer.x += (pointer.targetX - pointer.x) * 0.08
      pointer.y += (pointer.targetY - pointer.y) * 0.08
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.05
      render(dt)
      raf = requestAnimationFrame(frame)
    }

    function start() {
      if (raf || reduceMotion || !inView || document.hidden) return
      lastFrame = performance.now()
      raf = requestAnimationFrame(frame)
    }

    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      const rect = canvas!.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      if (inside && pointer.strength < 0.01) {
        pointer.x = x
        pointer.y = y
      }
      pointer.targetX = x
      pointer.targetY = y
      pointer.targetStrength = inside ? 1 : 0
    }

    function onPointerLeave() {
      pointer.targetStrength = 0
    }

    function onScroll() {
      // The animation loop picks up scroll on its own; the still frame needs a redraw.
      if (reduceMotion) render(0)
    }

    function onVisibilityChange() {
      if (document.hidden) stop()
      else start()
    }

    function onMotionPreferenceChange() {
      reduceMotion = motionQuery.matches
      if (reduceMotion) {
        stop()
        render(0)
      } else {
        start()
      }
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    })
    intersectionObserver.observe(canvas)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    resize()
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [avoidRef, clearRef])

  return <canvas ref={canvasRef} className={`${styles.canvas} ${className ?? ''}`} aria-hidden="true" />
}
