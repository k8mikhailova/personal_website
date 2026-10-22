import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import styles from './AgeCounter.module.css'

/** Enough to show it moving (the last digit turns over about every 53 minutes) while still reading as a number in a sentence. */
const DECIMALS = 4

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
 * Live age in years. It checks once a second (once a minute with reduced
 * motion) and only touches the DOM when the shown value changes.
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
    const id = window.setInterval(update, reduceMotion ? 60_000 : 1_000)
    return () => window.clearInterval(id)
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
