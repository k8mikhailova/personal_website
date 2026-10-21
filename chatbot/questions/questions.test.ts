import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleChat } from '../handler.js'
import { resetRateLimits } from '../rateLimit.js'
import { handleQuestions, questionsEnabled } from './handler.js'
import { getQuestionStore, memoryStore, type QuestionStore } from './store.js'
import { issueQuestionToken, verifyQuestionToken } from './token.js'

const ORIGIN = 'http://localhost:5173'
const ADMIN = 'test-admin-token-0123456789abcdef'
const env = { QUESTIONS_ADMIN_TOKEN: ADMIN }

// Each request comes from a different address unless a test sets one, so rate limits only apply where tested.
let nextIp = 0
function req(method: string, body?: unknown, headers: Record<string, string> = {}) {
  return new Request(`${ORIGIN}/api/questions`, {
    method,
    headers: {
      origin: ORIGIN,
      host: 'localhost:5173',
      'content-type': 'application/json',
      'x-forwarded-for': `10.0.0.${++nextIp % 250}`,
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

const submit = (store: QuestionStore, question: string, extra: object = {}, headers?: Record<string, string>) =>
  handleQuestions(req('POST', { question, token: issueQuestionToken(ADMIN, question), ...extra }, headers), { env, store })

beforeEach(() => {
  resetRateLimits()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('question tokens', () => {
  it('verify only for the same question, secret, and within 30 minutes', () => {
    const t = issueQuestionToken('secret', 'What is her favorite book?', 1_000_000)
    expect(verifyQuestionToken('secret', t, 'What is her favorite book?', 1_000_000 + 60_000)).toBe(true)
    expect(verifyQuestionToken('secret', t, 'Something else?', 1_000_000)).toBe(false)
    expect(verifyQuestionToken('other', t, 'What is her favorite book?', 1_000_000)).toBe(false)
    expect(verifyQuestionToken('secret', t, 'What is her favorite book?', 1_000_000 + 31 * 60_000)).toBe(false)
    expect(verifyQuestionToken('secret', 'garbage', 'x')).toBe(false)
  })
})

describe('handleQuestions', () => {
  it('is unavailable until storage and an admin token are configured', async () => {
    expect(questionsEnabled({})).toBe(false)
    expect(questionsEnabled({ QUESTIONS_ADMIN_TOKEN: 'short' }, memoryStore())).toBe(false)
    expect(questionsEnabled(env, null)).toBe(false)
    expect(questionsEnabled(env, memoryStore())).toBe(true)
    const res = await handleQuestions(req('POST', { question: 'x', token: 'y' }), { env: {}, store: null })
    expect(res.status).toBe(503)
  })

  it('saves a question with a valid token: question, date, and a hashed client only', async () => {
    const store = memoryStore()
    const res = await submit(store, '  What is Kate’s favorite book?  ', {}, { 'x-forwarded-for': '203.0.113.9' })
    expect(res.status).toBe(200)
    const [saved] = await store.list()
    expect(saved.question).toBe('What is Kate’s favorite book?')
    expect(Date.parse(saved.createdAt)).not.toBeNaN()
    expect(saved.reviewed).toBe(false)
    expect(saved.clientHash).not.toContain('203.0.113.9')
    expect(Object.keys(saved).sort()).toEqual(['clientHash', 'createdAt', 'id', 'question', 'reviewed'])
  })

  it('rejects missing/forged tokens, foreign origins, and oversized questions', async () => {
    const store = memoryStore()
    expect((await handleQuestions(req('POST', { question: 'hi' }), { env, store })).status).toBe(400)
    expect((await handleQuestions(req('POST', { question: 'hi', token: issueQuestionToken(ADMIN, 'other') }), { env, store })).status).toBe(400)
    expect((await handleQuestions(req('POST', { question: 'hi', token: issueQuestionToken('wrong-secret', 'hi') }), { env, store })).status).toBe(400)
    expect((await handleQuestions(req('POST', { question: 'hi', token: issueQuestionToken(ADMIN, 'hi') }, { origin: 'https://evil.example' }), { env, store })).status).toBe(403)
    const long = 'x'.repeat(501)
    expect((await handleQuestions(req('POST', { question: long, token: issueQuestionToken(ADMIN, long) }), { env, store })).status).toBe(400)
    expect(await store.count()).toBe(0)
  })

  it('silently drops honeypot submissions', async () => {
    const store = memoryStore()
    const res = await submit(store, 'Spam?', { website: 'http://spam.example' })
    expect(res.status).toBe(200)
    expect(await store.count()).toBe(0)
  })

  it('rate limits submissions per visitor', async () => {
    const store = memoryStore()
    const headers = { 'x-forwarded-for': '198.51.100.4' }
    for (let i = 0; i < 3; i++) expect((await submit(store, `Question ${i}?`, {}, headers)).status).toBe(200)
    expect((await submit(store, 'One more?', {}, headers)).status).toBe(429)
    expect(await store.count()).toBe(3)
  })

  it('lets only the admin list questions and mark them reviewed', async () => {
    const store = memoryStore()
    await submit(store, 'Does Kate like hiking?')
    expect((await handleQuestions(req('GET'), { env, store })).status).toBe(401)
    expect((await handleQuestions(req('GET', undefined, { authorization: 'Bearer nope' }), { env, store })).status).toBe(401)

    const auth = { authorization: `Bearer ${ADMIN}` }
    const listed = (await (await handleQuestions(req('GET', undefined, auth), { env, store })).json()) as { questions: { id: string }[] }
    expect(listed.questions).toHaveLength(1)

    const patched = await handleQuestions(req('PATCH', { id: listed.questions[0].id, reviewed: true }, auth), { env, store })
    expect(patched.status).toBe(200)
    expect((await store.list())[0].reviewed).toBe(true)
    expect((await handleQuestions(req('PATCH', { id: 'missing', reviewed: true }, auth), { env, store })).status).toBe(404)
    expect((await handleQuestions(req('PATCH', { id: listed.questions[0].id, reviewed: true }), { env, store })).status).toBe(401)
  })
})

describe('local file store', () => {
  it('persists to the configured file', async () => {
    const file = join(mkdtempSync(join(tmpdir(), 'questions-')), 'questions.json')
    const store = getQuestionStore({ QUESTIONS_LOCAL_FILE: file })!
    await store.add({ question: 'Saved locally?', clientHash: 'h' })
    expect(JSON.parse(readFileSync(file, 'utf8'))[0].question).toBe('Saved locally?')
  })
})

describe('chat endpoint: unanswered questions', () => {
  const chat = (reply: string, chatEnv: Record<string, string>) =>
    handleChat(
      new Request(`${ORIGIN}/api/chat`, {
        method: 'POST',
        headers: { origin: ORIGIN, host: 'localhost:5173', 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'What is Kate’s favorite color?' }] }),
      }),
      { env: { OPENAI_API_KEY: 'k', ...chatEnv }, createGenerator: () => async () => reply },
    )

  it('strips the marker and offers a token bound to the question when saving is configured', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'questions-'))
    const res = await chat('[[UNANSWERED]] I don’t know that one yet!', { ...env, QUESTIONS_LOCAL_FILE: join(dir, 'q.json') })
    const data = (await res.json()) as { reply: string; unanswered: boolean; questionToken?: string }
    expect(data.reply).toBe('I don’t know that one yet!')
    expect(data.unanswered).toBe(true)
    expect(verifyQuestionToken(ADMIN, data.questionToken!, 'What is Kate’s favorite color?')).toBe(true)
  })

  it('reports unanswered but offers no token when saving is not configured', async () => {
    const data = (await (await chat('[[UNANSWERED]] I don’t know that one yet!', {})).json()) as Record<string, unknown>
    expect(data.unanswered).toBe(true)
    expect(data).not.toHaveProperty('questionToken')
  })

  it('offers nothing for normal answers', async () => {
    const data = (await (await chat('Her favorite projects are on the Home page.', env)).json()) as Record<string, unknown>
    expect(data.unanswered).toBe(false)
    expect(data).not.toHaveProperty('questionToken')
  })
})
