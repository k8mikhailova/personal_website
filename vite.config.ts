import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'

type Env = Record<string, string | undefined>

/** Turns a Node request into a Fetch API Request for the shared handlers. */
async function toRequest(req: IncomingMessage, path: string) {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value)
  const method = req.method ?? 'GET'
  return new Request(`http://${req.headers.host}${path}`, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
  })
}

async function send(res: ServerResponse, response: Response) {
  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(Buffer.from(await response.arrayBuffer()))
}

function route(server: ViteDevServer, path: string, run: (request: Request) => Promise<Response>) {
  server.middlewares.use(path, async (req, res) => {
    try {
      await send(res, await run(await toRequest(req, path)))
    } catch (error) {
      server.config.logger.error(`[local-api] ${(error as Error).message}`)
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'upstream_error' }))
    }
  })
}

/**
 * Runs the /api functions inside the Vite dev server, so the chatbot and the
 * leave-a-question flow work with plain `npm run dev`. Production uses the
 * real Vercel functions in /api.
 *
 * `env` is passed in fresh on every config load, so editing .env.local takes
 * effect on Vite's automatic restart.
 */
function localApi(env: Env): Plugin {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      route(server, '/api/chat', async (request) => {
        const { handleChat } = await server.ssrLoadModule('/chatbot/handler.ts')
        const { createOpenAIGenerator } = await server.ssrLoadModule('/chatbot/openai.ts')
        return handleChat(request, { env, createGenerator: createOpenAIGenerator })
      })
      route(server, '/api/questions', async (request) => {
        const { handleQuestions } = await server.ssrLoadModule('/chatbot/questions/handler.ts')
        return handleQuestions(request, { env })
      })
    },
  }
}

// Local-only defaults so the leave-a-question flow can be tried without any
// external service. Saved questions go to a gitignored JSON file.
const LOCAL_QUESTIONS_FILE = resolve(process.cwd(), '.local-data/questions.json')
const LOCAL_REVIEW_TOKEN = 'local-dev-review-token-not-a-secret'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // Server-only settings for the local API, from .env / .env.local. Variables
  // already set in the shell take priority. No VITE_ prefix, so Vite never
  // exposes them to browser code.
  const prefixes = ['OPENAI_', 'CHAT_', 'QUESTIONS_', 'UPSTASH_', 'KV_']
  const fromFiles = loadEnv(mode, process.cwd(), prefixes)
  const fromShell = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => prefixes.some((prefix) => key.startsWith(prefix))),
  )
  const env: Env = { ...fromFiles, ...fromShell }

  if (command === 'serve') {
    env.QUESTIONS_LOCAL_FILE ??= LOCAL_QUESTIONS_FILE
    if (!env.QUESTIONS_ADMIN_TOKEN) {
      env.QUESTIONS_ADMIN_TOKEN = LOCAL_REVIEW_TOKEN
      console.log(`\n  Local question review: http://localhost:5173/admin/questions (token: ${LOCAL_REVIEW_TOKEN})\n`)
    }
  }

  return { plugins: [react(), localApi(env)] }
})
