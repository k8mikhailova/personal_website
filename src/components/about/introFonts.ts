/**
 * Candidate fonts for the About intro, previewed locally with ?introFont=<id>.
 * Dev only: production keeps the site's body font (Geist) and loads none of these.
 * Once one is chosen, add it to index.html and set it on .intro for good.
 */
export const introFonts = [
  { id: 'geist', label: 'Geist (current)', family: 'var(--font-sans)', href: '' },
  {
    id: 'instrument',
    label: 'Instrument Sans',
    family: "'Instrument Sans', var(--font-sans)",
    href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&display=swap',
  },
  {
    id: 'dm',
    label: 'DM Sans',
    family: "'DM Sans', var(--font-sans)",
    href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600&display=swap',
  },
  {
    id: 'manrope',
    label: 'Manrope',
    family: "'Manrope', var(--font-sans)",
    href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap',
  },
] as const
