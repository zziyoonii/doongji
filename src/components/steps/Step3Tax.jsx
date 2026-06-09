import { useState, useEffect } from 'react'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

const CARD_COMPANIES = [
  { name: '국민카드', fee: '0.7~1.0%', url: 'https://www.kbcard.com' },
  { name: '신한카드', fee: '0.7~1.0%', url: 'https://www.shinhancard.com' },
  { name: '현대카드', fee: '0.7~1.0%', url: 'https://www.hyundaicard.com' },
  { name: '삼성카드', fee: '0.7~1.0%', url: 'https://www.samsungcard.com' },
  { name: '롯데카드', fee: '0.7~1.0%', url: 'https://www.lottecard.co.kr' },
]

export default function Step3Tax({ data, onChange, prevData }) {
  const [situation, setSituation] = useState(data.situation || 'first')
  const [useCard, setUseCard] = useState(data.useCard ?? false)

  const housePrice = Number(prevData?.housePrice || 0)
  const priceWon = housePrice * 10000

  // 취득세율 계산
  const getBaseRate = (won) => {
    if (won <= 60000000) return 0.01
    if (won <= 90000000) return 0.02
    return 0.03
  }

  const baseRate = getBaseRate(priceWon)
  const baseTax = Math.floor(priceWon * baseRate)
  const educationTax = Math.floor(baseTax * 0.1)
  const ruralTax = priceWon > 600000000 ? Math.floor(priceWon * 0.002) : 0
  const totalBeforeDiscount = baseTax + educationTax + ruralTax

  const firstDiscount = priceWon > 0 && priceWon <= 1200000000
    ? Math.min(baseTax, 2000000) : 0

  const babyDiscount = priceWon <= 500000000
    ? baseTax + educationTax
    : priceWon <= 900000000
    ? Math.floor((baseTax + educationTax) * 0.5)
    : 0

  const discount = situation === 'first' ? firstDiscount
    : (situation === 'baby' || situation === 'pregnant') ? babyDiscount
    : 0

  const finalTax = Math.max(totalBeforeDiscount - discount, 0)

  // 카드 할부 수수료 (취득세 기준)
  const cardFeeMin = Math.floor(finalTax * 0.007)
  const cardFeeMax = Math.floor(finalTax * 0.01)

  useEffect(() => {
    onChange({ situation, useCard, finalTax, discount })
  }, [situation, useCard, finalTax, discount])

  const situations = [
    { value: 'first', label: '🏠 생애최초만 해당', sub: '최대 200만원 감면 (12억 이하)' },
    { value: 'baby', label: '👶 신생아·출산 가구', sub: '2년 내 출산 · 5억↓ 전액, 9억↓ 50% 감면' },
    { value: 'pregnant', label: '🤰 현재 임신 중', sub: '신생아 특례와 동일한 혜택' },
    { value: 'none', label: '📋 일반 취득', sub: '감면 없음' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">취득세는 얼마나 내야 할까요?</h2>
        <p className="text-sm text-gray-500">집값 구간별 세율과 감면 혜택을 자동으로 계산해요</p>
      </div>

      {housePrice > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-sm text-blue-700">
          집값 <strong>{formatManWon(housePrice)}만원</strong> · 기본 취득세율 <strong>{(baseRate * 100).toFixed(0)}%</strong>
        </div>
      )}

      {/* 세율 구간 표 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">취득세율 구간</label>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden text-sm divide-y divide-gray-50">
          {[
            { range: '6천만원 이하', rate: '1%' },
            { range: '6천만~9천만원', rate: '2%' },
            { range: '9천만원 초과', rate: '3%' },
          ].map(r => (
            <div key={r.range} className={`flex justify-between px-4 py-2.5 ${housePrice > 0 && (
              (r.rate === '1%' && priceWon <= 60000000) ||
              (r.rate === '2%' && priceWon > 60000000 && priceWon <= 90000000) ||
              (r.rate === '3%' && priceWon > 90000000)
            ) ? 'bg-amber-50 font-semibold text-amber-800' : 'text-gray-600'}`}>
              <span>{r.range}</span>
              <span>{r.rate}</span>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <InfoToggle>
            취득세 외에 <strong>지방교육세</strong>(취득세의 10%)와 <strong>농어촌특별세</strong>(6억 초과 시 0.2%)도 같이 나와요. 모두 합산해서 계산해드려요.
          </InfoToggle>
        </div>
      </div>

      {/* 상황 선택 */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">내 상황을 골라주세요</label>
        <div className="grid grid-cols-1 gap-2">
          {situations.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSituation(opt.value)}
              className={`p-3.5 rounded-xl border-2 text-left transition-all ${situation === opt.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 계산 결과 */}
      {housePrice > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">세금 내역</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 text-sm">
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-600">취득세 ({(baseRate * 100).toFixed(0)}%)</span>
              <span>{formatManWon(Math.round(baseTax / 10000))}만</span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-600">지방교육세</span>
              <span>{formatManWon(Math.round(educationTax / 10000))}만</span>
            </div>
            {ruralTax > 0 && (
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">농어촌특별세</span>
                <span>{formatManWon(Math.round(ruralTax / 10000))}만</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between px-4 py-3 bg-green-50 text-green-700">
                <span>감면 혜택</span>
                <span>- {formatManWon(Math.round(discount / 10000))}만</span>
              </div>
            )}
          </div>

          <ResultCard
            label="최종 납부 취득세"
            value={`${formatManWon(Math.round(finalTax / 10000))}만원`}
            highlight
            sub={discount > 0 ? `${formatManWon(Math.round(discount / 10000))}만원 절감됐어요 🎉` : ''}
          />

          {/* 카드 납부 */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setUseCard(!useCard)}
              className="w-full flex justify-between items-center px-4 py-3.5 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <span className="font-medium text-gray-700">카드로 납부할 예정인가요?</span>
              </div>
              <span className="text-gray-400">{useCard ? '▲' : '▼'}</span>
            </button>
            {useCard && (
              <div className="border-t border-gray-100 px-4 pb-4 space-y-3">
                <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">
                  <p className="font-medium mb-1">카드 할부 수수료 (취득세 기준)</p>
                  <p>약 <strong>{formatManWon(Math.round(cardFeeMin / 10000))}~{formatManWon(Math.round(cardFeeMax / 10000))}만원</strong> (0.7~1.0%)</p>
                  <p className="text-xs text-amber-600 mt-1">카드사마다 수수료율이 달라요</p>
                </div>
                <div className="space-y-2">
                  {CARD_COMPANIES.map(c => (
                    <a
                      key={c.name}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center px-3 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700">{c.name}</span>
                      <span className="text-xs text-gray-400">{c.fee} →</span>
                    </a>
                  ))}
                </div>
                <a
                  href="https://www.wetax.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  🏛️ 위택스에서 취득세 신고·납부 →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
