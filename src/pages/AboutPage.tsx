import type { ReactNode } from 'react'
import { AgeCounter } from '../components/about/AgeCounter'
import { PhotoGrid } from '../components/about/PhotoGrid'
import { Portrait } from '../components/about/Portrait'
import { Reveal } from '../components/ui/Reveal'
import { about, photos } from '../content/about'
import { site } from '../content/site'
import styles from './AboutPage.module.css'

const isPlaceholder = (text: string) => !text || text.startsWith('[')

export function AboutPage() {
  const [mornings, spontaneous, camera, books, picnics] = about.notes

  return (
    <>
      <title>{`About · ${site.name}`}</title>

      {/* ---------- Intro: photo beside a short hello ---------- */}
      <section className={`container ${styles.hero}`} aria-labelledby="about-title">
        <Reveal className={styles.portrait}>
          <Portrait src={about.portrait.src} alt={about.portrait.alt} />
        </Reveal>

        <div className={styles.introText}>
          <Reveal delay={0.08}>
            <h1 id="about-title" className={styles.title}>
              About me
            </h1>
          </Reveal>
          {about.intro.map((paragraph, i) => (
            <Reveal key={i} delay={0.14 + i * 0.06}>
              <p className={i === 0 ? styles.lead : styles.paragraph}>{paragraph}</p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <p className={styles.age}>
              I’m <AgeCounter birthDate={about.birthDate} /> years old.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Notes: short stories with small asides ---------- */}
      <section className={`container ${styles.notes}`} aria-labelledby="notes-title">
        <h2 id="notes-title" className="section-label">
          A few things about me
        </h2>

        <Note {...mornings} />

        <Note {...spontaneous}>
          <div className={styles.aside}>
            <p className={styles.asideLabel}>Tried so far</p>
            <ul className={styles.tried}>
              {about.tried.map((thing) => (
                <li key={thing}>
                  <CheckIcon />
                  {thing}
                </li>
              ))}
            </ul>
          </div>
        </Note>

        <Note {...camera} />
        <Note {...books} />
        <Note {...picnics} />

        <Reveal>
          <aside className={styles.currently} aria-label="Currently">
            <p className={styles.asideLabel}>Currently</p>
            <dl>
              {about.currently.map((item) => (
                <div key={item.label} className={styles.currentRow}>
                  <dt>{item.label}</dt>
                  <dd>
                    {isPlaceholder(item.value) ? (
                      <span className="placeholder">{item.value || '[add]'}</span>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </Reveal>
      </section>

      {/* ---------- Photo diary: wider than the reading column ---------- */}
      <section className={`container-wide ${styles.photos}`} aria-labelledby="photos-title">
        <div className={styles.photosHead}>
          <h2 id="photos-title" className="section-label">
            From the photo diary
          </h2>
          <p className={styles.photosNote}>Placeholders for now. Real photos and captions are coming.</p>
        </div>
        <PhotoGrid photos={photos} />
      </section>
    </>
  )
}

type NoteProps = {
  title: string
  body: string
  children?: ReactNode
}

function Note({ title, body, children }: NoteProps) {
  return (
    <Reveal className={styles.note}>
      <h3 className={styles.noteTitle}>{title}</h3>
      <div className={styles.noteBody}>
        <p>{body}</p>
        {children}
      </div>
    </Reveal>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
