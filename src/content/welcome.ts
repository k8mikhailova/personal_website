/**
 * /welcome — the cinematic intro. Everything you'd change when the real video
 * exists lives here: the footage, caption wording and timing, and where the
 * captions and menu sit so they don't cover you.
 */

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

  /** Typed onto the screen while she looks up and waves. */
  greeting: 'Oh, hey. Thanks for stopping by.',
  /** Typed after the video ends; heads the menu. */
  invite: 'What would you like to see?',

  /**
   * Caption timing, in seconds of video time (the sequence follows the video's
   * own clock, so buffering can't knock it out of sync).
   */
  timing: {
    /** When the greeting starts typing: she looks up at the camera around 3s. */
    greetingAt: 3,
    /** Typing speed in characters per second. */
    charsPerSecond: 17,
    /** After the video ends: the greeting fades out, then the invite starts typing this much later. */
    inviteDelay: 0.6,
    /** After the invite is fully typed, the menu fades in this much later. */
    menuDelay: 0.35,
    /** Stands in for the video's length when it can't play (still image or autoplay blocked). */
    fallbackLength: 8,
  },

  /** Where things sit, so they stay clear of you in the final shot. */
  layout: {
    /** Horizontal side for captions and menu. */
    side: 'left' as 'left' | 'right',
    /** Vertical anchor for the caption/menu block. */
    vertical: 'bottom' as 'bottom' | 'center',
  },

  menu: [
    { label: 'My work', subtitle: 'Experience & projects', to: '/home' },
    { label: 'About me', subtitle: 'Get to know me', to: '/about' },
    { label: 'Ask my AI', subtitle: 'Talk to my assistant', to: '/about#ask-ai' },
    { label: 'Get in touch', subtitle: 'Contact', to: '/contact' },
  ],
}
