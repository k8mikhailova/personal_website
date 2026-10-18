import { limits } from './limits.js'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

export type ValidationResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; code: 'invalid_request' | 'message_too_long' }

/**
 * Checks the request body shape and trims history to what we're willing to pay
 * for. The conversation must end with a non-empty visitor message.
 */
export function validateBody(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { messages?: unknown }).messages)) {
    return { ok: false, code: 'invalid_request' }
  }

  const raw = (body as { messages: unknown[] }).messages
  if (raw.length === 0 || raw.length > 50) return { ok: false, code: 'invalid_request' }

  const messages: ChatMessage[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') return { ok: false, code: 'invalid_request' }
    const { role, content } = item as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return { ok: false, code: 'invalid_request' }
    }
    messages.push({ role, content })
  }

  const recent = messages.slice(-limits.maxHistoryMessages)
  // Drop a leading assistant message so history always starts with the visitor.
  while (recent.length && recent[0].role === 'assistant') recent.shift()

  const last = recent[recent.length - 1]
  if (!last || last.role !== 'user' || !last.content.trim()) return { ok: false, code: 'invalid_request' }

  for (const message of recent) {
    if (message.role === 'user' && message.content.length > limits.maxMessageChars) {
      return { ok: false, code: 'message_too_long' }
    }
  }

  return {
    ok: true,
    messages: recent.map((m) => ({
      role: m.role,
      content: (m.role === 'assistant' ? m.content.slice(0, limits.maxReplyChars) : m.content).trim(),
    })),
  }
}
