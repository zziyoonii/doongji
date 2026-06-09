import { useState } from 'react'
import { formatManWon } from '../../utils/format'

const CHECKLIST = [
  {
    group: '계약 전',
    icon: '📋',
    items: [
      { id: 'c1', text: '등기부등본 확인 (근저당, 압류 여부)', link: 'https://www.iros.go.kr' },
      { id: 'c2', text: '토지이용계획확인원 확인 (용도지역)' },
      { id: 'c3', text: '건축물대장 확인 (위반건축물 여부)' },
      { id: 'c4', text: '국토교통부 실거래가 조회', link: 'https://rt.molit.go.kr' },
      { id: 'c5', text: '전입세대 열람 신청 (선순위 세입자 확인)' },
    ],
  },
  {
    group: '대출 준비',
    icon: '🏦',
    items: [
      { id: 'l1', text: '주택담보대출 은행 3곳 이상 비교' },
      { id: 'l2', text: '디딤돌대출 자격 확인 (부부합산 연 6천만원 이하)', link: 'https://nhuf.molit.go.kr' },
      { id: 'l3', text: '신생아특례대출 자격 확인 (2년 내 출산)', link: 'https://nhuf.molit.go.kr' },
      { id: 'l4', text: '대출 사전 심사 완료' },
      { id: 'l5', text: '인감도장·인감증명서 준비' },
    ],
  },
  {
    group: '계약일',
    icon: '✍️',
    items: [
      { id: 'k1', text: '계약서 특약 내용 꼼꼼히 확인' },
      { id: 'k2', text: '계약금 입금 (통상 집값의 10%)' },
      { id: 'k3', text: '부동산 중개사 등록 여부 확인', link: 'https://www.eum.go.kr' },
      { id: 'k4', text: '잔금일·이사일 명시 확인' },
    ],
  },
  {
    group: '잔금일 준비',
    icon: '🔑',
    items: [
      { id: 'b1', text: '잔금 이체 준비 (이체한도 미리 올리기)' },
      { id: 'b2', text: '취득세 신고·납부 (잔금일로부터 60일 이내)' },
      { id: 'b3', text: '소유권이전등기 신청 (법무사 또는 셀프)' },
      { id: 'b4', text: '전입신고 + 확정일자 받기' },
      { id: 'b5', text: '주택화재보험 가입' },
      { id: 'b6', text: '관리비 명의 변경 신청' },
    ],
  },
  {
    group: '이사 후',
    icon: '🏡',
    items: [
      { id: 'a1', text: '주민등록 주소 변경' },
      { id: 'a2', text: '건강보험·자동차보험 주소 변경' },
      { id: 'a3', text: '인터넷·TV 이전 신청' },
      { id: 'a4', text: '각종 카드·은행 주소 변경' },
    ],
  },
]

export default function Step5Checklist({ prevData }) {
  const [checked, setChecked] = useState({})

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const total = CHECKLIST.flatMap(g => g.items).length
  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round((done / total) * 100)

  const housePrice = Number(prevData?.step1?.housePrice || 0)
  const loanLimit = Number(prevData?.step1?.loanLimit || 0)
  const finalTax = Number(prevData?.step3?.finalTax || 0)
  const monthlyPayment = Number(prevData?.step4?.monthlyPayment || 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">잔금일 체크리스트</h2>
        <p className="text-sm text-gray-500">하나씩 체크하며 놓치는 것 없이 준비해요</p>
      </div>

      {/* 진행률 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">전체 진행률</span>
          <span className="font-bold text-amber-600">{done} / {total} ({pct}%)</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-amber-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 요약 카드 */}
      {housePrice > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-semibold text-amber-800">📊 내 계획 요약</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {housePrice > 0 && <div className="text-gray-600">집값<br /><strong className="text-gray-900">{formatManWon(housePrice)}원</strong></div>}
            {loanLimit > 0 && <div className="text-gray-600">대출<br /><strong className="text-gray-900">{formatManWon(loanLimit)}원</strong></div>}
            {finalTax > 0 && <div className="text-gray-600">취득세<br /><strong className="text-gray-900">{formatManWon(Math.round(finalTax / 10000))}원</strong></div>}
            {monthlyPayment > 0 && <div className="text-gray-600">월 상환<br /><strong className="text-gray-900">{formatManWon(Math.round(monthlyPayment / 10000))}원</strong></div>}
          </div>
        </div>
      )}

      {/* 체크리스트 */}
      <div className="space-y-4">
        {CHECKLIST.map(group => (
          <div key={group.group} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="font-semibold text-sm text-gray-700">{group.icon} {group.group}</span>
              <span className="ml-2 text-xs text-gray-400">
                {group.items.filter(i => checked[i.id]).length}/{group.items.length}
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {group.items.map(item => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="w-4 h-4 rounded accent-amber-500"
                    />
                  </div>
                  <span className={`text-sm leading-relaxed flex-1 ${checked[item.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {item.text}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="ml-1 text-xs text-amber-600 underline no-underline hover:underline"
                      >
                        바로가기 →
                      </a>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {pct === 100 && (
        <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-green-800 text-lg">모든 준비 완료!</p>
          <p className="text-green-600 text-sm mt-1">내 집 마련을 축하해요. 행복한 새 보금자리가 되길 바랍니다!</p>
        </div>
      )}
    </div>
  )
}
