function pad(n) {
  return String(n).padStart(2, '0')
}

export function toIcsDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

export function buildEvent(title, date) {
  const dateStr = toIcsDate(date)
  return [
    'BEGIN:VEVENT',
    `UID:${dateStr}-${Math.random().toString(36).slice(2)}@dungi`,
    `DTSTAMP:${toIcsDate(new Date())}T000000Z`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `SUMMARY:🪺 ${title}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:🪺 ${title}`,
    `TRIGGER;VALUE=DATE-TIME:${dateStr}T090000Z`,
    'END:VALARM',
    'END:VEVENT',
  ].join('\r\n')
}

export function buildCalendar(events) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dungi//calendar//KO',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}
