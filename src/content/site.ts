// Site-wide content: name, links, and homepage copy.
// Empty `href` values render as clearly marked placeholders on the page.

export type SiteLink = {
  label: string
  href: string
  /** Text shown in the Contact section, e.g. the email address itself. */
  display?: string
}

export const site = {
  name: 'Kate Mikhailova',
  title: 'Kate Mikhailova',
  description:
    'Kate Mikhailova graduated from UC Santa Cruz with a B.S. in Computer Science. Software development, data engineering, AI, and automation.',

  links: {
    // For email, put the plain address in both href and display.
    email: { label: 'Email', href: '', display: '[your email]' },
    linkedin: { label: 'LinkedIn', href: '', display: '[LinkedIn URL]' },
    github: { label: 'GitHub', href: '', display: '[GitHub URL]' },
    // Drop a PDF into /public (e.g. /public/resume.pdf) and set href to '/resume.pdf'.
    resume: { label: 'Resume', href: '', display: '[resume PDF]' },
  } satisfies Record<string, SiteLink>,
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  greeting: "Hi, I'm Kate.",
  lead: 'I like building',
  phrases: [
    'useful little tools.',
    'things that save time.',
    'small automations.',
    'with data and AI.',
  ],
  intro:
    "I'm a recent computer science grad who likes building things and figuring out how technology works. Most of my experience so far is in software, data, and automation, plus a lot of time testing AI tools to see where they actually help.",
  facts: [
    {
      label: 'Studied',
      value: 'B.S. Computer Science',
      detail: 'UC Santa Cruz, Baskin School of Engineering',
    },
    { label: 'Graduated', value: 'June 2026' },
    {
      label: 'Interested in',
      value: 'Software development, data engineering, AI, and automation',
    },
  ],
}

export const about = {
  // Replace with e.g. '/kate.jpg' once the photo is in /public.
  portrait: { src: '', alt: 'Kate Mikhailova' },
  lead: 'I studied computer science at UC Santa Cruz. I like learning by building things and figuring out how they work.',
  paragraphs: [
    'During college I started InfoMomentum, a small marketing business. The longer I ran it, the more of my time went to the technical side: automating repetitive work, connecting tools that didn’t talk to each other, working with client data, and trying AI tools to see which ones were actually useful.',
    'My internships pulled in the same direction, from stock analysis tools to data quality work on open map data. These days I’m most interested in software development, data engineering, AI, and automation, and I want to keep building in that space.',
  ],
  placeholder: '[Optional: a line about what you like doing outside of work.]',
}

export const contact = {
  intro:
    "If you're hiring, or just want to ask about something on this page, email is the easiest way to reach me.",
}
