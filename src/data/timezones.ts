import type { TimezoneEntry } from '../types/timezone'

export const TIMEZONES: TimezoneEntry[] = [
  // UTC-12
  { id: 'Etc/GMT+12', label: 'Baker Island', utcOffset: -720, region: 'Pacific' },
  // UTC-11
  { id: 'Pacific/Pago_Pago', label: 'American Samoa', utcOffset: -660, region: 'Pacific' },
  { id: 'Pacific/Niue', label: 'Niue', utcOffset: -660, region: 'Pacific' },
  // UTC-10
  { id: 'Pacific/Honolulu', label: 'Honolulu', utcOffset: -600, region: 'Pacific' },
  { id: 'Pacific/Tahiti', label: 'Tahiti', utcOffset: -600, region: 'Pacific' },
  { id: 'Pacific/Rarotonga', label: 'Rarotonga', utcOffset: -600, region: 'Pacific' },
  // UTC-9:30
  { id: 'Pacific/Marquesas', label: 'Marquesas Islands', utcOffset: -570, region: 'Pacific' },
  // UTC-9
  { id: 'America/Anchorage', label: 'Anchorage', utcOffset: -540, region: 'Americas' },
  { id: 'America/Juneau', label: 'Juneau', utcOffset: -540, region: 'Americas' },
  // UTC-8
  { id: 'America/Los_Angeles', label: 'Los Angeles', utcOffset: -480, region: 'Americas' },
  { id: 'America/Vancouver', label: 'Vancouver', utcOffset: -480, region: 'Americas' },
  { id: 'America/Tijuana', label: 'Tijuana', utcOffset: -480, region: 'Americas' },
  // UTC-7
  { id: 'America/Denver', label: 'Denver', utcOffset: -420, region: 'Americas' },
  { id: 'America/Phoenix', label: 'Phoenix', utcOffset: -420, region: 'Americas' },
  { id: 'America/Chihuahua', label: 'Chihuahua', utcOffset: -420, region: 'Americas' },
  // UTC-6
  { id: 'America/Chicago', label: 'Chicago', utcOffset: -360, region: 'Americas' },
  { id: 'America/Mexico_City', label: 'Mexico City', utcOffset: -360, region: 'Americas' },
  { id: 'America/Tegucigalpa', label: 'Tegucigalpa', utcOffset: -360, region: 'Americas' },
  // UTC-5
  { id: 'America/New_York', label: 'New York', utcOffset: -300, region: 'Americas' },
  { id: 'America/Toronto', label: 'Toronto', utcOffset: -300, region: 'Americas' },
  { id: 'America/Bogota', label: 'Bogotá', utcOffset: -300, region: 'Americas' },
  { id: 'America/Lima', label: 'Lima', utcOffset: -300, region: 'Americas' },
  // UTC-4
  { id: 'America/Halifax', label: 'Halifax', utcOffset: -240, region: 'Americas' },
  { id: 'America/Caracas', label: 'Caracas', utcOffset: -240, region: 'Americas' },
  { id: 'America/La_Paz', label: 'La Paz', utcOffset: -240, region: 'Americas' },
  { id: 'America/Manaus', label: 'Manaus', utcOffset: -240, region: 'Americas' },
  // UTC-3:30
  { id: 'America/St_Johns', label: "St. John's", utcOffset: -210, region: 'Americas' },
  // UTC-3
  { id: 'America/Sao_Paulo', label: 'São Paulo', utcOffset: -180, region: 'Americas' },
  { id: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires', utcOffset: -180, region: 'Americas' },
  { id: 'America/Santiago', label: 'Santiago', utcOffset: -180, region: 'Americas' },
  { id: 'America/Montevideo', label: 'Montevideo', utcOffset: -180, region: 'Americas' },
  // UTC-2
  { id: 'America/Noronha', label: 'Fernando de Noronha', utcOffset: -120, region: 'Americas' },
  { id: 'Atlantic/South_Georgia', label: 'South Georgia', utcOffset: -120, region: 'Atlantic' },
  // UTC-1
  { id: 'Atlantic/Azores', label: 'Azores', utcOffset: -60, region: 'Atlantic' },
  { id: 'Atlantic/Cape_Verde', label: 'Cape Verde', utcOffset: -60, region: 'Africa' },
  // UTC+0
  { id: 'Europe/London', label: 'London', utcOffset: 0, region: 'Europe' },
  { id: 'Atlantic/Reykjavik', label: 'Reykjavik', utcOffset: 0, region: 'Atlantic' },
  { id: 'Africa/Abidjan', label: 'Abidjan', utcOffset: 0, region: 'Africa' },
  { id: 'Africa/Accra', label: 'Accra', utcOffset: 0, region: 'Africa' },
  // UTC+1
  { id: 'Europe/Paris', label: 'Paris', utcOffset: 60, region: 'Europe' },
  { id: 'Europe/Berlin', label: 'Berlin', utcOffset: 60, region: 'Europe' },
  { id: 'Europe/Rome', label: 'Rome', utcOffset: 60, region: 'Europe' },
  { id: 'Europe/Madrid', label: 'Madrid', utcOffset: 60, region: 'Europe' },
  { id: 'Africa/Lagos', label: 'Lagos', utcOffset: 60, region: 'Africa' },
  // UTC+2
  { id: 'Europe/Athens', label: 'Athens', utcOffset: 120, region: 'Europe' },
  { id: 'Europe/Helsinki', label: 'Helsinki', utcOffset: 120, region: 'Europe' },
  { id: 'Africa/Cairo', label: 'Cairo', utcOffset: 120, region: 'Africa' },
  { id: 'Africa/Johannesburg', label: 'Johannesburg', utcOffset: 120, region: 'Africa' },
  { id: 'Asia/Jerusalem', label: 'Jerusalem', utcOffset: 120, region: 'Asia' },
  // UTC+3
  { id: 'Europe/Moscow', label: 'Moscow', utcOffset: 180, region: 'Europe' },
  { id: 'Asia/Istanbul', label: 'Istanbul', utcOffset: 180, region: 'Asia' },
  { id: 'Africa/Nairobi', label: 'Nairobi', utcOffset: 180, region: 'Africa' },
  { id: 'Asia/Riyadh', label: 'Riyadh', utcOffset: 180, region: 'Asia' },
  { id: 'Asia/Baghdad', label: 'Baghdad', utcOffset: 180, region: 'Asia' },
  // UTC+3:30
  { id: 'Asia/Tehran', label: 'Tehran', utcOffset: 210, region: 'Asia' },
  // UTC+4
  { id: 'Asia/Dubai', label: 'Dubai', utcOffset: 240, region: 'Asia' },
  { id: 'Asia/Baku', label: 'Baku', utcOffset: 240, region: 'Asia' },
  { id: 'Asia/Tbilisi', label: 'Tbilisi', utcOffset: 240, region: 'Asia' },
  { id: 'Indian/Mauritius', label: 'Mauritius', utcOffset: 240, region: 'Indian Ocean' },
  // UTC+4:30
  { id: 'Asia/Kabul', label: 'Kabul', utcOffset: 270, region: 'Asia' },
  // UTC+5
  { id: 'Asia/Karachi', label: 'Karachi', utcOffset: 300, region: 'Asia' },
  { id: 'Asia/Tashkent', label: 'Tashkent', utcOffset: 300, region: 'Asia' },
  { id: 'Asia/Yekaterinburg', label: 'Yekaterinburg', utcOffset: 300, region: 'Asia' },
  // UTC+5:30
  { id: 'Asia/Kolkata', label: 'Mumbai / Kolkata', utcOffset: 330, region: 'Asia' },
  { id: 'Asia/Colombo', label: 'Colombo', utcOffset: 330, region: 'Asia' },
  // UTC+5:45
  { id: 'Asia/Kathmandu', label: 'Kathmandu', utcOffset: 345, region: 'Asia' },
  // UTC+6
  { id: 'Asia/Dhaka', label: 'Dhaka', utcOffset: 360, region: 'Asia' },
  { id: 'Asia/Almaty', label: 'Almaty', utcOffset: 360, region: 'Asia' },
  // UTC+6:30
  { id: 'Asia/Yangon', label: 'Yangon', utcOffset: 390, region: 'Asia' },
  // UTC+7
  { id: 'Asia/Bangkok', label: 'Bangkok', utcOffset: 420, region: 'Asia' },
  { id: 'Asia/Jakarta', label: 'Jakarta', utcOffset: 420, region: 'Asia' },
  { id: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City', utcOffset: 420, region: 'Asia' },
  { id: 'Asia/Novosibirsk', label: 'Novosibirsk', utcOffset: 420, region: 'Asia' },
  // UTC+8
  { id: 'Asia/Shanghai', label: 'Beijing / Shanghai', utcOffset: 480, region: 'Asia' },
  { id: 'Asia/Singapore', label: 'Singapore', utcOffset: 480, region: 'Asia' },
  { id: 'Australia/Perth', label: 'Perth', utcOffset: 480, region: 'Australia' },
  { id: 'Asia/Hong_Kong', label: 'Hong Kong', utcOffset: 480, region: 'Asia' },
  { id: 'Asia/Taipei', label: 'Taipei', utcOffset: 480, region: 'Asia' },
  // UTC+8:45
  { id: 'Australia/Eucla', label: 'Eucla', utcOffset: 525, region: 'Australia' },
  // UTC+9
  { id: 'Asia/Tokyo', label: 'Tokyo', utcOffset: 540, region: 'Asia' },
  { id: 'Asia/Seoul', label: 'Seoul', utcOffset: 540, region: 'Asia' },
  // UTC+9:30
  { id: 'Australia/Darwin', label: 'Darwin', utcOffset: 570, region: 'Australia' },
  { id: 'Australia/Adelaide', label: 'Adelaide', utcOffset: 570, region: 'Australia' },
  // UTC+10
  { id: 'Australia/Sydney', label: 'Sydney', utcOffset: 600, region: 'Australia' },
  { id: 'Australia/Melbourne', label: 'Melbourne', utcOffset: 600, region: 'Australia' },
  { id: 'Australia/Brisbane', label: 'Brisbane', utcOffset: 600, region: 'Australia' },
  { id: 'Pacific/Guam', label: 'Guam', utcOffset: 600, region: 'Pacific' },
  // UTC+10:30
  { id: 'Australia/Lord_Howe', label: 'Lord Howe Island', utcOffset: 630, region: 'Pacific' },
  // UTC+11
  { id: 'Pacific/Guadalcanal', label: 'Solomon Islands', utcOffset: 660, region: 'Pacific' },
  { id: 'Pacific/Noumea', label: 'Noumea', utcOffset: 660, region: 'Pacific' },
  // UTC+12
  { id: 'Pacific/Auckland', label: 'Auckland', utcOffset: 720, region: 'Pacific' },
  { id: 'Pacific/Fiji', label: 'Fiji', utcOffset: 720, region: 'Pacific' },
  // UTC+12:45
  { id: 'Pacific/Chatham', label: 'Chatham Islands', utcOffset: 765, region: 'Pacific' },
  // UTC+13
  { id: 'Pacific/Tongatapu', label: 'Tonga', utcOffset: 780, region: 'Pacific' },
  { id: 'Pacific/Apia', label: 'Apia', utcOffset: 780, region: 'Pacific' },
  // UTC+14
  { id: 'Pacific/Kiritimati', label: 'Kiritimati', utcOffset: 840, region: 'Pacific' },
]

/** Returns all timezones sorted alphabetically by label */
export function getAllTimezones(): TimezoneEntry[] {
  return TIMEZONES.map(t => ({ ...t }))
}

/** Returns timezones whose standard UTC offset rounds to the given whole hour */
export function getTimezonesByOffsetHour(hourOffset: number): TimezoneEntry[] {
  return TIMEZONES.filter(t => Math.round(t.utcOffset / 60) === hourOffset).map(t => ({ ...t }))
}

/** Searches timezones by label or IANA id (case-insensitive) */
export function searchTimezones(query: string): TimezoneEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return TIMEZONES.map(t => ({ ...t }))
  return TIMEZONES.filter(
    t => t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.region.toLowerCase().includes(q)
  ).map(t => ({ ...t }))
}

/** Returns unique UTC offset hours (-12 to +14) present in the dataset */
export function getOffsetHours(): number[] {
  const set = new Set(TIMEZONES.map(t => Math.round(t.utcOffset / 60)))
  return Array.from(set).sort((a, b) => a - b)
}
