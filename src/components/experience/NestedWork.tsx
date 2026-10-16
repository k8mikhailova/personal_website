import type {
  CaseStudyPreview,
  NestedWork as NestedWorkData,
  ProjectPreview,
  VideoPreview,
  WorkList,
} from '../../content/experience'
import { MediaPlaceholder } from '../ui/MediaPlaceholder'
import { AccuracyBars } from './AccuracyBars'
import styles from './NestedWork.module.css'
import { Tags } from './Tags'
import { WorkLinks } from './WorkLinks'
import { YouTubeEmbed } from './YouTubeEmbed'

const isPlaceholder = (text: string) => text.startsWith('[')

/** Picks the right preview for a piece of work nested under an experience. */
export function NestedWork({ work }: { work: NestedWorkData }) {
  switch (work.kind) {
    case 'project':
      return <ProjectCard work={work} />
    case 'case-study':
      return <CaseStudyCard work={work} />
    case 'video':
      return <VideoCard work={work} />
    case 'list':
      return <WorkListBlock work={work} />
  }
}

function ProjectCard({ work }: { work: ProjectPreview }) {
  return (
    <article className={`lift-card ${styles.card} ${styles.project}`}>
      <div className={styles.thumb}>
        {work.image ? (
          <img src={work.image.src} alt={work.image.alt} loading="lazy" />
        ) : (
          <MediaPlaceholder label="Screenshot coming soon" seed={work.title} />
        )}
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{work.label}</p>
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

function VideoCard({ work }: { work: VideoPreview }) {
  return (
    <article className={`${styles.card} ${styles.video}`}>
      <YouTubeEmbed videoId={work.youtubeId} title={work.title} />
      <div className={styles.content}>
        <p className={styles.label}>{work.label}</p>
        <h4 className={styles.title}>{work.title}</h4>
        <p className={styles.summary}>{work.summary}</p>
        <Tags tags={work.tags} />
        <WorkLinks links={work.links} />
      </div>
    </article>
  )
}

function WorkListBlock({ work }: { work: WorkList }) {
  return (
    <div className={styles.list}>
      <p className={styles.label}>{work.label}</p>
      <ul>
        {work.items.map((item) => (
          <li key={item.title} className={styles.listItem}>
            <span className={styles.listTitle}>{item.title}</span>
            {isPlaceholder(item.detail) ? (
              <span className="placeholder">{item.detail}</span>
            ) : (
              <span className={styles.listDetail}>{item.detail}</span>
            )}
          </li>
        ))}
      </ul>
      {work.note && <p className={styles.note}>{work.note}</p>}
    </div>
  )
}
