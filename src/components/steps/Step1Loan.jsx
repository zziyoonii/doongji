import { useState, useEffect } from 'react'
import NumberInput from '../ui/NumberInput'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

export default function Step1Loan({ data, onChange }) {
  const [housePrice, setHousePrice] = useState(data.housePrice || '')
  const [income, setIncome] = useState(data.income || '')
  const [otherDebt, setOtherDebt] = useState(data.otherDebt || '')
  const [loanTerm, setLoanTerm] = useState(data.loanTerm || '30')
  const [houseType, setHouseType] = useState(data.houseType || 'apartment')

  const ltv = houseType === 'apartment' ? 0.8 : 0.7
  const ltvLabel = houseType === 'apartment' ? '80%' : '70%'

  const ltvLimit = housePrice ? Math.floor(Number(housePrice) * ltv) : null

  const rate = 0.039 // 보금자리론 기본 기준
  const n = Number(loanTerm) * 12
  const r = rate / 12

  // DSR 40% 기반 최대 대출
  const maxYearlyRepayment = income ? Number(income) * 10000 * 12 * 0.4 : null
  const maxMonthly = maxYearlyRepayment ? maxYearlyRepayment / 12 : null
  const otherMonthlyDebt = otherDebt ? (Number(otherDebt) * 10000 * rate) / 12 : 0
  const availableMonthly = maxMonthly ? maxMonthly - otherMonthlyDebt : null

  const factor = r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
  const dsrLimit = availableMonthly && factor ? Math.floor(availableMonthly / factor / 10000) : null

  const loanLimit = ltvLimit && dsrLimit
    ? Math.min(ltvLimit, dsrLimit)
    : ltvLimit || dsrLimit || null

  // 현재 DSR 비율 계산 (대출받았을 때)
  const currentLoan = loanLimit ? loanLimit * 10000 : 0
  const monthlyPayment = currentLoan && factor ? Math.round(currentLoan * factor) : 0
  const yearlyPayment = monthlyPayment * 12
  const yearlyIncome = income ? Number(income) * 10000 * 12 : 0
  const dsrRatio = yearlyIncome > 0 ? Math.round((yearlyPayment / yearlyIncome) * 100) : null

  useEffect(() => {
    onChange({ housePrice, income, otherDebt, loanTerm, houseType, loanLimit, ltvLimit, dsrLimit })
  }, [housePrice, income, otherDebt, loanTerm, houseType, loanLimit])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">얼마까지 대출받을 수 있을까요?</h2>
        <p className="text-sm text-gray-500">생애최초 기준으로 LTV·DSR을 함께 계산해드려요</p>
      </div>

      <div className="space-y-4">
        {/* 주택 유형 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">어떤 주택을 보고 계세요?</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'apartment', label: '🏢 아파트', sub: 'LTV 80% (생애최초)' },
              { value: 'other', label: '🏠 빌라·오피스텔', sub: 'LTV 70%' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHouseType(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${houseType === opt.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{opt.sub}</div>
              </button>
            ))}
          </div>
          <div className="mt-2">
            <InfoToggle>
              <strong>LTV(주택담보대출비율)</strong>는 집값 대비 대출 한도예요. 생애최초 구매자는 규제지역 여부에 관계없이 아파트 80%까지 가능해요. 빌라·오피스텔은 70%가 상한이에요.
            </InfoToggle>
          </div>
        </div>

        <NumberInput
          label="보려는 집 가격은 얼마예요?"
          value={housePrice}
          onChange={setHousePrice}
          unit="만원"
          placeholder="50000"
          hint="예: 5억이면 50000 입력"
        />

        <div>
          <NumberInput
            label="1년에 버는 돈(세전 연봉)은 얼마예요?"
            value={income}
            onChange={setIncome}
            unit="만원"
            placeholder="5000"
          />
          <div className="mt-2">
            <InfoToggle>
              <strong>DSR(총부채원리금상환비율)</strong>은 1년 소득 대비 연간 원리금 상환액의 비율이에요. 은행은 이 비율이 40%를 넘지 않는 선에서만 대출해줘요. 대출 한도에 가장 큰 영향을 줘요.
            </InfoToggle>
          </div>
        </div>

        <NumberInput
          label="지금 갚고 있는 다른 대출 총액"
          value={otherDebt}
          onChange={setOtherDebt}
          unit="만원"
          placeholder="0"
          hint="자동차 할부, 신용대출 등 모두 포함. 없으면 0"
        />

        {/* 만기 선택 */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">대출 만기는 몇 년으로 할까요?</label>
          <div className="flex gap-2">
            {['20', '30', '40'].map(y => (
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
          <p className="text-xs text-gray-400 mt-1.5">만기가 길수록 월 상환액이 줄고 대출 한도가 늘어요</p>
        </div>
      </div>

      {/* 결과 */}
      {loanLimit && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">계산 결과</h3>

          {/* DSR 게이지 */}
          {dsrRatio !== null && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">내 DSR 비율</span>
                <span className={`font-bold ${dsrRatio > 40 ? 'text-red-500' : dsrRatio > 30 ? 'text-amber-500' : 'text-green-600'}`}>
                  {dsrRatio}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${dsrRatio > 40 ? 'bg-red-400' : dsrRatio > 30 ? 'bg-amber-400' : 'bg-green-400'}`}
                  style={{ width: `${Math.min(dsrRatio, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span className="text-amber-500">한도 40%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {dsrRatio <= 40
                  ? `대출 한도 내에서 월 ${Math.round(monthlyPayment / 10000).toLocaleString()}만원 납부`
                  : '소득 대비 상환액이 한도를 초과해요'}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {ltvLimit && (
              <ResultCard
                label={`집값 기준 한도 (LTV ${ltvLabel})`}
                value={`${formatManWon(ltvLimit)}원`}
              />
            )}
            {dsrLimit && (
              <ResultCard
                label={`소득 기준 한도 (DSR 40%, ${loanTerm}년)`}
                value={`${formatManWon(dsrLimit)}원`}
              />
            )}
            <ResultCard
              label="최종 대출 한도 (둘 중 낮은 값)"
              value={`${formatManWon(loanLimit)}원`}
              highlight
              sub="실제 은행 심사 결과와 다를 수 있어요"
            />
          </div>
        </div>
      )}
    </div>
  )
}
