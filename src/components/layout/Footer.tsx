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
      <button type="button" className={styles.top} onClick={() => window.scrollTo({ top: 0 })}>
        Back to top <ArrowIcon direction="up" className={styles.arrow} />
      </button>
    </footer>
  )
}
