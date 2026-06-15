function pad(n) {
  return String(n).padStart(2, '0')
}

export function toIcsDate(date) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
}
