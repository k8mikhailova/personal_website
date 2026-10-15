import type { Project } from '../../content/projects'
import { MediaPlaceholder } from './MediaPlaceholder'
import styles from './ProjectMedia.module.css'

type ProjectMediaProps = {
  project: Project
  /** CSS aspect-ratio for the frame, e.g. '16 / 9'. */
  aspect?: string
}

/** Renders whatever visual a project has: image, video, or a placeholder. */
export function ProjectMedia({ project, aspect = '16 / 10' }: ProjectMediaProps) {
  const { media } = project

  return (
    <div className={styles.frame} style={{ aspectRatio: aspect }}>
      <div className={styles.inner}>
        {media.type === 'image' && (
          <img className={styles.asset} src={media.src} alt={media.alt} loading="lazy" />
        )}
        {media.type === 'video' && (
          <video
            className={styles.asset}
            src={media.src}
            poster={media.poster}
            controls
            preload="metadata"
            aria-label={media.label}
          />
        )}
        {media.type === 'placeholder' && (
          <MediaPlaceholder label={media.label} seed={project.slug} variant={media.variant} />
        )}
      </div>
    </div>
  )
}
