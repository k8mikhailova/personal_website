import type { SuggestionTopic } from '../../content/askKate'

export type Suggestion = { text: string; topic: string }

export const normalizeQuestion = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%]+/gu, ' ')
    .trim()

/** Topics whose keywords appear in the text, most-mentioned first. */
export function detectTopics(text: string, topics: SuggestionTopic[]): string[] {
  const lower = text.toLowerCase()
  return topics
    .map((topic) => ({ id: topic.id, hits: topic.keywords.filter((k) => lower.includes(k)).length }))
    .filter((t) => t.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .map((t) => t.id)
}

export function starterSuggestions(topics: SuggestionTopic[], starterTopicIds: string[]): Suggestion[] {
  return starterTopicIds
    .map((id) => topics.find((t) => t.id === id))
    .filter((t): t is SuggestionTopic => !!t && t.questions.length > 0)
    .map((t) => ({ text: t.questions[0], topic: t.id }))
}

/**
 * Next set of suggestions after an answer:
 * - suggestions that weren't asked keep their position;
 * - the slot of the asked question is refilled, preferring a follow-up on the
 *   topic just discussed;
 * - at least one suggestion relates to that topic when possible (if the visitor
 *   typed their own question, the last slot is swapped for a related one);
 * - remaining slots introduce other topics, favouring ones not explored yet;
 * - at most two suggestions are follow-ups on topics already discussed, so the
 *   rest keep pointing to new parts of Kate's background;
 * - nothing already asked (or already shown) is suggested again.
 */
export function nextSuggestions(args: {
  topics: SuggestionTopic[]
  current: Suggestion[]
  asked: Set<string>
  /** Topics of the latest exchange, most relevant first. */
  contextTopics: string[]
  size?: number
}): Suggestion[] {
  const { topics, current, asked, contextTopics, size = 4 } = args
  const isAsked = (text: string) => asked.has(normalizeQuestion(text))

  const slots: (Suggestion | null)[] = current.map((s) => (isAsked(s.text) ? null : s))
  const shown = () => new Set(slots.filter((s): s is Suggestion => !!s).map((s) => normalizeQuestion(s.text)))

  const pool: Suggestion[] = topics.flatMap((t) => t.questions.map((text) => ({ text, topic: t.id })))
  const available = () => pool.filter((q) => !isAsked(q.text) && !shown().has(normalizeQuestion(q.text)))

  const related = () =>
    contextTopics.flatMap((id) => available().filter((q) => q.topic === id))

  const askedTopics = new Set(pool.filter((q) => isAsked(q.text)).map((q) => q.topic))
  const other = () => {
    const shownTopics = new Set(slots.filter((s): s is Suggestion => !!s).map((s) => s.topic))
    const candidates = available().filter((q) => !contextTopics.includes(q.topic))
    // Fresh topics first (not asked about, not on screen), then everything else, in pool order.
    const score = (q: Suggestion) => (askedTopics.has(q.topic) ? 2 : 0) + (shownTopics.has(q.topic) ? 1 : 0)
    return [...candidates].sort((a, b) => score(a) - score(b))
  }

  const primary = contextTopics[0]
  const hasRelated = () => slots.some((s) => s && contextTopics.includes(s.topic))
  const hasPrimary = () => slots.some((s) => s && s.topic === primary)

  // 1. Make sure one suggestion follows up on what was just discussed, preferring
  //    the main topic (the clicked question's own topic) over side mentions.
  if (primary && !hasPrimary()) {
    const follow = available().find((q) => q.topic === primary)
    if (follow) {
      const empty = slots.indexOf(null)
      if (empty !== -1) slots[empty] = follow
      else if (!hasRelated() && slots.length > 0) slots[slots.length - 1] = follow
    }
  }
  if (!hasRelated()) {
    const follow = related()[0]
    if (follow) {
      const empty = slots.indexOf(null)
      if (empty !== -1) slots[empty] = follow
      else if (slots.length > 0) slots[slots.length - 1] = follow
      else slots.push(follow)
    }
  }

  // 2. Refill any other empty slots, then top up to the target size.
  for (let i = 0; i < slots.length; i++) {
    if (slots[i] === null) slots[i] = other()[0] ?? related()[0] ?? null
  }
  while (slots.filter(Boolean).length < size) {
    const next = other()[0] ?? related()[0]
    if (!next) break
    slots.push(next)
  }

  // 3. Cap follow-ups on discussed topics at two; swap the extras (from the end
  //    of the list, never the current topic) for unexplored topics.
  const discussed = new Set([...askedTopics, ...contextTopics])
  const fresh = () => other().filter((q) => !discussed.has(q.topic) && !slots.some((s) => s?.topic === q.topic))
  const followUpIndexes = () =>
    slots.flatMap((s, i) => (s && discussed.has(s.topic) && !contextTopics.includes(s.topic) ? [i] : []))
  while (slots.filter((s) => s && discussed.has(s.topic)).length > 2) {
    const index = followUpIndexes().at(-1)
    const replacement = fresh()[0]
    if (index === undefined || !replacement) break
    slots[index] = replacement
  }

  return slots.filter((s): s is Suggestion => !!s).slice(0, size)
}
