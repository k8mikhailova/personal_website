import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { MediaPlaceholder } from '../ui/MediaPlaceholder'
import styles from './Portrait.module.css'

type PortraitProps = {
  src: string
  alt: string
  className?: string
}

/**
 * A modest, slightly offset portrait. The photo drifts a few pixels as the page
 * scrolls. Renders a placeholder until `src` is set.
 */
export function Portrait({ src, alt, className }: PortraitProps) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <figure ref={ref} className={`${styles.figure} ${className ?? ''}`}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.frame}>
        <motion.div className={styles.inner} style={reduceMotion ? undefined : { y }}>
          {src ? (
            <img className={styles.image} src={src} alt={alt} loading="lazy" />
          ) : (
            <MediaPlaceholder label="Photo coming soon" seed="portrait" />
          )}
        </motion.div>
      </div>
    </figure>
  )
}
