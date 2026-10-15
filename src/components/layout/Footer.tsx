import { site } from '../../content/site'
import { ArrowIcon } from '../ui/ArrowIcon'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <p>
        © {year} {site.name}
      </p>
      <a href="#top" className={styles.top}>
        Back to top <ArrowIcon direction="up" className={styles.arrow} />
      </a>
    </footer>
  )
}
