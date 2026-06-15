import { buildEvent, buildCalendar, toIcsDate } from './icsCore'

function toBase64(content) {
  const bytes = new TextEncoder().encode(content)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function isTossApp() {
  return typeof window !== 'undefined' && !!window.ReactNativeWebView
}

function icsApiUrl(items) {
  const encoded = items.map(({ title, date }) => ({ t: title, d: toIcsDate(date) }))
  const params = new URLSearchParams({ items: toBase64(JSON.stringify(encoded)) })
  return `${window.location.origin}/api/ics?${params.toString()}`
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
    await openURL(icsApiUrl([{ title, date }]))
    return
  }
  return download(buildCalendar([buildEvent(title, date)]), `${title}.ics`)
}

export async function downloadIcsAll(items) {
  if (isTossApp()) {
    const { openURL } = await import('@apps-in-toss/web-framework')
    await openURL(icsApiUrl(items))
    return
  }
  const events = items.map(({ title, date }) => buildEvent(title, date))
  return download(buildCalendar(events), '둥지-이사일정.ics')
}
