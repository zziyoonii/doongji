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
  {
    phase: '대출 준비 시작', days: -60, items: [
      {
        text: '디딤돌/보금자리론 신청 시작 (심사까지 2~3주 소요)',
        textByType: { general: '주택담보대출 신청 시작 (은행 방문 또는 비대면, 심사까지 1~2주 소요)' },
      },
      {
        text: '주택금융공사 예상대출조회 확인', link: 'https://www.hf.go.kr', linkLabel: 'HF 예상대출조회 바로가기',
        onlyTypes: ['didimdol', 'bogeumjari'],
      },
      { text: '대출받을 은행 방문해 한도·금리 비교 상담', onlyTypes: ['general'] },
    ],
  },
  {
    phase: 'D-30', days: -30, items: [
      { text: '대출 승인 확인' },
      { text: '이사업체 예약 (인기 날짜는 1달 전 마감!)' },
      { text: '인터넷 이전 신청' },
    ],
  },
  {
    phase: 'D-7', days: -7, items: [
      { text: '주식 매도 (국내 입금까지 영업일 2일!)' },
      { text: '은행 이체 한도 상향 확인 (1억 이상)' },
      { text: '보증금 반환 일정 집주인과 최종 확인' },
    ],
  },
  {
    phase: 'D-1', days: -1, items: [
      { text: '인지대+채권 비용 은행 계좌 입금', id: 'bondFee' },
      { text: '법무사에게 카드 납부 의사 전달' },
      { text: '법무사 보수료 준비 확인' },
    ],
  },
  {
    phase: '당일', days: 0, items: [
      { text: '보증금 받고 → 기존 대출 즉시 상환' },
      { text: '잔금 이체 → 등기서류 확인' },
      { text: '관리비·장기수선충당금 정산' },
      { text: '선수관리비 전 주인에게 지급' },
      { text: '이사' },
    ],
  },
  {
    phase: '이사 후', days: 60, items: [
      { text: '전입신고 (취득세 감면 필수! 3개월 이내)', days: 90 },
      { text: '취득세 신고·납부 (60일 이내)', days: 60, link: 'https://www.wetax.go.kr', linkLabel: '위택스 바로가기' },
      { text: '생애최초·신생아 감면 신청', days: 60 },
      { text: '인터넷·도시가스·전기 명의 이전', days: 14 },
    ],
  },
]

export function addDays(dateStr, n) {
  const dt = new Date(dateStr)
  dt.setDate(dt.getDate() + n)
  return dt
}

export function formatDateKo(date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

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

// 집값·소득·가구 조건에 따라 해당될 수 있는 대출 상품을 계산
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

