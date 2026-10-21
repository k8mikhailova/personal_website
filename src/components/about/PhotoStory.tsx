import { motion, useReducedMotion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import type { Photo, PhotoSlot } from '../../content/about'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import { PhotoLightbox } from './PhotoLightbox'
import styles from './PhotoStory.module.css'

type PhotoStoryProps = {
  photos: Photo[]
  /** The section heading, rendered inside the first spread. */
  heading: ReactNode
}

// Rendered width of each slot at each breakpoint, so the browser picks a sensible file.
const SIZES: Record<PhotoSlot, string> = {
  rafting: '(min-width: 1100px) 400px, (min-width: 700px) 46vw, 100vw',
  surfing: '(min-width: 1100px) 440px, (min-width: 700px) 46vw, 50vw',
  sailing: '(min-width: 1100px) 440px, (min-width: 700px) 46vw, 50vw',
  hiking: '100vw',
  camping: '(min-width: 1100px) 760px, 100vw',
  running: '(min-width: 1100px) 430px, 50vw',
  whales: '(min-width: 1100px) 430px, 50vw',
  reading: '(min-width: 1100px) 650px, 90vw',
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The photo section: three hand-placed spreads (action, a panoramic breather,
 * friends and quieter moments). Each photo wipes into view once; clicking
 * opens the full-screen viewer with the original caption.
 */
export function PhotoStory({ photos, heading }: PhotoStoryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  const indexOf = (slot: PhotoSlot) => photos.findIndex((p) => p.slot === slot)
  const pick = (...slots: PhotoSlot[]) => slots.map(indexOf).filter((i) => i !== -1)

  const figure = (i: number) => {
    const photo = photos[i]
    return (
      <figure key={photo.slot} className={`${styles.figure} ${styles[photo.slot]}`}>
        <button
          type="button"
          className={styles.frame}
          onClick={() => setOpenIndex(i)}
          aria-label={`View larger: ${photo.label}`}
          aria-haspopup="dialog"
        >
          <motion.span
            className={styles.reveal}
            initial={reduceMotion ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1.1, ease }}
          >
            <motion.span
              className={styles.zoom}
              initial={reduceMotion ? false : { scale: 1.14 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 1.6, ease }}
            >
              <ResponsiveImage
                image={photo.image}
                alt={photo.alt}
                sizes={SIZES[photo.slot]}
                className={styles.image}
                style={{ objectPosition: photo.focus }}
              />
            </motion.span>
          </motion.span>
        </button>
        <figcaption className={styles.label}>
          <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
          {photo.label}
        </figcaption>
      </figure>
    )
  }

  return (
    <>
      {/* Spread 1: the big action shots, with the heading. */}
      <div className={`${styles.wrap} ${styles.spread} ${styles.spreadOne}`}>
        <div className={styles.heading}>{heading}</div>
        {pick('rafting', 'surfing', 'sailing').map(figure)}
      </div>

      {/* A panoramic breather, edge to edge. */}
      <div className={styles.band}>{pick('hiking').map(figure)}</div>

      {/* Spread 2: friends and quieter moments. */}
      <div className={`${styles.wrap} ${styles.spread} ${styles.spreadTwo}`}>
        {pick('camping', 'running', 'whales', 'reading').map(figure)}
      </div>

      <PhotoLightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </>
  )
}
