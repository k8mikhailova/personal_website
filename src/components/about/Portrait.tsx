import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ZoomablePhoto } from '../ui/ZoomablePhoto'
import styles from './Portrait.module.css'

type PortraitProps = {
  src: string
  alt: string
  /** Crop focus as CSS object-position. */
  focus?: string
  /** Small tag pinned to the corner of the photo. Empty shows a placeholder. */
  caption?: string
  className?: string
}

/**
 * A tilted, print-like photo on an offset sage panel. It drifts a few pixels
 * as the page scrolls and opens full size on click. Shows a placeholder until
 * `src` is set.
 */
export function Portrait({ src, alt, focus, caption, className }: PortraitProps) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <figure ref={ref} className={`${styles.figure} ${className ?? ''}`}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.print}>
        <div className={styles.frame}>
          <motion.div className={styles.inner} style={reduceMotion ? undefined : { y }}>
            <ZoomablePhoto src={src} alt={alt} focus={focus} />
          </motion.div>
        </div>
      </div>
      {caption !== undefined && (
        <figcaption className={styles.tag}>{caption || <span className="placeholder">[caption]</span>}</figcaption>
      )}
    </figure>
  )
}
