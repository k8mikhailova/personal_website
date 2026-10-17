import type { ProjectLinks } from '../../content/experience'
import { ArrowIcon } from '../ui/ArrowIcon'
import styles from './WorkLinks.module.css'

// Display order. `live` is styled as the primary action.
const labels: Record<keyof ProjectLinks, string> = {
  live: 'Try live demo',
  video: 'Watch demo',
  github: 'GitHub',
  demo: 'Demo',
  caseStudy: 'Case study',
}

/**
 * Small row of project links. Only keys present on `links` are shown;
 * empty values render as "coming soon" placeholders.
 */
export function WorkLinks({ links }: { links: ProjectLinks }) {
  const keys = (Object.keys(labels) as (keyof ProjectLinks)[]).filter((key) => key in links)
  if (keys.length === 0) return null

  return (
    <ul className={styles.list}>
      {keys.map((key) => {
        const href = links[key]
        return (
          <li key={key}>
            {href ? (
              <a
                href={href}
                className={`${styles.link} ${key === 'live' ? styles.primary : ''}`}
                {...(/^https?:\/\//.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {labels[key]}
                <ArrowIcon direction="up-right" className={styles.arrow} />
              </a>
            ) : (
              <span className={styles.missing}>{labels[key]} coming soon</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
