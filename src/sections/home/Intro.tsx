import { FlowField } from '../../components/hero/FlowField'
import { RotatingText } from '../../components/hero/RotatingText'
import { Reveal } from '../../components/ui/Reveal'
import { intro } from '../../content/home'
import styles from './Intro.module.css'

export function Intro() {
  return (
    <section className={styles.intro} aria-labelledby="intro-title">
      <FlowField className={styles.flow} center={0.8} mobileCenter={0.86} />

      <div className={`container ${styles.inner}`}>
        <h1 id="intro-title" className={styles.title}>
          <Reveal as="span" y={12}>
            <span className={styles.greeting}>{intro.greeting}</span>
          </Reveal>
          <Reveal as="span" delay={0.12} y={24}>
            <span className={styles.headline}>
              <span className={styles.lead}>{intro.lead} </span>
              <RotatingText phrases={intro.phrases} className={styles.rotating} interval={2650} />
            </span>
          </Reveal>
        </h1>

        <Reveal delay={0.28}>
          <p className={styles.paragraph}>{intro.paragraph}</p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className={styles.degree}>
            <span className={styles.badge}>{intro.degree.date}</span>
            <p>
              <span className={styles.degreeTitle}>{intro.degree.title}</span>
              <span className={styles.degreeSchool}>{intro.degree.school}</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
