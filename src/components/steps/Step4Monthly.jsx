import { useState, useEffect } from 'react'
import NumberInput from '../ui/NumberInput'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

export default function Step4Monthly({ data, onChange, prevData }) {
  const [loanRate, setLoanRate] = useState(data.loanRate || '4.5')
  const [loanTerm, setLoanTerm] = useState(data.loanTerm || '30')
  const [repayType, setRepayType] = useState(data.repayType || 'equal')
  const [monthlyLiving, setMonthlyLiving] = useState(data.monthlyLiving || '')

  const loanLimit = Number(prevData?.loanLimit || 0)
  const income = Number(prevData?.income || 0)
  const monthlyIncome = Math.round(income * 10000 / 12)

  const principal = loanLimit * 10000
  const rate = Number(loanRate) / 100 / 12
  const n = Number(loanTerm) * 12

  let monthlyPayment = 0
  if (principal > 0 && rate > 0 && n > 0) {
    if (repayType === 'equal') {
      // 원리금균등상환
      monthlyPayment = Math.round(principal * rate * Math.pow(1 + rate, n) / (Math.pow(1 + rate, n) - 1))
    } else {
      // 원금균등상환 (1회차)
      monthlyPayment = Math.round(principal / n + principal * rate)
    }
  }

  const monthlyLivingNum = Number(monthlyLiving) * 10000
  const totalMonthly = monthlyPayment + monthlyLivingNum
  const remaining = monthlyIncome - totalMonthly
  const isOk = remaining > 0

  useEffect(() => {
    onChange({ loanRate, loanTerm, repayType, monthlyLiving, monthlyPayment })
  }, [loanRate, loanTerm, repayType, monthlyLiving, monthlyPayment])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">매달 얼마씩 나가게 될까요?</h2>
        <p className="text-sm text-gray-500">대출 상환액과 생활비를 비교해봐요</p>
      </div>

      {loanLimit > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-700">
            📋 대출 금액 <strong>{formatManWon(loanLimit)}원</strong>을 기준으로 계산해요
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">상환 방식을 골라주세요</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'equal', label: '원리금균등', sub: '매달 같은 금액' },
              { value: 'principal', label: '원금균등', sub: '초반에 더 많이 내고 줄어요' },
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
              <p className="mb-1"><strong>원리금균등</strong>: 매달 동일한 금액 납부. 예측이 쉬워요.</p>
              <p><strong>원금균등</strong>: 초반엔 더 많이 내지만 총 이자가 더 적어요. 초기 부담이 크지만 장기적으로 유리해요.</p>
            </InfoToggle>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="예상 금리"
            value={loanRate}
            onChange={setLoanRate}
            unit="%"
            placeholder="4.5"
          />
          <NumberInput
            label="대출 기간"
            value={loanTerm}
            onChange={setLoanTerm}
            unit="년"
            placeholder="30"
          />
        </div>

        <NumberInput
          label="한 달 생활비는 얼마 쓰세요?"
          value={monthlyLiving}
          onChange={setMonthlyLiving}
          unit="만원"
          placeholder="200"
          hint="식비, 교통비, 통신비, 보험 등 합산"
        />
      </div>

      {monthlyPayment > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">월 지출 분석</h3>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-gray-600">대출 월 상환액</span>
              <span className="font-medium">{formatManWon(Math.round(monthlyPayment / 10000))}원</span>
            </div>
            {monthlyLivingNum > 0 && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-gray-600">생활비</span>
                <span className="font-medium">{formatManWon(Number(monthlyLiving))}원</span>
              </div>
            )}
            {monthlyIncome > 0 && (
              <div className="flex justify-between px-4 py-3 text-sm font-semibold">
                <span>월 수입 (세전 기준)</span>
                <span>{formatManWon(Math.round(monthlyIncome / 10000))}원</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <ResultCard
              label="월 대출 상환액"
              value={`${formatManWon(Math.round(monthlyPayment / 10000))}원`}
              sub={`연간 ${formatManWon(Math.round(monthlyPayment * 12 / 10000))}원`}
            />
            {monthlyIncome > 0 && monthlyLivingNum > 0 && (
              <ResultCard
                label={isOk ? '✅ 월 여유 자금' : '⚠️ 월 부족액'}
                value={`${formatManWon(Math.abs(Math.round(remaining / 10000)))}원`}
                highlight={isOk}
                warn={!isOk}
                sub={isOk ? '저축·비상금으로 활용하세요' : '생활비를 줄이거나 대출을 조정해보세요'}
              />
            )}
          </div>

          {loanLimit > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 text-sm">
              <p className="text-gray-600 font-medium mb-2">💡 총 이자 내역</p>
              <p className="text-gray-500">
                {loanTerm}년 동안 낼 총 이자: 약{' '}
                <strong className="text-gray-800">
                  {formatManWon(Math.round((monthlyPayment * n - principal) / 10000))}원
                </strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
