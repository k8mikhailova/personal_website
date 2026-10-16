import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import styles from './AgeCounter.module.css'

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000

function ageInYears(born: number) {
  return (Date.now() - born) / YEAR_MS
}

/**
 * Live age in years, ticking through the decimals.
 * With reduced motion it shows two decimals and updates once a minute.
 */
export function AgeCounter({ birthDate }: { birthDate: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const born = birthDate ? new Date(birthDate).getTime() : NaN
  const valid = !Number.isNaN(born)
  const digits = reduceMotion ? 2 : 9
  // First value for the initial render; the effect below keeps it ticking.
  const [initial] = useState(() => (valid ? ageInYears(born) : 0))

  useEffect(() => {
    if (!valid) return
    const update = () => {
      if (ref.current) ref.current.textContent = ageInYears(born).toFixed(digits)
    }
    update()

    if (reduceMotion) {
      const id = window.setInterval(update, 60_000)
      return () => window.clearInterval(id)
    }

    let raf = 0
    const loop = () => {
      update()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [born, valid, digits, reduceMotion])

  if (!valid) {
    return <span className="placeholder">[age: add birthDate in src/content/about.ts]</span>
  }

  return (
    <span className={styles.age}>
      <span ref={ref} aria-hidden="true">
        {initial.toFixed(digits)}
      </span>
      <span className="sr-only">{Math.floor(initial)}</span>
    </span>
  )
}
