import type { Project } from '../../content/projects'
import { Reveal } from '../ui/Reveal'
import { ProjectLinks } from './ProjectLinks'
import { ProjectMedia } from './ProjectMedia'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project
  index: number
  /** 'wide' spans the full width with text beneath; 'stacked' is a column card. */
  layout?: 'wide' | 'stacked'
  className?: string
}

export function ProjectCard({ project, index, layout = 'stacked', className }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, '0')
  const titleId = `project-${project.slug}`

  return (
    <article
      className={`project-card ${styles.card} ${styles[layout]} ${className ?? ''}`}
      aria-labelledby={titleId}
    >
      <Reveal className={styles.media}>
        <ProjectMedia project={project} aspect={layout === 'wide' ? '16 / 7' : '4 / 3'} />
      </Reveal>

      <Reveal className={styles.head} delay={0.08}>
        <p className={styles.meta}>
          <span className={styles.number}>{number}</span>
          <span>{project.context}</span>
        </p>
        <h3 className={styles.title} id={titleId}>
          {project.links.caseStudy ? (
            <a href={project.links.caseStudy} className={styles.titleLink}>
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        {project.highlight && (
          <p className={styles.highlight}>
            <span className={styles.highlightValue}>{project.highlight.value}</span>
            <span className={styles.highlightLabel}>{project.highlight.label}</span>
          </p>
        )}
      </Reveal>

      <Reveal className={styles.body} delay={0.14}>
        <p className={styles.summary}>{project.summary}</p>
        {project.note && <p className={styles.note}>{project.note}</p>}

        <ul className={styles.tags} aria-label="Tools used">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <ProjectLinks links={project.links} />
      </Reveal>
    </article>
  )
}
