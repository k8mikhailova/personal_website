import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Runs the /api/chat Vercel function inside the Vite dev server, so the chatbot
 * works with plain `npm run dev`. Production uses the real Vercel function.
 */
function localApi(): Plugin {
  return {
    name: 'local-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          const mod = (await server.ssrLoadModule('/api/chat.ts')) as Record<string, (r: Request) => Promise<Response>>
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

          const handler = mod[method]
          const response = handler ? await handler(request) : new Response(null, { status: 405 })
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
  // Server-only secrets for the local API (e.g. from .env.local). These have no
  // VITE_ prefix, so Vite never exposes them to browser code.
  const env = loadEnv(mode, process.cwd(), ['OPENAI_', 'CHAT_'])
  for (const [key, value] of Object.entries(env)) process.env[key] ??= value

  return { plugins: [react(), localApi()] }
})
