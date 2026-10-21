import type { CSSProperties } from 'react'
import type { ResponsiveImage as ImageSet } from '../../content/about'
import { srcFor } from './imageSrc'

type ResponsiveImageProps = {
  image: ImageSet
  alt: string
  /** Rendered width hint for the browser, e.g. '(min-width: 1100px) 40vw, 100vw'. */
  sizes: string
  className?: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/** WebP image with a width-based srcset; width/height attributes prevent layout shift. */
export function ResponsiveImage({ image, alt, sizes, className, style, loading = 'lazy', fetchPriority }: ResponsiveImageProps) {
  const middle = image.widths[Math.min(1, image.widths.length - 1)]
  return (
    <img
      className={className}
      src={srcFor(image, middle)}
      srcSet={image.widths.map((w) => `${srcFor(image, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={alt}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      style={style}
    />
  )
}
