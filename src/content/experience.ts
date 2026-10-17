// Experience timeline for the homepage. Projects live inside the experience
// they came from (or were inspired by), so there's no separate projects section.
// Empty link/video values render as clearly marked placeholders.

export type ProjectLinks = {
  /** Deployed app, shown first as the primary "Try live demo" button. */
  live?: string
  /** Demo video URL, shown as "Watch demo". */
  video?: string
  github?: string
  demo?: string
  caseStudy?: string
}

/** A project shown with a screenshot slot. */
export type ProjectPreview = {
  kind: 'project'
  title: string
  /** Small label above the title, e.g. "Independent project". */
  label?: string
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

export type NestedWork = ProjectPreview | CaseStudyPreview

export type ExperienceItem = {
  org: string
  role: string
  start: string
  end: string
  type: 'work' | 'volunteer'
  /** 2–3 bullets. Wrap words in **double asterisks** to bold them. */
  bullets: string[]
  /** Small clarifying note under the bullets. */
  note?: string
  work?: NestedWork[]
}

export const experience: ExperienceItem[] = [
  {
    org: 'InfoMomentum',
    role: 'Founder / AI & Automation Specialist',
    start: 'Jan 2024',
    end: 'Jul 2026',
    type: 'work',
    bullets: [
      'Built and maintained **CRM systems and automations**, connecting different tools through APIs and Zapier.',
      'Set up **email and SMS workflows**, managed integrations, and tested everything to make sure data moved correctly between systems.',
      'Built and experimented with **AI agents** for ad performance reporting and checking email sequences for errors.',
    ],
    work: [
      {
        kind: 'project',
        title: 'Marketing Intelligence Hub',
        label: 'Related independent project',
        summary:
          'A prototype that brings marketing and customer data together, looks for patterns, and uses AI agent workflows to suggest experiments worth trying.',
        note: 'A personal prototype I built for a separate opportunity, not something made for an InfoMomentum client. All of the data is simulated.',
        tags: ['Python', 'Streamlit', 'AI agent workflows', 'Simulated data'],
        image: {
          src: '/images/projects/marketing-hub.jpg',
          alt: 'Marketing Intelligence Hub overview: a dashboard of customer signals, insights, creative tests and experiments',
        },
        links: {
          live: 'https://kate-marketing-intelligence.streamlit.app/',
          github: 'https://github.com/k8mikhailova/marketing_hub',
        },
      },
    ],
  },
  {
    org: 'Antforce.AI',
    role: 'AI Solutions & Marketing Intern',
    start: 'Mar 2026',
    end: 'Jun 2026',
    type: 'work',
    bullets: [
      'Worked on an **AI-powered Marketing Hub** that helped with content creation and SEO/GEO workflows, including organizing the information and context used by the system.',
      'Built a **live analytics dashboard** that my manager used daily, making reporting turnaround approximately **4x faster**.',
      'Worked on internal **AI productivity tools**, including automated meeting summaries, executive-assistant agents using OpenClaw, and reusable Claude skills.',
    ],
    note: 'Done with the team at Antforce. Separate from my independent Marketing Intelligence Hub.',
  },
  {
    org: 'Overture Maps Foundation',
    role: 'Data Engineering / AI Intern',
    start: 'Jan 2026',
    end: 'Mar 2026',
    type: 'work',
    bullets: [
      'Analyzed large datasets using **Python, DuckDB, pandas, and SQL** to investigate inconsistencies in place information.',
      'Tested different **rule-based and machine learning-assisted approaches** to improve how conflicting attributes were resolved.',
      "Led parts of the testing process and helped improve our team's accuracy from **64% to 83%**.",
    ],
    work: [
      {
        kind: 'case-study',
        title: 'Improving data accuracy',
        label: 'Case study preview',
        summary:
          'How we went from 64% to 83% accuracy by investigating conflicting datasets and testing different approaches.',
        metric: { name: 'Accuracy', before: 64, after: 83 },
        tags: ['Python', 'DuckDB', 'pandas', 'SQL'],
        links: { github: 'https://github.com/project-terraforma/ResolvePOI-Attribute-Conflation', caseStudy: '' },
      },
    ],
  },
  {
    org: 'Arcadian Investments',
    role: 'Software Engineering Intern',
    start: 'Jul 2024',
    end: 'Sep 2024',
    type: 'work',
    bullets: [
      'Built **StockAdvisor**, a Python application that retrieves financial market data through an API.',
      'Developed stock scoring and historical strategy simulations, with a **Streamlit interface** for exploring the results.',
      'Added **automated email reports** to reduce manual financial analysis and reporting work.',
    ],
    work: [
      {
        kind: 'project',
        title: 'StockAdvisor',
        summary:
          'A Python application for analyzing stocks, comparing investment strategies, and automating financial reports.',
        tags: ['Python', 'Streamlit', 'Financial APIs'],
        image: {
          src: '/images/projects/stockadvisor.jpg',
          alt: 'StockAdvisor overview: portfolio simulation chart, strategy comparison table and stock scores',
        },
        links: {
          live: 'https://stockadvisor.streamlit.app/',
          video: 'https://youtu.be/vEshZVmSw44',
          github: 'https://github.com/k8mikhailova/StockAdvisor',
        },
      },
    ],
  },
  {
    org: 'Women of Color on the Move',
    role: 'Security Analyst Volunteer',
    start: 'Aug 2026',
    end: 'Present',
    type: 'volunteer',
    bullets: [
      'Recently started volunteering as a **Security Analyst** to learn more about protecting software, systems, and data.',
      'Want to apply that knowledge to the applications, integrations, and automation tools I build myself.',
    ],
  },
]
