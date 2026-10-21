import { AgeCounter } from '../components/about/AgeCounter'
import { AskKate } from '../components/about/AskKate'
import { LoupePortrait } from '../components/about/LoupePortrait'
import { PhotoStory } from '../components/about/PhotoStory'
import { Reveal } from '../components/ui/Reveal'
import { about, photos } from '../content/about'
import { askKate } from '../content/askKate'
import { site } from '../content/site'
import styles from './AboutPage.module.css'

/**
 * About, in three movements that loosen as you scroll:
 * a close-up opening → a structured "workbench" for the AI assistant → an open photo story.
 */
export function AboutPage() {
  return (
    <>
      <title>{`About · ${site.name}`}</title>

      {/* ---------- 1. Opening: oversized name overlapping a large portrait ---------- */}
      <section className={`${styles.wide} ${styles.opening}`} aria-labelledby="about-title">
        <h1 id="about-title" className={styles.name}>
          <Reveal as="span" y={16} className={styles.nameSmall}>
            {about.greeting.small}
          </Reveal>
          <Reveal as="span" y={28} delay={0.08} className={styles.nameLarge}>
            {about.greeting.large}
          </Reveal>
        </h1>

        <Reveal y={24} delay={0.05} className={styles.portrait}>
          <LoupePortrait
            image={about.portrait.image}
            alt={about.portrait.alt}
            focus={about.portrait.focus}
            sizes="(min-width: 1100px) 760px, 100vw"
            className={styles.portraitFrame}
          />
        </Reveal>

        <Reveal y={16} delay={0.2} className={styles.introBlock}>
          <p className={styles.intro}>{about.intro}</p>
          <p className={styles.age}>
            <AgeCounter birthDate={about.birthDate} /> years old
          </p>
        </Reveal>
      </section>

      {/* ---------- 2. The AI assistant, on a faint working grid ---------- */}
      <section className={styles.assistantBand} aria-labelledby="assistant-title">
        <div className={`${styles.wide} ${styles.assistant}`}>
          <Reveal className={styles.assistantText}>
            <p className={styles.eyebrow}>{about.assistant.eyebrow}</p>
            <h2 id="assistant-title" className={styles.assistantTitle}>
              {askKate.title}
            </h2>
            <p className={styles.assistantDescription}>{askKate.description}</p>
            <ul className={styles.facts}>
              {about.assistant.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </Reveal>
          <AskKate embedded className={styles.chat} />
        </div>
      </section>

      {/* ---------- 3. Photo story: wider, looser, hand-placed ---------- */}
      <section className={styles.photos} aria-labelledby="photos-title">
        <PhotoStory
          photos={photos}
          heading={
            <Reveal>
              <h2 id="photos-title" className={styles.photosTitle}>
                <span className={styles.photosTitleSmall}>{about.photosTitle.small}</span>{' '}
                <span className={styles.photosTitleLarge}>{about.photosTitle.large}</span>
              </h2>
            </Reveal>
          }
        />
      </section>
    </>
  )
}
