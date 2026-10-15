import { motion } from 'motion/react'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { education } from '../content/education'
import styles from './Education.module.css'

export function Education() {
  const [first, second] = education

  return (
    <section id="education" className={`container ${styles.section}`} aria-labelledby="education-title">
      <SectionHeader id="education-title" eyebrow="Education" title="Where I studied" />

      {/* Decorative route between the two places, drawn in on scroll. */}
      {first && second && (
        <div className={styles.route} aria-hidden="true">
          <span className={styles.stop}>{first.shortName}</span>
          <svg className={styles.arc} viewBox="0 0 400 40" preserveAspectRatio="none">
            <motion.path
              d="M2 36 C 120 -8, 280 -8, 398 36"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            />
          </svg>
          <span className={styles.stop}>{second.shortName}</span>
        </div>
      )}

      <div className={styles.cards}>
        {education.map((item, i) => (
          <Reveal key={item.institution} className={styles.card} delay={i * 0.12}>
            <span className={styles.marker} aria-hidden="true">
              {item.marker}
            </span>

            <p className={styles.place}>{item.place}</p>
            <h3 className={styles.institution}>{item.institution}</h3>

            <dl className={styles.facts}>
              <div>
                <dt>Program</dt>
                <dd>{item.program}</dd>
              </div>
              <div>
                <dt>School</dt>
                <dd>{item.school}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{item.dates}</dd>
              </div>
            </dl>

            {item.details && (
              <div className={styles.details}>
                <p className={styles.detailsLabel}>Business subjects, including</p>
                <ul className={styles.chips}>
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}
