import { useEffect, useRef } from 'react'
import styles from './FlowField.module.css'

type FlowFieldProps = {
  className?: string
  /** Number of strands in the ribbon. */
  lineCount?: number
  /** Vertical position of the ribbon as a fraction of the canvas height. */
  center?: number
  /** Same, for narrow screens. */
  mobileCenter?: number
}

/**
 * A ribbon of thin lines drifting across the hero. Each strand follows a shared
 * slow wave plus its own small wobble, so the bundle twists and loosens over time.
 * The cursor gently pushes nearby strands aside.
 *
 * Pauses when off-screen or in a background tab, and renders a single still
 * frame for people who prefer reduced motion.
 */
export function FlowField({ className, lineCount = 26, center = 0.56, mobileCenter = 0.63 }: FlowFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionQuery.matches

    let width = 0
    let height = 0
    let raf = 0
    let inView = true
    let lastFrame = performance.now()
    // Start partway into the animation so the first frame isn't a flat line.
    let time = 40 + Math.random() * 20

    // Pointer position is eased toward its target so the push feels soft.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 }

    let strokeColor = getComputedStyle(canvas).color

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      strokeColor = getComputedStyle(canvas!).color
      draw()
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      if (!width || !height) return

      const narrow = width < 720
      const step = narrow ? 12 : 9
      const centerY = height * (narrow ? mobileCenter : center)
      const amplitude = height * (narrow ? 0.06 : 0.15)
      const bandWidth = Math.min(height * 0.32, narrow ? 150 : 260)
      const radius = narrow ? 90 : 150
      const push = 34 * pointer.strength

      ctx!.strokeStyle = strokeColor
      ctx!.lineWidth = 1

      for (let i = 0; i < lineCount; i++) {
        // -0.5 (top strand) … 0.5 (bottom strand)
        const k = i / (lineCount - 1) - 0.5
        // Middle strands are a bit stronger than the outer ones.
        ctx!.globalAlpha = 0.16 + 0.4 * (1 - Math.abs(k) * 2)
        ctx!.beginPath()

        for (let x = -step; x <= width + step; x += step) {
          const nx = x / width

          // Shared slow wave: gives the ribbon its overall path.
          const wave =
            Math.sin(nx * 3.2 + time * 0.21) * 0.55 +
            Math.sin(nx * 5.9 - time * 0.15 + 1.3) * 0.25 +
            Math.sin(nx * 1.4 + time * 0.09 + 4.1) * 0.45

          // Twist: the spacing between strands swells, pinches and flips along x.
          const twist = Math.sin(nx * 2.6 - time * 0.17 + 0.8)

          // Each strand's own small drift, so it doesn't look mechanical.
          const wobble = Math.sin(nx * 7.3 + time * 0.33 + i * 1.71) * 5

          let y = centerY + wave * amplitude + k * bandWidth * (0.15 + 0.85 * twist) + wobble

          if (push > 0.01) {
            const dx = x - pointer.x
            const dy = y - pointer.y
            const falloff = Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius))
            // Smooth push away from the cursor (derivative-of-Gaussian shape).
            y += (dy / radius) * falloff * push
          }

          if (x === -step) ctx!.moveTo(x, y)
          else ctx!.lineTo(x, y)
        }

        ctx!.stroke()
      }

      ctx!.globalAlpha = 1
    }

    function frame(now: number) {
      const dt = Math.min((now - lastFrame) / 1000, 0.05)
      lastFrame = now
      time += dt

      pointer.x += (pointer.targetX - pointer.x) * 0.07
      pointer.y += (pointer.targetY - pointer.y) * 0.07
      pointer.strength += (pointer.targetStrength - pointer.strength) * 0.04

      draw()
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
        // Jump straight to the cursor when it first enters, instead of sliding in from the old spot.
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

    function onVisibilityChange() {
      if (document.hidden) stop()
      else start()
    }

    function onMotionPreferenceChange() {
      reduceMotion = motionQuery.matches
      if (reduceMotion) {
        stop()
        draw()
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
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [lineCount, center, mobileCenter])

  return (
    <canvas ref={canvasRef} className={`${styles.canvas} ${className ?? ''}`} aria-hidden="true" />
  )
}
