import { motion } from 'motion/react'
import { Reveal } from '../../components/ui/Reveal'
import { ZoomablePhoto } from '../../components/ui/ZoomablePhoto'
import { education, type EducationItem } from '../../content/education'
import styles from './Education.module.css'

export function Education() {
  const [first, second] = education

  return (
    <section className={`container ${styles.section}`} aria-labelledby="education-title">
      <h2 id="education-title" className="section-label">
        Education
      </h2>

      {/* Decorative route between the two places, drawn in on scroll. */}
      {first && second && (
        <div className={styles.route} aria-hidden="true">
          <span className={styles.stop}>Santa Cruz</span>
          <svg className={styles.arc} viewBox="0 0 400 40" preserveAspectRatio="none">
            <motion.path
              d="M2 36 C 120 -8, 280 -8, 398 36"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 1.8, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            />
          </svg>
          <span className={styles.stop}>Manchester</span>
        </div>
      )}

      <div className={styles.list}>
        {education.map((item, i) => (
          <Reveal key={item.institution} delay={i * 0.1}>
            <EducationCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function EducationCard({ item }: { item: EducationItem }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.info}>
          <div className={styles.head}>
            <div>
              <p className={styles.place}>{item.place}</p>
              <h3 className={styles.institution}>{item.institution}</h3>
            </div>
            <p className={styles.dates}>{item.dates}</p>
          </div>

          <p className={styles.program}>
            <span className={styles.programName}>{item.program}</span>
            <span className={styles.school}>{item.school}</span>
          </p>

          {item.coursework && (
            <div className={styles.coursework}>
              <h4 className={styles.courseworkLabel}>Selected coursework</h4>
              <ul className={styles.courseList}>
                {item.coursework.map((course) => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.photo}>
          <ZoomablePhoto
            src={item.photo.src}
            alt={item.photo.alt}
            focus={item.photo.focus}
            fullSrc={item.photo.fullSrc}
            placeholderLabel="Photo coming soon"
          />
        </div>
      </div>

    </article>
  )
}
