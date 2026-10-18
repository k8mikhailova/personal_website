// Text for the "Ask Kate" chatbot on the About page.
// The chatbot's knowledge and personality live server-side in /chatbot.

export const askKate = {
  title: 'Ask Kate',
  description:
    'Curious about my experience, projects, or what I’m looking for next? Ask my AI portfolio assistant.',
  starters: [
    'What did Kate work on at Overture Maps?',
    'What is the Marketing Intelligence Hub?',
    'What did Kate build at Arcadian Investments?',
    'What kind of work is Kate interested in?',
  ],
  placeholder: 'Ask about Kate’s experience, projects, or interests',
  disclaimer: 'AI-generated answers based on Kate’s portfolio. They can be wrong, and conversations aren’t saved.',
  assistantLabel: 'Kate’s assistant',
}

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
