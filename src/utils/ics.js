function pad(n) {
  return String(n).padStart(2, '0')
}

function toIcsDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}

function buildEvent(title, date) {
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

function buildCalendar(events) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dungi//calendar//KO',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}

function download(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadIcsEvent(title, date) {
  download(buildCalendar([buildEvent(title, date)]), `${title}.ics`)
}

export function downloadIcsAll(items) {
  const events = items.map(({ title, date }) => buildEvent(title, date))
  download(buildCalendar(events), '둥지-이사일정.ics')
}
