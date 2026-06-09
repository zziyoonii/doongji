import { useState, useEffect } from 'react'
import NumberInput from '../ui/NumberInput'
import ResultCard from '../ui/ResultCard'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

export default function Step2Cash({ data, onChange, prevData }) {
  const [savings, setSavings] = useState(data.savings || '')
  const [deposit, setDeposit] = useState(data.deposit || prevData?.housePrice || '')
  const [movingCost, setMovingCost] = useState(data.movingCost || '200')
  const [agentFee, setAgentFee] = useState(data.agentFee || '')

  const housePrice = Number(prevData?.housePrice || 0)
  const loanLimit = Number(prevData?.loanLimit || 0)

  // 중개보수 자동 계산
  const calcAgentFee = (price) => {
    const p = price * 10000
    if (p <= 50000000) return Math.floor(p * 0.006 / 10000)
    if (p <= 200000000) return Math.floor(p * 0.005 / 10000)
    if (p <= 600000000) return Math.floor(p * 0.004 / 10000)
    if (p <= 900000000) return Math.floor(p * 0.005 / 10000)
    return Math.floor(p * 0.009 / 10000)
  }

  const autoFee = housePrice ? calcAgentFee(housePrice) : 0

  useEffect(() => {
    if (!agentFee && autoFee) setAgentFee(String(autoFee))
  }, [autoFee])

  const depositNum = Number(deposit)
  const downPayment = housePrice > 0 && loanLimit > 0 ? Math.max(housePrice - loanLimit, 0) : null
  const totalNeeded = (downPayment || 0) + Number(movingCost || 0) + Number(agentFee || 0)
  const savingsNum = Number(savings)
  const gap = totalNeeded - savingsNum

  useEffect(() => {
    onChange({ savings, deposit, movingCost, agentFee, totalNeeded, gap })
  }, [savings, deposit, movingCost, agentFee, totalNeeded, gap])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">실제로 필요한 현금은 얼마일까요?</h2>
        <p className="text-sm text-gray-500">대출 외에 직접 준비해야 할 돈을 계산해요</p>
      </div>

      {housePrice > 0 && loanLimit > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-700">
            📋 앞 단계에서: 집값 <strong>{formatManWon(housePrice)}원</strong>, 대출 <strong>{formatManWon(loanLimit)}원</strong>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            → 최소 자기 부담금: <strong>{formatManWon(Math.max(housePrice - loanLimit, 0))}원</strong>
          </p>
        </div>
      )}

      <div className="space-y-4">
        <NumberInput
          label="지금 모아둔 돈(저축)은 얼마예요?"
          value={savings}
          onChange={setSavings}
          unit="만원"
          placeholder="5000"
          hint="예금, 적금, 청약 등 다 합쳐서요"
        />

        <div>
          <NumberInput
            label="이사 비용은 얼마 예상하세요?"
            value={movingCost}
            onChange={setMovingCost}
            unit="만원"
            placeholder="200"
            hint="이사비 + 초기 인테리어 등 포함"
          />
        </div>

        <div>
          <NumberInput
            label="부동산 중개보수"
            value={agentFee}
            onChange={setAgentFee}
            unit="만원"
            placeholder={String(autoFee)}
            hint={autoFee ? `집값 기준 자동 계산: 약 ${autoFee.toLocaleString()}만원` : ''}
          />
          <div className="mt-2">
            <InfoToggle>
              부동산 중개보수는 거래금액에 따라 법적으로 상한선이 있어요. 6억 이하는 0.4%, 9억 이하는 0.5% 등이에요. 자동으로 계산해두었지만 실제 협의 금액을 입력해도 돼요.
            </InfoToggle>
          </div>
        </div>
      </div>

      {savings && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">자금 흐름 요약</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">계약금 (보통 집값의 10%)</span>
              <span className="font-medium">{formatManWon(Math.floor(housePrice * 0.1))}원</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">잔금 (집값 - 대출 - 계약금)</span>
              <span className="font-medium">
                {formatManWon(Math.max(housePrice - loanLimit - Math.floor(housePrice * 0.1), 0))}원
              </span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">이사 비용</span>
              <span className="font-medium">{formatManWon(Number(movingCost || 0))}원</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">중개보수</span>
              <span className="font-medium">{formatManWon(Number(agentFee || 0))}원</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b-2 border-gray-800 font-semibold">
              <span>총 필요 금액</span>
              <span>{formatManWon(totalNeeded)}원</span>
            </div>
            <ResultCard
              label={gap > 0 ? '⚠️ 부족한 금액' : '✅ 여유 자금'}
              value={`${formatManWon(Math.abs(gap))}원`}
              highlight={gap <= 0}
              warn={gap > 0}
              sub={gap > 0 ? '부모님 증여, 전세자금 대출 전환, 청약저축 해지 등을 고려해보세요' : '여유가 있어요! 예비비로 남겨두면 좋아요'}
            />
          </div>
        </div>
      )}
    </div>
  )
}
