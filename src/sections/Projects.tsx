import { SectionHeader } from '../components/ui/SectionHeader'
import { ProjectCard } from '../components/work/ProjectCard'
import { projects } from '../content/projects'
import styles from './Projects.module.css'

export function Projects() {
  const [featured, ...rest] = projects

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader id="projects-title" eyebrow="Projects" title="A few things I’ve built" />

        {featured && <ProjectCard project={featured} index={0} layout="wide" />}

        <div className={styles.pair}>
          {rest.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i + 1}
              className={i % 2 === 1 ? styles.offset : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
