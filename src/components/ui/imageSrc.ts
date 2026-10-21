import type { ResponsiveImage } from '../../content/about'

/** URL of one width from a responsive WebP set. */
export const srcFor = (image: ResponsiveImage, width: number) => `${image.base}-${width}.webp`
