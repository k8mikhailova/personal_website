import { Fragment } from 'react'

// **bold** or [link text](https://url)
const TOKEN = /(\*\*.+?\*\*|\[[^\]]+\]\([^)\s]+\))/g
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/
// Only web links and on-site paths become links; anything else (e.g. javascript:) stays text.
const SAFE_HREF = /^(https?:\/\/|\/(?!\/))/i

/**
 * Renders a string where **double asterisks** mark bold text and
 * [text](url) marks a link. Keeps content files plain while allowing
 * selective emphasis. External links open in a new tab. Safe for untrusted
 * text such as chatbot replies: only http(s) and site-relative links render.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        const link = part.match(LINK)
        if (link && SAFE_HREF.test(link[2])) {
          const [, label, href] = link
          const external = /^https?:\/\//.test(href)
          return (
            <a key={i} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {label}
            </a>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
