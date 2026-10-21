import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Signed "leave this question" tokens. The chat endpoint issues one only when
 * the assistant couldn't answer, binding it to that exact question text, so
 * the save endpoint can't be used to post arbitrary text.
 */
const TOKEN_TTL_MS = 30 * 60 * 1000

const sign = (secret: string, payload: string) => createHmac('sha256', `questions:${secret}`).update(payload).digest('base64url')

const fingerprint = (question: string) => createHash('sha256').update(question.trim()).digest('base64url')

export function issueQuestionToken(secret: string, question: string, now = Date.now()): string {
  const payload = `${now}.${fingerprint(question)}`
  return `${payload}.${sign(secret, payload)}`
}

export function verifyQuestionToken(secret: string, token: string, question: string, now = Date.now()): boolean {
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [issued, hash, signature] = parts
  const issuedAt = Number(issued)
  if (!Number.isFinite(issuedAt) || now - issuedAt > TOKEN_TTL_MS || issuedAt > now + 60_000) return false
  if (hash !== fingerprint(question)) return false
  const expected = Buffer.from(sign(secret, `${issued}.${hash}`))
  const actual = Buffer.from(signature)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

/** Salted hash of the client IP: enough to spot abuse, without storing the IP. */
export function hashClient(secret: string, ip: string): string {
  return createHmac('sha256', `client:${secret}`).update(ip).digest('base64url').slice(0, 22)
}
