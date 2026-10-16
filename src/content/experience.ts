// Experience timeline for the homepage. Projects live inside the experience
// they came from (or were inspired by), so there's no separate projects section.
// Empty link/video values render as clearly marked placeholders.

export type ProjectLinks = {
  github?: string
  demo?: string
  caseStudy?: string
}

/** A project shown with a screenshot slot. */
export type ProjectPreview = {
  kind: 'project'
  title: string
  /** Small label above the title, e.g. "Independent project". */
  label: string
  summary: string
  /** Clarifying note, shown with an accent marker. */
  note?: string
  tags: string[]
  image?: { src: string; alt: string }
  links: ProjectLinks
}

/** A compact case study teaser with a before/after metric. */
export type CaseStudyPreview = {
  kind: 'case-study'
  title: string
  label: string
  summary: string
  metric: { name: string; before: number; after: number }
  tags: string[]
  links: ProjectLinks
}

/** A project with a YouTube demo. */
export type VideoPreview = {
  kind: 'video'
  title: string
  label: string
  summary: string
  /** The YouTube video ID (the part after `v=` in the URL). */
  youtubeId: string
  tags: string[]
  links: ProjectLinks
}

/** A short list of smaller pieces of work, no media. */
export type WorkList = {
  kind: 'list'
  label: string
  items: { title: string; detail: string }[]
  note?: string
}

export type NestedWork = ProjectPreview | CaseStudyPreview | VideoPreview | WorkList

export type ExperienceItem = {
  org: string
  role: string
  start: string
  end: string
  type: 'work' | 'volunteer'
  summary: string
  work?: NestedWork[]
}

export const experience: ExperienceItem[] = [
  {
    org: 'InfoMomentum',
    role: 'Founder / AI & Automation Specialist',
    start: 'Jan 2024',
    end: 'Jul 2026',
    type: 'work',
    summary:
      'A small marketing business I started in college. Most of my work ended up on the technical side: CRM integrations, automations, AI agents, and getting different systems to talk to each other.',
    work: [
      {
        kind: 'project',
        title: 'Marketing Intelligence Hub',
        label: 'Related independent project',
        summary:
          'A prototype that brings marketing and customer data together, looks for patterns, and uses AI agent workflows to suggest experiments worth trying.',
        note: 'A personal prototype I built for a separate opportunity, not something made for an InfoMomentum client. All of the data is simulated.',
        tags: ['Python', 'Streamlit', 'AI agent workflows', 'Simulated data'],
        links: { github: '', demo: '' },
      },
    ],
  },
  {
    org: 'Antforce.AI',
    role: 'AI Solutions & Marketing Intern',
    start: 'Mar 2026',
    end: 'Jun 2026',
    type: 'work',
    summary: 'AI-related work, including two projects:',
    work: [
      {
        kind: 'list',
        label: 'Projects',
        items: [
          { title: 'Marketing Hub', detail: 'Content and SEO workflows' },
          { title: 'Analytics dashboard', detail: '[Add a short line about the dashboard]' },
        ],
        note: 'Separate from the Marketing Intelligence Hub above.',
      },
    ],
  },
  {
    org: 'Overture Maps Foundation',
    role: 'Data Engineering / AI Intern',
    start: 'Jan 2026',
    end: 'Mar 2026',
    type: 'work',
    summary: 'Data quality work on Overture’s open map data.',
    work: [
      {
        kind: 'case-study',
        title: 'Improving data accuracy',
        label: 'Case study preview',
        summary:
          'How we went from 64% to 83% accuracy by investigating conflicting datasets and testing different approaches.',
        metric: { name: 'Accuracy', before: 64, after: 83 },
        tags: ['Python', 'DuckDB', 'pandas', 'SQL'],
        links: { caseStudy: '' },
      },
    ],
  },
  {
    org: 'Arcadian Investments',
    role: 'Software Engineering Intern',
    start: 'Jul 2024',
    end: 'Sep 2024',
    type: 'work',
    summary:
      'Built StockAdvisor, a Python app that pulls financial API data, scores stocks, and shows the results in Streamlit.',
    work: [
      {
        kind: 'video',
        title: 'StockAdvisor',
        label: 'Video demo',
        summary: 'A short demo of the app.',
        youtubeId: '',
        tags: ['Python', 'Financial APIs', 'Streamlit'],
        links: { github: '' },
      },
    ],
  },
  {
    org: 'Women of Color on the Move',
    role: 'Security Analyst Volunteer',
    start: 'Oct 2026',
    end: 'Present',
    type: 'volunteer',
    summary:
      "I recently started volunteering here. I'm using it to learn more about cybersecurity and how to protect systems and data.",
  },
]
