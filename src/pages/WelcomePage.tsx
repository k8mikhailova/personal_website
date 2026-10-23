import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { site } from '../content/site'
import { welcome } from '../content/welcome'
import styles from './WelcomePage.module.css'
import { captionText, finalState, sameState, sequenceAt, startState, type SequenceState } from './welcomeSequence'

type Mode = 'video' | 'timer'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * / and /welcome: a full-screen scene (video or still) with HTML captions
 * typed onto it and a menu that fades in at the end. The sequence follows the
 * video's own clock when a video plays, and a simple timer otherwise (no
 * video, autoplay blocked, or the file fails), so it never depends on the asset.
 */
export function WelcomePage() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const rafRef = useRef(0)
  const modeRef = useRef<Mode>('timer')
  const timerStartRef = useRef(0)
  const endedAtRef = useRef<number | null>(null)

  const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
  const videoSrc = (isPhone && welcome.media.mobileVideo) || welcome.media.video
  const [videoFailed, setVideoFailed] = useState(!videoSrc)
  const hasVideo = Boolean(videoSrc) && !videoFailed

  const [seq, setSeq] = useState<SequenceState>(startState)
  const menuOpen = seq.menu
  const [focusMenu, setFocusMenu] = useState(false)
  // Reduced motion rests on the last frame (as an image) until the visitor presses Replay.
  const [showStill, setShowStill] = useState(Boolean(reduceMotion))

  const stopClock = () => cancelAnimationFrame(rafRef.current)

  /**
   * Reads the sequence time each frame and updates the screen only when the
   * typed text or menu changes. While the video plays, time is the video's
   * currentTime; once it has ended, time keeps counting on from its length.
   */
  const startClock = useCallback(() => {
    stopClock()
    const tick = () => {
      const video = videoRef.current
      const now = performance.now()
      let t: number
      let end: number = welcome.timing.fallbackLength
      if (modeRef.current === 'video' && video) {
        if (Number.isFinite(video.duration)) end = video.duration
        if (video.ended) {
          endedAtRef.current ??= now
          t = end + (now - endedAtRef.current) / 1000
        } else {
          t = video.currentTime
        }
      } else {
        t = (now - timerStartRef.current) / 1000
      }
      const next = sequenceAt(t, end)
      setSeq((current) => (sameState(current, next) ? current : next))
      if (next.menu) return // Sequence done; the menu stays until the visitor chooses.
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const runOnTimer = useCallback(() => {
    modeRef.current = 'timer'
    timerStartRef.current = performance.now()
    startClock()
  }, [startClock])

  /** Plays the sequence from the beginning. */
  const play = useCallback(() => {
    setShowStill(false)
    setSeq(startState)
    endedAtRef.current = null
    const video = videoRef.current
    if (video && hasVideo) {
      modeRef.current = 'video'
      video.currentTime = 0
      video
        .play()
        .then(startClock)
        .catch(() => runOnTimer()) // Autoplay blocked: keep the still, run captions on a timer.
    } else {
      runOnTimer()
    }
  }, [hasVideo, runOnTimer, startClock])

  /** Jumps straight to the menu. */
  const skip = useCallback(() => {
    stopClock()
    setSeq(finalState)
    setFocusMenu(true)
  }, [])

  // Start once. With reduced motion, open on the final state with no autoplay.
  useEffect(() => {
    if (reduceMotion) {
      setShowStill(true)
      setSeq(finalState)
      return
    }
    play()
    return stopClock
    // Run on mount only; replay is user-initiated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After Skip, move keyboard focus to the first option.
  useEffect(() => {
    if (menuOpen && focusMenu) {
      firstLinkRef.current?.focus({ preventScroll: true })
      setFocusMenu(false)
    }
  }, [menuOpen, focusMenu])

  // Escape skips the intro.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !menuOpen) skip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen, skip])

  const layoutClass = `${styles[welcome.layout.side]} ${styles[welcome.layout.vertical]}`
  const text = seq.caption ? captionText[seq.caption] : ''

  return (
    <div
      className={`${styles.stage} ${menuOpen ? styles.menuOpen : ''}`}
      style={{ '--focus': welcome.media.focus, '--focus-portrait': welcome.media.portraitFocus } as CSSProperties}
    >
      <title>{`Welcome · ${site.name}`}</title>
      {/* Welcome-only fonts: Special Elite for the message and menu, Plex Mono for small print. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Special+Elite&display=swap"
        precedence="default"
      />

      {/* ---------- Scene ---------- */}
      {hasVideo ? (
        <video
          ref={videoRef}
          className={styles.media}
          src={videoSrc}
          poster={welcome.media.poster}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => {
            setVideoFailed(true)
            if (!menuOpen) runOnTimer()
          }}
        />
      ) : (
        <img className={`${styles.media} ${styles.stillImage}`} src={welcome.media.still || welcome.media.poster} alt="" />
      )}
      {hasVideo && showStill && <img className={styles.media} src={welcome.media.still || welcome.media.poster} alt="" />}
      <div className={styles.shade} aria-hidden="true" />
      <div className={`${styles.menuShade} ${styles[welcome.layout.side]}`} aria-hidden="true" />

      {/* ---------- Top bar ---------- */}
      <header className={styles.topBar}>
        <Link to="/home" className={styles.wordmark}>
          {site.name}
        </Link>
        {menuOpen ? (
          <button type="button" className={styles.control} onClick={play}>
            Replay intro
          </button>
        ) : (
          <button type="button" className={styles.control} onClick={skip}>
            Skip intro
          </button>
        )}
      </header>

      {/* ---------- Captions + menu ---------- */}
      <main className={`${styles.content} ${layoutClass}`}>
        <div className={styles.captionSlot} aria-live="polite">
          {/* Both captions laid out invisibly in the same cell, so the slot is
              always as tall as the longer one and nothing below it moves. */}
          {Object.entries(captionText).map(([id, sizer]) => (
            <p key={id} className={`${styles.caption} ${id === 'invite' ? styles.invite : ''} ${styles.sizer}`} aria-hidden="true">
              {sizer}
            </p>
          ))}
          <AnimatePresence mode="wait">
            {seq.caption && (
              <motion.p
                key={seq.caption}
                className={`${styles.caption} ${seq.caption === 'invite' ? styles.invite : ''}`}
                exit={{ opacity: 0, y: -6, filter: 'blur(3px)', transition: { duration: 0.45, ease } }}
              >
                {/* The full sentence is laid out from the start (untyped letters
                    are invisible), so line breaks never change while typing.
                    Screen readers get the sentence once, not letter by letter. */}
                <span aria-hidden="true">
                  {/* One span per letter, laid out from the start: typing only
                      flips visibility, so nothing reflows or moves. The cursor
                      hangs off the last typed letter. */}
                  {[...text].map((char, i) => (
                    <span
                      key={i}
                      className={
                        i >= seq.typed
                          ? styles.untyped
                          : i === seq.typed - 1 && !menuOpen
                            ? `${styles.cursor} ${seq.typed < text.length ? styles.typing : ''}`
                            : undefined
                      }
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="sr-only">{text}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Always rendered so its space is reserved (no layout shift); hidden and
            unfocusable until the sequence reaches it. */}
        <motion.nav
          className={`${styles.menu} ${menuOpen ? '' : styles.menuHidden}`}
          aria-label="Explore the site"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          initial="hidden"
          animate={menuOpen ? 'shown' : 'hidden'}
          variants={{
            hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
            shown: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
          }}
        >
          <ol className={styles.menuList}>
            {welcome.menu.map((item, i) => (
              <motion.li
                key={item.to}
                variants={{
                  hidden: { opacity: 0, y: 14, transition: { duration: 0.3 } },
                  shown: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
                }}
              >
                <Link ref={i === 0 ? firstLinkRef : undefined} to={item.to} className={styles.menuLink}>
                  <span className={styles.menuNumber}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.menuText}>
                    <span className={styles.menuLabel}>{item.label}</span>
                    <span className={styles.menuSubtitle}>{item.subtitle}</span>
                  </span>
                  <ArrowIcon className={styles.menuArrow} />
                </Link>
              </motion.li>
            ))}
          </ol>
        </motion.nav>
      </main>
    </div>
  )
}
