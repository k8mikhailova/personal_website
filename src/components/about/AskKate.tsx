import { useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode, type Ref } from 'react'
import { askKate, askKateErrors, starterTopics, suggestionTopics } from '../../content/askKate'
import { ArrowIcon } from '../ui/ArrowIcon'
import { Reveal } from '../ui/Reveal'
import styles from './AskKate.module.css'
import { ChatText } from './ChatText'
import { detectTopics, nextSuggestions, normalizeQuestion, starterSuggestions, type Suggestion } from './suggestions'

type LeaveState = 'idle' | 'saving' | 'saved' | 'failed' | 'rate_limited'

type Message = {
  id: number
  role: 'user' | 'assistant'
  content: string
  /** Set when the assistant couldn't answer and saving questions is configured. */
  leave?: { question: string; token: string; state: LeaveState }
}

/** Matches the server's limits in chatbot/limits.ts. */
const MAX_CHARS = 500
const HISTORY = 8
const SUGGESTION_COUNT = 4

const initialSuggestions = () => starterSuggestions(suggestionTopics, starterTopics)

/**
 * Kate's AI Assistant: a small chat about Kate's background, backed by /api/chat.
 * Nothing is stored; the conversation lives only in this component's state.
 */
type AskKateProps = {
  /**
   * Embedded: the page supplies the section heading and description, so the
   * panel shows a slim title bar instead and renders no <section> of its own.
   */
  embedded?: boolean
  className?: string
}

export function AskKate({ embedded = false, className }: AskKateProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions)
  // Questions already asked in this conversation (normalized). The ref is read when
  // an answer arrives; the state copy drives rendering.
  const askedRef = useRef<Set<string>>(new Set())
  const [asked, setAsked] = useState<ReadonlySet<string>>(() => new Set())
  const reduceMotion = useReducedMotion()

  const bodyRef = useRef<HTMLDivElement>(null)
  const lastReplyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const nextId = useRef(0)
  const titleId = useId()
  const inputId = useId()

  useEffect(() => () => abortRef.current?.abort(), [])

  // Scroll only inside the conversation area. A new reply is shown from its first
  // line (so long answers aren't half scrolled past); otherwise jump to the bottom.
  useEffect(() => {
    const body = bodyRef.current
    if (!body || messages.length === 0) return
    const behavior = reduceMotion ? 'auto' : 'smooth'
    const reply = lastReplyRef.current
    if (!pending && !error && messages.at(-1)?.role === 'assistant' && reply) {
      body.scrollTo({ top: Math.max(0, reply.offsetTop - 16), behavior })
    } else {
      body.scrollTo({ top: body.scrollHeight, behavior })
    }
  }, [messages, pending, error, reduceMotion])

  /** After an answer: refresh suggestions around what was just discussed. */
  function refreshSuggestions(question: string, reply: string, topic?: string) {
    const contextTopics = [...new Set([...(topic ? [topic] : []), ...detectTopics(`${question} ${reply}`, suggestionTopics)])]
    const askedNow = new Set(askedRef.current)
    setSuggestions((current) =>
      nextSuggestions({ topics: suggestionTopics, current, asked: askedNow, contextTopics, size: SUGGESTION_COUNT }),
    )
  }

  async function request(history: Message[], topic?: string) {
    const question = [...history].reverse().find((m) => m.role === 'user')?.content ?? ''
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
      const data = (await res.json().catch(() => ({}))) as { reply?: unknown; error?: unknown; questionToken?: unknown }
      if (!res.ok || typeof data.reply !== 'string') {
        throw new Error(typeof data.error === 'string' ? data.error : 'default')
      }
      const reply = data.reply
      const leave =
        typeof data.questionToken === 'string' ? { question, token: data.questionToken, state: 'idle' as const } : undefined
      setMessages((current) => [...current, { id: nextId.current++, role: 'assistant', content: reply, leave }])
      refreshSuggestions(question, reply, topic)
    } catch (err) {
      if (controller.signal.aborted) return
      const code = !navigator.onLine ? 'offline' : (err as Error).message
      setError(askKateErrors[code] ?? askKateErrors.default)
      // Keep 3–4 suggestions on screen even when a request fails.
      refreshSuggestions(question, '', topic)
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        setPending(false)
      }
    }
  }

  /** Saves one unanswered question, only after the visitor clicks to leave it. */
  async function leaveQuestion(messageId: number, honeypot: string) {
    const target = messages.find((m) => m.id === messageId)?.leave
    if (!target || target.state === 'saving' || target.state === 'saved') return
    const setState = (state: LeaveState) =>
      setMessages((current) => current.map((m) => (m.id === messageId && m.leave ? { ...m, leave: { ...m.leave, state } } : m)))

    setState('saving')
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: target.question, token: target.token, website: honeypot }),
      })
      setState(res.ok ? 'saved' : res.status === 429 ? 'rate_limited' : 'failed')
    } catch {
      setState('failed')
    }
  }

  function send(text: string, suggestion?: Suggestion) {
    const question = text.trim().slice(0, MAX_CHARS)
    if (!question || pending) return
    const history = [...messages, { id: nextId.current++, role: 'user' as const, content: question }]
    setMessages(history)
    askedRef.current.add(normalizeQuestion(question))
    setAsked(new Set(askedRef.current))
    setInput('')
    void request(history, suggestion?.topic)
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
    setSuggestions(initialSuggestions())
    askedRef.current = new Set()
    setAsked(new Set())
    inputRef.current?.focus()
  }

  const started = messages.length > 0
  const visibleSuggestions = suggestions.filter((s) => !asked.has(normalizeQuestion(s.text)))
  const nearLimit = input.length > MAX_CHARS - 80

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

  return (
    <Wrapper embedded={embedded} className={className} titleId={titleId}>
      <Reveal className={`${styles.panel} ${embedded ? styles.embedded : ''}`}>
        {/* ---------- Header ---------- */}
        <header className={styles.header}>
          <span className={styles.icon} aria-hidden="true">
            <SparkIcon />
          </span>
          <div className={styles.headerText}>
            {embedded ? (
              <p className={styles.title}>{askKate.title}</p>
            ) : (
              <>
                <h2 id={titleId} className={styles.title}>
                  {askKate.title}
                </h2>
                <p className={styles.description}>{askKate.description}</p>
              </>
            )}
          </div>
          {started && (
            <button type="button" className={styles.startOver} onClick={startOver}>
              Start over
            </button>
          )}
        </header>

        {/* ---------- Conversation (scrolls past a comfortable height) ---------- */}
        <div ref={bodyRef} className={styles.body} tabIndex={0} role="region" aria-label="Conversation with Kate’s AI assistant">
          <div className={styles.log} role="log" aria-live="polite" aria-relevant="additions">
            <AssistantMessage>
              <p>{askKate.welcome}</p>
            </AssistantMessage>

            {messages.map((message) =>
              message.role === 'user' ? (
                <div key={message.id} className={styles.user}>
                  <span className="sr-only">You: </span>
                  {message.content}
                </div>
              ) : (
                <AssistantMessage key={message.id} ref={message.id === lastAssistantId ? lastReplyRef : undefined}>
                  {message.content.split(/\n{2,}/).map((paragraph, i) => (
                    <p key={i}>
                      <ChatText text={paragraph} />
                    </p>
                  ))}
                  {message.leave && <LeaveQuestion state={message.leave.state} onLeave={(hp) => void leaveQuestion(message.id, hp)} />}
                </AssistantMessage>
              ),
            )}

            {pending && (
              <AssistantMessage>
                <span className={styles.typing} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="sr-only">Thinking…</span>
              </AssistantMessage>
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

          {/* Suggestions sit in the flow of the chat, like quick replies under the latest answer. */}
          {!pending && visibleSuggestions.length > 0 && (
            <div className={styles.suggestions}>
              <p className={styles.suggestionsLabel} id={`${inputId}-suggestions`}>
                {started ? 'Ask next' : 'Try asking'}
              </p>
              <ul className={styles.suggestionList} aria-labelledby={`${inputId}-suggestions`}>
                {visibleSuggestions.map((suggestion) => (
                  <li key={suggestion.text}>
                    <button type="button" className={styles.suggestion} onClick={() => send(suggestion.text, suggestion)}>
                      {suggestion.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ---------- Input ---------- */}
        <div className={styles.footer}>
          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor={inputId} className="sr-only">
              Your question for Kate’s AI assistant
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
          <p className={styles.disclaimer}>{askKate.disclaimer}</p>
        </div>
      </Reveal>
    </Wrapper>
  )
}

/** Standalone: its own <section> in the text column. Embedded: a plain region inside the page's section. */
function Wrapper({ embedded, className, titleId, children }: { embedded: boolean; className?: string; titleId: string; children: ReactNode }) {
  return embedded ? (
    <div className={className} role="region" aria-label="Chat with Kate’s AI assistant">
      {children}
    </div>
  ) : (
    <section className={`container ${styles.section} ${className ?? ''}`} aria-labelledby={titleId}>
      {children}
    </section>
  )
}

/** One reply from the assistant: small icon + label, then the message bubble. */
function AssistantMessage({ children, ref }: { children: ReactNode; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={styles.assistant}>
      <span className={styles.assistantLabel}>
        <span className={styles.avatar} aria-hidden="true">
          <SparkIcon />
        </span>
        {askKate.assistantLabel}
      </span>
      <div className={styles.bubble}>{children}</div>
    </div>
  )
}

/** "Leave it for Kate" option under an answer the assistant couldn't give. */
function LeaveQuestion({ state, onLeave }: { state: LeaveState; onLeave: (honeypot: string) => void }) {
  const text = askKate.leaveQuestion
  if (state === 'saved' || state === 'failed' || state === 'rate_limited') {
    const message = state === 'saved' ? text.saved : state === 'failed' ? text.failed : text.rateLimited
    return (
      <p className={`${styles.leave} ${state === 'saved' ? styles.leaveDone : ''}`} role="status">
        {state === 'saved' && <span className={styles.check} aria-hidden="true" />}
        {message}
      </p>
    )
  }
  return (
    <form
      className={styles.leave}
      onSubmit={(event) => {
        event.preventDefault()
        const honeypot = new FormData(event.currentTarget).get('website')
        onLeave(typeof honeypot === 'string' ? honeypot : '')
      }}
    >
      <span>{text.prompt}</span>
      {/* Hidden from people; bots that fill every field get ignored. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.honeypot} />
      <button type="submit" className={styles.leaveButton} disabled={state === 'saving'}>
        {state === 'saving' ? text.saving : text.button}
      </button>
    </form>
  )
}

/** Small four-point spark used as the assistant's icon. */
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M12 2.5c.6 5.1 2.9 7.4 8 8-5.1.6-7.4 2.9-8 8-.6-5.1-2.9-7.4-8-8 5.1-.6 7.4-2.9 8-8Z" fill="currentColor" />
      <path d="M19 15.5c.25 2 1.1 2.85 3 3.1-1.9.25-2.75 1.1-3 3.1-.25-2-1.1-2.85-3-3.1 1.9-.25 2.75-1.1 3-3.1Z" fill="currentColor" opacity="0.6" />
    </svg>
  )
}
