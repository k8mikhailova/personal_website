import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { site } from '../content/site'
import { welcome, type WelcomeCaption } from '../content/welcome'
import styles from './WelcomePage.module.css'

type Mode = 'video' | 'timer'

const ease = [0.22, 1, 0.36, 1] as const
const finalCaption = [...welcome.captions].reverse().find((c) => c.end === undefined) ?? null

/** Which caption is on screen at time t (seconds), or null. */
function captionAt(t: number): WelcomeCaption | null {
  const live = welcome.captions.filter((c) => t >= c.start && (c.end === undefined || t < c.end))
  return live[live.length - 1] ?? null
}

/**
 * /welcome: a full-screen scene (video or still) with timed HTML captions and
 * a menu that fades in at the end. The sequence follows the video's own clock
 * when a video plays, and a simple timer otherwise (no video, autoplay
 * blocked, or the file fails), so it never depends on the asset.
 */
export function WelcomePage() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const rafRef = useRef(0)
  const modeRef = useRef<Mode>('timer')
  const timerStartRef = useRef(0)

  const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
  const videoSrc = (isPhone && welcome.media.mobileVideo) || welcome.media.video
  const [videoFailed, setVideoFailed] = useState(!videoSrc)
  const hasVideo = Boolean(videoSrc) && !videoFailed

  const [caption, setCaption] = useState<WelcomeCaption | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [focusMenu, setFocusMenu] = useState(false)
  // Reduced motion rests on the last frame (as an image) until the visitor presses Replay.
  const [showStill, setShowStill] = useState(Boolean(reduceMotion))

  const stopClock = () => cancelAnimationFrame(rafRef.current)

  /** Reads the current time and updates captions/menu only when they change. */
  const startClock = useCallback(() => {
    stopClock()
    const tick = () => {
      const video = videoRef.current
      const t =
        modeRef.current === 'video' && video ? video.currentTime : (performance.now() - timerStartRef.current) / 1000
      const next = captionAt(t)
      setCaption((current) => (current?.id === next?.id ? current : next))
      if (t >= welcome.menuAt) {
        setMenuOpen(true)
        return // Sequence done; the menu stays until the visitor chooses.
      }
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
    setMenuOpen(false)
    setCaption(null)
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
    setCaption(finalCaption)
    setMenuOpen(true)
    setFocusMenu(true)
  }, [])

  // Start once. With reduced motion, open on the final state with no autoplay.
  useEffect(() => {
    if (reduceMotion) {
      setShowStill(true)
      setCaption(finalCaption)
      setMenuOpen(true)
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
  const words = caption?.text.split(' ') ?? []

  return (
    <div
      className={`${styles.stage} ${menuOpen ? styles.menuOpen : ''}`}
      style={{ '--focus': welcome.media.focus, '--focus-portrait': welcome.media.portraitFocus } as CSSProperties}
    >
      <title>{`Welcome · ${site.name}`}</title>

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
          onEnded={() => {
            // Hold the last frame and show the menu.
            stopClock()
            setCaption(finalCaption)
            setMenuOpen(true)
          }}
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
          <AnimatePresence mode="wait">
            {caption && (
              <motion.p
                key={caption.id}
                className={styles.caption}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.45, ease } }}
              >
                {words.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    {i > 0 && ' '}
                    <motion.span
                      className={styles.word}
                      initial={{ opacity: 0, y: '0.35em', filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.8, ease, delay: 0.05 + i * 0.07 }}
                    >
                      {word}
                    </motion.span>
                  </Fragment>
                ))}
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
