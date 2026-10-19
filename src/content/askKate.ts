// Text for the "Ask Kate" chatbot on the About page.
// The chatbot's knowledge and personality live server-side in /chatbot.

export const askKate = {
  title: 'Ask Kate',
  description:
    'Curious about my experience, projects, or what I’m looking for next? Ask my AI portfolio assistant.',
  placeholder: 'Ask about Kate’s experience, projects, or interests',
  disclaimer: 'AI-generated answers based on Kate’s portfolio. They can be wrong, and conversations aren’t saved.',
  assistantLabel: 'Kate’s assistant',
}

export type SuggestionTopic = {
  id: string
  /** Words that mark a question or answer as being about this topic (lowercase). */
  keywords: string[]
  questions: string[]
}

/**
 * Suggested questions, grouped by topic. Every question should be answerable
 * from the knowledge base (chatbot/knowledge.ts). The first question of each
 * topic listed in `starterTopics` is shown before the conversation starts.
 */
export const suggestionTopics: SuggestionTopic[] = [
  {
    id: 'overture',
    keywords: ['overture', '64%', '83%', 'duckdb', 'conflicting attributes', 'place information'],
    questions: [
      'What did Kate work on at Overture Maps?',
      'How did her team improve accuracy from 64% to 83%?',
      'Where can I see the Overture project code?',
    ],
  },
  {
    id: 'mih',
    keywords: ['intelligence hub', 'customer signals', 'simulated'],
    questions: [
      'What is the Marketing Intelligence Hub?',
      'Is the Marketing Intelligence Hub built on real data?',
      'Can I try the Marketing Intelligence Hub?',
    ],
  },
  {
    id: 'stockadvisor',
    keywords: ['stockadvisor', 'arcadian', 'stock'],
    questions: [
      'What did Kate build at Arcadian Investments?',
      'Can I try StockAdvisor myself?',
      'Is there a video demo of StockAdvisor?',
    ],
  },
  {
    id: 'interests',
    keywords: ['interested', 'looking for', 'experimentation'],
    questions: ['What kind of work is Kate interested in?', 'How can I get in touch with Kate?'],
  },
  {
    id: 'antforce',
    keywords: ['antforce', 'meeting summar', 'openclaw', 'claude skills', 'analytics dashboard', '4x'],
    questions: ['What did Kate do at Antforce.AI?', 'What AI productivity tools has Kate worked on?'],
  },
  {
    id: 'infomomentum',
    keywords: ['infomomentum', 'zapier', 'crm', 'sms', 'founded', 'ontraport', 'gohighlevel', 'meta ads'],
    questions: [
      'What is InfoMomentum?',
      'How did Kate get into automation and marketing?',
      'What kinds of automations has Kate built?',
    ],
  },
  {
    id: 'education',
    keywords: ['santa cruz', 'ucsc', 'manchester', 'graduat', 'coursework', 'degree'],
    questions: ['Where did Kate study?', 'What did Kate study in Manchester?'],
  },
  {
    id: 'skills',
    keywords: ['skills', 'tech stack', 'programming languages', 'tools does'],
    questions: ['What tools and languages does Kate use?', 'What experience does Kate have with AI agents?'],
  },
  {
    id: 'portfolio',
    keywords: ['portfolio', 'ask kate', 'this chatbot', 'react', 'vercel'],
    questions: ['How was this site and chatbot built?'],
  },
  {
    id: 'volunteering',
    keywords: ['security', 'volunteer', 'women of color'],
    questions: ['Is Kate involved in cybersecurity?'],
  },
]

export const starterTopics = ['overture', 'mih', 'stockadvisor', 'interests']

/** Friendly messages for each error code the /api/chat endpoint can return. */
export const askKateErrors: Record<string, string> = {
  rate_limited: 'That’s a lot of questions in a short time. Give it a minute and try again.',
  message_too_long: 'That question is a bit long. Could you shorten it?',
  not_configured: 'The assistant isn’t available right now. You can still reach Kate through the Contact page.',
  busy: 'The assistant is busy right now. Please try again in a moment.',
  timeout: 'That took too long to answer. Please try again.',
  offline: 'It looks like you’re offline. Check your connection and try again.',
  default: 'Something went wrong on my end. Please try again in a moment.',
}
