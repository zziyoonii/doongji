import { useApp } from '../../context/useApp'
import { flow, fmt } from '../../utils/calc'
import Field from '../ui/Field'
import WhyToggle from '../ui/WhyToggle'
import Verdict from '../ui/Verdict'

export default function Step2Cash() {
  const { d, set, setFee, go } = useApp()
  const r = flow(d)

  return (
    <>
      <div className="card">
        <div className="sect">💰 잔금일에 오가는 돈</div>
        <Field label="계약금은 얼마 냈어요?" sub="보통 집값의 10%" unit="만원" value={d.deposit} onChange={v => set('deposit', v)} />
        <Field label="대출 받는 금액" sub="STEP 1에서 계산한 금액이 들어가 있어요" unit="만원" value={d.loan} onChange={v => set('loan', v)} />
      </div>

      <div className="card">
        <div className="sect">🏢 지금 전세·월세 보증금이 있나요?</div>
        <Field label="돌려받을 보증금" sub="없으면 0" unit="만원" value={d.guarantee} onChange={v => set('guarantee', v)} />
        <Field label="보증금에 묶인 대출" sub="전세자금대출 등 — 받자마자 바로 갚아야 해요" unit="만원" value={d.oldLoan} onChange={v => set('oldLoan', v)} />
      </div>

      <div className="card">
        <div className="sect">👛 내가 준비한 돈</div>
        <Field label="통장에 있는 현금" unit="만원" value={d.cash} onChange={v => set('cash', v)} />
        <Field label="잔금일 전에 들어올 돈" sub="주식 매도금 등 — 국내주식은 매도 후 영업일 2일 뒤 입금돼요!" unit="만원" value={d.stock} onChange={v => set('stock', v)} />
        <Field label="가족·지인에게 빌리는 돈" sub="없으면 0" unit="만원" value={d.borrow} onChange={v => set('borrow', v)} />
      </div>

      <div className="card">
        <div className="sect">🧾 집값 말고도 나가는 돈</div>
        {d.fees.map((f, i) => (
          <div key={f.id}>
            {f.why && <WhyToggle q={`${f.name}이 뭐예요?`}>{f.why}</WhyToggle>}
            <div className="flabel">{f.name}</div>
            <div className="frow">
              <input type="number" value={f.a} onChange={e => setFee(i, +e.target.value || 0)} />
              <span>만원</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="sect">🔁 당일 자금 흐름</div>
        <div className="row"><span className="l">내가 낼 잔금 (집값−계약금−대출)</span><span className="r minus">- {fmt(r.bal)}</span></div>
        <div className="row"><span className="l">부대비용 합계</span><span className="r minus">- {fmt(r.fees)}</span></div>
        <div className="row"><span className="l">보증금 순수 회수</span><span className="r plus">+ {fmt(r.gn)}</span></div>
        <div className="row"><span className="l">내 돈 (현금+입금예정+차용)</span><span className="r plus">+ {fmt(r.have)}</span></div>
        <Verdict
          ok={r.diff >= 0}
          label={r.diff >= 0 ? '여유 금액' : '부족한 금액'}
          amount={fmt(Math.abs(r.diff))}
          sub={r.diff >= 0 ? '당일 자금이 충분해요' : '추가 자금이 필요해요'}
        />
      </div>

      <button className="pbtn" onClick={() => go(2)}>취득세는 얼마나 아낄 수 있을까?</button>
    </>
  )
}
