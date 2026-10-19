import { describe, expect, it } from 'vitest'
import { approvedUrls, isApprovedHref, sanitizeReplyLinks } from './links.js'

describe('approved links', () => {
  it('come from the knowledge base plus the site pages', () => {
    expect(approvedUrls.has('https://github.com/k8mikhailova/stockadvisor')).toBe(true)
    expect(isApprovedHref('https://stockadvisor.streamlit.app/')).toBe(true)
    expect(isApprovedHref('https://stockadvisor.streamlit.app')).toBe(true)
    expect(isApprovedHref('/contact')).toBe(true)
    expect(isApprovedHref('/secret')).toBe(false)
    expect(isApprovedHref('https://github.com/k8mikhailova/made-up-repo')).toBe(false)
    expect(isApprovedHref('javascript:alert(1)')).toBe(false)
  })
})

describe('sanitizeReplyLinks', () => {
  it('keeps approved markdown links and bare URLs', () => {
    const text =
      'See [View the project on GitHub](https://github.com/k8mikhailova/StockAdvisor), or https://stockadvisor.streamlit.app/. Also [Contact page](/contact).'
    expect(sanitizeReplyLinks(text)).toBe(text)
  })

  it('unlinks invented or unsafe links', () => {
    expect(sanitizeReplyLinks('Try [this demo](https://evil.example/phish) now.')).toBe('Try this demo now.')
    expect(sanitizeReplyLinks('Click [here](javascript:alert(1)).')).toBe('Click here.')
    expect(sanitizeReplyLinks('Code at https://github.com/k8mikhailova/fake-repo.')).toBe('Code at github.com.')
    expect(sanitizeReplyLinks('Go to [Projects](/projects).')).toBe('Go to Projects.')
  })
})
