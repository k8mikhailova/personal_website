import { Portrait } from '../components/about/Portrait'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { about } from '../content/site'
import styles from './About.module.css'

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.portrait}>
          <Portrait src={about.portrait.src} alt={about.portrait.alt} />
        </Reveal>

        <div className={styles.text}>
          <SectionHeader id="about-title" eyebrow="About" title="How I got here" />

          <div className={styles.body}>
            <Reveal>
              <p className={styles.lead}>{about.lead}</p>
            </Reveal>
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 + i * 0.08}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
            <Reveal delay={0.08 + about.paragraphs.length * 0.08}>
              <p>
                <span className="placeholder">{about.placeholder}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
