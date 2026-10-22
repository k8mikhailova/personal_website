/**
 * /welcome — the cinematic intro. Everything you'd change when the real video
 * exists lives here: the footage, caption wording and timing, and where the
 * captions and menu sit so they don't cover you.
 */

export type WelcomeCaption = {
  id: string
  text: string
  /** Seconds from the start of the sequence (video time when a video plays). */
  start: number
  /** When it fades out. Leave undefined to keep it on screen (it then heads the menu). */
  end?: number
}

export const welcome = {
  media: {
    /**
     * Video shown on wider screens. Put files in /public/welcome/ and reference
     * them here. Set to '' to run the sequence over the still image only.
     */
    video: '/welcome/placeholder-1080.mp4',
    /** Optional lighter file for phones (≤ 900px wide). '' = use `video`. */
    mobileVideo: '/welcome/placeholder-720.mp4',
    /** Still image: shown while the video loads, if it can't play, and when there's no video. */
    poster: '/welcome/placeholder-poster.jpg',
    /** Crop focus for the footage (CSS object-position), e.g. '50% 40%' keeps the upper middle in view. */
    focus: '50% 50%',
  },

  captions: [
    { id: 'greeting', text: 'Oh, hey. Thanks for stopping by!', start: 2.5, end: 5.8 },
    { id: 'invite', text: 'What would you like to see?', start: 6.4 },
  ] satisfies WelcomeCaption[],

  /** Seconds at which the menu fades in. It also appears as soon as the video ends, or on Skip. */
  menuAt: 8,

  /** Where things sit, so they stay clear of you in the final shot. */
  layout: {
    /** Horizontal side for captions and menu. */
    side: 'left' as 'left' | 'right',
    /** Vertical anchor for the caption/menu block. */
    vertical: 'bottom' as 'bottom' | 'center',
  },

  menu: [
    { label: 'My work', subtitle: 'Experience & projects', to: '/' },
    { label: 'About me', subtitle: 'Get to know me', to: '/about' },
    { label: 'Ask my AI', subtitle: 'Talk to my assistant', to: '/about#ask-ai' },
    { label: 'Get in touch', subtitle: 'Contact', to: '/contact' },
  ],
}
