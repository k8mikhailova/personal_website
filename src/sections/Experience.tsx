import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { experience } from '../content/experience'
import styles from './Experience.module.css'

export function Experience() {
  return (
    <section id="experience" className={`container ${styles.section}`} aria-labelledby="experience-title">
      <SectionHeader id="experience-title" eyebrow="Experience" title="What I’ve worked on" />

      <ol className={styles.list}>
        {experience.map((item, i) => (
          <li key={item.org} className={styles.item}>
            <Reveal className={styles.row} delay={i * 0.05} y={14}>
              <div className={styles.heading}>
                <h3 className={styles.org}>{item.org}</h3>
                <p className={styles.role}>{item.role}</p>
              </div>

              <div className={styles.details}>
                {item.description ? (
                  <p className={styles.description}>{item.description}</p>
                ) : (
                  <p>
                    <span className="placeholder">[Add a line or two about what you worked on here.]</span>
                  </p>
                )}
                {item.tools && (
                  <ul className={styles.tools} aria-label="Tools used">
                    {item.tools.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.meta}>
                <span className={`${styles.kind} ${item.kind === 'Volunteer' ? styles.volunteer : ''}`}>
                  {item.kind}
                </span>
                <span className={styles.dates}>
                  {item.dates || <span className="placeholder">[Dates]</span>}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
