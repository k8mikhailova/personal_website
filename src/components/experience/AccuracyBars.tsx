import { motion } from 'motion/react'
import styles from './AccuracyBars.module.css'

type AccuracyBarsProps = {
  name: string
  before: number
  after: number
}

const ease = [0.22, 1, 0.36, 1] as const

/** Before/after bars for a percentage metric. Bars grow in when scrolled into view. */
export function AccuracyBars({ name, before, after }: AccuracyBarsProps) {
  const rows = [
    { label: 'Before', value: before, className: styles.before },
    { label: 'After', value: after, className: styles.after },
  ]

  return (
    <figure className={styles.figure}>
      <figcaption className="sr-only">
        {name} went from {before}% to {after}%.
      </figcaption>
      <div className={styles.rows} aria-hidden="true">
        {rows.map((row, i) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <div className={styles.track}>
              <motion.div
                className={`${styles.bar} ${row.className}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${row.value}%` }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1.2, ease, delay: 0.15 + i * 0.25 }}
              />
            </div>
            <span className={styles.value}>{row.value}%</span>
          </div>
        ))}
      </div>
      <p className={styles.delta} aria-hidden="true">
        <span className={styles.deltaValue}>+{after - before}</span> percentage points of {name.toLowerCase()}
      </p>
    </figure>
  )
}
