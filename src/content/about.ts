// About page content. Edit the words here; layout lives in the components.

export const about = {
  // ---------- Opening ----------
  greeting: { small: 'Hi, I’m', large: 'Kate.' },
  intro:
    'I’m proud of what I’ve done so far, but there’s a lot more to me than what fits on a resume. I wanted this page to be a little more personal. If you’re curious about my work, my experiences, or what I’m like outside of it all, you can ask my AI assistant below.',
  portrait: {
    image: { base: '/images/about/web/portrait', widths: [640, 1024, 1600], width: 2048, height: 1536 },
    alt: 'Kate holding a magnifying glass up to one eye and sticking her tongue out in a colorful shop',
    // Crop focus as CSS object-position.
    focus: '52% 42%',
  },
  // Drives the live age counter (local midnight, since no birth time is given). The date itself isn't shown.
  birthDate: '2003-12-28T00:00:00',

  // ---------- AI assistant section ----------
  assistant: {
    title: 'Want to know more?',
    description: 'I built an AI assistant that knows about my projects, experience, and interests. Give it a try.',
  },

  // ---------- Photos ----------
  photosTitle: { small: 'What you’d catch me doing', large: 'outside of work.' },
}

/**
 * How a question sits in the Q&A section:
 * - 'statement': full width, the answer set large (best for a very short answer)
 * - 'wide': full width, question in the margin beside a longer answer
 * - 'half': half width; two in a row sit side by side
 */
export type QuestionLayout = 'statement' | 'wide' | 'half'

export type Question = {
  question: string
  /** Supports **bold** and [link text](https://url). */
  answer: string
  layout: QuestionLayout
}

// Kate's own answers (restored from the earlier About page). Keep 'half' items in pairs.
export const questions: Question[] = [
  {
    question: 'Three words to describe myself?',
    answer: 'Curious, reliable, resourceful.',
    layout: 'statement',
  },
  {
    question: 'How did marketing fit into computer science?',
    answer:
      'I started a small business while I was in college. A lot of my work eventually involved building automations, connecting different platforms, and figuring out how to make the systems behind campaigns work better. It gave me a chance to use my CS skills on real business problems, and I found myself much more interested in that technical side of the work.',
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
  {
    question: 'Something people might not expect about me?',
    answer:
      'I usually like having my days planned out, but I’m also pretty open to last-minute plans when something interesting comes up.',
    layout: 'half',
  },
  {
    question: 'What do I enjoy most about building something?',
    answer:
      'Seeing something go from an idea to something that actually works. I like figuring out how all the pieces fit together, and it’s even better when someone else gets to use what I’ve built.',
    layout: 'half',
  },
]

export type ResponsiveImage = {
  /** Path prefix of the WebP set: `${base}-${width}.webp`. */
  base: string
  widths: number[]
  /** Full-size dimensions (aspect ratio). */
  width: number
  height: number
}

/** Where a photo sits in the composition (see PhotoStory.module.css). */
export type PhotoSlot = 'rafting' | 'surfing' | 'sailing' | 'hiking' | 'camping' | 'running' | 'whales' | 'reading'

export type Photo = {
  slot: PhotoSlot
  /** Short label shown on the page. */
  label: string
  /** Kate's original caption, shown in the enlarged view. */
  caption: string
  alt: string
  image: ResponsiveImage
  /** Original web-sized JPEG (kept as the fallback source). */
  src: string
  /** Crop focus as CSS object-position. */
  focus?: string
}

const set = (name: string, widths: number[], width: number, height: number): ResponsiveImage => ({
  base: `/images/about/web/${name}`,
  widths,
  width,
  height,
})

// In the order they appear on the page.
export const photos: Photo[] = [
  {
    slot: 'rafting',
    label: 'Class III rafting',
    caption: 'Class III rafting. Would absolutely do it again',
    alt: 'Kate and friends in helmets and life jackets sitting in a raft on a river, smiling at the camera',
    image: set('rafting', [640, 1024, 1536], 1536, 2730),
    src: '/images/about/rafting.jpg',
    focus: '50% 60%',
  },
  {
    slot: 'surfing',
    label: 'Surfing, Santa Cruz',
    caption: "You can't live in Santa Cruz and not give surfing a try",
    alt: 'Kate in a wetsuit, seen from behind, carrying a surfboard on her head',
    image: set('surfing', [640, 1024, 1600], 3024, 4032),
    src: '/images/about/surfing.jpg',
    focus: '50% 35%',
  },
  {
    slot: 'sailing',
    label: 'Dinghy sailing',
    caption: 'Learning to sail a dinghy.',
    alt: 'View from a small sailboat with a green and white sail, other dinghies on the water',
    image: set('sailing', [640, 1024, 1600], 3024, 4032),
    src: '/images/about/sailing.jpg',
    focus: '50% 45%',
  },
  {
    slot: 'hiking',
    label: 'Yosemite',
    caption: 'Exploring Yosemite on foot',
    alt: 'A hiker on a forest trail in Yosemite with granite cliffs behind',
    image: set('hiking', [640, 1024, 1600, 2400], 2730, 1536),
    src: '/images/about/hiking.jpg',
    focus: '50% 58%',
  },
  {
    slot: 'camping',
    label: 'Camping',
    caption: 'Camping in the middle of nowhere',
    alt: 'Kate and a friend sitting in the doorway of a tent at a campsite',
    image: set('camping', [640, 1024, 1600], 2048, 1536),
    src: '/images/about/camping.jpg',
    focus: '55% 55%',
  },
  {
    slot: 'running',
    label: 'First 5K',
    caption: 'First 5K in the books',
    alt: 'Kate and friends in matching race shirts on a lawn after a 5K, one friend lying in front in a banana costume',
    image: set('running', [640, 1024, 1600], 3024, 4032),
    src: '/images/about/running.jpg',
    focus: '45% 62%',
  },
  {
    slot: 'whales',
    label: 'Whale watching, Monterey',
    caption: 'Saying hi to the whales in Monterey',
    alt: 'People on a boat watching a whale surface in Monterey Bay',
    image: set('whales', [640, 1024, 1600], 3024, 4032),
    src: '/images/about/whales.jpg',
    focus: '50% 60%',
  },
  {
    slot: 'reading',
    label: 'Beach reading',
    caption: 'Brought a book to the beach and actually read it',
    alt: 'An open book held up on a sandy beach, with a coffee cup in the sand',
    image: set('reading', [640, 1024, 1600], 4032, 3024),
    src: '/images/about/reading.jpg',
    focus: '50% 60%',
  },
]
