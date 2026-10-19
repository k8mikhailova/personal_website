import { describe, expect, it } from 'vitest'
import { starterTopics, suggestionTopics } from '../../content/askKate'
import { parseChatText } from './parseChatText'
import { detectTopics, nextSuggestions, normalizeQuestion, starterSuggestions, type Suggestion } from './suggestions'

describe('parseChatText', () => {
  it('renders markdown links with their own text', () => {
    expect(parseChatText('See [View the project on GitHub](https://github.com/k8mikhailova/StockAdvisor).')).toEqual([
      { type: 'text', text: 'See ' },
      { type: 'link', text: 'View the project on GitHub', href: 'https://github.com/k8mikhailova/StockAdvisor', internal: false },
      { type: 'text', text: '.' },
    ])
  })

  it('links bare URLs with a descriptive label and keeps trailing punctuation out', () => {
    const pieces = parseChatText('Code: https://github.com/k8mikhailova/marketing_hub. Demo: https://kate-marketing-intelligence.streamlit.app/, video https://youtu.be/vEshZVmSw44')
    const links = pieces.filter((p) => p.type === 'link')
    expect(links).toEqual([
      { type: 'link', text: 'View the project on GitHub', href: 'https://github.com/k8mikhailova/marketing_hub', internal: false },
      { type: 'link', text: 'Try the live demo', href: 'https://kate-marketing-intelligence.streamlit.app/', internal: false },
      { type: 'link', text: 'Watch the video demo', href: 'https://youtu.be/vEshZVmSw44', internal: false },
    ])
    expect(pieces.map((p) => p.text).join('')).toContain('Try the live demo, video')
  })

  it('labels a GitHub profile differently from a repository', () => {
    expect(parseChatText('https://github.com/k8mikhailova')).toEqual([
      { type: 'link', text: 'Kate’s GitHub profile', href: 'https://github.com/k8mikhailova', internal: false },
    ])
  })

  it('turns site paths into internal links', () => {
    expect(parseChatText('Reach out via [the Contact page](/contact) or see /about.')).toEqual([
      { type: 'text', text: 'Reach out via ' },
      { type: 'link', text: 'the Contact page', href: '/contact', internal: true },
      { type: 'text', text: ' or see ' },
      { type: 'link', text: 'About page', href: '/about', internal: true },
      { type: 'text', text: '.' },
    ])
  })

  it('does not link paths inside other words or URLs', () => {
    expect(parseChatText('and/or 24/contact').every((p) => p.type === 'text')).toBe(true)
  })

  it('never produces unsafe links', () => {
    for (const text of ['[x](javascript:alert(1))', '[x](data:text/html,hi)', '[x](//evil.example)', '[x](/admin)', '<script>alert(1)</script>']) {
      expect(parseChatText(text).some((p) => p.type === 'link')).toBe(false)
    }
  })

  it('supports bold', () => {
    expect(parseChatText('from **64% to 83%**')).toEqual([
      { type: 'text', text: 'from ' },
      { type: 'bold', text: '64% to 83%' },
    ])
  })
})

describe('suggestions', () => {
  const starters = starterSuggestions(suggestionTopics, starterTopics)
  const asked = (...texts: string[]) => new Set(texts.map(normalizeQuestion))

  it('starts with the four chosen questions, in order, from different topics', () => {
    expect(starters.map((s) => s.text)).toEqual([
      'How did Kate end up combining computer science and marketing?',
      'What’s a real problem Kate has solved with code?',
      'What has Kate actually built with AI?',
      'What makes Kate different from a typical CS graduate?',
    ])
    expect(starters).toHaveLength(4)
    expect(new Set(starters.map((s) => s.topic)).size).toBe(4)
  })

  it('replaces only the clicked question, with a follow-up on the same topic', () => {
    const clicked = starters[0]
    const next = nextSuggestions({ topics: suggestionTopics, current: starters, asked: asked(clicked.text), contextTopics: [clicked.topic] })
    expect(next).toHaveLength(4)
    expect(next[0].topic).toBe(clicked.topic)
    expect(next[0].text).not.toBe(clicked.text)
    expect(next.slice(1)).toEqual(starters.slice(1))
  })

  it('refills the clicked slot from its own topic even when the answer mentions another topic already shown', () => {
    const clicked = starters[2] // the AI question (Marketing Intelligence Hub topic)
    const next = nextSuggestions({
      topics: suggestionTopics,
      current: starters,
      asked: asked(clicked.text),
      // The answer also mentioned InfoMomentum, whose starter is still on screen.
      contextTopics: [clicked.topic, 'infomomentum', 'antforce'],
    })
    expect(next[2].topic).toBe(clicked.topic)
    expect(next[2].text).not.toBe(clicked.text)
  })

  it('adds a related question when the visitor types their own question', () => {
    const next = nextSuggestions({ topics: suggestionTopics, current: starters, asked: asked('Where did Kate go to school?'), contextTopics: ['education'] })
    expect(next).toHaveLength(4)
    expect(next.some((s) => s.topic === 'education')).toBe(true)
    expect(next.slice(0, 3)).toEqual(starters.slice(0, 3))
  })

  it('never repeats asked questions over a long conversation, and keeps 3–4 suggestions', () => {
    let current: Suggestion[] = starters
    const seenAsked = new Set<string>()
    for (let turn = 0; turn < 12 && current.length; turn++) {
      const pick = current[turn % current.length]
      seenAsked.add(normalizeQuestion(pick.text))
      current = nextSuggestions({ topics: suggestionTopics, current, asked: seenAsked, contextTopics: [pick.topic] })
      for (const s of current) expect(seenAsked.has(normalizeQuestion(s.text))).toBe(false)
      expect(new Set(current.map((s) => s.text)).size).toBe(current.length)
      if (turn < 8) expect(current.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('keeps introducing unexplored topics as the conversation goes on', () => {
    let current: Suggestion[] = starters
    const seen = new Set<string>()
    const askedTopics = new Set<string>()
    for (let turn = 0; turn < 5; turn++) {
      // Always follow up on the first suggestion, like a visitor drilling into one area.
      const pick = current[0]
      seen.add(normalizeQuestion(pick.text))
      askedTopics.add(pick.topic)
      current = nextSuggestions({ topics: suggestionTopics, current, asked: seen, contextTopics: [pick.topic] })
      const followUps = current.filter((s) => askedTopics.has(s.topic)).length
      expect(followUps).toBeLessThanOrEqual(2)
    }
    expect(current.filter((s) => !askedTopics.has(s.topic)).length).toBeGreaterThanOrEqual(2)
  })

  it('detects topics from an answer', () => {
    expect(detectTopics('StockAdvisor was built during the Arcadian internship.', suggestionTopics)[0]).toBe('stockadvisor')
    expect(detectTopics('She studied at UC Santa Cruz and in Manchester.', suggestionTopics)).toContain('education')
    expect(detectTopics('Nothing relevant here.', suggestionTopics)).toEqual([])
  })
})
