import styles from './Tags.module.css'

export function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className={styles.tags} aria-label="Tools used">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}
