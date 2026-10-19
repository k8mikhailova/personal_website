import OpenAI from 'openai'
import type { ReasoningEffort } from 'openai/resources/shared'
import type { ChatEnv, GenerateReply } from './handler.js'
import { limits } from './limits.js'

/**
 * Calls the OpenAI Responses API. Conversations are not stored on OpenAI's side
 * (store: false). For GPT-5-family models, reasoning is kept minimal and replies
 * terse to keep latency and cost down; OPENAI_REASONING_EFFORT can override.
 */
export function createOpenAIGenerator(apiKey: string, env: ChatEnv = {}): GenerateReply {
  const client = new OpenAI({ apiKey, timeout: limits.timeoutMs, maxRetries: 1 })

  return async ({ model, instructions, messages, maxOutputTokens }) => {
    const isGpt5 = /^gpt-5/i.test(model)
    const isReasoningModel = isGpt5 || /^o\d/i.test(model)
    const effort = (env.OPENAI_REASONING_EFFORT?.trim() || 'minimal') as ReasoningEffort

    const response = await client.responses.create({
      model,
      instructions,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      max_output_tokens: maxOutputTokens,
      store: false,
      ...(isReasoningModel ? { reasoning: { effort } } : {}),
      ...(isGpt5 ? { text: { verbosity: 'low' as const } } : {}),
    })

    return response.output_text ?? ''
  }
}
