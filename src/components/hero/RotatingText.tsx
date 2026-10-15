import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useState } from 'react'
import styles from './RotatingText.module.css'

type RotatingTextProps = {
  phrases: string[]
  className?: string
  /** Time each phrase stays on screen, in ms. */
  interval?: number
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Cycles through phrases, letting each word rise softly into place.
 * Every phrase is also rendered invisibly in the same grid cell so the
 * layout never jumps when a longer or shorter phrase comes in.
 */
export function RotatingText({ phrases, className, interval = 3400 }: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || phrases.length < 2) return
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % phrases.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [reduceMotion, phrases.length, interval])

  const words = phrases[index].split(' ')

  return (
    <span className={`${styles.root} ${className ?? ''}`}>
      {phrases.map((phrase) => (
        <span key={phrase} className={styles.ghost} aria-hidden="true">
          {phrase}
        </span>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={index} className={styles.phrase} aria-hidden="true">
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              {i > 0 && ' '}
              <motion.span
                className={styles.word}
                initial={{ opacity: 0, y: '0.45em', filter: 'blur(6px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.75, ease, delay: i * 0.06 },
                }}
                exit={{
                  opacity: 0,
                  y: '-0.3em',
                  filter: 'blur(4px)',
                  transition: { duration: 0.4, ease, delay: i * 0.025 },
                }}
              >
                {word}
              </motion.span>
            </Fragment>
          ))}
        </motion.span>
      </AnimatePresence>

      {/* One stable sentence for screen readers instead of a constantly changing one. */}
      <span className="sr-only">{phrases[0]}</span>
    </span>
  )
}
