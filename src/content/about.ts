// About page content. Anything left empty renders as a clearly marked placeholder.

export const about = {
  photo: {
    src: '/images/about-photo.jpg',
    alt: 'Kate',
    // Crop focus as CSS object-position. Adjust if the crop cuts off the wrong part.
    focus: '50% 40%',
    // Short tag pinned to the photo. Leave empty for a placeholder.
    caption: '',
  },

  // Kate will write this. Leave empty to show the placeholder.
  paragraph: '',

  // ISO date and time of birth, e.g. '2003-05-14T08:30:00'. Left empty, the counter shows a placeholder.
  birthDate: '',
}

export type Photo = {
  src: string
  alt: string
  /** Short caption under the photo. */
  caption: string
  /** Shown on the placeholder until a real photo exists. */
  placeholder: string
  shape: 'tall' | 'wide' | 'square'
}

// Placeholder slots. The placeholder text only suggests what could go there.
export const photos: Photo[] = [
  { src: '', alt: '', caption: '', placeholder: 'Sailing', shape: 'tall' },
  { src: '', alt: '', caption: '', placeholder: 'A picnic with a book', shape: 'square' },
  { src: '', alt: '', caption: '', placeholder: 'Movie night with friends', shape: 'wide' },
  { src: '', alt: '', caption: '', placeholder: 'An early morning walk', shape: 'square' },
  { src: '', alt: '', caption: '', placeholder: 'Surfing', shape: 'tall' },
  { src: '', alt: '', caption: '', placeholder: 'A page from the photo diary', shape: 'wide' },
  { src: '', alt: '', caption: '', placeholder: 'Whitewater rafting', shape: 'square' },
  { src: '', alt: '', caption: '', placeholder: 'Volleyball', shape: 'tall' },
]
