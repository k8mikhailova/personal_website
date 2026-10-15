import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  /** Distance in px the element travels up while fading in. */
  y?: number
  /** Use 'span' inside headings and other inline-only contexts. */
  as?: 'div' | 'span'
}

/** Fades content up into place the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 20, as = 'div' }: RevealProps) {
  const Component = as === 'span' ? motion.span : motion.div
  return (
    <Component
      className={className}
      style={as === 'span' ? { display: 'block' } : undefined}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  )
}
