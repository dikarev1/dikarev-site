import { describe, it, expect } from 'vitest'
import { TIMEZONES, getAllTimezones, getTimezonesByOffsetHour, searchTimezones, getOffsetHours } from './timezones'

describe('TIMEZONES constant', () => {
  it('contains at least 80 entries', () => {
    expect(TIMEZONES.length).toBeGreaterThanOrEqual(80)
  })

  it('every entry has a non-empty id, label, and region', () => {
    for (const tz of TIMEZONES) {
      expect(tz.id.length).toBeGreaterThan(0)
      expect(tz.label.length).toBeGreaterThan(0)
      expect(tz.region.length).toBeGreaterThan(0)
    }
  })

  it('all UTC offsets are within -720..+840 minutes', () => {
    for (const tz of TIMEZONES) {
      expect(tz.utcOffset).toBeGreaterThanOrEqual(-720)
      expect(tz.utcOffset).toBeLessThanOrEqual(840)
    }
  })

  it('all IANA ids are recognized by Intl.DateTimeFormat', () => {
    for (const tz of TIMEZONES) {
      // Etc/GMT+12 etc. are valid but may not format with timeZoneName
      // Just check that the constructor does not throw
      expect(() => new Intl.DateTimeFormat('en', { timeZone: tz.id })).not.toThrow()
    }
  })

  it('contains major world cities', () => {
    const ids = TIMEZONES.map(t => t.id)
    expect(ids).toContain('Europe/London')
    expect(ids).toContain('America/New_York')
    expect(ids).toContain('Asia/Tokyo')
    expect(ids).toContain('Asia/Kolkata')
    expect(ids).toContain('Pacific/Auckland')
    expect(ids).toContain('Pacific/Kiritimati')
    expect(ids).toContain('Pacific/Marquesas')
  })

  it('includes fractional UTC offset zones', () => {
    const offsets = TIMEZONES.map(t => t.utcOffset)
    expect(offsets).toContain(-570) // UTC-9:30 Marquesas
    expect(offsets).toContain(-210) // UTC-3:30 St Johns
    expect(offsets).toContain(210)  // UTC+3:30 Tehran
    expect(offsets).toContain(270)  // UTC+4:30 Kabul
    expect(offsets).toContain(330)  // UTC+5:30 Kolkata
    expect(offsets).toContain(345)  // UTC+5:45 Kathmandu
    expect(offsets).toContain(525)  // UTC+8:45 Eucla
    expect(offsets).toContain(765)  // UTC+12:45 Chatham
  })
})

describe('getAllTimezones', () => {
  it('returns same count as TIMEZONES', () => {
    expect(getAllTimezones()).toHaveLength(TIMEZONES.length)
  })

  it('returns copies (immutable)', () => {
    const result = getAllTimezones()
    result[0].label = 'mutated'
    expect(TIMEZONES[0].label).not.toBe('mutated')
  })
})

describe('getTimezonesByOffsetHour', () => {
  it('returns only entries matching the rounded hour offset', () => {
    const results = getTimezonesByOffsetHour(0)
    expect(results.length).toBeGreaterThan(0)
    for (const tz of results) {
      expect(Math.round(tz.utcOffset / 60)).toBe(0)
    }
  })

  it('includes London at offset hour 0', () => {
    const results = getTimezonesByOffsetHour(0)
    expect(results.some(t => t.id === 'Europe/London')).toBe(true)
  })

  it('includes Tokyo at offset hour +9', () => {
    const results = getTimezonesByOffsetHour(9)
    expect(results.some(t => t.id === 'Asia/Tokyo')).toBe(true)
  })

  it('returns empty array for an offset with no timezones', () => {
    expect(getTimezonesByOffsetHour(99)).toHaveLength(0)
  })

  it('Kolkata (UTC+5:30) rounds to hour 6', () => {
    // 330 / 60 = 5.5, Math.round(5.5) = 6
    const results = getTimezonesByOffsetHour(6)
    expect(results.some(t => t.id === 'Asia/Kolkata')).toBe(true)
  })
})

describe('searchTimezones', () => {
  it('returns all timezones for empty query', () => {
    expect(searchTimezones('')).toHaveLength(TIMEZONES.length)
  })

  it('finds London by city name', () => {
    const results = searchTimezones('london')
    expect(results.some(t => t.id === 'Europe/London')).toBe(true)
  })

  it('finds timezones by IANA id fragment', () => {
    const results = searchTimezones('Pacific')
    expect(results.length).toBeGreaterThan(0)
    for (const t of results) {
      const match =
        t.id.toLowerCase().includes('pacific') ||
        t.label.toLowerCase().includes('pacific') ||
        t.region.toLowerCase().includes('pacific')
      expect(match).toBe(true)
    }
  })

  it('is case-insensitive', () => {
    expect(searchTimezones('TOKYO')).toEqual(searchTimezones('tokyo'))
  })

  it('returns empty array when nothing matches', () => {
    expect(searchTimezones('xyzzy_no_match_12345')).toHaveLength(0)
  })

  it('returns copies (immutable)', () => {
    const results = searchTimezones('Tokyo')
    results[0].label = 'mutated'
    expect(TIMEZONES.find(t => t.id === 'Asia/Tokyo')?.label).not.toBe('mutated')
  })
})

describe('getOffsetHours', () => {
  it('returns sorted array of unique offset hours', () => {
    const hours = getOffsetHours()
    for (let i = 1; i < hours.length; i++) {
      expect(hours[i]).toBeGreaterThan(hours[i - 1])
    }
  })

  it('includes -12 and +14', () => {
    const hours = getOffsetHours()
    expect(hours).toContain(-12)
    expect(hours).toContain(14)
  })

  it('contains only numbers', () => {
    for (const h of getOffsetHours()) {
      expect(typeof h).toBe('number')
    }
  })
})
