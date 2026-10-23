import { knowledge } from './knowledge.js'

/** Site pages the assistant may link to. */
export const SITE_PATHS = ['/', '/home', '/about', '/contact'] as const

const URL_IN_TEXT = /https?:\/\/[^\s<>()\]]+[^\s<>()\].,;:!?'"]/g
// Link targets may contain one level of balanced parentheses.
const MARKDOWN_LINK = /\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g

function normalize(url: string) {
  return url.replace(/\/+$/, '').toLowerCase()
}

/** Every URL written in the knowledge base. Only these may appear as links in replies. */
export const approvedUrls: ReadonlySet<string> = new Set((knowledge.match(URL_IN_TEXT) ?? []).map(normalize))

export function isApprovedHref(href: string): boolean {
  if ((SITE_PATHS as readonly string[]).includes(href)) return true
  return /^https?:\/\//i.test(href) && approvedUrls.has(normalize(href))
}

/**
 * Removes links the knowledge base doesn't contain, so the model can't send
 * visitors to invented or injected URLs:
 * - [text](unapproved) becomes just "text"
 * - a bare unapproved URL becomes its hostname as plain, unlinkable text
 */
export function sanitizeReplyLinks(reply: string): string {
  const withoutBadMarkdown = reply.replace(MARKDOWN_LINK, (match, label: string, href: string) =>
    isApprovedHref(href) ? match : label,
  )

  // Bare URLs outside markdown links.
  return withoutBadMarkdown.replace(/\[[^\]\n]+\]\((?:[^()\s]|\([^()\s]*\))+\)|https?:\/\/[^\s<>()\]]+[^\s<>()\].,;:!?'"]/g, (match) => {
    if (match.startsWith('[')) return match
    if (isApprovedHref(match)) return match
    try {
      return new URL(match).hostname
    } catch {
      return ''
    }
  })
}
