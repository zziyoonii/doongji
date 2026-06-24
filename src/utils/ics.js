import { toIcsDate } from './icsCore'
import { openExternal } from './openExternal'

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
  await openExternal(gcalUrl(title, date))
}
