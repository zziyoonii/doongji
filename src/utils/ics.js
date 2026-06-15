import { toIcsDate } from './icsCore'

function toGcalDate(date) {
  const next = new Date(date)
  next.setDate(next.getDate() + 1)
  return `${toIcsDate(date)}/${toIcsDate(next)}`
}

function gcalUrl(title, date) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `🪺 ${title}`,
    dates: toGcalDate(date),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export async function addToCalendar(title, date) {
  const url = gcalUrl(title, date)
  if (typeof window !== 'undefined' && window.ReactNativeWebView) {
    const { openURL } = await import('@apps-in-toss/web-framework')
    await openURL(url)
    return
  }
  window.open(url, '_blank', 'noopener')
}
