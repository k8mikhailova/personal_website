import { describe, expect, it } from 'vitest'
import { welcome } from '../content/welcome'
import { finalState, sequenceAt } from './welcomeSequence'

const timing = { greetingAt: 3, charsPerSecond: 10, inviteDelay: 0.5, menuDelay: 0.3, fallbackLength: 8 }
const end = 8

describe('welcome sequence', () => {
  it('shows nothing before the greeting starts', () => {
    expect(sequenceAt(2.9, end, timing)).toEqual({ caption: null, typed: 0, menu: false })
  })

  it('types the greeting from greetingAt at the configured speed', () => {
    expect(sequenceAt(3, end, timing)).toMatchObject({ caption: 'greeting', typed: 0 })
    expect(sequenceAt(3.55, end, timing)).toMatchObject({ caption: 'greeting', typed: 5 })
  })

  it('holds the full greeting until the video ends', () => {
    expect(sequenceAt(7.9, end, timing)).toMatchObject({ caption: 'greeting', typed: welcome.greeting.length })
  })

  it('clears the greeting at the end, then types the invite after the delay', () => {
    expect(sequenceAt(8.2, end, timing).caption).toBeNull()
    expect(sequenceAt(8.5, end, timing)).toMatchObject({ caption: 'invite', typed: 0, menu: false })
    expect(sequenceAt(9, end, timing)).toMatchObject({ caption: 'invite', typed: 5, menu: false })
  })

  it('opens the menu only after the invite is fully typed', () => {
    const inviteDone = end + 0.5 + welcome.invite.length / 10
    expect(sequenceAt(inviteDone + 0.29, end, timing)).toMatchObject({ typed: welcome.invite.length, menu: false })
    expect(sequenceAt(inviteDone + 0.3, end, timing)).toEqual(finalState)
  })

  it('follows a different video length', () => {
    expect(sequenceAt(9, 12, timing).caption).toBe('greeting')
  })
})
