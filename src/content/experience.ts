// Experience overview. Leave `dates` empty to show a placeholder.
// Only include what actually happened. Use `description: ''` to show a placeholder.

export type ExperienceItem = {
  org: string
  role: string
  kind: 'Founder' | 'Internship' | 'Volunteer'
  dates: string
  description: string
  tools?: string[]
}

export const experience: ExperienceItem[] = [
  {
    org: 'InfoMomentum',
    role: 'Founder, AI & Automation Specialist',
    kind: 'Founder',
    dates: '',
    description:
      'A small marketing business I started during college. Over time most of my work moved to the technical side: building automations, connecting the tools clients used, working with their data, and testing AI tools.',
  },
  {
    org: 'Overture Maps Foundation',
    role: 'Data Engineering / AI Intern',
    kind: 'Internship',
    dates: '',
    description:
      'Investigated inconsistencies in map data and helped develop improvements. Our accuracy went from 64% to 83%.',
    tools: ['Python', 'DuckDB', 'pandas', 'SQL'],
  },
  {
    org: 'Antforce.AI',
    role: 'AI Solutions & Marketing Intern',
    kind: 'Internship',
    dates: '',
    description: '',
  },
  {
    org: 'Arcadian Investments',
    role: 'Software Engineering Intern',
    kind: 'Internship',
    dates: '',
    description:
      'Built StockAdvisor, a Python app that pulls financial API data, scores stocks with rule-based logic, and shows the results in a Streamlit interface.',
    tools: ['Python', 'Financial APIs', 'Streamlit', 'Automation'],
  },
  {
    org: 'Women of Color on the Move',
    role: 'Security Analyst Volunteer',
    kind: 'Volunteer',
    dates: '',
    description:
      'A volunteer role I recently started. I’m using it to learn more about cybersecurity alongside building software.',
  },
]
