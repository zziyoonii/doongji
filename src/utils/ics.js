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

function toGcalDate(date) {
  const next = new Date(date)
  next.setDate(next.getDate() + 1)
  return `${toIcsDate(date)}/${toIcsDate(next)}`
}

function gcalUrl({ title, date, details }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: toGcalDate(date),
    details: details || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function isTossApp() {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView
}

async function download(content, filename) {
  if (isTossApp()) {
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

export async function downloadIcsEvent(title, date) {
  if (isTossApp()) {
    const { openURL } = await import('@apps-in-toss/web-framework')
    await openURL(gcalUrl({ title: `🪺 ${title}`, date }))
    return
  }
  return download(buildCalendar([buildEvent(title, date)]), `${title}.ics`)
}

export async function downloadIcsAll(items) {
  if (isTossApp()) {
    const { openURL } = await import('@apps-in-toss/web-framework')
    const sorted = [...items].sort((a, b) => a.date - b.date)
    const details = sorted
      .map(({ title, date }) => `${date.getMonth() + 1}/${date.getDate()} - ${title}`)
      .join('\n')
    await openURL(gcalUrl({ title: '🪺 둥지 이사 일정', date: sorted[0].date, details }))
    return
  }
  const events = items.map(({ title, date }) => buildEvent(title, date))
  return download(buildCalendar(events), '둥지-이사일정.ics')
}
