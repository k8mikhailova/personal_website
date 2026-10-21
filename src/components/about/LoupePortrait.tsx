import { useEffect, useRef } from 'react'
import type { ResponsiveImage as ImageSet } from '../../content/about'
import { srcFor } from '../ui/imageSrc'
import { ResponsiveImage } from '../ui/ResponsiveImage'
import styles from './LoupePortrait.module.css'

type LoupePortraitProps = {
  image: ImageSet
  alt: string
  /** CSS object-position for the crop, e.g. '52% 42%'. */
  focus?: string
  sizes: string
  className?: string
}

const LENS = 190 // px
const ZOOM = 2.4

/**
 * The portrait, with a round magnifying lens that follows the cursor on
 * devices with a fine pointer — a nod to the magnifying glass in the photo.
 * Purely visual: hidden from assistive tech and absent on touch screens.
 */
export function LoupePortrait({ image, alt, focus = '50% 50%', sizes, className }: LoupePortraitProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const lens = lensRef.current
    if (!frame || !lens) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const [fx, fy] = focus.split(' ').map((v) => parseFloat(v) / 100)
    let raf = 0

    const move = (event: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = frame.getBoundingClientRect()
        // Where the cropped (object-fit: cover) image actually sits inside the frame.
        const scale = Math.max(rect.width / image.width, rect.height / image.height)
        const shownW = image.width * scale
        const shownH = image.height * scale
        const offsetX = (rect.width - shownW) * fx
        const offsetY = (rect.height - shownH) * fy
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        lens.style.transform = `translate(${x - LENS / 2}px, ${y - LENS / 2}px)`
        lens.style.backgroundSize = `${shownW * ZOOM}px ${shownH * ZOOM}px`
        lens.style.backgroundPosition = `${-((x - offsetX) * ZOOM - LENS / 2)}px ${-((y - offsetY) * ZOOM - LENS / 2)}px`
      })
    }
    const enter = () => frame.setAttribute('data-loupe', 'on')
    const leave = () => frame.removeAttribute('data-loupe')

    frame.addEventListener('pointermove', move)
    frame.addEventListener('pointerenter', enter)
    frame.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      frame.removeEventListener('pointermove', move)
      frame.removeEventListener('pointerenter', enter)
      frame.removeEventListener('pointerleave', leave)
    }
  }, [focus, image.width, image.height])

  const largest = image.widths[image.widths.length - 1]

  return (
    <div ref={frameRef} className={`${styles.frame} ${className ?? ''}`}>
      <ResponsiveImage
        image={image}
        alt={alt}
        sizes={sizes}
        className={styles.image}
        style={{ objectPosition: focus }}
        loading="eager"
        fetchPriority="high"
      />
      <div
        ref={lensRef}
        className={styles.lens}
        style={{ width: LENS, height: LENS, backgroundImage: `url(${srcFor(image, largest)})` }}
        aria-hidden="true"
      />
    </div>
  )
}
