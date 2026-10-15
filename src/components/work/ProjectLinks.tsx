import type { Project } from '../../content/projects'
import { ArrowIcon } from '../ui/ArrowIcon'
import styles from './ProjectLinks.module.css'

const linkLabels: Record<keyof Project['links'], string> = {
  github: 'GitHub',
  demo: 'Demo',
  caseStudy: 'Case study',
}

/** GitHub / demo / case study links. Missing ones show as "coming soon" placeholders. */
export function ProjectLinks({ links }: { links: Project['links'] }) {
  const entries = Object.entries(linkLabels) as [keyof Project['links'], string][]
  const hasMissing = entries.some(([key]) => !links[key])

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {entries.map(([key, label]) => {
          const href = links[key]
          return (
            <li key={key}>
              {href ? (
                <a
                  href={href}
                  className={styles.link}
                  {...(/^https?:\/\//.test(href) ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {label}
                  <ArrowIcon direction="up-right" className={styles.arrow} />
                </a>
              ) : (
                <span className={styles.missing} title={`${label} link coming soon`}>
                  {label}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      {hasMissing && <p className={styles.soon}>Links coming soon</p>}
    </div>
  )
}
