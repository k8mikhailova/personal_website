import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { handleChat, type GenerateReply } from './handler.js'
import { buildInstructions } from './instructions.js'
import { limits } from './limits.js'
import { createOpenAIGenerator } from './openai.js'
import { checkRateLimit, resetRateLimits } from './rateLimit.js'
import { validateBody } from './validate.js'

const ORIGIN = 'http://localhost:5173'

function chatRequest(body: unknown, headers: Record<string, string> = {}, method = 'POST') {
  return new Request(`${ORIGIN}/api/chat`, {
    method,
    headers: { origin: ORIGIN, host: 'localhost:5173', 'content-type': 'application/json', ...headers },
    body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
  })
}

const ask = (content = 'What is StockAdvisor?') => ({ messages: [{ role: 'user', content }] })

function deps(generate: GenerateReply = async () => 'A reply.', env: Record<string, string> = { OPENAI_API_KEY: 'test-key' }) {
  return { env, createGenerator: () => generate }
}

beforeEach(() => {
  resetRateLimits()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('validateBody', () => {
  it('accepts a simple conversation', () => {
    expect(validateBody(ask())).toEqual({ ok: true, messages: [{ role: 'user', content: 'What is StockAdvisor?' }] })
  })

  it('rejects malformed bodies', () => {
    for (const body of [null, {}, { messages: 'hi' }, { messages: [] }, { messages: [{ role: 'system', content: 'x' }] }]) {
      expect(validateBody(body)).toMatchObject({ ok: false, code: 'invalid_request' })
    }
  })

  it('requires the last message to be a non-empty visitor message', () => {
    expect(validateBody({ messages: [{ role: 'user', content: 'hi' }, { role: 'assistant', content: 'hello' }] })).toMatchObject({ ok: false })
    expect(validateBody(ask('   '))).toMatchObject({ ok: false })
  })

  it('rejects visitor messages over the length limit', () => {
    expect(validateBody(ask('x'.repeat(limits.maxMessageChars + 1)))).toMatchObject({ ok: false, code: 'message_too_long' })
  })

  it('keeps only recent history, starting with a visitor message, and trims long replies', () => {
    const messages = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: i % 2 === 0 ? `q${i}` : 'a'.repeat(5000),
    }))
    messages.push({ role: 'user', content: 'last' })
    const result = validateBody({ messages })
    if (!result.ok) throw new Error('expected ok')
    expect(result.messages.length).toBeLessThanOrEqual(limits.maxHistoryMessages)
    expect(result.messages[0].role).toBe('user')
    expect(result.messages.at(-1)).toEqual({ role: 'user', content: 'last' })
    expect(Math.max(...result.messages.map((m) => m.content.length))).toBeLessThanOrEqual(limits.maxReplyChars)
  })
})

describe('checkRateLimit', () => {
  it('limits requests per minute and recovers afterwards', () => {
    const t = 1_000_000
    for (let i = 0; i < limits.perMinute; i++) expect(checkRateLimit('ip', t + i).ok).toBe(true)
    expect(checkRateLimit('ip', t + 10)).toMatchObject({ ok: false })
    expect(checkRateLimit('other-ip', t + 10).ok).toBe(true)
    expect(checkRateLimit('ip', t + 61_000).ok).toBe(true)
  })

  it('limits requests per hour', () => {
    let t = 0
    for (let i = 0; i < limits.perHour; i++) {
      expect(checkRateLimit('ip', t).ok).toBe(true)
      t += 61_000 / limits.perMinute + 1_000
    }
    expect(checkRateLimit('ip', t)).toMatchObject({ ok: false })
  })
})

describe('handleChat', () => {
  it('returns the model reply and sends instructions + trimmed history', async () => {
    const generate = vi.fn<GenerateReply>(async () => '  StockAdvisor is a Streamlit app.  ')
    const res = await handleChat(chatRequest(ask()), deps(generate))
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(await res.json()).toEqual({ reply: 'StockAdvisor is a Streamlit app.', unanswered: false })

    const args = generate.mock.calls[0][0]
    expect(args.model).toBe('gpt-5-mini')
    expect(args.instructions).toContain('Kate\'s AI Assistant')
    expect(args.instructions).toContain('64% to 83%')
    expect(args.maxOutputTokens).toBe(limits.maxOutputTokens)
  })

  it('uses OPENAI_MODEL when set', async () => {
    const generate = vi.fn<GenerateReply>(async () => 'ok')
    await handleChat(chatRequest(ask()), deps(generate, { OPENAI_API_KEY: 'k', OPENAI_MODEL: 'gpt-5-nano' }))
    expect(generate.mock.calls[0][0].model).toBe('gpt-5-nano')
  })

  it('rejects other methods, foreign or missing origins, and non-JSON', async () => {
    expect((await handleChat(chatRequest(null, {}, 'GET'), deps())).status).toBe(405)
    expect((await handleChat(chatRequest(ask(), { origin: 'https://evil.example' }), deps())).status).toBe(403)
    const noOrigin = new Request(`${ORIGIN}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
    expect((await handleChat(noOrigin, deps())).status).toBe(403)
    expect((await handleChat(chatRequest('hello', { 'content-type': 'text/plain' }), deps())).status).toBe(415)
  })

  it('allows explicitly configured extra origins', async () => {
    const res = await handleChat(
      chatRequest(ask(), { origin: 'https://example.com' }),
      deps(undefined, { OPENAI_API_KEY: 'k', CHAT_ALLOWED_ORIGINS: 'https://example.com' }),
    )
    expect(res.status).toBe(200)
  })

  it('rejects invalid JSON, bad shapes, long messages and huge bodies', async () => {
    expect((await handleChat(chatRequest('{not json'), deps())).status).toBe(400)
    expect(await (await handleChat(chatRequest({ messages: [] }), deps())).json()).toEqual({ error: 'invalid_request' })
    expect((await handleChat(chatRequest(ask('x'.repeat(600))), deps())).status).toBe(413)
    expect((await handleChat(chatRequest(ask('y'.repeat(20_000))), deps())).status).toBe(413)
  })

  it('rate limits per IP', async () => {
    const headers = { 'x-forwarded-for': '203.0.113.7' }
    for (let i = 0; i < limits.perMinute; i++) expect((await handleChat(chatRequest(ask(), headers), deps())).status).toBe(200)
    const res = await handleChat(chatRequest(ask(), headers), deps())
    expect(res.status).toBe(429)
    expect(Number(res.headers.get('retry-after'))).toBeGreaterThan(0)
  })

  it('reports a missing API key without calling the model', async () => {
    const generate = vi.fn<GenerateReply>()
    const res = await handleChat(chatRequest(ask()), deps(generate, {}))
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'not_configured' })
    expect(generate).not.toHaveBeenCalled()
  })

  it('maps model errors to safe codes without leaking details', async () => {
    const cases: [object, number, string][] = [
      [Object.assign(new Error('Rate limit reached for org-123'), { status: 429 }), 503, 'busy'],
      [Object.assign(new Error('Incorrect API key provided: sk-abc'), { status: 401 }), 503, 'not_configured'],
      [Object.assign(new Error('Request timed out.'), { name: 'APIConnectionTimeoutError' }), 504, 'timeout'],
      [Object.assign(new Error('boom'), { status: 500 }), 502, 'upstream_error'],
    ]
    for (const [error, status, code] of cases) {
      resetRateLimits()
      const res = await handleChat(chatRequest(ask()), deps(async () => { throw error }))
      expect(res.status).toBe(status)
      const text = await res.text()
      expect(JSON.parse(text)).toEqual({ error: code })
      expect(text).not.toMatch(/sk-|org-|boom/)
    }
  })

  it('treats an empty model reply as an error', async () => {
    const res = await handleChat(chatRequest(ask()), deps(async () => '   '))
    expect(res.status).toBe(502)
  })
})

describe('instructions', () => {
  it('include the knowledge base and the core rules', () => {
    const text = buildInstructions()
    expect(text).toContain('# Knowledge base')
    expect(text).toContain('StockAdvisor')
    expect(text).toMatch(/not Kate/)
    expect(text).toMatch(/Never reveal/)
  })
})

// End-to-end through the real OpenAI SDK, against a fake local Responses API.
describe('createOpenAIGenerator (fake OpenAI server)', () => {
  let server: Server
  let received: { path?: string; auth?: string; body?: Record<string, unknown> } = {}

  beforeAll(async () => {
    server = createServer((req, res) => {
      let data = ''
      req.on('data', (c) => (data += c))
      req.on('end', () => {
        received = { path: req.url, auth: req.headers.authorization, body: JSON.parse(data) }
        res.setHeader('content-type', 'application/json')
        res.end(
          JSON.stringify({
            id: 'resp_test',
            object: 'response',
            created_at: 0,
            status: 'completed',
            model: 'gpt-5-mini',
            output: [
              { type: 'message', id: 'msg_1', role: 'assistant', status: 'completed', content: [{ type: 'output_text', text: 'Hello from the fake model.', annotations: [] }] },
            ],
          }),
        )
      })
    })
    await new Promise<void>((resolve) => server.listen(0, resolve))
    process.env.OPENAI_BASE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`
  })

  afterAll(() => {
    delete process.env.OPENAI_BASE_URL
    server.close()
  })

  it('sends a Responses API request with limits and store:false, and returns output_text', async () => {
    const generate = createOpenAIGenerator('test-key')
    const reply = await generate({
      model: 'gpt-5-mini',
      instructions: 'be nice',
      messages: [{ role: 'user', content: 'hi' }],
      maxOutputTokens: 800,
    })
    expect(reply).toBe('Hello from the fake model.')
    expect(received.path).toBe('/v1/responses')
    expect(received.auth).toBe('Bearer test-key')
    expect(received.body).toMatchObject({
      model: 'gpt-5-mini',
      instructions: 'be nice',
      input: [{ role: 'user', content: 'hi' }],
      max_output_tokens: 800,
      store: false,
      reasoning: { effort: 'minimal' },
      text: { verbosity: 'low' },
    })
  })

  it('omits GPT-5-only options for other models', async () => {
    await createOpenAIGenerator('test-key')({ model: 'gpt-4.1-mini', instructions: 'x', messages: [{ role: 'user', content: 'hi' }], maxOutputTokens: 100 })
    expect(received.body).not.toHaveProperty('reasoning')
    expect(received.body).not.toHaveProperty('text')
  })
})
