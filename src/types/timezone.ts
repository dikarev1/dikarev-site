export interface TimezoneEntry {
  id: string
  label: string
  utcOffset: number // minutes
  region: string
}

export interface TimezoneGroup {
  offset: number // hours (integer or fractional)
  label: string
  entries: TimezoneEntry[]
}
