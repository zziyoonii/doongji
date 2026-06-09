import { useState, useEffect } from 'react'
import NumberInput from '../ui/NumberInput'
import InfoToggle from '../ui/InfoToggle'
import { formatManWon } from '../../utils/format'

export default function Step2Cash({ data, onChange, prevData }) {
  const [myCash, setMyCash] = useState(data.myCash || '')
  const [stocks, setStocks] = useState(data.stocks || '')
  const [borrowed, setBorrowed] = useState(data.borrowed || '')
  const [movingCost, setMovingCost] = useState(data.movingCost || '200')
  const [agentFee, setAgentFee] = useState(data.agentFee || '')
  const [furnish, setFurnish] = useState(data.furnish || '')

  const housePrice = Number(prevData?.housePrice || 0)
  const loanLimit = Number(prevData?.loanLimit || 0)

  // 중개보수 자동 계산
  const calcAgentFee = (priceMan) => {
    const p = priceMan * 10000
    if (p <= 50000000) return Math.floor(p * 0.006 / 10000)
    if (p <= 200000000) return Math.floor(p * 0.005 / 10000)
    if (p <= 600000000) return Math.floor(p * 0.004 / 10000)
    if (p <= 900000000) return Math.floor(p * 0.005 / 10000)
    return Math.floor(p * 0.009 / 10000)
  }

  const autoFee = housePrice ? calcAgentFee(housePrice) : 0

  useEffect(() => {
    if (!data.agentFee && autoFee) setAgentFee(String(autoFee))
  }, [autoFee])

  // 들어오는 돈
  const inTotal = Number(myCash || 0) + Number(stocks || 0) + Number(borrowed || 0)

  // 나가는 돈
  const depositAmt = housePrice > 0 ? Math.floor(housePrice * 0.1) : 0     // 계약금 10%
  const balanceAmt = housePrice > 0 && loanLimit > 0
    ? Math.max(housePrice - loanLimit - depositAmt, 0)
    : 0
  const outTotal = depositAmt + balanceAmt + Number(movingCost || 0) + Number(agentFee || 0) + Number(furnish || 0)

  const gap = inTotal - outTotal

  useEffect(() => {
    onChange({ myCash, stocks, borrowed, movingCost, agentFee, furnish, inTotal, outTotal, gap })
  }, [myCash, stocks, borrowed, movingCost, agentFee, furnish, inTotal, outTotal, gap])

  const Row = ({ label, value, sub, plus }) => (
    <div className={`flex justify-between items-center px-4 py-3 text-sm ${plus ? 'bg-green-50' : ''}`}>
      <div>
        <span className="text-gray-700">{label}</span>
        {sub && <span className="text-xs text-gray-400 ml-1">{sub}</span>}
      </div>
      <span className={`font-semibold ${plus ? 'text-green-700' : 'text-gray-800'}`}>
        {plus ? '+' : ''}{formatManWon(Number(value) || 0)}만
      </span>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">실제로 필요한 현금은 얼마일까요?</h2>
        <p className="text-sm text-gray-500">들어오는 돈 vs 나가는 돈을 한눈에 비교해요</p>
      </div>

      {housePrice > 0 && loanLimit > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-sm text-blue-700">
          집값 <strong>{formatManWon(housePrice)}만</strong> · 대출 <strong>{formatManWon(loanLimit)}만</strong> 기준이에요
        </div>
      )}

      {/* 들어오는 돈 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-400" /> 들어오는 돈
        </h3>
        <div className="space-y-3">
          <NumberInput label="내 통장에 있는 현금·예금" value={myCash} onChange={setMyCash} unit="만원" placeholder="3000" />
          <NumberInput label="팔 수 있는 주식·펀드" value={stocks} onChange={setStocks} unit="만원" placeholder="0" hint="청산 후 세금 차감한 실수령 금액" />
          <div>
            <NumberInput label="부모님·지인에게 빌릴 수 있는 돈" value={borrowed} onChange={setBorrowed} unit="만원" placeholder="0" />
            <div className="mt-1">
              <InfoToggle>
                가족 간 차용금은 연 4.6% 이상 이자를 주거나, 2억 이하면 무이자도 가능해요. 차용증을 꼭 써두세요. 증여로 간주되면 증여세가 나올 수 있어요.
              </InfoToggle>
            </div>
          </div>
        </div>
      </div>

      {/* 나가는 돈 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-400" /> 나가는 돈
        </h3>
        <div className="space-y-3">
          <NumberInput label="이사 비용" value={movingCost} onChange={setMovingCost} unit="만원" placeholder="200" hint="이삿짐센터 + 청소 등" />
          <NumberInput
            label="부동산 중개보수"
            value={agentFee}
            onChange={setAgentFee}
            unit="만원"
            placeholder={String(autoFee)}
            hint={autoFee ? `집값 기준 법정 상한: 약 ${autoFee.toLocaleString()}만원` : ''}
          />
          <NumberInput label="입주 인테리어·가구" value={furnish} onChange={setFurnish} unit="만원" placeholder="0" />
        </div>
      </div>

      {/* 자금 흐름 요약 */}
      {(inTotal > 0 || outTotal > 0) && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">자금 흐름 요약</h3>

          {/* 들어오는 돈 카드 */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
            <div className="px-4 py-2 bg-green-50">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">+ 들어오는 돈</span>
            </div>
            {myCash && <Row label="현금·예금" value={myCash} plus />}
            {stocks && <Row label="주식·펀드" value={stocks} plus />}
            {borrowed && <Row label="차용금" value={borrowed} plus />}
            <div className="flex justify-between px-4 py-3 font-bold text-sm border-t border-green-100 bg-green-50">
              <span className="text-green-800">소계</span>
              <span className="text-green-700">{formatManWon(inTotal)}만</span>
            </div>
          </div>

          {/* 나가는 돈 카드 */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
            <div className="px-4 py-2 bg-red-50">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">− 나가는 돈</span>
            </div>
            {housePrice > 0 && <Row label={`계약금`} sub="(집값 10%)" value={depositAmt} />}
            {balanceAmt > 0 && <Row label="잔금" sub="(집값 − 대출 − 계약금)" value={balanceAmt} />}
            {movingCost && <Row label="이사 비용" value={movingCost} />}
            {agentFee && <Row label="중개보수" value={agentFee} />}
            {furnish && <Row label="인테리어·가구" value={furnish} />}
            <div className="flex justify-between px-4 py-3 font-bold text-sm border-t border-red-100 bg-red-50">
              <span className="text-red-800">소계</span>
              <span className="text-red-600">{formatManWon(outTotal)}만</span>
            </div>
          </div>

          {/* 최종 결과 */}
          <div className={`rounded-2xl p-5 border-2 ${gap >= 0 ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-300'}`}>
            <p className="text-sm font-medium text-gray-600 mb-1">{gap >= 0 ? '✅ 여유 자금' : '⚠️ 부족한 금액'}</p>
            <p className={`text-3xl font-bold ${gap >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {formatManWon(Math.abs(gap))}만원
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {gap >= 0
                ? '예비비로 남겨두면 좋아요. 취득세도 잊지 마세요!'
                : '부족 금액을 줄이려면: 대출 늘리기 · 부모님 차용 · 청약저축 해지 등을 고려해보세요'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
