import { ArrowIcon } from '../components/ui/ArrowIcon'
import { MaybeLink } from '../components/ui/MaybeLink'
import { Reveal } from '../components/ui/Reveal'
import { contact, site, type SiteLink } from '../content/site'
import styles from './Contact.module.css'

const contactLinks: SiteLink[] = [
  {
    ...site.links.email,
    href: site.links.email.href && `mailto:${site.links.email.href.replace(/^mailto:/, '')}`,
  },
  site.links.linkedin,
  site.links.github,
  site.links.resume,
]

export function Contact() {
  return (
    <section id="contact" className={`container ${styles.section}`} aria-labelledby="contact-title">
      <div className={styles.grid}>
        <Reveal className={styles.intro}>
          <p className={styles.eyebrow}>Contact</p>
          <h2 id="contact-title" className={styles.title}>
            Say hi.
          </h2>
          <p className={styles.text}>{contact.intro}</p>
        </Reveal>

        <ul className={styles.links}>
          {contactLinks.map((link, i) => (
            <li key={link.label}>
              <Reveal delay={0.08 + i * 0.06} y={12}>
                <div className={styles.row}>
                  <span className={styles.label}>{link.label}</span>
                  <MaybeLink href={link.href} className={styles.value} placeholder={link.display}>
                    <span>{link.display}</span>
                    <ArrowIcon direction="up-right" className={styles.arrow} />
                  </MaybeLink>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
