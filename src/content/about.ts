// About page content. This page is personal, so keep the writing short and plain.
// Anything in [brackets] is a placeholder to replace.

export const about = {
  // Replace with e.g. '/photos/kate.jpg' once the photo is in /public.
  portrait: { src: '', alt: 'Kate Mikhailova' },

  intro: [
    'Hi again. This page is less about work and more about me.',
    "The short version: the people around me and the memories we make matter a lot to me, and I'm usually the one with the camera out.",
  ],

  // ISO date and time of birth, e.g. '2003-05-14T08:30:00'. Left empty, the counter shows a placeholder.
  birthDate: '',

  notes: [
    {
      title: 'Early mornings',
      body: 'I love early mornings, yoga and Pilates, and going on walks. A good day has at least one of those in it.',
    },
    {
      title: 'Spontaneous, with a schedule',
      body: "I'm spontaneous and I love trying new things. I also plan my days carefully and like having a schedule. Somehow both are true.",
    },
    {
      title: 'The one with the camera',
      body: "I'm usually the one taking pictures in my friend group, and I keep a digital photo diary. I remember past events in a lot of detail, and looking back through old photos is how I revisit them.",
    },
    {
      title: 'Book first, then the movie',
      body: 'I love reading, especially books that have a movie or TV adaptation. I also love going to the theater, a habit I picked up in college with friends who liked to pick the movie apart afterwards.',
    },
    {
      title: 'Picnics',
      body: 'A picnic in the park with a book. Time with friends. Simple things, but they’re the ones I remember.',
    },
  ],

  tried: ['Sailing', 'Surfing', 'Whitewater rafting', 'Volleyball'],

  currently: [
    { label: 'Reading', value: '' },
    { label: 'Last movie in a theater', value: '' },
    { label: 'Next thing to try', value: '' },
  ],
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
