// Skills grouped by what they're for. `usedIn` keeps this honest: it says where
// each tool was actually used instead of rating proficiency.
// Leave `usedIn` empty to show a placeholder.

export type Skill = {
  name: string
  usedIn: string
}

export type SkillGroup = {
  title: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', usedIn: 'StockAdvisor, Marketing Intelligence Hub, Overture Maps' },
      { name: 'SQL', usedIn: 'Overture Maps data quality work' },
      { name: 'JavaScript / TypeScript', usedIn: '' },
    ],
  },
  {
    title: 'Data',
    skills: [
      { name: 'pandas', usedIn: 'Overture Maps data quality work' },
      { name: 'DuckDB', usedIn: 'Overture Maps data quality work' },
      { name: 'Data analysis', usedIn: 'Marketing Intelligence Hub' },
    ],
  },
  {
    title: 'Apps & integrations',
    skills: [
      { name: 'Streamlit', usedIn: 'StockAdvisor, Marketing Intelligence Hub' },
      { name: 'APIs', usedIn: 'Financial API data in StockAdvisor' },
      { name: 'Git', usedIn: '' },
    ],
  },
  {
    title: 'AI & automation',
    skills: [
      { name: 'AI agent workflows', usedIn: 'Marketing Intelligence Hub' },
      { name: 'Business automations', usedIn: 'InfoMomentum client work' },
      { name: '[Automation tools you’ve used]', usedIn: '' },
    ],
  },
]
