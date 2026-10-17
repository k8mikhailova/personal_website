import { useEffect, useRef, useState, type MouseEvent } from 'react'
import styles from './SectionNav.module.css'

export type SectionNavItem = {
  /** id of the element to scroll to and track. */
  id: string
  label: string
}

/**
 * Small "on this page" list fixed in the left margin. Highlights the section
 * crossing a band ~35–40% down the viewport (IntersectionObserver), with the
 * top and bottom of the page handled explicitly. Hidden below wide desktop.
 */
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id)
  // While a click-triggered scroll is running, keep the clicked item active.
  const lockedRef = useRef(false)

  useEffect(() => {
    const ids = items.map((item) => item.id)
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    const inBand = new Map<string, boolean>()

    function pick() {
      if (lockedRef.current) return
      const doc = document.documentElement
      if (window.scrollY < 8) return setActive(ids[0])
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) return setActive(ids[ids.length - 1])
      const hit = ids.find((id) => inBand.get(id))
      // Between sections nothing is in the band; keep the previous one.
      if (hit) setActive(hit)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) inBand.set(entry.target.id, entry.isIntersecting)
        pick()
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    elements.forEach((el) => observer.observe(el))

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(pick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [items])

  function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setActive(id)
    lockedRef.current = true

    const unlock = () => {
      if (!lockedRef.current) return
      lockedRef.current = false
      window.removeEventListener('scrollend', unlock)
      window.clearTimeout(fallback)
      // Move keyboard focus to the section without jumping again.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    // 'scrollend' isn't everywhere yet, so also unlock after a generous delay.
    window.addEventListener('scrollend', unlock)
    const fallback = window.setTimeout(unlock, 1200)

    if (id === items[0]?.id) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <nav className={styles.nav} aria-label="On this page">
      <ol className={styles.list}>
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.link} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(event) => jumpTo(event, item.id)}
              >
                <span className={styles.dot} aria-hidden="true" />
                {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
