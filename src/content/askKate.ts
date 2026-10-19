// Text for Kate's AI Assistant (the chatbot on the About page).
// The chatbot's knowledge and personality live server-side in /chatbot.

export const askKate = {
  title: 'Kate’s AI Assistant',
  description:
    'Curious about my projects or experience? I built this AI assistant to answer questions about my work, background, and interests.',
  placeholder: 'Ask a question about me…',
  disclaimer: 'AI-generated answers based on Kate’s portfolio. They can be wrong, and conversations aren’t saved.',
  assistantLabel: 'Kate’s AI assistant',
  /** First message in the chat, so it's clear an AI is answering, not Kate. */
  welcome:
    'Hi! I’m an AI assistant Kate built for her portfolio. I can answer questions about her projects, experience, and background, using what she’s shared here.',
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
      'What’s a real problem Kate has solved with code?',
      'How did her team improve accuracy from 64% to 83%?',
      'Where can I see the Overture project code?',
      'What did Kate work on at Overture Maps?',
    ],
  },
  {
    id: 'mih',
    keywords: ['intelligence hub', 'customer signals', 'customer feedback', 'simulated'],
    questions: [
      'What has Kate actually built with AI?',
      'Is the Marketing Intelligence Hub built on real data?',
      'Can I try the Marketing Intelligence Hub?',
      'What is the Marketing Intelligence Hub?',
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
    questions: [
      'What makes Kate different from a typical CS graduate?',
      'What kind of work is Kate interested in?',
      'How can I get in touch with Kate?',
    ],
  },
  {
    id: 'antforce',
    keywords: ['antforce', 'meeting summar', 'openclaw', 'claude skills', 'analytics dashboard', '4x'],
    questions: ['What did Kate do at Antforce.AI?', 'What AI productivity tools has Kate worked on?'],
  },
  {
    id: 'infomomentum',
    keywords: ['infomomentum', 'zapier', 'crm', 'sms', 'founded', 'ontraport', 'gohighlevel', 'meta ads', 'small business'],
    questions: [
      'How did Kate end up combining computer science and marketing?',
      'What is InfoMomentum?',
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
    keywords: ['portfolio', 'ai assistant', 'this chatbot', 'react', 'vercel'],
    questions: ['How was this site and chatbot built?'],
  },
  {
    id: 'volunteering',
    keywords: ['security', 'volunteer', 'women of color'],
    questions: ['Is Kate involved in cybersecurity?'],
  },
]

// Starters, in display order: the first question of each of these topics.
export const starterTopics = ['infomomentum', 'overture', 'mih', 'interests']

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
