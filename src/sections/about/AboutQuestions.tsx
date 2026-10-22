import { Reveal } from '../../components/ui/Reveal'
import { RichText } from '../../components/ui/RichText'
import { questions } from '../../content/about'
import styles from './AboutQuestions.module.css'

/**
 * Kate's six questions, laid out like an editorial spread on the page's
 * 12-column grid: a large statement, a full-width row, then side-by-side pairs.
 * Layout hints live in the content (src/content/about.ts).
 */
export function AboutQuestions({ className }: { className?: string }) {
  return (
    <section className={`${styles.section} ${className ?? ''}`} aria-labelledby="questions-title">
      <h2 id="questions-title" className="sr-only">
        A few questions about me
      </h2>

      <dl className={styles.list}>
        {questions.map((item, i) => (
          <Reveal key={item.question} className={`${styles.item} ${styles[item.layout]}`} delay={(i % 2) * 0.06} y={14}>
            <dt className={styles.question}>{item.question}</dt>
            <dd className={styles.answer}>
              <RichText text={item.answer} />
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}
