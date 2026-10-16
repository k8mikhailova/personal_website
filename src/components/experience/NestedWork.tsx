import type {
  CaseStudyPreview,
  NestedWork as NestedWorkData,
  ProjectPreview,
} from '../../content/experience'
import { MediaPlaceholder } from '../ui/MediaPlaceholder'
import { AccuracyBars } from './AccuracyBars'
import styles from './NestedWork.module.css'
import { Tags } from './Tags'
import { WorkLinks } from './WorkLinks'

/** Picks the right preview for a piece of work nested under an experience. */
export function NestedWork({ work }: { work: NestedWorkData }) {
  switch (work.kind) {
    case 'project':
      return <ProjectCard work={work} />
    case 'case-study':
      return <CaseStudyCard work={work} />
  }
}

function ProjectCard({ work }: { work: ProjectPreview }) {
  const showThumbnail = work.showThumbnail ?? true
  return (
    <article className={`lift-card ${styles.card} ${showThumbnail ? styles.project : ''}`}>
      {showThumbnail && (
        <div className={styles.thumb}>
          {work.image ? (
            <img src={work.image.src} alt={work.image.alt} loading="lazy" />
          ) : (
            <MediaPlaceholder label="Screenshot coming soon" seed={work.title} />
          )}
        </div>
      )}
      <div className={styles.content}>
        {work.label && <p className={styles.label}>{work.label}</p>}
        <h4 className={styles.title}>{work.title}</h4>
        <p className={styles.summary}>{work.summary}</p>
        {work.note && <p className={styles.note}>{work.note}</p>}
        <Tags tags={work.tags} />
        <WorkLinks links={work.links} />
      </div>
    </article>
  )
}

function CaseStudyCard({ work }: { work: CaseStudyPreview }) {
  return (
    <article className={`lift-card ${styles.card} ${styles.caseStudy}`}>
      <div className={styles.content}>
        <p className={styles.label}>{work.label}</p>
        <h4 className={styles.title}>{work.title}</h4>
        <p className={styles.summary}>{work.summary}</p>
      </div>
      <AccuracyBars name={work.metric.name} before={work.metric.before} after={work.metric.after} />
      <div className={styles.footer}>
        <Tags tags={work.tags} />
        <WorkLinks links={work.links} />
      </div>
    </article>
  )
}
