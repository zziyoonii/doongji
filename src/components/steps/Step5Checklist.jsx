import { useState, useEffect } from 'react'
import { formatManWon } from '../../utils/format'

const STORAGE_KEY = 'dungi-checklist-v1'
const DATE_KEY = 'dungi-balance-date-v1'

const TIMELINE = [
  {
    phase: '계약 전',
    icon: '🔍',
    color: 'blue',
    days: '계약일 D-7 이상',
    items: [
      { id: 'pre1', text: '등기부등본 확인 (근저당·압류·가처분 여부)', url: 'https://www.iros.go.kr' },
      { id: 'pre2', text: '국토교통부 실거래가 조회', url: 'https://rt.molit.go.kr' },
      { id: 'pre3', text: '건축물대장 확인 (위반건축물 여부)' },
      { id: 'pre4', text: '전입세대 열람 (선순위 세입자 유무)' },
      { id: 'pre5', text: '은행 3곳 이상 대출 조건 비교' },
      { id: 'pre6', text: '디딤돌·보금자리론 자격 확인', url: 'https://nhuf.molit.go.kr' },
      { id: 'pre7', text: '부동산 중개사 자격 확인', url: 'https://www.eum.go.kr' },
    ],
  },
  {
    phase: '계약일',
    icon: '✍️',
    color: 'amber',
    days: 'D-day',
    items: [
      { id: 'con1', text: '계약서 특약 사항 꼼꼼히 확인' },
      { id: 'con2', text: '계약금 이체 (통상 집값의 10%)' },
      { id: 'con3', text: '잔금일·이사일 날짜 명시 확인' },
      { id: 'con4', text: '대출 사전 심사 신청' },
      { id: 'con5', text: '인감도장·인감증명서 준비' },
    ],
  },
  {
    phase: '잔금일',
    icon: '🔑',
    color: 'green',
    days: '잔금 당일',
    items: [
      { id: 'bal1', text: '이체한도 미리 올려두기 (수백만원 이상)' },
      { id: 'bal2', text: '잔금 이체 완료', deadline: 0 },
      { id: 'bal3', text: '열쇠·카드키 수령' },
      { id: 'bal4', text: '소유권이전등기 신청 (법무사 또는 셀프)', url: 'https://www.iros.go.kr', deadline: 0 },
      { id: 'bal5', text: '주택화재보험 가입' },
    ],
  },
  {
    phase: '잔금일 후',
    icon: '📋',
    color: 'purple',
    days: '~60일 이내',
    items: [
      { id: 'aft1', text: '취득세 신고·납부', url: 'https://www.wetax.go.kr', deadline: 60, urgent: true },
      { id: 'aft2', text: '전입신고 (이사 당일 또는 익일)', deadline: 1 },
      { id: 'aft3', text: '확정일자 받기 (주민센터 또는 인터넷등기소)', url: 'https://www.iros.go.kr', deadline: 1 },
      { id: 'aft4', text: '관리비 명의 변경' },
      { id: 'aft5', text: '각종 청구서 주소 변경 (카드·은행·보험)' },
      { id: 'aft6', text: '인터넷·TV 이전 신청' },
      { id: 'aft7', text: '건강보험·자동차보험 주소 변경' },
    ],
  },
]

const COLOR = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-400' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-400' },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-400' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-400' },
}

const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

const toGcalDate = (date) => date.toISOString().slice(0, 10).replace(/-/g, '')

const gcalUrl = ({ title, date, details }) => {
  const start = toGcalDate(date)
  const end = toGcalDate(addDays(date, 1))
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE', text: title,
    dates: `${start}/${end}`, details: details || '',
  })}`
}

const getKeyEvents = (balanceDate) => [
  {
    title: '🔑 잔금일 · 이사',
    date: balanceDate,
    details: ['☐ 이체한도 미리 올려두기', '☐ 잔금 이체 완료', '☐ 열쇠 · 카드키 수령', '☐ 소유권이전등기 신청', '☐ 주택화재보험 가입'].join('\n'),
    badge: 'D+0',
  },
  {
    title: '📋 전입신고 · 확정일자',
    date: addDays(balanceDate, 1),
    details: ['☐ 전입신고 (주민센터 또는 정부24)', '☐ 확정일자 받기', '☐ 관리비 명의 변경'].join('\n'),
    badge: 'D+1',
  },
  {
    title: '🏛️ 취득세 신고·납부 마감',
    date: addDays(balanceDate, 60),
    details: ['☐ 위택스(wetax.go.kr)에서 취득세 신고', '☐ 납부 완료 확인', '', '⚠️ 잔금일로부터 60일 이내 필수! 늦으면 가산세가 붙어요.'].join('\n'),
    badge: 'D+60',
  },
]

const formatDateShort = (date) => `${date.getMonth() + 1}/${date.getDate()}`
const formatDateKo = (date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`

// 마감 배지 계산
const getDeadlineBadge = (deadline, balanceDate, isChecked, urgent) => {
  if (!balanceDate) return null
  const deadlineDate = addDays(balanceDate, deadline)
  if (isChecked) return { label: '완료', cls: 'bg-green-100 text-green-700' }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((deadlineDate - today) / 86400000)
  if (diff < 0) return { label: '기한 초과!', cls: 'bg-red-100 text-red-600 font-bold' }
  if (diff === 0) return { label: '오늘까지!', cls: 'bg-red-100 text-red-600 font-bold' }
  if (diff <= 7 || (urgent && diff <= 30)) return { label: `D-${diff}`, cls: 'bg-amber-100 text-amber-700 font-bold' }
  return { label: `${formatDateShort(deadlineDate)}까지`, cls: 'bg-gray-100 text-gray-500' }
}

export default function Step5Checklist({ prevData }) {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} }
    catch { return {} }
  })
  const [balanceDateStr, setBalanceDateStr] = useState(() =>
    localStorage.getItem(DATE_KEY) || ''
  )

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)) }, [checked])
  useEffect(() => { if (balanceDateStr) localStorage.setItem(DATE_KEY, balanceDateStr) }, [balanceDateStr])

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const allItems = TIMELINE.flatMap(g => g.items)
  const total = allItems.length
  const done = allItems.filter(i => checked[i.id]).length
  const pct = Math.round((done / total) * 100)

  const housePrice = Number(prevData?.step1?.housePrice || 0)
  const loanLimit = Number(prevData?.step1?.loanLimit || 0)
  const finalTax = Number(prevData?.step3?.finalTax || 0)
  const monthlyPayment = Number(prevData?.step4?.monthlyPayment || 0)

  const balanceDate = balanceDateStr ? new Date(balanceDateStr) : null
  const keyEvents = balanceDate ? getKeyEvents(balanceDate) : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">잔금일 체크리스트</h2>
        <p className="text-sm text-gray-500">하나씩 체크하세요. 브라우저를 닫아도 기록이 유지돼요 ✨</p>
      </div>

      {/* 진행률 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">전체 진행률</span>
          <span className="font-bold text-amber-600">{done} / {total} ({pct}%)</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="bg-amber-400 h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-1 mt-3 flex-wrap">
          {TIMELINE.map(g => {
            const c = COLOR[g.color]
            const gDone = g.items.filter(i => checked[i.id]).length
            return (
              <span key={g.phase} className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text}`}>
                {g.icon} {g.phase} {gDone}/{g.items.length}
              </span>
            )
          })}
        </div>
      </div>

      {/* 구글 캘린더 연동 */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-800">📅 잔금일 입력 & 캘린더 추가</p>
          <p className="text-xs text-gray-400 mt-0.5">잔금일을 입력하면 각 항목에 마감일이 표시돼요</p>
        </div>
        <div className="px-4 py-4 space-y-4">
          <input
            type="date"
            value={balanceDateStr}
            onChange={e => setBalanceDateStr(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          {balanceDate && (
            <div className="space-y-2">
              {keyEvents.map(ev => (
                <a key={ev.title} href={gcalUrl(ev)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-all group">
                  <div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{ev.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDateKo(ev.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      ev.badge === 'D+60' ? 'bg-red-100 text-red-600' :
                      ev.badge === 'D+0'  ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'}`}>{ev.badge}</span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
              <p className="text-xs text-gray-400 text-center pt-1">클릭 → 구글 캘린더 열림 → 저장</p>
            </div>
          )}
        </div>
      </div>

      {/* 요약 */}
      {housePrice > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-800">📊 내 계획 요약</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {housePrice > 0 && <div className="text-gray-600">집값<br /><strong className="text-gray-900">{formatManWon(housePrice)}만</strong></div>}
            {loanLimit > 0 && <div className="text-gray-600">대출<br /><strong className="text-gray-900">{formatManWon(loanLimit)}만</strong></div>}
            {finalTax > 0 && <div className="text-gray-600">취득세<br /><strong className="text-gray-900">{formatManWon(Math.round(finalTax / 10000))}만</strong></div>}
            {monthlyPayment > 0 && <div className="text-gray-600">월 상환<br /><strong className="text-gray-900">{formatManWon(Math.round(monthlyPayment / 10000))}만</strong></div>}
          </div>
        </div>
      )}

      {/* 타임라인 체크리스트 */}
      <div className="relative">
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {TIMELINE.map((group) => {
            const c = COLOR[group.color]
            const gDone = group.items.filter(i => checked[i.id]).length
            return (
              <div key={group.phase} className="relative pl-12">
                <div className={`absolute left-3 top-3 w-5 h-5 rounded-full ${c.dot} border-4 border-white shadow-sm z-10`} />
                <div className={`border-2 ${c.border} rounded-2xl overflow-hidden`}>
                  <div className={`${c.bg} px-4 py-3 flex justify-between items-center`}>
                    <div>
                      <span className={`font-bold text-sm ${c.text}`}>{group.icon} {group.phase}</span>
                      <span className="text-xs text-gray-500 ml-2">{group.days}</span>
                    </div>
                    <span className={`text-xs font-bold ${c.text}`}>{gDone}/{group.items.length}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {group.items.map(item => {
                      const badge = item.deadline != null
                        ? getDeadlineBadge(item.deadline, balanceDate, !!checked[item.id], item.urgent)
                        : null
                      return (
                        <label key={item.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="mt-0.5 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={!!checked[item.id]}
                              onChange={() => toggle(item.id)}
                              className="w-4 h-4 rounded accent-amber-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm leading-relaxed ${checked[item.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {item.text}
                              </span>
                              {item.url && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="text-xs text-blue-500 hover:underline flex-shrink-0">
                                  바로가기 →
                                </a>
                              )}
                            </div>
                            {badge && (
                              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${badge.cls}`}>
                                {badge.label}
                              </span>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button"
          onClick={() => { if (window.confirm('체크리스트를 초기화할까요?')) setChecked({}) }}
          className="text-xs text-gray-400 underline">
          체크리스트 초기화
        </button>
      </div>

      {pct === 100 && (
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-green-800 text-lg">모든 준비 완료!</p>
          <p className="text-green-600 text-sm mt-1">새 보금자리에서 행복한 시간 보내세요!</p>
        </div>
      )}
    </div>
  )
}
