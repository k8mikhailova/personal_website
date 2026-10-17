// Skills & Tools on the homepage. Edit freely; order here is display order.

export type SkillGroup = {
  title: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Software Development',
    skills: ['Python', 'SQL', 'Git', 'REST APIs', 'Streamlit'],
  },
  {
    title: 'Data & Evaluation',
    skills: ['pandas', 'DuckDB', 'Data Processing', 'Data Validation', 'Model Evaluation'],
  },
  {
    title: 'AI & Automation',
    skills: ['LLM Applications', 'AI Agent Workflows', 'Prompt Engineering', 'Workflow Automation'],
  },
  {
    title: 'Engineering & Integration',
    skills: [
      'System Integration',
      'Testing & Debugging',
      'Rapid Prototyping',
      'Requirements Gathering',
      'Technical Documentation',
    ],
  },
]
