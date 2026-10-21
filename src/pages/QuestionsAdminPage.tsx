import { useCallback, useEffect, useState, type FormEvent } from 'react'
import styles from './QuestionsAdminPage.module.css'

type SavedQuestion = { id: string; question: string; createdAt: string; reviewed: boolean }

const TOKEN_KEY = 'questions-review-token'

type LoadResult =
  | { kind: 'ok'; questions: SavedQuestion[] }
  | { kind: 'unauthorized' | 'error'; message: string }

async function fetchQuestions(token: string): Promise<LoadResult> {
  const res = await fetch('/api/questions', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
  if (!res) return { kind: 'error', message: 'Couldn’t reach the server.' }
  if (res.status === 401) return { kind: 'unauthorized', message: 'That token didn’t work.' }
  if (res.status === 503) return { kind: 'error', message: 'Question saving isn’t configured on this deployment yet.' }
  if (!res.ok) return { kind: 'error', message: 'Something went wrong loading questions.' }
  const data = (await res.json()) as { questions: SavedQuestion[] }
  return { kind: 'ok', questions: data.questions }
}

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}

/**
 * Private review page for questions visitors left for Kate. Not linked
 * anywhere; every request needs the QUESTIONS_ADMIN_TOKEN, which is kept only
 * in this browser tab's session storage.
 */
export function QuestionsAdminPage() {
  const [token, setToken] = useState(readToken)
  const [draft, setDraft] = useState('')
  const [questions, setQuestions] = useState<SavedQuestion[] | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [showReviewed, setShowReviewed] = useState(false)

  const call = useCallback(
    (method: 'GET' | 'PATCH', body?: object) =>
      fetch('/api/questions', {
        method,
        headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      }),
    [token],
  )

  // Applies the result of a list request to the page state.
  const apply = useCallback((result: LoadResult) => {
    if (result.kind === 'ok') {
      setQuestions(result.questions)
      setStatus(null)
      return
    }
    if (result.kind === 'unauthorized') {
      try {
        sessionStorage.removeItem(TOKEN_KEY)
      } catch {
        /* ignore */
      }
      setToken('')
    }
    setStatus(result.message)
  }, [])

  const load = useCallback(() => fetchQuestions(token).then(apply), [token, apply])

  useEffect(() => {
    if (!token) return
    let cancelled = false
    void fetchQuestions(token).then((result) => {
      if (!cancelled) apply(result)
    })
    return () => {
      cancelled = true
    }
  }, [token, apply])

  function signIn(event: FormEvent) {
    event.preventDefault()
    const value = draft.trim()
    if (!value) return
    try {
      sessionStorage.setItem(TOKEN_KEY, value)
    } catch {
      /* ignore */
    }
    setDraft('')
    setToken(value)
  }

  async function toggle(question: SavedQuestion) {
    const res = await call('PATCH', { id: question.id, reviewed: !question.reviewed }).catch(() => null)
    if (!res?.ok) return setStatus('Couldn’t update that question.')
    setQuestions((current) => current?.map((q) => (q.id === question.id ? { ...q, reviewed: !q.reviewed } : q)) ?? null)
  }

  function signOut() {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      /* ignore */
    }
    setToken('')
    setQuestions(null)
  }

  const visible = questions?.filter((q) => showReviewed || !q.reviewed) ?? []
  const open = questions?.filter((q) => !q.reviewed).length ?? 0

  return (
    <>
      <title>Questions · Review</title>
      <meta name="robots" content="noindex, nofollow" />
      <section className={`container ${styles.page}`}>
        <h1 className={styles.title}>Questions left for Kate</h1>
        <p className={styles.note}>
          Private. Saved only when a visitor chose to leave an unanswered question. Nothing here is added to the
          assistant’s knowledge base automatically.
        </p>

        {!token ? (
          <form className={styles.signIn} onSubmit={signIn}>
            <label htmlFor="review-token">Review token</label>
            <input
              id="review-token"
              type="password"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoComplete="off"
            />
            <button type="submit">Open</button>
          </form>
        ) : (
          <div className={styles.toolbar}>
            <span>
              {open} to review{questions ? ` · ${questions.length} total` : ''}
            </span>
            <label className={styles.filter}>
              <input type="checkbox" checked={showReviewed} onChange={(event) => setShowReviewed(event.target.checked)} />
              Show reviewed
            </label>
            <button type="button" onClick={() => void load()}>
              Refresh
            </button>
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </div>
        )}

        {(status || (token && !questions)) && (
          <p className={styles.status} role="status">
            {status ?? 'Loading…'}
          </p>
        )}

        {token && questions && (
          <ul className={styles.list}>
            {visible.length === 0 && <li className={styles.empty}>Nothing to review.</li>}
            {visible.map((q) => (
              <li key={q.id} className={`${styles.item} ${q.reviewed ? styles.reviewed : ''}`}>
                <p className={styles.question}>{q.question}</p>
                <div className={styles.meta}>
                  <time dateTime={q.createdAt}>{new Date(q.createdAt).toLocaleString()}</time>
                  <button type="button" onClick={() => void toggle(q)}>
                    {q.reviewed ? 'Mark as not reviewed' : 'Mark as reviewed'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
