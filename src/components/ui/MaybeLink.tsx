import type { ReactNode } from 'react'

type MaybeLinkProps = {
  href: string
  children: ReactNode
  className?: string
  /** Shown inside the placeholder when there's no href yet. */
  placeholder?: string
}

/**
 * Renders a link when `href` is set, otherwise a visibly marked placeholder.
 * Lets the page ship before every URL exists without pretending it does.
 */
export function MaybeLink({ href, children, className, placeholder }: MaybeLinkProps) {
  if (!href) {
    return (
      <span className="placeholder" title="Placeholder: add this link in src/content/site.ts">
        {placeholder ?? children}
      </span>
    )
  }

  const isExternal = /^https?:\/\//.test(href) || href.endsWith('.pdf')
  return (
    <a
      href={href}
      className={className}
      {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
