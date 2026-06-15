import { buildEvent, buildCalendar } from '../src/utils/icsCore.js'

export default function handler(req, res) {
  let items
  try {
    const json = Buffer.from(req.query.items || '', 'base64').toString('utf-8')
    items = JSON.parse(json)
  } catch {
    res.status(400).send('Invalid items')
    return
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).send('No items')
    return
  }

  const events = items.map(({ t, d }) => {
    const date = new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`)
    return buildEvent(t, date)
  })

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="dungi-schedule.ics"')
  res.status(200).send(buildCalendar(events))
}
