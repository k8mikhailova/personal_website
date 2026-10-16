import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { NestedWork } from '../../components/experience/NestedWork'
import { Reveal } from '../../components/ui/Reveal'
import { experience, type ExperienceItem } from '../../content/experience'
import styles from './ExperienceTimeline.module.css'

export function ExperienceTimeline() {
  const work = experience.filter((item) => item.type === 'work')
  const volunteer = experience.filter((item) => item.type === 'volunteer')

  return (
    <section className={`container ${styles.section}`} aria-labelledby="experience-title">
      <h2 id="experience-title" className="section-label">
        Experience
      </h2>

      <Timeline items={work} />

      {volunteer.length > 0 && (
        <>
          <h3 className={`section-label ${styles.subLabel}`}>Volunteering</h3>
          <Timeline items={volunteer} />
        </>
      )}
    </section>
  )
}

function Timeline({ items }: { items: ExperienceItem[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const reduceMotion = useReducedMotion()
  // The rail fills in as the list scrolls past the middle of the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })

  return (
    <ol ref={ref} className={styles.timeline}>
      <span className={styles.rail} aria-hidden="true">
        <motion.span
          className={styles.railFill}
          style={reduceMotion ? { scaleY: 1 } : { scaleY: scrollYProgress }}
        />
      </span>

      {items.map((item) => (
        <li key={item.org} className={styles.item}>
          <span className={styles.dot} aria-hidden="true" />
          <Reveal y={16}>
            <p className={styles.dates}>
              <span>
                {item.start} – {item.end}
              </span>
              {item.type === 'volunteer' && <span className={styles.volunteer}>Volunteer</span>}
            </p>
            <h3 className={styles.org}>{item.org}</h3>
            <p className={styles.role}>{item.role}</p>
            <p className={styles.summary}>{item.summary}</p>
          </Reveal>

          {item.work && (
            <div className={styles.nested}>
              {item.work.map((work, i) => (
                <Reveal key={i} delay={0.08} y={16}>
                  <NestedWork work={work} />
                </Reveal>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
