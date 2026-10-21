// Request helpers shared by the chat and questions endpoints.

/** Only same-origin browser requests (plus any explicitly allowed origins). */
export function originAllowed(request: Request, env: { CHAT_ALLOWED_ORIGINS?: string }) {
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

export function clientKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip') || 'unknown'
}
