import { Reveal } from '../../components/ui/Reveal'
import { skillGroups } from '../../content/skills'
import styles from './Skills.module.css'

/** Compact skills overview: four groups in a two-column grid on desktop. */
export function Skills() {
  return (
    <section id="skills" className={`container spy-target ${styles.section}`} aria-labelledby="skills-title">
      <h2 id="skills-title" className="section-label">
        Skills &amp; Tools
      </h2>

      <div className={styles.groups}>
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} className={styles.group} delay={(i % 2) * 0.06} y={12}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.skills}>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
