import { SectionNav, type SectionNavItem } from '../components/layout/SectionNav'
import { site } from '../content/site'
import { Education } from '../sections/home/Education'
import { ExperienceTimeline } from '../sections/home/ExperienceTimeline'
import { Intro } from '../sections/home/Intro'
import { Skills } from '../sections/home/Skills'

// ids match the sections below.
const sections: SectionNavItem[] = [
  { id: 'intro', label: 'Intro' },
  { id: 'experience', label: 'Experience' },
  { id: 'volunteering', label: 'Volunteering' },
  { id: 'skills', label: 'Skills & Tools' },
  { id: 'education', label: 'Education' },
]

export function HomePage() {
  return (
    <>
      <title>{site.name}</title>
      <SectionNav items={sections} />
      <Intro />
      <ExperienceTimeline />
      <Skills />
      <Education />
    </>
  )
}
