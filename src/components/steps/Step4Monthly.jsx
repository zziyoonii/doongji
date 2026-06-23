import { useApp } from '../../context/useApp'
import { DISCOUNTS, mpay, fmtW, recommendLoanType, loanLimit, LOAN_LABELS } from '../../utils/calc'
import Field from '../ui/Field'
import Verdict from '../ui/Verdict'
import PlusLock from '../ui/PlusLock'

export default function Step4Monthly() {
  const { d, set, toggleBenefit, go } = useApp()
  const type = d.loanTypeOverride || recommendLoanType(d)
  const isPolicyLoan = type === 'didimdol' || type === 'bogeumjari'
  const base = loanLimit(type, d).rate
  const cut = isPolicyLoan
    ? Math.min(d.benefits.reduce((a, id) => a + (DISCOUNTS.find(x => x.id === id)?.r || 0), 0), 1)
    : 0
  const rt = +(base - cut).toFixed(2)
  const m = mpay(d.loan, rt, d.years)
  const inc = d.netIncome * 1e4
  const left = inc - m - d.living * 1e4 - d.existingMonthly * 1e4

  const result = (
    <div className="card">
      <div className="sect">📅 매달 살림 미리보기</div>
      <div className="row">
        <span className="l">
          {isPolicyLoan ? `적용금리 (기본 ${base}% − 우대 ${cut.toFixed(1)}%p)` : `적용금리 (기본 ${base}% 기준)`}
        </span>
        <span className="r">{rt}%</span>
      </div>
      <div className="row"><span className="l">{LOAN_LABELS[type]} 월 상환</span><span className="r minus">- {fmtW(m)}</span></div>
      <div className="row"><span className="l">생활비</span><span className="r minus">- {fmtW(d.living * 1e4)}</span></div>
      {d.existingMonthly > 0 && (
        <div className="row"><span className="l">기존 대출</span><span className="r minus">- {fmtW(d.existingMonthly * 1e4)}</span></div>
      )}
      <div className="row"><span className="l">월 소득</span><span className="r plus">+ {fmtW(inc)}</span></div>
      <Verdict
        ok={left >= 0}
        label={left >= 0 ? '매달 남는 돈' : '매달 부족한 돈'}
        amount={fmtW(Math.abs(left))}
        sub={left >= 0 ? '저축하거나 빌린 돈을 갚을 수 있어요' : '생활비를 줄이거나 만기를 늘려보세요'}
      />
    </div>
  )

  return (
    <>
      <div className="card">
        <div className="sect">📉 우대금리 챙기기</div>
        {isPolicyLoan ? (
          <>
            <p className="fsub">해당하는 것 모두 선택 — 최대 1.0%p까지 깎여요</p>
            {DISCOUNTS.map(b => {
              const on = d.benefits.includes(b.id)
              return (
                <button key={b.id} className={`benefit ${on ? 'on' : ''}`} onClick={() => toggleBenefit(b.id)}>
                  <span>{on ? '✅' : '⬜'}</span>
                  <span style={{ flex: 1 }}>
                    <span className="bn">{b.n}</span>
                    <span className="bd">{b.ds}</span>
                  </span>
                  <span className="br">-{b.r}%p</span>
                </button>
              )
            })}
          </>
        ) : (
          <p className="fsub">일반 주택담보대출은 정부 우대금리 혜택이 적용되지 않아요. 은행별 자체 우대 조건은 따로 상담받아보세요</p>
        )}
        <Field label="월 실수령액 (세후)" sub="월급에서 세금·보험 떼고 받는 금액 · (실제 통장에 들어오는 금액)" unit="만원/월" value={d.netIncome} onChange={v => set('netIncome', v)} placeholder="400" />
        <Field label="한 달 생활비" sub="식비·교통·통신 등" unit="만원" value={d.living} onChange={v => set('living', v)} placeholder="100" />
      </div>

      <PlusLock teaser={'입주 후 매달 얼마가 남는지,\n우대금리로 얼마나 아끼는지 확인해 보세요.'}>
        {result}
      </PlusLock>

      <button className="pbtn" style={{ marginTop: 14 }} onClick={() => go(4)}>마지막, 잔금일 체크리스트</button>
    </>
  )
}
