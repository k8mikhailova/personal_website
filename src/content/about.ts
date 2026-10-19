// About page content. Anything left empty renders as a clearly marked placeholder.

export const about = {
  photo: {
    src: '/images/about-photo.jpg',
    alt: 'Kate',
    // Crop focus as CSS object-position. Adjust if the crop cuts off the wrong part.
    focus: '50% 40%',
  },

  // Large line at the top of the page.
  statement: 'Curious, reliable, spontaneous.',

  // Short introduction under the statement.
  intro:
    'I studied computer science, started a small business while I was in college, and somewhere along the way got interested in marketing and AI. I like figuring out how things work, building things that are actually useful, and trying something new whenever I get the chance.',

  // Photo gallery section.
  outside: {
    title: 'Outside the screen.',
    intro:
      'Most of this website is about the things I’ve worked on, but I wanted to include a little of what life looks like outside my laptop. I’m usually the one taking pictures when I’m with friends, and I love having these moments to look back on. Here are a few favorites from my camera roll.',
  },

  // Drives the live age counter (local midnight, since no birth time is given). Not shown on the page.
  birthDate: '2003-12-28T00:00:00',
}

export type Photo = {
  /** Path under /public. Empty shows a placeholder. */
  src: string
  alt: string
  caption: string
  /** Pixel size of the web image, so the grid reserves the right space before it loads. */
  width?: number
  height?: number
  /** Placeholder shape and label, used only while `src` is empty. */
  shape: 'tall' | 'wide' | 'square'
  placeholder: string
}

// Ordered so the four grid columns come out roughly the same height on desktop.
export const photos: Photo[] = [
  {
    src: '/images/about/surfing.jpg',
    alt: 'Kate in a wetsuit, seen from behind, carrying a surfboard on her head',
    caption: "You can't live in Santa Cruz and not give surfing a try",
    width: 1050,
    height: 1400,
    shape: 'tall',
    placeholder: 'Surfing',
  },
  {
    src: '/images/about/camping.jpg',
    alt: 'Kate and a friend sitting in the doorway of a tent at a campsite',
    caption: 'Camping in the middle of nowhere',
    width: 1400,
    height: 1050,
    shape: 'wide',
    placeholder: 'Camping',
  },
  {
    src: '/images/about/sailing.jpg',
    alt: 'View from a small sailboat with a green and white sail, other dinghies on the water',
    caption: 'Learning to sail a dinghy.',
    width: 1050,
    height: 1400,
    shape: 'tall',
    placeholder: 'Sailing',
  },
  {
    src: '/images/about/reading.jpg',
    alt: 'An open book held up on a sandy beach, with a coffee cup in the sand',
    caption: 'Brought a book to the beach and actually read it',
    width: 1400,
    height: 1050,
    shape: 'wide',
    placeholder: 'Reading',
  },
  {
    src: '/images/about/whales.jpg',
    alt: 'People on a boat watching a whale surface in Monterey Bay',
    caption: 'Saying hi to the whales in Monterey',
    width: 1050,
    height: 1400,
    shape: 'tall',
    placeholder: 'Whales',
  },
  {
    src: '/images/about/running.jpg',
    alt: 'Kate and friends in matching race shirts on a lawn after a 5K, one friend lying in front in a banana costume',
    caption: 'First 5K in the books',
    width: 1050,
    height: 1400,
    shape: 'tall',
    placeholder: 'Running',
  },
  {
    src: '/images/about/rafting.jpg',
    alt: 'Kate and friends in helmets and life jackets sitting in a raft on a river, smiling at the camera',
    caption: 'Class III rafting. Would absolutely do it again',
    width: 788,
    height: 1400,
    shape: 'tall',
    placeholder: 'Rafting',
  },
  {
    src: '/images/about/hiking.jpg',
    alt: 'A hiker on a forest trail in Yosemite with granite cliffs behind',
    caption: 'Exploring Yosemite on foot',
    width: 1400,
    height: 788,
    shape: 'wide',
    placeholder: 'Hiking',
  },
]
