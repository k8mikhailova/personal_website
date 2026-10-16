import type { Photo } from '../../content/about'
import { Reveal } from '../ui/Reveal'
import styles from './PhotoGrid.module.css'

/**
 * Loose, photo-diary style grid. Each photo sits in a light paper frame with a
 * slight tilt that straightens on hover. Empty `src` shows a labeled placeholder.
 */
export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <ul className={styles.grid}>
      {photos.map((photo, i) => (
        <li key={i} className={styles.cell}>
          <Reveal delay={(i % 3) * 0.08} y={18}>
            <figure className={`${styles.figure} ${styles[photo.shape]}`}>
              <div className={styles.frame}>
                {photo.src ? (
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                ) : (
                  <div className={styles.placeholder}>
                    <CameraIcon />
                    <span className={styles.placeholderTitle}>Photo placeholder</span>
                    <span className={styles.placeholderHint}>{photo.placeholder}</span>
                  </div>
                )}
              </div>
              <figcaption className={styles.caption}>
                {photo.caption || <span className="placeholder">[caption]</span>}
              </figcaption>
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.2-2h6.6l1.2 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.75" r="3.25" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
