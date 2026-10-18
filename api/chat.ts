// Vercel serverless function: POST /api/chat
// All logic lives in /chatbot so it can be tested and run locally by Vite too.
import { handleChat } from '../chatbot/handler.js'
import { createOpenAIGenerator } from '../chatbot/openai.js'

export function POST(request: Request): Promise<Response> {
  return handleChat(request, { env: process.env, createGenerator: createOpenAIGenerator })
}

export function GET(request: Request): Promise<Response> {
  return handleChat(request, { env: process.env, createGenerator: createOpenAIGenerator })
}
