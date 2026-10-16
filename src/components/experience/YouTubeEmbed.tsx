import { useState } from 'react'
import { MediaPlaceholder } from '../ui/MediaPlaceholder'
import styles from './YouTubeEmbed.module.css'

type YouTubeEmbedProps = {
  videoId: string
  title: string
}

/**
 * Click-to-load YouTube player. Shows the thumbnail until someone presses play,
 * so the page doesn't load YouTube's player (or its cookies) up front.
 * Without a video ID it shows a placeholder.
 */
export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false)

  if (!videoId) {
    return (
      <div className={`lift-card ${styles.frame}`}>
        <MediaPlaceholder label="YouTube demo goes here" seed={title} variant="video" />
      </div>
    )
  }

  return (
    <div className={`lift-card ${styles.frame}`}>
      {playing ? (
        <iframe
          className={styles.iframe}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={`${title} demo video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)}>
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            className={styles.thumb}
            loading="lazy"
          />
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="sr-only">Play {title} demo video</span>
        </button>
      )}
    </div>
  )
}
