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

function toBase64(content) {
  const bytes = new TextEncoder().encode(content)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

async function download(content, filename) {
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    const { saveBase64Data } = await import('@apps-in-toss/web-framework')
    await saveBase64Data({
      data: toBase64(content),
      fileName: filename,
      mimeType: 'text/calendar',
    })
    return
  }

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
  return download(buildCalendar([buildEvent(title, date)]), `${title}.ics`)
}

export function downloadIcsAll(items) {
  const events = items.map(({ title, date }) => buildEvent(title, date))
  return download(buildCalendar(events), '둥지-이사일정.ics')
}
