import { site } from '../content/site'
import { Education } from '../sections/home/Education'
import { ExperienceTimeline } from '../sections/home/ExperienceTimeline'
import { Intro } from '../sections/home/Intro'

export function HomePage() {
  return (
    <>
      <title>{site.name}</title>
      <Intro />
      <ExperienceTimeline />
      <Education />
    </>
  )
}
