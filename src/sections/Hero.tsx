import { FlowField } from '../components/hero/FlowField'
import { RotatingText } from '../components/hero/RotatingText'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { MaybeLink } from '../components/ui/MaybeLink'
import { Reveal } from '../components/ui/Reveal'
import { hero, site } from '../content/site'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <FlowField className={styles.flow} />

      <div className={`container ${styles.inner}`}>
        <div className={styles.main}>
          <h1 id="hero-title" className={styles.title}>
            <Reveal as="span" y={12}>
              <span className={styles.greeting}>{hero.greeting}</span>
            </Reveal>
            <Reveal as="span" delay={0.12} y={24}>
              <span className={styles.headline}>
                <span className={styles.lead}>{hero.lead} </span>
                <RotatingText phrases={hero.phrases} className={styles.rotating} />
              </span>
            </Reveal>
          </h1>

          <Reveal delay={0.3}>
            <p className={styles.intro}>{hero.intro}</p>
          </Reveal>

          <Reveal delay={0.42} className={styles.actions}>
            <a href="#projects" className={styles.primary}>
              See my projects
              <ArrowIcon direction="down" className={styles.primaryArrow} />
            </a>
            <MaybeLink
              href={site.links.resume.href}
              className={`${styles.secondary} link-underline`}
              placeholder="Resume (PDF coming soon)"
            >
              Resume
            </MaybeLink>
          </Reveal>
        </div>

        <Reveal delay={0.55} y={12}>
          <dl className={styles.facts}>
            {hero.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>
                  <span className={styles.factValue}>{fact.value}</span>
                  {fact.detail && <span className={styles.factDetail}>{fact.detail}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
