import { welcome } from '../content/welcome'

export type CaptionId = 'greeting' | 'invite'

export type SequenceState = {
  /** Which caption is on screen, or null between captions. */
  caption: CaptionId | null
  /** How many characters of it have been typed. */
  typed: number
  /** True once the menu should show. The sequence is over at that point. */
  menu: boolean
}

export const captionText: Record<CaptionId, string> = {
  greeting: welcome.greeting,
  invite: welcome.invite,
}

/** The finished state: invite fully typed, menu showing (Skip, reduced motion). */
export const finalState: SequenceState = { caption: 'invite', typed: welcome.invite.length, menu: true }

export const startState: SequenceState = { caption: null, typed: 0, menu: false }

/**
 * What's on screen at sequence time t (seconds), given when the video ends.
 * Video time drives everything up to the end; after that the clock simply
 * keeps counting from the end, since there's no more playback to follow.
 */
export function sequenceAt(t: number, end: number, timing = welcome.timing): SequenceState {
  const { greetingAt, charsPerSecond, inviteDelay, menuDelay } = timing
  const typedSince = (start: number, text: string) => Math.min(text.length, Math.floor((t - start) * charsPerSecond))

  const inviteAt = end + inviteDelay
  const inviteDone = inviteAt + welcome.invite.length / charsPerSecond

  if (t >= inviteDone + menuDelay) return finalState
  if (t >= inviteAt) return { caption: 'invite', typed: typedSince(inviteAt, welcome.invite), menu: false }
  if (t >= end) return startState // The greeting fades out before the invite types in.
  if (t >= greetingAt) return { caption: 'greeting', typed: typedSince(greetingAt, welcome.greeting), menu: false }
  return startState
}

export function sameState(a: SequenceState, b: SequenceState) {
  return a.caption === b.caption && a.typed === b.typed && a.menu === b.menu
}
