import { describe, it, expect } from 'vitest'
import { getProfile, getRoles, getEducation, getContacts, getLanguages } from './resume'

describe('getProfile', () => {
  it('returns correct name and title', () => {
    const p = getProfile()
    expect(p.name).toBe('Pavel Dikarev')
    expect(p.title).toBe('Product Manager')
  })

  it('returns a non-empty summary', () => {
    expect(getProfile().summary.length).toBeGreaterThan(0)
  })

  it('returns a copy (immutable)', () => {
    const a = getProfile()
    const b = getProfile()
    a.name = 'mutated'
    expect(b.name).toBe('Pavel Dikarev')
  })
})

describe('getRoles', () => {
  it('returns 4 roles', () => {
    expect(getRoles()).toHaveLength(4)
  })

  it('every role has required fields', () => {
    for (const role of getRoles()) {
      expect(role.title.length).toBeGreaterThan(0)
      expect(role.company.length).toBeGreaterThan(0)
      expect(role.period.length).toBeGreaterThan(0)
      expect(role.bullets.length).toBeGreaterThan(0)
    }
  })

  it('includes Ecwid and InSoft companies', () => {
    const companies = getRoles().map(r => r.company)
    expect(companies).toContain('Ecwid by Lightspeed')
    expect(companies).toContain('InSoft Retail')
  })

  it('returns copies (immutable bullets array)', () => {
    const roles = getRoles()
    const original = roles[0].bullets.length
    roles[0].bullets.push('injected')
    expect(getRoles()[0].bullets).toHaveLength(original)
  })
})

describe('getEducation', () => {
  it('returns correct institution', () => {
    const edu = getEducation()
    expect(edu.institution).toBe('Kazan National Research Technical University')
  })

  it('returns period 2011 – 2015', () => {
    expect(getEducation().period).toBe('2011 – 2015')
  })

  it('returns a copy (immutable)', () => {
    const a = getEducation()
    a.institution = 'mutated'
    expect(getEducation().institution).toBe('Kazan National Research Technical University')
  })
})

describe('getContacts', () => {
  it('returns 4 contacts', () => {
    expect(getContacts()).toHaveLength(4)
  })

  it('includes LinkedIn, Phone, Email, Location', () => {
    const types = getContacts().map(c => c.type)
    expect(types).toContain('LinkedIn')
    expect(types).toContain('Phone')
    expect(types).toContain('Email')
    expect(types).toContain('Location')
  })

  it('every contact has a non-empty value', () => {
    for (const c of getContacts()) {
      expect(c.value.length).toBeGreaterThan(0)
    }
  })

  it('returns copies (immutable)', () => {
    const a = getContacts()
    a[0].value = 'mutated'
    expect(getContacts()[0].value).not.toBe('mutated')
  })
})

describe('getLanguages', () => {
  it('returns 2 languages', () => {
    expect(getLanguages()).toHaveLength(2)
  })

  it('includes Russian native and English B2', () => {
    const langs = getLanguages()
    const russian = langs.find(l => l.name === 'Russian')
    const english = langs.find(l => l.name === 'English')
    expect(russian?.level).toBe('Native')
    expect(english?.level).toBe('B2')
  })

  it('returns copies (immutable)', () => {
    const a = getLanguages()
    a[0].name = 'mutated'
    expect(getLanguages()[0].name).not.toBe('mutated')
  })
})
