import { Fragment } from 'react'
import { AgeCounter } from './AgeCounter'
import styles from './IntroText.module.css'

// {age} → live age counter, **text** → semibold, [text](#id) → in-page link.
const TOKEN = /(\{age\}|\*\*[^*]+\*\*|\[[^\]]+\]\(#[^)]+\))/

/** The About intro, written in content with a few light markers. */
export function IntroText({ text, birthDate }: { text: string; birthDate: string }) {
  return text.split(TOKEN).map((part, i) => {
    if (part === '{age}') return <AgeCounter key={i} birthDate={birthDate} />
    if (part.startsWith('**')) return <strong key={i} className={styles.strong}>{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\((#[^)]+)\)$/)
    if (link)
      return (
        <a key={i} href={link[2]} className={styles.link}>
          {link[1]}
        </a>
      )
    return <Fragment key={i}>{part}</Fragment>
  })
}
