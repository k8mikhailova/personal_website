import { useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { askKate, askKateErrors } from '../../content/askKate'
import { ArrowIcon } from '../ui/ArrowIcon'
import { Reveal } from '../ui/Reveal'
import { RichText } from '../ui/RichText'
import styles from './AskKate.module.css'

type Message = { id: number; role: 'user' | 'assistant'; content: string }

/** Matches the server's limits in chatbot/limits.ts. */
const MAX_CHARS = 500
const HISTORY = 8

/**
 * "Ask Kate": a small chat about Kate's background, backed by /api/chat.
 * Nothing is stored; the conversation lives only in this component's state.
 */
export function AskKate() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const nextId = useRef(0)
  const titleId = useId()
  const inputId = useId()

  useEffect(() => () => abortRef.current?.abort(), [])

  // Keep the newest message in view, scrolling only inside the conversation box.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [messages, pending, error, reduceMotion])

  async function request(history: Message[]) {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setPending(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-HISTORY).map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      })
      const data = (await res.json().catch(() => ({}))) as { reply?: unknown; error?: unknown }
      if (!res.ok || typeof data.reply !== 'string') {
        throw new Error(typeof data.error === 'string' ? data.error : 'default')
      }
      const reply = data.reply
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', content: reply }])
    } catch (err) {
      if (controller.signal.aborted) return
      const code = !navigator.onLine ? 'offline' : (err as Error).message
      setError(askKateErrors[code] ?? askKateErrors.default)
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        setPending(false)
      }
    }
  }

  function send(text: string) {
    const question = text.trim().slice(0, MAX_CHARS)
    if (!question || pending) return
    const history = [...messages, { id: nextId.current++, role: 'user' as const, content: question }]
    setMessages(history)
    setInput('')
    void request(history)
    inputRef.current?.focus()
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    send(input)
  }

  function startOver() {
    abortRef.current?.abort()
    abortRef.current = null
    setPending(false)
    setMessages([])
    setError(null)
    inputRef.current?.focus()
  }

  const started = messages.length > 0
  const nearLimit = input.length > MAX_CHARS - 80

  return (
    <section className={`container ${styles.section}`} aria-labelledby={titleId}>
      <Reveal>
        <h2 id={titleId} className={styles.title}>
          {askKate.title}
        </h2>
        <p className={styles.description}>{askKate.description}</p>
      </Reveal>

      <Reveal delay={0.08} className={styles.panel}>
        {!started ? (
          <div className={styles.starters}>
            <p className={styles.startersLabel}>Try asking</p>
            <ul className={styles.starterList}>
              {askKate.starters.map((starter) => (
                <li key={starter}>
                  <button type="button" className={styles.starter} onClick={() => send(starter)}>
                    {starter}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-relevant="additions" tabIndex={0} aria-label="Conversation">
            {messages.map((message) =>
              message.role === 'user' ? (
                <div key={message.id} className={styles.user}>
                  <span className="sr-only">You: </span>
                  {message.content}
                </div>
              ) : (
                <div key={message.id} className={styles.assistant}>
                  <span className={styles.assistantLabel}>{askKate.assistantLabel}</span>
                  {message.content.split(/\n{2,}/).map((paragraph, i) => (
                    <p key={i}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              ),
            )}

            {pending && (
              <div className={styles.assistant}>
                <span className={styles.assistantLabel}>{askKate.assistantLabel}</span>
                <span className={styles.typing} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="sr-only">Thinking…</span>
              </div>
            )}

            {error && (
              <div className={styles.error} role="alert">
                <p>{error}</p>
                <button type="button" className={styles.textButton} onClick={() => void request(messages)}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor={inputId} className="sr-only">
            Ask a question about Kate
          </label>
          <input
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={askKate.placeholder}
            maxLength={MAX_CHARS}
            autoComplete="off"
            enterKeyHint="send"
          />
          {nearLimit && (
            <span className={styles.counter} aria-live="polite">
              {MAX_CHARS - input.length}
            </span>
          )}
          <button type="submit" className={styles.send} disabled={pending || !input.trim()} aria-label="Send">
            <ArrowIcon direction="up" />
          </button>
        </form>
      </Reveal>

      <div className={styles.footer}>
        <p>{askKate.disclaimer}</p>
        {started && (
          <button type="button" className={styles.textButton} onClick={startOver}>
            Start over
          </button>
        )}
      </div>
    </section>
  )
}
