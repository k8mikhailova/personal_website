/**
 * Tuning knobs for the About page wind animation (WindField).
 * Change these to adjust the feel; the page reloads with the new values.
 */
export const windSettings = {
  /** Average gap between strokes in px. Smaller = denser. */
  spacing: 22,
  /** Same, for screens narrower than 720px (fewer strokes = lighter on phones). */
  mobileSpacing: 34,
  /** How fast strokes drift along the current, in px per second. */
  speed: 20,
  /** How quickly the current itself changes shape. 1 = default, 0.5 = calmer. */
  flowChange: 1,
  /** Stroke length in px. */
  length: 11,
  /** Strongest stroke opacity (0–1). */
  maxOpacity: 0.55,
  /** Radius in px around the cursor where strokes swirl. 0 turns it off. */
  cursorRadius: 140,
  /** How strongly strokes near the cursor turn to circle it (0–1). */
  cursorStrength: 0.9,
}
