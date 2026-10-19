import { Link } from 'react-router-dom'
import { parseChatText } from './parseChatText'

/** Renders one paragraph of an assistant reply with safe, clickable links. */
export function ChatText({ text }: { text: string }) {
  return (
    <>
      {parseChatText(text).map((piece, i) => {
        if (piece.type === 'bold') return <strong key={i}>{piece.text}</strong>
        if (piece.type === 'text') return <span key={i}>{piece.text}</span>
        return piece.internal ? (
          <Link key={i} to={piece.href}>
            {piece.text}
          </Link>
        ) : (
          <a key={i} href={piece.href} target="_blank" rel="noopener noreferrer">
            {piece.text}
          </a>
        )
      })}
    </>
  )
}
