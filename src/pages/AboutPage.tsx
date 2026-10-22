import { AgeCounter } from '../components/about/AgeCounter'
import { AskKate } from '../components/about/AskKate'
import { LoupePortrait } from '../components/about/LoupePortrait'
import { PhotoStory } from '../components/about/PhotoStory'
import { Reveal } from '../components/ui/Reveal'
import { about, photos } from '../content/about'
import { site } from '../content/site'
import { AboutQuestions } from '../sections/about/AboutQuestions'
import styles from './AboutPage.module.css'

/**
 * About, in four movements that loosen as you scroll:
 * a close-up opening → a few questions in Kate's words → the AI assistant → an open photo story.
 */
export function AboutPage() {
  return (
    <>
      <title>{`About · ${site.name}`}</title>

      {/* ---------- 1. Opening: oversized name overlapping a large portrait ---------- */}
      <section className={`${styles.wide} ${styles.opening}`} aria-labelledby="about-title">
        {/* The stage is sized from the viewport height so the whole opening fits on the first screen. */}
        <div className={styles.stage}>
          <div className={styles.photoArea}>
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
                sizes="(min-width: 1100px) 960px, 100vw"
                className={styles.portraitFrame}
              />
            </Reveal>
          </div>

          <Reveal y={16} delay={0.2} className={styles.introBlock}>
            <p className={styles.intro}>{about.intro}</p>
            <p className={styles.age}>
              I’m <AgeCounter birthDate={about.birthDate} /> years old
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- 2. Q&A: a few questions in my own words ---------- */}
      <div className="container">
        <AboutQuestions />
      </div>

      {/* ---------- 3. The AI assistant: centered, the chat is the focus ---------- */}
      <section id="ask-ai" className={styles.assistantBand} aria-labelledby="assistant-title">
        <div className={`${styles.wide} ${styles.assistant}`}>
          <Reveal className={styles.assistantText}>
            <h2 id="assistant-title" className={styles.assistantTitle}>
              {about.assistant.title}
            </h2>
            <p className={styles.assistantDescription}>{about.assistant.description}</p>
          </Reveal>
          <AskKate embedded className={styles.chat} />
        </div>
      </section>

      {/* ---------- 4. Photo story: wider, looser, hand-placed ---------- */}
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
