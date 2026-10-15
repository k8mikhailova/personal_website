// Featured projects on the homepage.
// To add real assets later, swap `media` to an image or video and put files in /public/projects/<slug>/.
// Empty link values render as "coming soon" placeholders.

export type ProjectMedia =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster?: string; label: string }
  | { type: 'placeholder'; label: string; variant?: 'image' | 'video' }

export type Project = {
  slug: string
  title: string
  context: string
  summary: string
  tags: string[]
  media: ProjectMedia
  links: {
    github: string
    demo: string
    caseStudy: string
  }
  /** A short fact worth calling out, e.g. a result. */
  highlight?: { value: string; label: string }
  /** A small honest caveat shown under the summary. */
  note?: string
}

export const projects: Project[] = [
  {
    slug: 'marketing-intelligence-hub',
    title: 'Marketing Intelligence Hub',
    context: 'Prototype',
    summary:
      'A prototype that pulls marketing and customer data into one place, looks for patterns, and uses AI agent workflows to suggest experiments worth trying. I built it to explore how those pieces could fit together.',
    note: 'All of the data is simulated. This is a prototype, not a deployed tool.',
    tags: ['Python', 'Streamlit', 'Data analysis', 'AI agent workflows'],
    media: { type: 'placeholder', label: 'Screenshot coming soon' },
    links: { github: '', demo: '', caseStudy: '' },
  },
  {
    slug: 'stockadvisor',
    title: 'StockAdvisor',
    context: 'Arcadian Investments internship',
    summary:
      'A Python app I built during my software engineering internship. It pulls data from a financial API, scores stocks with a set of rules, and shows the results in a Streamlit interface, with some automation around it.',
    tags: ['Python', 'Financial APIs', 'Streamlit', 'Automation'],
    media: { type: 'placeholder', label: 'Video demo coming soon', variant: 'video' },
    links: { github: '', demo: '', caseStudy: '' },
  },
  {
    slug: 'overture-maps-data-quality',
    title: 'Overture Maps Data Quality',
    context: 'Overture Maps Foundation internship',
    summary:
      "I spent my data engineering internship digging into places where the data didn't line up. We used Python, DuckDB, pandas, and SQL to track down inconsistencies and work out fixes.",
    highlight: { value: '64% → 83%', label: 'accuracy, before and after our changes' },
    tags: ['Python', 'DuckDB', 'pandas', 'SQL'],
    media: { type: 'placeholder', label: 'Visual coming soon' },
    links: { github: '', demo: '', caseStudy: '' },
  },
]
