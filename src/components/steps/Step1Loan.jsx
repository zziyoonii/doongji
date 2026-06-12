import { useApp } from '../../context/useApp'
import { limit, fmt } from '../../utils/calc'
import Field from '../ui/Field'
import WhyToggle from '../ui/WhyToggle'
import Verdict from '../ui/Verdict'
import Chip from '../ui/Chip'

export default function Step1Loan() {
  const { d, set, go } = useApp()
  const r = limit(d)
  const ok = r.dsr <= 40

  return (
    <>
      <div className="card">
        <div className="sect">🏠 사려는 집부터 알려주세요</div>
        <Field label="집값이 얼마예요?" sub="계약하려는 집의 매매가" unit="만원" value={d.price} onChange={v => set('price', v)} />
        <WhyToggle q="소득이 왜 필요해요?">
          은행은 갚을 능력을 확인해요. 월급 대비 매달 갚는 돈이 많으면 대출이 줄어요. 이게 <b>DSR</b> — "월급의 몇 %를 빚 갚는 데 써요?"예요.
        </WhyToggle>
        <Field label="연소득이 얼마예요?" sub="부부라면 합산 소득으로" unit="만원/년" value={d.income} onChange={v => set('income', v)} />
        <Field label="기존에 매달 갚는 대출이 있나요?" sub="자동차 할부, 학자금 등 · 없으면 0" unit="만원/월" value={d.existingMonthly} onChange={v => set('existingMonthly', v)} />
        <div className="flabel" style={{ marginBottom: 8 }}>몇 년에 걸쳐 갚을까요?</div>
        <div className="chips">
          {[10, 20, 30, 40, 50].map(y => (
            <Chip key={y} on={d.years === y} onClick={() => set('years', y)}>{y}년</Chip>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="sect">🧮 빌릴 수 있는 금액</div>
        <div className="row"><span className="l">집값 기준 한도 (LTV 70%)</span><span className="r">{fmt(r.ltv)}</span></div>
        <div className="row"><span className="l">소득 기준 한도 (DSR 40%)</span><span className="r">{r.dsrL > 0 ? fmt(r.dsrL) : '소득 입력 필요'}</span></div>
        <WhyToggle q="LTV, DSR이 뭐예요?">
          <b>LTV</b>는 "집값의 70%까지만", <b>DSR</b>은 "월급의 40% 넘게 빚 갚는 데 쓰면 안 돼요"라는 규칙. 둘 중 <b>낮은 금액</b>이 실제 한도예요.
        </WhyToggle>
        <Verdict
          ok={ok}
          label="최종 대출 가능 금액"
          amount={fmt(r.fin)}
          sub={`적용금리 ${r.rt}% 기준 · DSR ${Math.round(r.dsr)}%${ok ? ' (적정)' : ' (빠듯해요)'}`}
        />
      </div>

      <button className="pbtn" onClick={() => { set('loan', r.fin); go(1) }}>이 금액으로 필요한 현금 계산하기</button>
    </>
  )
}
