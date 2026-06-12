import { useApp } from '../../context/useApp'
import { tax, fmt } from '../../utils/calc'
import Verdict from '../ui/Verdict'
import Chip from '../ui/Chip'
import PlusLock from '../ui/PlusLock'

const BABY_OPTIONS = [
  ['has', '있어요 (24년 이후 출생)'],
  ['pregnant', '임신 중이에요'],
  ['none', '없어요'],
]

export default function Step3Tax() {
  const { d, set, go } = useApp()
  const t = tax(d)
  const m = d.months
  const lo = t.fin * .10 * (m / 12)
  const hi = t.fin * .18 * (m / 12)

  const result = (
    <div className="card">
      <div className="sect">🎁 내 상황 최대 혜택</div>
      <div className="row"><span className="l">취득세 ({(t.rate * 100).toFixed(0)}%) + 지방교육세</span><span className="r minus">- {fmt(t.total)}</span></div>
      {d.isFirst && (
        <div className="row"><span className="l">생애최초 감면 (최대 200만원)</span><span className="r plus">+ {fmt(t.fc)}</span></div>
      )}
      {d.baby !== 'none' && (
        <div className="row"><span className="l">신생아 감면 (최대 500만원)</span><span className="r plus">+ {fmt(t.bc)}</span></div>
      )}
      <Verdict ok={true} label="실제 납부할 취득세" amount={fmt(t.fin)} sub={t.best > 0 ? fmt(t.best) + ' 아꼈어요!' : ''} />
      {d.baby === 'pregnant' && (
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink-soft)', marginTop: 12 }}>
          임신 중이면 일단 납부하고, 잔금일 기준 1년 이내 출산하면 <b>경정청구로 환급</b>받을 수 있어요 (최대 500만원).
        </p>
      )}
      <div style={{ marginTop: 18 }}>
        <div className="flabel" style={{ marginBottom: 8 }}>카드 할부로 내면?</div>
        <div className="chips">
          {[2, 3, 4, 6, 12].map(x => (
            <Chip key={x} on={m === x} onClick={() => set('months', x)}>{x}개월</Chip>
          ))}
        </div>
        <div className="row"><span className="l">월 납부액</span><span className="r">{fmt(t.fin / m)}</span></div>
        <div className="row"><span className="l">예상 수수료 (연 10~18%)</span><span className="r minus">{fmt(lo)} ~ {fmt(hi)}</span></div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.6 }}>
          위택스 일시불은 수수료 0원. 할부는 카드사 <b>무이자 이벤트</b>부터 확인하세요 — 매달 바뀌어요!
        </p>
      </div>
    </div>
  )

  return (
    <>
      <div className="card">
        <div className="sect">🙋 내 상황을 알려주세요</div>
        <div className="flabel" style={{ marginBottom: 8 }}>생애최초 주택 구매예요?</div>
        <div className="chips">
          <Chip on={d.isFirst} onClick={() => set('isFirst', true)}>맞아요</Chip>
          <Chip on={!d.isFirst} onClick={() => set('isFirst', false)}>아니에요</Chip>
        </div>
        <div className="flabel" style={{ marginBottom: 8 }}>자녀가 있거나 곧 태어나요?</div>
        <div className="chips">
          {BABY_OPTIONS.map(([val, l]) => (
            <Chip key={val} on={d.baby === val} onClick={() => set('baby', val)}>{l}</Chip>
          ))}
        </div>
      </div>

      <PlusLock teaser={`내 상황으로 최대 ${fmt(Math.max(t.best, 200))}을 아낄 수 있어요.\n정확한 감면액과 할부 전략을 확인해 보세요.`}>
        {result}
      </PlusLock>

      <button className="pbtn" style={{ marginTop: 14 }} onClick={() => go(3)}>입주 후 매달 얼마 남을까?</button>
    </>
  )
}
