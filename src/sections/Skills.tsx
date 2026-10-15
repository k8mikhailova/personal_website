import { Reveal } from '../components/ui/Reveal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { skillGroups } from '../content/skills'
import styles from './Skills.module.css'

const isPlaceholder = (text: string) => text.startsWith('[')

export function Skills() {
  return (
    <section id="skills" className={`container ${styles.section}`} aria-labelledby="skills-title">
      <SectionHeader
        id="skills-title"
        eyebrow="Skills & tools"
        title="What I’ve used so far"
        description="Grouped by what they’re for, with where I actually used each one."
      />

      <div className={styles.groups}>
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} className={styles.group} delay={i * 0.07}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <ul className={styles.list}>
              {group.skills.map((skill) => (
                <li key={skill.name} className={styles.skill}>
                  {isPlaceholder(skill.name) ? (
                    <span className="placeholder">{skill.name}</span>
                  ) : (
                    <span className={styles.name}>{skill.name}</span>
                  )}
                  {skill.usedIn ? (
                    <span className={styles.usedIn}>{skill.usedIn}</span>
                  ) : (
                    !isPlaceholder(skill.name) && (
                      <span className={styles.usedIn}>
                        <span className="placeholder">[where you used it]</span>
                      </span>
                    )
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
