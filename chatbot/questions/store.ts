import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

/** A visitor question the assistant couldn't answer, saved only when the visitor chose to. */
export type SavedQuestion = {
  id: string
  question: string
  /** ISO timestamp of submission. */
  createdAt: string
  reviewed: boolean
  /** Salted hash of the visitor's IP, kept only for abuse prevention. Never the raw IP. */
  clientHash: string
}

export interface QuestionStore {
  add(input: { question: string; clientHash: string }): Promise<SavedQuestion>
  list(): Promise<SavedQuestion[]>
  setReviewed(id: string, reviewed: boolean): Promise<SavedQuestion | null>
  count(): Promise<number>
}

export type StoreEnv = {
  /** Upstash Redis REST credentials (Vercel Marketplace uses either naming). */
  UPSTASH_REDIS_REST_URL?: string
  UPSTASH_REDIS_REST_TOKEN?: string
  KV_REST_API_URL?: string
  KV_REST_API_TOKEN?: string
  /** Set by the local dev server only: save questions to this JSON file. */
  QUESTIONS_LOCAL_FILE?: string
}

/** Hard cap so a flood of submissions can't grow storage without bound. */
export const MAX_STORED_QUESTIONS = 2000

const newQuestion = (input: { question: string; clientHash: string }): SavedQuestion => ({
  id: randomUUID(),
  question: input.question,
  createdAt: new Date().toISOString(),
  reviewed: false,
  clientHash: input.clientHash,
})

const newestFirst = (a: SavedQuestion, b: SavedQuestion) => b.createdAt.localeCompare(a.createdAt)

/** Returns the configured store, or null when persistence isn't set up. */
export function getQuestionStore(env: StoreEnv): QuestionStore | null {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN
  if (url && token) return upstashStore(url, token)
  if (env.QUESTIONS_LOCAL_FILE) return fileStore(env.QUESTIONS_LOCAL_FILE)
  return null
}

// ---------- Upstash Redis (production) ----------
// One Redis hash: field = question id, value = JSON. Uses the REST API, no SDK.

const HASH_KEY = 'kate-site:questions'

function upstashStore(baseUrl: string, token: string): QuestionStore {
  async function command<T>(...args: (string | number)[]): Promise<T> {
    const res = await fetch(baseUrl.replace(/\/+$/, ''), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
    const data = (await res.json().catch(() => ({}))) as { result?: T; error?: string }
    if (!res.ok || data.error) throw Object.assign(new Error('storage_error'), { status: res.status })
    return data.result as T
  }

  const parse = (value: string | null): SavedQuestion | null => {
    if (!value) return null
    try {
      return JSON.parse(value) as SavedQuestion
    } catch {
      return null
    }
  }

  return {
    async add(input) {
      const saved = newQuestion(input)
      await command('HSET', HASH_KEY, saved.id, JSON.stringify(saved))
      return saved
    },
    async list() {
      const flat = (await command<string[]>('HGETALL', HASH_KEY)) ?? []
      const items: SavedQuestion[] = []
      for (let i = 1; i < flat.length; i += 2) {
        const q = parse(flat[i])
        if (q) items.push(q)
      }
      return items.sort(newestFirst)
    },
    async setReviewed(id, reviewed) {
      const current = parse(await command<string | null>('HGET', HASH_KEY, id))
      if (!current) return null
      const updated = { ...current, reviewed }
      await command('HSET', HASH_KEY, id, JSON.stringify(updated))
      return updated
    },
    async count() {
      return command<number>('HLEN', HASH_KEY)
    },
  }
}

// ---------- JSON file (local development only) ----------

function fileStore(path: string): QuestionStore {
  async function read(): Promise<SavedQuestion[]> {
    try {
      return JSON.parse(await readFile(path, 'utf8')) as SavedQuestion[]
    } catch {
      return []
    }
  }
  async function write(items: SavedQuestion[]) {
    await mkdir(dirname(path), { recursive: true })
    const tmp = `${path}.tmp`
    await writeFile(tmp, JSON.stringify(items, null, 2))
    await rename(tmp, path)
  }
  return {
    async add(input) {
      const items = await read()
      const saved = newQuestion(input)
      await write([...items, saved])
      return saved
    },
    async list() {
      return (await read()).sort(newestFirst)
    },
    async setReviewed(id, reviewed) {
      const items = await read()
      const target = items.find((q) => q.id === id)
      if (!target) return null
      target.reviewed = reviewed
      await write(items)
      return target
    },
    async count() {
      return (await read()).length
    },
  }
}

// ---------- In memory (tests) ----------

export function memoryStore(): QuestionStore {
  const items: SavedQuestion[] = []
  return {
    async add(input) {
      const saved = newQuestion(input)
      items.push(saved)
      return saved
    },
    async list() {
      return [...items].sort(newestFirst)
    },
    async setReviewed(id, reviewed) {
      const target = items.find((q) => q.id === id)
      if (!target) return null
      target.reviewed = reviewed
      return target
    },
    async count() {
      return items.length
    },
  }
}
