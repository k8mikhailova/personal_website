import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

type Handler = (request: Request, deps: { env: Record<string, string | undefined>; createGenerator: unknown }) => Promise<Response>

/**
 * Runs the /api/chat logic inside the Vite dev server, so the chatbot works with
 * plain `npm run dev`. Production uses the real Vercel function (api/chat.ts).
 *
 * `env` is passed in fresh on every config load, so editing .env.local takes
 * effect on Vite's automatic restart. (Writing into process.env once would keep
 * the first value for the life of the process.)
 */
function localApi(env: Record<string, string | undefined>): Plugin {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const { handleChat } = (await server.ssrLoadModule('/chatbot/handler.ts')) as { handleChat: Handler }
          const { createOpenAIGenerator } = await server.ssrLoadModule('/chatbot/openai.ts')

          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value)
          const method = req.method ?? 'GET'
          const request = new Request(`http://${req.headers.host}/api/chat`, {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
          })

          const response = await handleChat(request, { env, createGenerator: createOpenAIGenerator })
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.config.logger.error(`[local-api] ${(error as Error).message}`)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'upstream_error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-only settings for the local API, from .env / .env.local. Variables
  // already set in the shell take priority. No VITE_ prefix, so Vite never
  // exposes them to browser code.
  const fromFiles = loadEnv(mode, process.cwd(), ['OPENAI_', 'CHAT_'])
  const fromShell = Object.fromEntries(
    Object.entries(process.env).filter(([key]) => key.startsWith('OPENAI_') || key.startsWith('CHAT_')),
  )

  return { plugins: [react(), localApi({ ...fromFiles, ...fromShell })] }
})
