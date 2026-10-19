import { buildInstructions } from './instructions.js'
import { limits } from './limits.js'
import { checkRateLimit } from './rateLimit.js'
import { validateBody, type ChatMessage } from './validate.js'

export type GenerateReply = (args: {
  model: string
  instructions: string
  messages: ChatMessage[]
  maxOutputTokens: number
}) => Promise<string>

export type ChatEnv = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
  OPENAI_REASONING_EFFORT?: string
  /** Optional comma-separated extra origins allowed to call the endpoint. */
  CHAT_ALLOWED_ORIGINS?: string
}

type Deps = {
  env: ChatEnv
  /** Builds the reply generator once a key is known (injected so tests can fake it). */
  createGenerator: (apiKey: string, env: ChatEnv) => GenerateReply
}

/** Error codes the front end knows how to explain. Never raw backend details. */
export type ChatErrorCode =
  | 'method_not_allowed'
  | 'forbidden'
  | 'unsupported_media_type'
  | 'payload_too_large'
  | 'invalid_request'
  | 'message_too_long'
  | 'rate_limited'
  | 'not_configured'
  | 'busy'
  | 'timeout'
  | 'upstream_error'

export const DEFAULT_MODEL = 'gpt-5-mini'

const baseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

function json(status: number, body: object, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...baseHeaders, ...extraHeaders } })
}

function fail(status: number, error: ChatErrorCode, extraHeaders?: Record<string, string>) {
  return json(status, { error }, extraHeaders)
}

/** Only same-origin browser requests (plus any explicitly allowed origins). */
function originAllowed(request: Request, env: ChatEnv) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    return false
  }
  const requestHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? new URL(request.url).host
  if (originHost === requestHost) return true
  const extra = (env.CHAT_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return extra.includes(origin)
}

function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'unknown'
}

export async function handleChat(request: Request, deps: Deps): Promise<Response> {
  if (request.method !== 'POST') return fail(405, 'method_not_allowed', { Allow: 'POST' })
  if (!originAllowed(request, deps.env)) return fail(403, 'forbidden')
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return fail(415, 'unsupported_media_type')
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > limits.maxBodyBytes) return fail(413, 'payload_too_large')

  const limit = checkRateLimit(clientKey(request))
  if (!limit.ok) return fail(429, 'rate_limited', { 'Retry-After': String(limit.retryAfterSeconds) })

  let body: unknown
  try {
    const text = await request.text()
    if (new TextEncoder().encode(text).length > limits.maxBodyBytes) return fail(413, 'payload_too_large')
    body = JSON.parse(text)
  } catch {
    return fail(400, 'invalid_request')
  }

  const result = validateBody(body)
  if (!result.ok) return fail(result.code === 'message_too_long' ? 413 : 400, result.code)

  const apiKey = deps.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    console.error('[ask-kate] OPENAI_API_KEY is not set')
    return fail(503, 'not_configured')
  }

  try {
    const reply = await deps.createGenerator(apiKey, deps.env)({
      model: deps.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
      instructions: buildInstructions(),
      messages: result.messages,
      maxOutputTokens: limits.maxOutputTokens,
    })
    const text = reply.trim()
    if (!text) {
      console.error('[ask-kate] empty reply from model')
      return fail(502, 'upstream_error')
    }
    return json(200, { reply: text })
  } catch (error) {
    // Log only the error type and status, never the key or visitor messages.
    const status = (error as { status?: number }).status
    const name = (error as { name?: string }).name ?? 'Error'
    if (status === 401 || status === 403) {
      console.error(`[ask-kate] OpenAI rejected the request (status ${status}): check OPENAI_API_KEY and the key's project permissions`)
    } else {
      console.error(`[ask-kate] model request failed: ${name}${status ? ` (status ${status})` : ''}`)
    }

    if (status === 429) return fail(503, 'busy')
    if (status === 401 || status === 403) return fail(503, 'not_configured')
    if (name.includes('Timeout')) return fail(504, 'timeout')
    return fail(502, 'upstream_error')
  }
}
