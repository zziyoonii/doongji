import { useState } from 'react'
import { useApp } from '../../context/useApp'
import { recommendLoanType, loanLimit, loanReason, LOAN_LABELS, mpay, fmt, fmtW } from '../../utils/calc'
import Field from '../ui/Field'
import WhyToggle from '../ui/WhyToggle'
import Verdict from '../ui/Verdict'
import Chip from '../ui/Chip'

export default function Step1Loan() {
  const { d, set, go } = useApp()
  const [showOverride, setShowOverride] = useState(false)

  const autoType = recommendLoanType(d)
  const type = d.loanTypeOverride || autoType
  const r = loanLimit(type, d)
  const monthly = mpay(r.fin, r.rate, d.years)
  const reason = d.loanTypeOverride ? '직접 선택한 상품 기준으로 계산했어요' : loanReason(type, d)

  return (
    <>
      <p className="intro">
        둥지는 생애최초 주택 구매를 위한 계산 도구예요. 대출 한도와 잔금을 쉽게 계산하고, 금융 상품을 중개하거나 권유하지 않아요.
      </p>

      <div className="card">
        <div className="sect">🏠 사려는 집부터 알려주세요</div>
        <Field label="집값이 얼마예요?" sub="계약하려는 집의 매매가" unit="만원" value={d.price} onChange={v => set('price', v)} />
        <WhyToggle q="소득이 왜 필요해요?">
          은행은 갚을 능력을 확인해요. 월급 대비 매달 갚는 돈이 많으면 대출이 줄어요. 집값·소득에 따라 디딤돌대출 · HF 보금자리론 · 일반 주택담보대출 중 어떤 상품을 받을 수 있는지도 달라져요.
        </WhyToggle>
        <Field label="연소득 (세전)이 얼마예요?" sub="부부라면 합산 소득으로 · (세전 · 은행 심사 기준)" unit="만원/년" value={d.income} onChange={v => set('income', v)} />
        <Field label="기존에 매달 갚는 대출이 있나요?" sub="자동차 할부, 학자금 등 · 없으면 0" unit="만원/월" value={d.existingMonthly} onChange={v => set('existingMonthly', v)} />

        <div className="flabel" style={{ marginBottom: 8 }}>해당하는 게 있나요?</div>
        <div className="chips">
          <Chip on={d.isFirst} onClick={() => set('isFirst', !d.isFirst)}>생애최초 구입</Chip>
          <Chip on={d.newlywed} onClick={() => set('newlywed', !d.newlywed)}>신혼부부예요</Chip>
          <Chip on={d.multichild} onClick={() => set('multichild', !d.multichild)}>2자녀 이상이에요</Chip>
        </div>

        <div className="flabel" style={{ marginBottom: 8 }}>몇 년에 걸쳐 갚을까요?</div>
        <div className="chips">
          {[10, 20, 30, 40, 50].map(y => (
            <Chip key={y} on={d.years === y} onClick={() => set('years', y)}>{y}년</Chip>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="sect">🧮 내 조건에 해당할 수 있는 상품</div>
        <div className="flabel">{LOAN_LABELS[type]}</div>
        <p className="fsub">{reason}</p>

        {type === 'didimdol' && (
          <>
            <div className="row"><span className="l">집값 기준 한도 (LTV 70%)</span><span className="r">{fmt(r.ltv)}</span></div>
            <div className="row"><span className="l">디딤돌대출 한도</span><span className="r">{fmt(r.cap)}</span></div>
          </>
        )}
        {type === 'bogeumjari' && (
          <>
            <div className="row"><span className="l">집값 기준 한도 (LTV {r.ltvPct}%)</span><span className="r">{fmt(r.ltv)}</span></div>
            <div className="row"><span className="l">보금자리론 한도</span><span className="r">{fmt(r.cap)}</span></div>
            <div className="row"><span className="l">소득 기준 한도 (DTI 60%)</span><span className="r">{r.dtiL > 0 ? fmt(r.dtiL) : '소득 입력 필요'}</span></div>
          </>
        )}
        {type === 'general' && (
          <>
            <div className="row"><span className="l">집값 기준 한도 (LTV 70%)</span><span className="r">{fmt(r.ltv)}</span></div>
            <div className="row"><span className="l">소득 기준 한도 (DSR 40%)</span><span className="r">{r.dsrL > 0 ? fmt(r.dsrL) : '소득 입력 필요'}</span></div>
          </>
        )}

        <Verdict
          ok={true}
          label="대출 가능 금액"
          amount={fmt(r.fin)}
          sub={type === 'didimdol' ? `금리 ${r.rateLabel} (평균 ${r.rate}% 적용)` : `적용금리 ${r.rate}% 기준`}
        />
        <div className="row"><span className="l">예상 월 상환액</span><span className="r">{fmtW(monthly)}</span></div>

        <button className="whybtn" style={{ marginTop: 12 }} onClick={() => setShowOverride(o => !o)}>이 조건이 아닌 것 같아요</button>
        {showOverride && (
          <div className="chips" style={{ marginTop: 10 }}>
            {Object.entries(LOAN_LABELS).map(([key, label]) => (
              <Chip key={key} on={type === key} onClick={() => set('loanTypeOverride', key)}>{label}</Chip>
            ))}
            <Chip on={!d.loanTypeOverride} onClick={() => set('loanTypeOverride', null)}>자동 계산으로</Chip>
          </div>
        )}
      </div>

      <button className="pbtn" onClick={() => { set('loan', r.fin); go(1) }}>이 금액으로 필요한 현금 계산하기</button>
    </>
  )
}
