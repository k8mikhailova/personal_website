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
    video: '/welcome/cafe-1080.mp4',
    /** Optional lighter file for phones (≤ 900px wide). '' = use `video`. */
    mobileVideo: '/welcome/cafe-720.mp4',
    /** First frame: shown while the video loads, so playback starts without a jump. */
    poster: '/welcome/cafe-poster.jpg',
    /** Last frame: the resting image for reduced motion, and the scene if the video can't play. */
    still: '/welcome/cafe-still.jpg',
    /** Crop focus (CSS object-position) on landscape screens. */
    focus: '50% 50%',
    /** Crop focus on portrait screens (phones), where the 16:9 shot loses its sides. Keeps her face in frame. */
    portraitFocus: '85% 40%',
  },

  captions: [
    // Timed to the cafe clip (8s): she looks up at ~3s, waves ~4s, smiles from ~5s.
    { id: 'greeting', text: 'Oh, hey. Thanks for stopping by!', start: 3.2, end: 5.3 },
    { id: 'invite', text: 'What would you like to see?', start: 5.7 },
  ] satisfies WelcomeCaption[],

  /** Seconds at which the menu fades in. It also appears as soon as the video ends, or on Skip. */
  menuAt: 7,

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
