import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import styles from './AgeCounter.module.css'

const DECIMALS = 8

/**
 * Exact fractional age: whole years since the last birthday, plus how far the
 * current moment is between the last and next birthday. Using the real length
 * of that particular year keeps it correct across birthdays and leap years.
 */
function ageInYears(birth: Date, now = new Date()) {
  const birthdayIn = (year: number) =>
    new Date(year, birth.getMonth(), birth.getDate(), birth.getHours(), birth.getMinutes(), birth.getSeconds())

  let year = now.getFullYear()
  let last = birthdayIn(year)
  if (last > now) last = birthdayIn(--year)
  const next = birthdayIn(year + 1)

  const wholeYears = year - birth.getFullYear()
  return wholeYears + (now.getTime() - last.getTime()) / (next.getTime() - last.getTime())
}

/**
 * Live age in years, ticking through the decimals every frame. It writes
 * straight to the number's text node, so the page around it never re-renders.
 * With reduced motion it updates once a minute instead.
 */
export function AgeCounter({ birthDate }: { birthDate: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()
  const birth = birthDate ? new Date(birthDate) : null
  const valid = !!birth && !Number.isNaN(birth.getTime())
  const birthTime = valid ? birth.getTime() : NaN
  // First value for the initial render; the effect below keeps it ticking.
  const [initial] = useState(() => (valid ? ageInYears(birth) : 0))

  useEffect(() => {
    if (Number.isNaN(birthTime)) return
    const born = new Date(birthTime)
    const update = () => {
      const text = ageInYears(born).toFixed(DECIMALS)
      if (ref.current && ref.current.textContent !== text) ref.current.textContent = text
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
  }, [birthTime, reduceMotion])

  if (!valid) {
    return <span className="placeholder">[age: add birthDate in src/content/about.ts]</span>
  }

  return (
    <span className={styles.age}>
      <span ref={ref} aria-hidden="true">
        {initial.toFixed(DECIMALS)}
      </span>
      <span className="sr-only">{Math.floor(initial)}</span>
    </span>
  )
}
