import { useSearchParams } from 'react-router-dom'
import { introFonts } from './introFonts'
import styles from './IntroFontPicker.module.css'

/** Dev-only switcher for comparing intro fonts in place. Not rendered in production. */
export function IntroFontPicker({ current }: { current: string }) {
  const [, setParams] = useSearchParams()
  return (
    <div className={styles.picker} role="group" aria-label="Preview intro font (local only)">
      <span className={styles.label}>Intro font</span>
      {introFonts.map((font) => (
        <button
          key={font.id}
          type="button"
          className={styles.option}
          aria-pressed={font.id === current}
          onClick={() => setParams(font.id === 'geist' ? {} : { introFont: font.id }, { replace: true, preventScrollReset: true })}
        >
          {font.label}
        </button>
      ))}
    </div>
  )
}
