/** Cost and abuse limits for the public /api/chat endpoint. */
export const limits = {
  /** Longest visitor message accepted, in characters. */
  maxMessageChars: 500,
  /** Previous assistant replies are trimmed to this length before being resent. */
  maxReplyChars: 1500,
  /** Only the most recent messages are sent (visitor + assistant combined). */
  maxHistoryMessages: 8,
  /** Largest request body accepted, in bytes. */
  maxBodyBytes: 16_000,
  /** Cap on generated tokens per reply (includes any reasoning tokens). */
  maxOutputTokens: 800,
  /** Requests allowed per visitor IP, per instance. */
  perMinute: 6,
  perHour: 30,
  /** OpenAI request timeout. */
  timeoutMs: 25_000,
} as const
