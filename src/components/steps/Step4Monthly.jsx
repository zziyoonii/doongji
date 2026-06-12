import { useApp } from '../../context/useApp'
import { RATES, DISCOUNTS, mpay, fmtW } from '../../utils/calc'
import Field from '../ui/Field'
import Verdict from '../ui/Verdict'
import PlusLock from '../ui/PlusLock'

export default function Step4Monthly() {
  const { d, set, toggleBenefit, go } = useApp()
  const base = RATES[d.years]
  const cut = Math.min(d.benefits.reduce((a, id) => a + (DISCOUNTS.find(x => x.id === id)?.r || 0), 0), 1)
  const rt = +(base - cut).toFixed(2)
  const m = mpay(d.loan, rt, d.years)
  const inc = d.income / 12 * 1e4
  const left = inc - m - d.living * 1e4 - d.existingMonthly * 1e4

  const result = (
    <div className="card">
      <div className="sect">📅 매달 살림 미리보기</div>
      <div className="row"><span className="l">적용금리 (기본 {base}% − 우대 {cut.toFixed(1)}%p)</span><span className="r">{rt}%</span></div>
      <div className="row"><span className="l">보금자리론 월 상환</span><span className="r minus">- {fmtW(m)}</span></div>
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
        <Field label="한 달 생활비" sub="식비·교통·통신 등" unit="만원" value={d.living} onChange={v => set('living', v)} />
      </div>

      <PlusLock teaser={'입주 후 매달 얼마가 남는지,\n우대금리로 얼마나 아끼는지 확인해 보세요.'}>
        {result}
      </PlusLock>

      <button className="pbtn" style={{ marginTop: 14 }} onClick={() => go(4)}>마지막, 잔금일 체크리스트</button>
    </>
  )
}
