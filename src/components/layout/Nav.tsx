import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks, site } from '../../content/site'
import styles from './Nav.module.css'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={`container ${styles.nav}`} aria-label="Main">
        <Link to="/home" className={styles.name}>
          {site.name}
        </Link>

        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
