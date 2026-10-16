import { useRef, useState } from 'react'
import { MediaPlaceholder } from './MediaPlaceholder'
import styles from './ZoomablePhoto.module.css'

type ZoomablePhotoProps = {
  src: string
  alt: string
  /** CSS object-position for the crop, e.g. '50% 30%' keeps the upper middle in frame. */
  focus?: string
  /** Shown when there's no photo yet (or the file fails to load). */
  placeholderLabel?: string
  className?: string
}

/**
 * A cropped photo that opens full size in a dialog when clicked.
 * Falls back to a labeled placeholder if `src` is empty or the image can't load.
 */
export function ZoomablePhoto({
  src,
  alt,
  focus = '50% 50%',
  placeholderLabel = 'Photo coming soon',
  className,
}: ZoomablePhotoProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`${styles.frame} ${className ?? ''}`}>
        <MediaPlaceholder label={placeholderLabel} seed={placeholderLabel} />
      </div>
    )
  }

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        className={`${styles.frame} ${styles.button} ${className ?? ''}`}
        onClick={open}
        aria-haspopup="dialog"
      >
        <img
          className={styles.image}
          src={src}
          alt={alt}
          style={{ objectPosition: focus }}
          loading="lazy"
          onError={() => setFailed(true)}
        />
        <span className={styles.hint} aria-hidden="true">
          <ExpandIcon /> View larger
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={alt}
        // Clicking the dark backdrop (the dialog element itself) closes it.
        onClick={(event) => {
          if (event.target === dialogRef.current) close()
        }}
      >
        <img className={styles.full} src={src} alt={alt} />
        <button type="button" className={styles.close} onClick={close}>
          Close
        </button>
      </dialog>
    </>
  )
}

function ExpandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
