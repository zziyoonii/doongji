import { useState } from 'react'
import { useApp } from '../../context/useApp'
import { recommendLoanType, loanLimit, loanReason, bogeumjariYearAllowed, LOAN_LABELS, mpay, fmt, fmtW } from '../../utils/calc'
import Field from '../ui/Field'
import WhyToggle from '../ui/WhyToggle'
import Verdict from '../ui/Verdict'
import Chip from '../ui/Chip'
import ConfirmSheet from '../ui/ConfirmSheet'

export default function Step1Loan() {
  const { d, set, go } = useApp()
  const [showWarning, setShowWarning] = useState(false)
  const missingInput = d.price <= 0 || d.income <= 0

  const autoType = recommendLoanType(d)
  const type = d.loanTypeOverride || autoType
  const r = loanLimit(type, d)
  const monthly = mpay(r.fin, r.rate, d.years)
  const reason = d.loanTypeOverride ? '직접 선택한 상품 기준으로 계산했어요' : loanReason(type, d)

  const adjustYearsFor = next => {
    const t = d.loanTypeOverride || recommendLoanType(next)
    if (t === 'bogeumjari' && !bogeumjariYearAllowed(next, d.years)) {
      set('years', bogeumjariYearAllowed(next, 40) ? 40 : 30)
    }
  }
  const onAgeChange = v => { set('age', v); adjustYearsFor({ ...d, age: v }) }
  const onNewlywedClick = () => {
    const next = { ...d, newlywed: !d.newlywed }
    set('newlywed', next.newlywed)
    adjustYearsFor(next)
  }

  return (
    <>
      <p className="intro">
        🏠 둥지는 생애최초 주택 구매를 위한 계산 도구예요. 대출 한도와 잔금을 쉽게 계산해드려요.
      </p>

      <div className="card">
        <div className="sect">🏠 사려는 집부터 알려주세요</div>
        <Field label="집값이 얼마예요?" sub="계약하려는 집의 매매가" unit="만원" value={d.price} onChange={v => set('price', v)} placeholder="35000" />
        <Field label="연소득 (세전)이 얼마예요?" sub="부부라면 합산 소득으로 · (세전 · 은행 심사 기준)" unit="만원/년" value={d.income} onChange={v => set('income', v)} placeholder="6000" />
        <WhyToggle q="소득이 왜 필요해요?">
          은행은 갚을 능력을 확인해요. 월급 대비 매달 갚는 돈이 많으면 대출이 줄어요. 집값·소득에 따라 디딤돌대출 · HF 보금자리론 · 일반 주택담보대출 중 어떤 상품을 받을 수 있는지도 달라져요.
        </WhyToggle>
        <Field label="기존에 매달 갚는 대출이 있나요?" sub="자동차 할부, 학자금 등 · 없으면 0" unit="만원/월" value={d.existingMonthly} onChange={v => set('existingMonthly', v)} placeholder="0" />
        <Field label="나이가 어떻게 되세요?" sub="보금자리론 40·50년 만기는 나이 제한이 있어요 (신혼가구는 완화)" unit="세" value={d.age} onChange={onAgeChange} placeholder="32" />

        <div className="flabel" style={{ marginBottom: 8 }}>해당하는 게 있나요?</div>
        <div className="chips grid2">
          <Chip on={d.isFirst} onClick={() => set('isFirst', !d.isFirst)}>생애최초 구입</Chip>
          <Chip on={d.newlywed} onClick={onNewlywedClick}>신혼부부예요</Chip>
          <Chip on={d.multichild} onClick={() => set('multichild', !d.multichild)}>2자녀 이상이에요</Chip>
          <Chip on={d.regulatedArea} onClick={() => set('regulatedArea', !d.regulatedArea)}>수도권·규제지역 주택</Chip>
        </div>
        <WhyToggle q="수도권·규제지역이 왜 중요해요?">
          서울·인천·경기 또는 조정대상지역·투기과열지구 등 규제지역의 집은 보금자리론 LTV·DTI 한도가 10%p씩 줄어요. 생애최초는 예외지만, 수도권에 집을 살 땐 LTV가 80%가 아니라 70%로 적용돼요.
        </WhyToggle>

        {d.isFirst ? (
          <p className="fsub" style={{ marginTop: 4, marginBottom: 0 }}>생애최초는 아파트·연립·다세대·단독 등 주택 유형과 관계없이 LTV가 동일하게 적용돼요</p>
        ) : (
          <>
            <div className="flabel" style={{ marginTop: 4, marginBottom: 8 }}>어떤 주택이에요?</div>
            <div className="chips">
              <Chip on={d.houseType === 'apt'} onClick={() => set('houseType', 'apt')}>아파트</Chip>
              <Chip on={d.houseType === 'other'} onClick={() => set('houseType', 'other')}>기타주택 (연립·다세대·단독 등)</Chip>
            </div>
          </>
        )}

        <div className="flabel" style={{ marginTop: 18, marginBottom: 8 }}>몇 년에 걸쳐 갚을까요?</div>
        <div className="chips">
          {[10, 15, 20, 30, 40, 50].map(y => {
            const disabled = type === 'bogeumjari' && !bogeumjariYearAllowed(d, y)
            return (
              <Chip key={y} on={d.years === y} disabled={disabled} onClick={() => set('years', y)}>{y}년</Chip>
            )
          })}
        </div>
        {type === 'bogeumjari' && (!bogeumjariYearAllowed(d, 40) || !bogeumjariYearAllowed(d, 50)) && (
          <p className="fsub">40년 만기는 만 40세 미만(신혼가구 50세 미만), 50년 만기는 만 35세 미만(신혼가구 40세 미만)만 신청할 수 있어요</p>
        )}
      </div>

      <div className="card">
        <div className="sect">🧮 내 조건에 해당할 수 있는 상품</div>
        <div className="chips stack">
          {Object.entries(LOAN_LABELS).map(([key, label]) => (
            <Chip key={key} on={type === key} onClick={() => set('loanTypeOverride', key)}>{label}</Chip>
          ))}
        </div>
        {d.loanTypeOverride && (
          <button className="override-toggle" style={{ marginTop: 8 }} onClick={() => set('loanTypeOverride', null)}>
            <span>↺ 자동 계산으로 되돌리기</span>
          </button>
        )}
        <p className="fsub" style={{ marginTop: 10 }}>{reason}</p>

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
            <div className="row"><span className="l">소득 기준 한도 (DTI {r.dtiPct}%)</span><span className="r">{r.dtiL > 0 ? fmt(r.dtiL) : '소득 입력 필요'}</span></div>
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
      </div>

      <button
        className="pbtn"
        onClick={() => {
          if (missingInput) { setShowWarning(true); return }
          set('loan', r.fin)
          go(1)
        }}
      >
        이 금액으로 필요한 현금 계산하기
      </button>

      <ConfirmSheet
        open={showWarning}
        title="입력값을 확인해주세요"
        body="집값이나 소득을 입력하지 않으면 대출 한도가 정확하지 않아요"
        confirmLabel="그래도 계속할게요"
        onConfirm={() => { setShowWarning(false); set('loan', r.fin); go(1) }}
        onCancel={() => setShowWarning(false)}
      />
    </>
  )
}
