import { timingSafeEqual } from 'node:crypto'
import { clientKey, originAllowed } from '../request.js'
import { limits } from '../limits.js'
import { createRateLimiter } from '../rateLimit.js'
import { getQuestionStore, MAX_STORED_QUESTIONS, type QuestionStore, type StoreEnv } from './store.js'
import { hashClient, verifyQuestionToken } from './token.js'

export type QuestionsEnv = StoreEnv & {
  /** Long random secret. Unlocks the review page and signs leave-a-question tokens. */
  QUESTIONS_ADMIN_TOKEN?: string
  CHAT_ALLOWED_ORIGINS?: string
}

type Deps = {
  env: QuestionsEnv
  /** Injected in tests; defaults to the store configured by env. */
  store?: QuestionStore | null
}

/** Visitors can leave at most this many questions (per server instance). */
const checkSubmitLimit = createRateLimiter(3, 10)
/** Slows down guessing the admin token. */
const checkAdminLimit = createRateLimiter(20, 200)

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex',
}

const json = (status: number, body: object, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } })

/** True only when questions can actually be stored. */
export function questionsEnabled(env: QuestionsEnv, store = getQuestionStore(env)) {
  return Boolean(store && env.QUESTIONS_ADMIN_TOKEN && env.QUESTIONS_ADMIN_TOKEN.length >= 24)
}

function isAdmin(request: Request, env: QuestionsEnv) {
  const expected = env.QUESTIONS_ADMIN_TOKEN
  const given = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  if (!expected || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return null
  const text = await request.text()
  if (text.length > 4000) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * /api/questions
 * - POST (public): save one unanswered question the visitor chose to leave.
 * - GET (admin): list saved questions.
 * - PATCH (admin): mark a question reviewed / not reviewed.
 */
export async function handleQuestions(request: Request, deps: Deps): Promise<Response> {
  const { env } = deps
  const store = deps.store === undefined ? getQuestionStore(env) : deps.store
  const secret = env.QUESTIONS_ADMIN_TOKEN ?? ''

  if (!questionsEnabled(env, store) || !store) return json(503, { error: 'not_configured' })

  try {
    if (request.method === 'POST') {
      if (!originAllowed(request, env)) return json(403, { error: 'forbidden' })
      const ip = clientKey(request)
      const limit = checkSubmitLimit(ip)
      if (!limit.ok) return json(429, { error: 'rate_limited' }, { 'Retry-After': String(limit.retryAfterSeconds) })

      const body = (await readJson(request)) as { question?: unknown; token?: unknown; website?: unknown } | null
      if (!body || typeof body.question !== 'string' || typeof body.token !== 'string') {
        return json(400, { error: 'invalid_request' })
      }
      // Honeypot: a hidden field real visitors never fill in. Pretend success.
      if (typeof body.website === 'string' && body.website.trim()) return json(200, { saved: true })

      const question = body.question.trim()
      if (!question || question.length > limits.maxMessageChars) return json(400, { error: 'invalid_request' })
      if (!verifyQuestionToken(secret, body.token, question)) return json(400, { error: 'invalid_request' })
      if ((await store.count()) >= MAX_STORED_QUESTIONS) return json(503, { error: 'busy' })

      await store.add({ question, clientHash: hashClient(secret, ip) })
      return json(200, { saved: true })
    }

    // ---------- Admin ----------
    if (request.method === 'GET' || request.method === 'PATCH') {
      const limit = checkAdminLimit(clientKey(request))
      if (!limit.ok) return json(429, { error: 'rate_limited' })
      if (!isAdmin(request, env)) return json(401, { error: 'unauthorized' })

      if (request.method === 'GET') return json(200, { questions: await store.list() })

      const body = (await readJson(request)) as { id?: unknown; reviewed?: unknown } | null
      if (!body || typeof body.id !== 'string' || typeof body.reviewed !== 'boolean') {
        return json(400, { error: 'invalid_request' })
      }
      const updated = await store.setReviewed(body.id, body.reviewed)
      return updated ? json(200, { question: updated }) : json(404, { error: 'not_found' })
    }

    return json(405, { error: 'method_not_allowed' }, { Allow: 'GET, POST, PATCH' })
  } catch (error) {
    console.error(`[questions] storage request failed: ${(error as Error).message}`)
    return json(502, { error: 'storage_error' })
  }
}
