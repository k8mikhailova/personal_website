import { FlowField } from '../components/hero/FlowField'
import { ArrowIcon } from '../components/ui/ArrowIcon'
import { Reveal } from '../components/ui/Reveal'
import { contactPage, site, type SiteLink } from '../content/site'
import styles from './ContactPage.module.css'

type ContactRow = SiteLink & { download?: boolean }

const rows: ContactRow[] = [
  {
    ...site.links.email,
    href: site.links.email.href && `mailto:${site.links.email.href.replace(/^mailto:/, '')}`,
  },
  site.links.github,
  site.links.linkedin,
  { ...site.links.resume, download: true },
]

export function ContactPage() {
  return (
    <>
      <title>{`Contact · ${site.name}`}</title>

      <section className={`container ${styles.section}`} aria-labelledby="contact-title">
        <Reveal>
          <h1 id="contact-title" className={styles.title}>
            {contactPage.title}
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className={styles.intro}>{contactPage.intro}</p>
        </Reveal>

        <ul className={styles.list}>
          {rows.map((row, i) => (
            <li key={row.label}>
              <Reveal delay={0.14 + i * 0.06} y={12}>
                <div className={styles.row}>
                  <span className={styles.label}>{row.label}</span>
                  {row.href ? (
                    <a
                      href={row.href}
                      className={styles.value}
                      {...(row.download
                        ? { download: '' }
                        : /^https?:\/\//.test(row.href)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                    >
                      <span>{row.download ? 'Download PDF' : row.display}</span>
                      <ArrowIcon direction={row.download ? 'down' : 'up-right'} className={styles.arrow} />
                    </a>
                  ) : (
                    <span className="placeholder" title="Placeholder: add this link in src/content/site.ts">
                      {row.display}
                    </span>
                  )}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.band} aria-hidden="true">
        <FlowField center={0.5} mobileCenter={0.5} lineCount={18} />
      </div>
    </>
  )
}
