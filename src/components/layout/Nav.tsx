import { useEffect, useState } from 'react'
import { navLinks, site } from '../../content/site'
import { MaybeLink } from '../ui/MaybeLink'
import styles from './Nav.module.css'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const headerClass = [styles.header, scrolled && styles.scrolled, menuOpen && styles.menuOpen]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClass}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <a href="#top" className={styles.name} onClick={() => setMenuOpen(false)}>
          {site.name}
        </a>

        <div className={styles.right}>
          <ul id="nav-links" className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.link} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            {site.links.resume.href && (
              <li className={styles.mobileOnly}>
                <a href={site.links.resume.href} className={styles.link} target="_blank" rel="noreferrer">
                  Resume
                </a>
              </li>
            )}
          </ul>
          <span className={styles.resumeSlot}>
            <MaybeLink href={site.links.resume.href} className={styles.resume} placeholder="Resume">
              Resume
            </MaybeLink>
          </span>
        </div>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.toggleLines} aria-hidden="true" />
          <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </nav>
    </header>
  )
}
