import { useState, useEffect } from 'react'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

export default function Step3Tax({ data, onChange, prevData }) {
  const [situation, setSituation] = useState(data.situation || 'first')

  const housePrice = Number(prevData?.housePrice || 0)
  const priceWon = housePrice * 10000

  // 기본 취득세율
  const getBaseTaxRate = (won) => {
    if (won <= 600000000) return 0.01 // 1%
    if (won <= 900000000) return 0.02 // 2%
    return 0.03 // 3%
  }

  const baseRate = getBaseTaxRate(priceWon)
  const baseTax = Math.floor(priceWon * baseRate)
  const educationTax = Math.floor(baseTax * 0.1) // 지방교육세 10%
  const ruralTax = priceWon > 600000000 ? Math.floor(priceWon * 0.002) : 0 // 농어촌특별세

  // 생애최초 감면 (2024년 기준)
  const firstBuyerDiscount = () => {
    if (priceWon <= 1200000000) { // 12억 이하
      const discount = Math.min(baseTax, 2000000) // 최대 200만원 감면
      return discount
    }
    return 0
  }

  // 신생아·출산 특례 (1년 내 출산·임신)
  const babyDiscount = () => {
    // 신생아 특례: 취득세 전액 면제 (5억 이하), 50% 감면 (5억~9억)
    if (priceWon <= 500000000) return baseTax + educationTax
    if (priceWon <= 900000000) return Math.floor((baseTax + educationTax) * 0.5)
    return 0
  }

  const situations = [
    { value: 'first', label: '🏠 생애최초만 해당', sub: '처음 집을 사는 경우' },
    { value: 'baby', label: '👶 신생아·출산 가구', sub: '2년 내 출산했거나 임신 중' },
    { value: 'pregnant', label: '🤰 현재 임신 중', sub: '임신 확인서 있는 경우 동일 혜택' },
    { value: 'none', label: '📋 혜택 없음', sub: '일반 취득세 적용' },
  ]

  const discount = situation === 'first'
    ? firstBuyerDiscount()
    : (situation === 'baby' || situation === 'pregnant')
    ? babyDiscount()
    : 0

  const totalBeforeDiscount = baseTax + educationTax + ruralTax
  const finalTax = Math.max(totalBeforeDiscount - discount, 0)

  useEffect(() => {
    onChange({ situation, finalTax, discount })
  }, [situation, finalTax, discount])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">취득세는 얼마나 내야 할까요?</h2>
        <p className="text-sm text-gray-500">내 상황에 맞는 감면 혜택을 적용해드려요</p>
      </div>

      {housePrice > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-700">
            📋 집값 <strong>{formatManWon(housePrice)}원</strong> 기준으로 계산해요
          </p>
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">내 상황을 골라주세요</label>
        <div className="grid grid-cols-1 gap-2">
          {situations.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSituation(opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${situation === opt.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.sub}</div>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <InfoToggle>
            <p className="mb-2"><strong>취득세</strong>는 집을 살 때 내는 세금이에요.</p>
            <p className="mb-2">• <strong>생애최초</strong>: 최대 200만원 감면 (12억 이하)</p>
            <p className="mb-2">• <strong>신생아·출산</strong>: 5억 이하 전액 면제, 9억 이하 50% 감면</p>
            <p>• 지방교육세(10%), 농어촌특별세(6억 초과 0.2%)도 포함해 계산해요</p>
          </InfoToggle>
        </div>
      </div>

      {housePrice > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">세금 계산 내역</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="space-y-0 divide-y divide-gray-50">
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-gray-600">취득세 (기본 {(baseRate * 100).toFixed(0)}%)</span>
                <span>{formatManWon(Math.round(baseTax / 10000))}원</span>
              </div>
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-gray-600">지방교육세</span>
                <span>{formatManWon(Math.round(educationTax / 10000))}원</span>
              </div>
              {ruralTax > 0 && (
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-gray-600">농어촌특별세</span>
                  <span>{formatManWon(Math.round(ruralTax / 10000))}원</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between px-4 py-3 text-sm text-green-600 bg-green-50">
                  <span>감면 혜택</span>
                  <span>- {formatManWon(Math.round(discount / 10000))}원</span>
                </div>
              )}
            </div>
          </div>
          <ResultCard
            label="최종 납부 취득세"
            value={`${formatManWon(Math.round(finalTax / 10000))}원`}
            highlight
            sub={discount > 0 ? `${formatManWon(Math.round(discount / 10000))}원 절감됐어요 🎉` : ''}
          />
        </div>
      )}
    </div>
  )
}
