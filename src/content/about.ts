// About page content. Anything left empty renders as a clearly marked placeholder.

export const about = {
  photo: {
    src: '/images/about-photo.jpg',
    alt: 'Kate',
    // Crop focus as CSS object-position. Adjust if the crop cuts off the wrong part.
    focus: '50% 40%',
  },

  // Drives the live age counter (local midnight, since no birth time is given). Not shown on the page.
  birthDate: '2003-12-28T00:00:00',
}

/**
 * How a question sits in the Q&A layout:
 * - 'statement': full width, the answer set large (best for a very short answer)
 * - 'wide': full width, question beside a longer answer
 * - 'half': half width; two in a row sit side by side
 */
export type QuestionLayout = 'statement' | 'wide' | 'half'

export type Question = {
  question: string
  /** Supports **bold** and [link text](https://url). */
  answer: string
  layout: QuestionLayout
}

// Draft answers, still being refined.
export const questions: Question[] = [
  {
    question: 'Three words to describe myself?',
    answer: 'Curious, reliable, spontaneous.',
    layout: 'statement',
  },
  {
    question: 'How did marketing fit into computer science?',
    answer:
      'I started a small marketing business while I was in college. A lot of my work eventually involved building automations, connecting different platforms, and figuring out how to make the systems behind campaigns work better. It gave me a chance to use my CS skills on real business problems, and I found myself much more interested in that technical side of the work.',
    layout: 'wide',
  },
  {
    question: 'What’s my favorite thing I’ve built?',
    answer:
      'Probably my [Marketing Intelligence Hub](https://github.com/k8mikhailova/marketing_hub). I wanted to see what would happen if customer feedback, advertising performance, and ideas for new experiments could all be brought into one place. I built a prototype to explore that, and it turned into one of my favorite projects to work on.',
    layout: 'half',
  },
  {
    question: 'What am I like to work with?',
    answer:
      'I like working with people and being part of a team where everyone can share ideas and ask questions. I’m pretty detail-oriented, and if I say I’ll take care of something, I make sure I follow through.',
    layout: 'half',
  },
]

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
    caption: 'Giving dinghy sailing a try',
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
