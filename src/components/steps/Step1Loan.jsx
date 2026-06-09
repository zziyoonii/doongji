import { useState, useEffect } from 'react'
import NumberInput from '../ui/NumberInput'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

export default function Step1Loan({ data, onChange }) {
  const [housePrice, setHousePrice] = useState(data.housePrice || '')
  const [income, setIncome] = useState(data.income || '')
  const [otherDebt, setOtherDebt] = useState(data.otherDebt || '')
  const [houseType, setHouseType] = useState(data.houseType || 'apartment')

  const ltv = houseType === 'apartment' ? 0.8 : 0.7
  const ltvLabel = houseType === 'apartment' ? '80%' : '70%'

  const ltvLimit = housePrice ? Math.floor(Number(housePrice) * ltv) : null

  // DSR: 연간 원리금 / 연소득 ≤ 40%
  // 가정: 30년 만기, 연 4.5% 금리
  const rate = 0.045
  const months = 360
  const monthlyRate = rate / 12
  const maxYearlyRepayment = income ? Number(income) * 10000 * 12 * 0.4 : null
  const maxMonthly = maxYearlyRepayment ? maxYearlyRepayment / 12 : null
  const otherMonthly = otherDebt ? Number(otherDebt) * 10000 / 12 : 0
  const availableMonthly = maxMonthly ? maxMonthly - otherMonthly : null

  // 월납입액 = P * r(1+r)^n / ((1+r)^n - 1)
  // 역산: P = monthly / (r(1+r)^n / ((1+r)^n - 1))
  const factor = monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
  const dsrLimit = availableMonthly ? Math.floor(availableMonthly / factor / 10000) : null

  const loanLimit = ltvLimit && dsrLimit ? Math.min(ltvLimit, dsrLimit) : ltvLimit || dsrLimit

  useEffect(() => {
    onChange({ housePrice, income, otherDebt, houseType, loanLimit })
  }, [housePrice, income, otherDebt, houseType, loanLimit])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">얼마까지 대출받을 수 있을까요?</h2>
        <p className="text-sm text-gray-500">생애최초 기준으로 LTV·DSR을 함께 계산해드려요</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">어떤 주택을 보고 계세요?</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'apartment', label: '🏢 아파트', sub: 'LTV 80%' },
              { value: 'other', label: '🏠 빌라·오피스텔', sub: 'LTV 70%' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHouseType(opt.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${houseType === opt.value ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'}`}
              >
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs text-gray-400">{opt.sub}</div>
              </button>
            ))}
          </div>
          <div className="mt-2">
            <InfoToggle>
              <strong>LTV(주택담보대출비율)</strong>란 집값 대비 대출 한도예요. 생애최초 구매자는 아파트 80%, 빌라·오피스텔 70%까지 대출받을 수 있어요.
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
            label="1년에 버는 돈(연봉)은 얼마예요?"
            value={income}
            onChange={setIncome}
            unit="만원"
            placeholder="5000"
            hint="세전 연봉 기준이에요"
          />
          <div className="mt-2">
            <InfoToggle>
              <strong>DSR(총부채원리금상환비율)</strong>은 연봉 대비 연간 대출 상환액이에요. 2024년부터 연봉의 40%까지만 상환할 수 있어요. 대출 한도에 가장 큰 영향을 줘요.
            </InfoToggle>
          </div>
        </div>

        <NumberInput
          label="지금 갚고 있는 다른 대출 총액이 있나요?"
          value={otherDebt}
          onChange={setOtherDebt}
          unit="만원"
          placeholder="0"
          hint="없으면 0을 입력하세요 (자동차 할부, 신용대출 등 포함)"
        />
      </div>

      {loanLimit && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">계산 결과</h3>
          <div className="grid grid-cols-1 gap-3">
            {ltvLimit && (
              <ResultCard
                label={`집값 기준 대출 한도 (LTV ${ltvLabel})`}
                value={`${formatManWon(ltvLimit)}원`}
              />
            )}
            {dsrLimit && (
              <ResultCard
                label="소득 기준 대출 한도 (DSR 40%)"
                value={`${formatManWon(dsrLimit)}원`}
                sub={`월 상환 여유: ${Math.floor(availableMonthly / 10000).toLocaleString()}만원`}
              />
            )}
            <ResultCard
              label="최종 대출 한도 (둘 중 낮은 값)"
              value={`${formatManWon(loanLimit)}원`}
              highlight
              sub="실제 은행 심사에 따라 달라질 수 있어요"
            />
          </div>
        </div>
      )}
    </div>
  )
}
