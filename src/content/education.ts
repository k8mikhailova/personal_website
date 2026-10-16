export type EducationPhoto = {
  /** Path under /public, e.g. '/images/graduation-photo.jpg'. Empty shows a placeholder. */
  src: string
  alt: string
  /** Crop focus as CSS object-position, e.g. '50% 30%'. Adjust to keep the subject centered. */
  focus?: string
  /** Larger, uncropped version shown when the photo is opened. Defaults to `src`. */
  fullSrc?: string
}

export type EducationItem = {
  institution: string
  place: string
  program: string
  school: string
  dates: string
  photo: EducationPhoto
  coursework?: string[]
}

export const education: EducationItem[] = [
  {
    institution: 'University of California, Santa Cruz',
    place: 'Santa Cruz, California',
    program: 'B.S. Computer Science',
    school: 'Baskin School of Engineering',
    dates: 'Graduated June 2026',
    photo: {
      // Cropped around Kate for the card; the full frame opens on click.
      src: '/images/graduation-photo.jpg',
      fullSrc: '/images/graduation-photo-full.jpg',
      alt: 'Kate in her UC Santa Cruz class of 2026 stole, holding her graduation cap on the lawn outside a campus building',
      focus: '50% 12%',
    },
  },
  {
    institution: 'University of Manchester',
    place: 'Manchester, United Kingdom',
    program: 'Study Abroad',
    school: 'Alliance Manchester Business School',
    dates: 'September 2024 – January 2025',
    photo: {
      src: '/images/manchester-photo.jpg',
      alt: 'Kate in a big scarf outside on an autumn day in Manchester',
      focus: '50% 30%',
    },
    coursework: [
      'Operations Management',
      'Business Analytics',
      'Strategy',
      'Digital Transformation',
      'Marketing Analytics',
    ],
  },
]
