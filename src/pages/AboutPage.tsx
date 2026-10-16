import { AgeCounter } from '../components/about/AgeCounter'
import { PhotoGrid } from '../components/about/PhotoGrid'
import { Portrait } from '../components/about/Portrait'
import { Reveal } from '../components/ui/Reveal'
import { about, photos } from '../content/about'
import { site } from '../content/site'
import styles from './AboutPage.module.css'

export function AboutPage() {
  return (
    <>
      <title>{`About · ${site.name}`}</title>

      {/* ---------- Intro: photo beside the text ---------- */}
      <section className={`container ${styles.hero}`} aria-labelledby="about-title">
        <Reveal className={styles.portrait}>
          <Portrait
            src={about.photo.src}
            alt={about.photo.alt}
            focus={about.photo.focus}
            caption={about.photo.caption}
          />
        </Reveal>

        <div className={styles.introText}>
          <Reveal delay={0.08}>
            <h1 id="about-title" className={styles.title}>
              About me
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            {about.paragraph ? (
              <p className={styles.paragraph}>{about.paragraph}</p>
            ) : (
              <div className={styles.writeHere}>
                <p className={styles.writeHereLabel}>Placeholder</p>
                <p>Kate’s About paragraph goes here.</p>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.22}>
            <p className={styles.age}>
              I’m <AgeCounter birthDate={about.birthDate} /> years old.
            </p>
          </Reveal>
        </div>
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
