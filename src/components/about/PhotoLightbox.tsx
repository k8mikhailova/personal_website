import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import type { Photo } from '../../content/about'
import { ArrowIcon } from '../ui/ArrowIcon'
import { srcFor } from '../ui/imageSrc'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import styles from './PhotoLightbox.module.css'

type PhotoLightboxProps = {
  photos: Photo[]
  /** Index of the open photo, or null when closed. */
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
}

/**
 * Full-screen viewer for the photo story. Native <dialog> handles focus
 * trapping and Esc; arrow keys, buttons, and horizontal swipes move between
 * photos. Focus returns to the photo that opened it.
 */
export function PhotoLightbox({ photos, index, onChange, onClose }: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const open = index !== null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Warm the cache for neighbours so arrowing through feels instant.
  useEffect(() => {
    if (index === null) return
    for (const i of [index - 1, index + 1]) {
      const photo = photos[(i + photos.length) % photos.length]
      const img = new Image()
      img.src = srcFor(photo.image, photo.image.widths[photo.image.widths.length - 1])
    }
  }, [index, photos])

  const go = (step: number) => {
    if (index === null) return
    onChange((index + step + photos.length) % photos.length)
  }

  const handleClose = () => {
    document.documentElement.style.overflow = ''
    onClose()
    returnFocusRef.current?.focus({ preventScroll: true })
  }

  const onPointerDown = (event: ReactPointerEvent) => {
    if (event.pointerType !== 'mouse') swipeStart.current = { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    const dy = event.clientY - start.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
  }

  const photo = index !== null ? photos[index] : null

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={photo ? `${photo.label}, photo ${index! + 1} of ${photos.length}` : 'Photo viewer'}
      onClose={handleClose}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
      // Clicking the dark area around the photo closes it (the layout fills the
      // whole screen, so empty layout/figure space counts as backdrop).
      onClick={(event) => {
        if ((event.target as HTMLElement).dataset.backdrop !== undefined) dialogRef.current?.close()
      }}
    >
      {photo && (
        <div className={styles.layout} data-backdrop onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()}>
            Close
          </button>

          <figure className={styles.figure} data-backdrop>
            <ResponsiveImage
              key={photo.slot}
              image={photo.image}
              alt={photo.alt}
              sizes="(min-width: 900px) 70vw, 100vw"
              className={styles.image}
              loading="eager"
            />
            <figcaption className={styles.caption}>
              <span className={styles.count}>
                {String(index! + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
              </span>
              <span className={styles.label}>{photo.label}</span>
              <span className={styles.text}>{photo.caption}</span>
            </figcaption>
          </figure>

          <div className={styles.nav}>
            <button type="button" className={styles.navButton} onClick={() => go(-1)} aria-label="Previous photo">
              <span className={styles.flip}>
                <ArrowIcon />
              </span>
            </button>
            <button type="button" className={styles.navButton} onClick={() => go(1)} aria-label="Next photo">
              <ArrowIcon />
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
