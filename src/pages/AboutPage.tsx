import { useRef } from 'react'
import { AgeCounter } from '../components/about/AgeCounter'
import { AskKate } from '../components/about/AskKate'
import { PhotoGrid } from '../components/about/PhotoGrid'
import { Portrait } from '../components/about/Portrait'
import { WindField } from '../components/about/WindField'
import { Reveal } from '../components/ui/Reveal'
import { about, photos } from '../content/about'
import { site } from '../content/site'
import styles from './AboutPage.module.css'

/** About: meet Kate → explore her background with the AI assistant → life outside work. */
export function AboutPage() {
  const photoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <title>{`About · ${site.name}`}</title>

      {/* ---------- 1. Introduction: photo beside a short intro, with the wind field behind ---------- */}
      <div className={styles.heroWrap}>
        <WindField className={styles.field} avoidRef={photoRef} clearRef={textRef} />

        <section className={`container ${styles.hero}`} aria-labelledby="about-title">
          <Reveal className={styles.portrait}>
            <div ref={photoRef}>
              <Portrait src={about.photo.src} alt={about.photo.alt} focus={about.photo.focus} />
            </div>
          </Reveal>

          <div ref={textRef} className={styles.introText}>
            <Reveal delay={0.06}>
              <h1 id="about-title" className={`section-label ${styles.label}`}>
                About me
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className={styles.statement}>{about.statement}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className={styles.intro}>{about.intro}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className={styles.age}>
                I’m <AgeCounter birthDate={about.birthDate} /> years old.
              </p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ---------- 2. Kate's AI Assistant ---------- */}
      <AskKate />

      {/* ---------- 3. Outside the screen: photo scrapbook, a little wider than the text column ---------- */}
      <section className={`container-wide ${styles.photos}`} aria-labelledby="photos-title">
        <Reveal className={styles.photosHead}>
          <h2 id="photos-title" className={styles.photosTitle}>
            {about.outside.title}
          </h2>
          <p className={styles.photosIntro}>{about.outside.intro}</p>
        </Reveal>
        <PhotoGrid photos={photos} />
      </section>
    </>
  )
}
