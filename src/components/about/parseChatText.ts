/**
 * Turns an assistant reply into safe, renderable pieces. No HTML is ever
 * interpreted: the reply is plain text with a little Markdown-style markup.
 *
 * Recognized:
 *   [label](url)         link (http(s) or a known site page)
 *   **bold**
 *   https://...          bare web address, shown with a short descriptive label
 *   /about, /contact     site pages written as plain paths
 *
 * Which external URLs are allowed is enforced on the server (chatbot/links.ts);
 * here we only accept web and site links, never javascript: or other schemes.
 */

export type ChatPiece =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'link'; text: string; href: string; internal: boolean }

const SITE_PAGES: Record<string, string> = {
  '/': 'Home page',
  '/about': 'About page',
  '/contact': 'Contact page',
}

const TOKEN =
  /\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)|\*\*([^*\n]+)\*\*|(https?:\/\/[^\s<>()\]]+[^\s<>()\].,;:!?'"])|(?<![\w/.])(\/(?:about|contact))(?![\w/])/g

function labelForUrl(url: string): string {
  try {
    const { hostname } = new URL(url)
    if (hostname === 'github.com' || hostname.endsWith('.github.com')) return 'View the project on GitHub'
    if (hostname.endsWith('.streamlit.app')) return 'Try the live demo'
    if (hostname === 'youtu.be' || hostname.endsWith('youtube.com')) return 'Watch the video demo'
    return hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function toLink(text: string, href: string): ChatPiece {
  if (href in SITE_PAGES) return { type: 'link', text, href, internal: true }
  if (/^https?:\/\//i.test(href)) return { type: 'link', text, href, internal: false }
  // Anything else (javascript:, data:, //host, unknown paths) is shown as plain text.
  return { type: 'text', text }
}

export function parseChatText(input: string): ChatPiece[] {
  const pieces: ChatPiece[] = []
  let last = 0
  for (const match of input.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) pieces.push({ type: 'text', text: input.slice(last, index) })
    const [whole, label, href, bold, url, path] = match

    if (label !== undefined && href !== undefined) pieces.push(toLink(label, href))
    else if (bold !== undefined) pieces.push({ type: 'bold', text: bold })
    else if (url !== undefined) pieces.push(toLink(labelForUrl(url), url))
    else if (path !== undefined) pieces.push(toLink(SITE_PAGES[path], path))
    else pieces.push({ type: 'text', text: whole })

    last = index + whole.length
  }
  if (last < input.length) pieces.push({ type: 'text', text: input.slice(last) })
  return pieces
}
