import { Fragment } from 'react'

/**
 * Renders a string where **double asterisks** mark bold text.
 * Keeps content files plain while allowing selective emphasis.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        // Odd indexes are the captured bold segments.
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}
