// Site-wide content: name, navigation, and links.
// Empty `href` values render as clearly marked placeholders on the page.

export type SiteLink = {
  label: string
  href: string
  /** Text shown on the Contact page, e.g. the email address itself. */
  display: string
}

export const site = {
  name: 'Kate Mikhailova',
  description:
    'Kate Mikhailova graduated from UC Santa Cruz with a B.S. in Computer Science. Software development, data engineering, AI, and automation.',

  links: {
    // For email, put the plain address in both href and display.
    email: { label: 'Email', href: 'katemo03el@gmail.com', display: 'katemo03el@gmail.com' },
    github: { label: 'GitHub', href: 'https://github.com/k8mikhailova', display: 'github.com/k8mikhailova' },
    linkedin: {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/katemikhailova/',
      display: 'linkedin.com/in/katemikhailova',
    },
    // The PDF lives at /public/resume.pdf; replace that file to update it.
    resume: { label: 'Resume', href: '/resume.pdf', display: 'Download PDF' },
  } satisfies Record<string, SiteLink>,
}

export const navLinks = [
  { label: 'Home', to: '/home' },
  { label: 'Welcome', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const contactPage = {
  title: 'Say hi.',
  intro:
    "If you're hiring, working on something interesting, or just want to ask about anything on this site, email is the best way to reach me.",
}
