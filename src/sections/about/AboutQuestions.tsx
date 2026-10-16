import { Reveal } from '../../components/ui/Reveal'
import { RichText } from '../../components/ui/RichText'
import { questions } from '../../content/about'
import styles from './AboutQuestions.module.css'

/**
 * A few short questions and answers laid out like an editorial spread:
 * layout hints in the content decide whether each one is a large statement,
 * a full-width row, or half of a side-by-side pair.
 */
export function AboutQuestions() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="questions-title">
      <h2 id="questions-title" className="sr-only">
        A few questions
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
