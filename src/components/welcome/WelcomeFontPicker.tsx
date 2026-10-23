import { useSearchParams } from 'react-router-dom'
import { welcomeFonts } from '../../content/welcome'
import styles from './WelcomeFontPicker.module.css'

/** Dev-only switcher for comparing the Welcome page's typewriter fonts in place. */
export function WelcomeFontPicker({ current }: { current: string }) {
  const [, setParams] = useSearchParams()
  return (
    <div className={styles.picker} role="group" aria-label="Preview font (local only)">
      {welcomeFonts.map((font) => (
        <button
          key={font.id}
          type="button"
          className={styles.option}
          aria-pressed={font.id === current}
          onClick={() => setParams({ font: font.id }, { replace: true })}
        >
          {font.label}
        </button>
      ))}
    </div>
  )
}
