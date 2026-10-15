import { useMemo } from 'react'
import styles from './MediaPlaceholder.module.css'

type MediaPlaceholderProps = {
  label: string
  /** Seeds the line pattern so each project gets its own variation. */
  seed: string
  /** 'video' adds a play glyph so it reads as a future demo. */
  variant?: 'image' | 'video'
}

function hash(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function random(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Temporary stand-in for a screenshot or video. Draws a few contour lines that
 * echo the hero background, with a clear "coming soon" label.
 */
export function MediaPlaceholder({ label, seed, variant = 'image' }: MediaPlaceholderProps) {
  const paths = useMemo(() => {
    const rand = random(hash(seed))
    const count = 14
    const tilt = (rand() - 0.5) * 60
    const phase = rand() * Math.PI * 2
    const freq = 1.4 + rand() * 1.4

    return Array.from({ length: count }, (_, i) => {
      const baseY = 30 + (i / (count - 1)) * 190 + tilt * (i / count - 0.5)
      const points: string[] = []
      for (let x = -20; x <= 420; x += 8) {
        const nx = x / 400
        const y =
          baseY +
          Math.sin(nx * Math.PI * freq + phase + i * 0.18) * 26 +
          Math.sin(nx * Math.PI * 3.1 - phase * 0.7) * 8
        points.push(`${x === -20 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
      }
      return points.join(' ')
    })
  }, [seed])

  return (
    <div className={styles.root}>
      <svg className={styles.lines} viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g className={styles.group}>
          {paths.map((d, i) => (
            <path key={i} d={d} style={{ opacity: 0.25 + 0.5 * Math.sin((i / paths.length) * Math.PI) }} />
          ))}
        </g>
      </svg>
      {variant === 'video' && (
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  )
}
