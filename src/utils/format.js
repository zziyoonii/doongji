export const formatWon = (n) => {
  if (!n && n !== 0) return ''
  const num = Number(n)
  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000)
    const man = Math.floor((num % 100000000) / 10000)
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`
  }
  if (num >= 10000) {
    return `${Math.floor(num / 10000).toLocaleString()}만원`
  }
  return `${num.toLocaleString()}원`
}

export const toMan = (n) => Math.round(Number(n) / 10000)
export const fromMan = (n) => Number(n) * 10000

export const formatManWon = (manWon) => {
  if (!manWon && manWon !== 0) return ''
  const num = Number(manWon)
  if (num >= 10000) {
    const eok = Math.floor(num / 10000)
    const man = num % 10000
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만` : `${eok}억`
  }
  return `${num.toLocaleString()}만`
}
