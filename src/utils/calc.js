export const STEPS = ['대출 한도', '필요 현금', '취득세', '월 상환', '체크리스트']
export const STEP_SHORT = ['대출', '현금', '세금', '월납', '체크']

export const RATES = { 10: 4.35, 15: 4.4, 20: 4.45, 30: 4.55, 40: 4.6, 50: 4.65 }

export const DISCOUNTS = [
  { id: 'youth', n: '저소득 청년', ds: '만 39세 이하, 연소득 6천만원 이하', r: .5 },
  { id: 'newlywed', n: '신혼가구', ds: '혼인 7년 이내 또는 3개월 내 예정', r: .2 },
  { id: 'social', n: '사회적 배려층', ds: '장애인, 한부모 가정 등', r: .5 },
  { id: 'multichild', n: '다자녀 가구', ds: '2자녀 이상', r: .3 },
  { id: 'first', n: '생애최초 구입', ds: '본인·배우자 주택 소유 이력 없음', r: .2 },
  { id: 'fraud', n: '전세사기 피해자', ds: '피해자 결정문 보유', r: 1 },
]

export const CHECKS = [
  ['잔금일 D-7', ['주식 매도 (국내 입금까지 영업일 2일!)', '대출 실행일·금액 은행 최종 확인', '보증금 반환 일정 집주인과 확정']],
  ['잔금일 D-1', ['인지대+채권 비용 은행 계좌 입금', '법무사에게 카드 납부 의사 전달', '이체 한도 상향 (1억 이상!)']],
  ['잔금일 당일', ['보증금 받고 → 기존 대출 즉시 상환', '잔금 이체 → 등기서류 확인', '관리비·장기수선충당금 정산', '선수관리비는 전 주인에게 지급']],
  ['이사 후 3개월 내', ['전입신고 (감면 필수 조건!)', '취득세 신고·납부 (60일 이내)', '생애최초·신생아 감면 신청', '인터넷·도시가스 이전']],
]

export const fmt = n => (n < 0 ? '-' : '') + Math.round(Math.abs(n)).toLocaleString('ko-KR') + '만원'
export const fmtW = n => Math.round(n).toLocaleString('ko-KR') + '원'

export function mpay(p, rt, y) {
  const r = rt / 100 / 12, n = y * 12
  if (p <= 0) return 0
  return p * 1e4 * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
}

// 월 상환 가능액(만원)으로부터 원리금균등 상환 기준 대출 한도(만원) 역산
function annuityLimit(monthlyCapacity, rate, years) {
  if (monthlyCapacity <= 0) return 0
  const r = rate / 100 / 12, n = years * 12
  return Math.floor(monthlyCapacity * 1e4 / (r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)) / 1e4 / 100) * 100
}

export const LOAN_LABELS = {
  didimdol: '디딤돌대출',
  bogeumjari: 'HF 보금자리론',
  general: '일반 주택담보대출',
}

// 집값·소득·가구 조건에 따라 가장 유리한 대출 상품을 추천
export function recommendLoanType(d) {
  if (d.price <= 50000 && d.income <= 7000) return 'didimdol'
  if (d.price <= 60000 && (d.newlywed || d.multichild)) return 'didimdol'
  if (d.price <= 90000) return 'bogeumjari'
  return 'general'
}

export function loanReason(type, d) {
  if (type === 'didimdol') {
    if (d.price <= 50000 && d.income <= 7000) {
      return '집값·소득 조건에 맞는 디딤돌대출을 받을 수 있어요! 보금자리론보다 금리가 훨씬 낮아요 🎉'
    }
    return '신혼·다자녀 가구는 집값 6억원 이하면 디딤돌대출 한도가 늘어나요 🎉'
  }
  if (type === 'bogeumjari') return 'HF 보금자리론 기준으로 계산했어요'
  return '집값이 9억원을 초과해 일반 주택담보대출 기준으로 계산했어요'
}

export function didimdolLimit(d) {
  const ltv = Math.floor(d.price * .7 / 100) * 100
  const cap = (d.newlywed || d.multichild) ? 40000 : d.isFirst ? 30000 : 25000
  const fin = Math.max(Math.min(ltv, cap), 0)
  return { type: 'didimdol', ltv, cap, fin, rate: 2.55, rateLabel: '2.1~3.0%' }
}

export function bogeumjariLimit(d) {
  const rate = RATES[d.years]
  const ltvPct = d.isFirst ? .8 : .7
  const ltv = Math.floor(d.price * ltvPct / 100) * 100
  const cap = d.isFirst ? 42000 : 36000
  const mm = (d.income / 12) * .6 - d.existingMonthly
  const dtiL = annuityLimit(mm, rate, d.years)
  const fin = Math.max(Math.min(ltv, cap, dtiL), 0)
  return { type: 'bogeumjari', ltv, ltvPct: ltvPct * 100, cap, dtiL, fin, rate }
}

export function generalLimit(d) {
  const rate = RATES[d.years]
  const ltv = Math.floor(d.price * .7 / 100) * 100
  const mm = (d.income / 12) * .4 - d.existingMonthly
  const dsrL = annuityLimit(mm, rate, d.years)
  const fin = Math.max(Math.min(ltv, dsrL), 0)
  return { type: 'general', ltv, dsrL, fin, rate }
}

export function loanLimit(type, d) {
  if (type === 'didimdol') return didimdolLimit(d)
  if (type === 'bogeumjari') return bogeumjariLimit(d)
  return generalLimit(d)
}

export function flow(d) {
  const bal = d.price - d.deposit - d.loan
  const gn = d.guarantee - d.oldLoan
  const fees = d.fees.reduce((a, f) => a + (+f.a || 0), 0)
  const have = (+d.cash || 0) + (+d.stock || 0) + (+d.borrow || 0)
  return { bal, gn, fees, have, diff: have + gn - bal - fees }
}

export function tax(d) {
  const rate = d.price <= 60000 ? .01 : d.price <= 90000 ? .02 : .03
  const acq = d.price * rate, edu = acq * .1, total = acq + edu
  const fc = d.isFirst ? Math.min(total, 200) : 0
  const bc = d.baby !== 'none' ? Math.min(total, 500) : 0
  const best = Math.max(fc, bc)
  return { rate, acq, edu, total, fc, bc, best, fin: Math.max(total - best, 0) }
}
