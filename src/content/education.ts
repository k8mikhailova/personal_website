export type CollegeProject = {
  title: string
  /** Language or area, if known. Leave empty to show a placeholder. */
  tech: string
  href: string
}

export type EducationItem = {
  institution: string
  place: string
  program: string
  school: string
  dates: string
  detail?: string
  projects?: CollegeProject[]
}

export const education: EducationItem[] = [
  {
    institution: 'University of California, Santa Cruz',
    place: 'Santa Cruz, California',
    program: 'B.S. Computer Science',
    school: 'Baskin School of Engineering',
    dates: 'Graduated June 2026',
    // Still deciding which of these to feature.
    projects: [
      { title: 'Banana Emulator', tech: 'C++', href: '' },
      { title: 'AI Pacman', tech: 'Python', href: '' },
      { title: 'Few-Shot Image Classification', tech: '', href: '' },
    ],
  },
  {
    institution: 'University of Manchester',
    place: 'Manchester, United Kingdom',
    program: 'Study Abroad',
    school: 'Alliance Manchester Business School',
    dates: 'September 2024 – January 2025',
    detail: 'Business subjects, including operations, analytics, and strategy.',
  },
]
