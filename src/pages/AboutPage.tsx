import { useRef } from 'react'
import { AgeCounter } from '../components/about/AgeCounter'
import { PhotoGrid } from '../components/about/PhotoGrid'
import { Portrait } from '../components/about/Portrait'
import { WindField } from '../components/about/WindField'
import { Reveal } from '../components/ui/Reveal'
import { about, photos } from '../content/about'
import { site } from '../content/site'
import { AboutQuestions } from '../sections/about/AboutQuestions'
import styles from './AboutPage.module.css'

export function AboutPage() {
  const photoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <title>{`About · ${site.name}`}</title>

      {/* ---------- Intro: photo beside the text, with the wind field behind ---------- */}
      <div className={styles.heroWrap}>
        <WindField className={styles.field} avoidRef={photoRef} clearRef={textRef} />

        <section className={`container ${styles.hero}`} aria-labelledby="about-title">
          <Reveal className={styles.portrait}>
            <div ref={photoRef}>
              <Portrait
                src={about.photo.src}
                alt={about.photo.alt}
                focus={about.photo.focus}
              />
            </div>
          </Reveal>

          <div ref={textRef} className={styles.introText}>
            <Reveal delay={0.08}>
              <h1 id="about-title" className={styles.title}>
                About me
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className={styles.age}>
                I’m <AgeCounter birthDate={about.birthDate} /> years old.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className={styles.intro}>{about.intro}</p>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ---------- Q&A: calmer, no animated background ---------- */}
      <AboutQuestions />

      {/* ---------- Photo diary: wider than the reading column ---------- */}
      <section className={`container-wide ${styles.photos}`} aria-labelledby="photos-title">
        <div className={styles.photosHead}>
          <h2 id="photos-title" className="section-label">
            From the photo diary
          </h2>
          <p className={styles.photosIntro}>{about.photoDiaryIntro}</p>
        </div>
        <PhotoGrid photos={photos} />
      </section>
    </>
  )
}
