import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  eyebrow: string
  title: ReactNode
  id?: string
  description?: ReactNode
}

export function SectionHeader({ eyebrow, title, id, description }: SectionHeaderProps) {
  return (
    <Reveal className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
      {description && <p className={styles.description}>{description}</p>}
    </Reveal>
  )
}
