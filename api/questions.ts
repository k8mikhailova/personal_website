// Vercel serverless function: /api/questions (leave-a-question + private review).
import { handleQuestions } from '../chatbot/questions/handler.js'

const handle = (request: Request) => handleQuestions(request, { env: process.env })

export const GET = handle
export const POST = handle
export const PATCH = handle
