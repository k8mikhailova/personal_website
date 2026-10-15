export type EducationItem = {
  institution: string
  shortName: string
  place: string
  school: string
  program: string
  dates: string
  /** Large background year on the card. */
  marker: string
  details?: string[]
}

export const education: EducationItem[] = [
  {
    institution: 'University of California, Santa Cruz',
    shortName: 'UC Santa Cruz',
    place: 'Santa Cruz, California',
    school: 'Baskin School of Engineering',
    program: 'B.S. Computer Science',
    dates: 'Graduated June 2026',
    marker: '2026',
  },
  {
    institution: 'University of Manchester',
    shortName: 'Manchester',
    place: 'Manchester, United Kingdom',
    school: 'Alliance Manchester Business School',
    program: 'Study Abroad',
    dates: 'September 2024 – January 2025',
    marker: '2024',
    details: ['Operations', 'Analytics', 'Strategy'],
  },
]
