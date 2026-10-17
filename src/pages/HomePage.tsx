import { site } from '../content/site'
import { Education } from '../sections/home/Education'
import { ExperienceTimeline } from '../sections/home/ExperienceTimeline'
import { Intro } from '../sections/home/Intro'
import { Skills } from '../sections/home/Skills'

export function HomePage() {
  return (
    <>
      <title>{site.name}</title>
      <Intro />
      <ExperienceTimeline />
      <Skills />
      <Education />
    </>
  )
}
