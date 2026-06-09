import { useState, useEffect } from 'react'
import NumberInput from '../ui/NumberInput'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

// 보금자리론 2024년 기준 금리
const BOGEUMJARI_RATES = [
  { term: 10, rate: 3.95 },
  { term: 15, rate: 4.05 },
  { term: 20, rate: 4.15 },
  { term: 30, rate: 4.20 },
]

const DISCOUNTS = [
  { label: '신혼부부 (7년 이내)', value: 0.4 },
  { label: '한부모 가정', value: 0.5 },
  { label: '다자녀 (2자녀)', value: 0.5 },
  { label: '장애인 가구', value: 0.5 },
  { label: '생애최초 단독 해당 없음', value: 0 },
]

export default function Step4Monthly({ data, onChange, prevData }) {
  const [repayType, setRepayType] = useState(data.repayType || 'equal')
  const [monthlyLiving, setMonthlyLiving] = useState(data.monthlyLiving || '')
  const [useBogeumjari, setUseBogeumjari] = useState(data.useBogeumjari ?? false)
  const [selectedDiscount, setSelectedDiscount] = useState(data.selectedDiscount ?? 0)
  const [customRate, setCustomRate] = useState(data.customRate || '4.5')
  const [loanTerm, setLoanTerm] = useState(data.loanTerm || prevData?.loanTerm || '30')

  const loanLimit = Number(prevData?.loanLimit || 0)
  const income = Number(prevData?.income || 0)
  const monthlyIncome = income ? Math.round(income * 10000 / 12) : 0

  // 보금자리론은 최대 5억
  const bogeumjariMax = 50000 // 5억 (만원)
  const effectiveLoan = useBogeumjari ? Math.min(loanLimit, bogeumjariMax) : loanLimit

  // 적용 금리
  const bgRate = BOGEUMJARI_RATES.find(r => r.term >= Number(loanTerm))?.rate
    || BOGEUMJARI_RATES[BOGEUMJARI_RATES.length - 1].rate
  const finalRate = useBogeumjari
    ? Math.max(bgRate - selectedDiscount, 1.85)
    : Number(customRate)

  const principal = effectiveLoan * 10000
  const r = finalRate / 100 / 12
  const n = Number(loanTerm) * 12

  let monthlyPayment = 0
  if (principal > 0 && r > 0 && n > 0) {
    if (repayType === 'equal') {
      monthlyPayment = Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1))
    } else {
      monthlyPayment = Math.round(principal / n + principal * r)
    }
  }

  const totalInterest = monthlyPayment * n - principal
  const monthlyLivingNum = Number(monthlyLiving) * 10000
  const totalMonthly = monthlyPayment + monthlyLivingNum
  const remaining = monthlyIncome - totalMonthly

  useEffect(() => {
    onChange({ repayType, monthlyLiving, useBogeumjari, selectedDiscount, customRate, loanTerm, monthlyPayment, finalRate })
  }, [repayType, monthlyLiving, useBogeumjari, selectedDiscount, customRate, loanTerm, monthlyPayment, finalRate])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">매달 얼마씩 나가게 될까요?</h2>
        <p className="text-sm text-gray-500">대출 상환액과 생활비를 함께 계산해요</p>
      </div>

      {loanLimit > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-sm text-blue-700">
          대출 금액 <strong>{formatManWon(loanLimit)}만원</strong>을 기준으로 계산해요
        </div>
      )}

      {/* 보금자리론 여부 */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setUseBogeumjari(!useBogeumjari)}
          className="w-full flex justify-between items-center px-4 py-4"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">🏛️ 보금자리론 적용</p>
            <p className="text-xs text-gray-400 mt-0.5">정책금리 · 최대 5억 · 부부합산 연 7천만원 이하</p>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative ${useBogeumjari ? 'bg-amber-400' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${useBogeumjari ? 'left-7' : 'left-1'}`} />
          </div>
        </button>
        {useBogeumjari && (
          <div className="border-t border-gray-100 px-4 pb-4 space-y-3">
            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 space-y-1">
              {BOGEUMJARI_RATES.map(r => (
                <div key={r.term} className={`flex justify-between ${Number(loanTerm) === r.term ? 'font-bold text-amber-900' : ''}`}>
                  <span>{r.term}년</span><span>{r.rate}%</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">우대금리 (해당 항목 선택)</p>
              <div className="space-y-1.5">
                {DISCOUNTS.map(d => (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setSelectedDiscount(d.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm border-2 transition-all ${selectedDiscount === d.value ? 'border-amber-400 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}
                  >
                    <span>{d.label}</span>
                    {d.value > 0 && <span className="text-green-600 ml-2 font-medium">−{d.value}%</span>}
                  </button>
                ))}
              </div>
              {selectedDiscount > 0 && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  적용 금리: {bgRate}% − {selectedDiscount}% = {Math.max(bgRate - selectedDiscount, 1.85).toFixed(2)}%
                </p>
              )}
            </div>
            <InfoToggle>
              보금자리론은 한국주택금융공사의 정책 모기지예요. 연소득 7천만원 이하, 집값 6억 이하, 대출 최대 5억까지 가능해요. 우대금리는 중복 적용되지 않아요.
            </InfoToggle>
          </div>
        )}
      </div>

      {!useBogeumjari && (
        <NumberInput
          label="예상 금리"
          value={customRate}
          onChange={setCustomRate}
          unit="%"
          placeholder="4.5"
          hint="은행별로 다르니 사전 상담 후 입력하세요"
        />
      )}

      {/* 만기 */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">대출 만기</label>
        <div className="flex gap-2">
          {['10', '15', '20', '30'].map(y => (
            <button
              key={y}
              type="button"
              onClick={() => setLoanTerm(y)}
              className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${loanTerm === y ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white text-gray-600'}`}
            >
              {y}년
            </button>
          ))}
        </div>
      </div>

      {/* 상환 방식 */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">상환 방식</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'equal', label: '원리금균등', sub: '매달 같은 금액' },
            { value: 'principal', label: '원금균등', sub: '초반 많고 점점 줄어요' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRepayType(opt.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${repayType === opt.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs text-gray-400">{opt.sub}</div>
            </button>
          ))}
        </div>
        <div className="mt-2">
          <InfoToggle>
            <p><strong>원리금균등</strong>: 매달 동일한 금액 납부. 생활비 계획이 쉬워요.</p>
            <p className="mt-1"><strong>원금균등</strong>: 초반엔 더 많이 내지만 총 이자가 적어요. 장기적으로 유리해요.</p>
          </InfoToggle>
        </div>
      </div>

      <NumberInput
        label="한 달 생활비는 얼마 쓰세요?"
        value={monthlyLiving}
        onChange={setMonthlyLiving}
        unit="만원"
        placeholder="200"
        hint="식비, 교통, 통신, 보험, 구독 등 모두 합산"
      />

      {/* 결과 */}
      {monthlyPayment > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">월 지출 분석</h3>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 text-sm">
            <div className="flex justify-between px-4 py-3">
              <span className="text-gray-600">대출 월 상환액 ({finalRate.toFixed(2)}%, {loanTerm}년)</span>
              <span className="font-medium">{formatManWon(Math.round(monthlyPayment / 10000))}만</span>
            </div>
            {monthlyLivingNum > 0 && (
              <div className="flex justify-between px-4 py-3">
                <span className="text-gray-600">생활비</span>
                <span className="font-medium">{formatManWon(Number(monthlyLiving))}만</span>
              </div>
            )}
            {monthlyIncome > 0 && (
              <div className="flex justify-between px-4 py-3 bg-gray-50 font-semibold">
                <span>월 수입 (세전)</span>
                <span>{formatManWon(Math.round(monthlyIncome / 10000))}만</span>
              </div>
            )}
          </div>

          <ResultCard
            label="월 대출 상환액"
            value={`${formatManWon(Math.round(monthlyPayment / 10000))}만원`}
            sub={`총 이자: 약 ${formatManWon(Math.round(totalInterest / 10000))}만원`}
          />

          {monthlyIncome > 0 && monthlyLivingNum > 0 && (
            <ResultCard
              label={remaining >= 0 ? '✅ 월 여유 자금' : '⚠️ 월 부족액'}
              value={`${formatManWon(Math.abs(Math.round(remaining / 10000)))}만원`}
              highlight={remaining >= 0}
              warn={remaining < 0}
              sub={remaining >= 0 ? '저축·비상금으로 활용하세요' : '생활비를 줄이거나 대출 조건을 다시 검토해보세요'}
            />
          )}
        </div>
      )}
    </div>
  )
}
