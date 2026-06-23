import { useApp } from '../../context/useApp'
import { fmt } from '../../utils/calc'
import Field from '../ui/Field'
import Verdict from '../ui/Verdict'
import Chip from '../ui/Chip'

const BABY_OPTIONS = [
  ['has', '있어요 (24년 이후 출생)'],
  ['pregnant', '임신 중이에요'],
  ['none', '없어요'],
]

export default function Step3Tax() {
  const { d, set, go } = useApp()
  const total = (+d.acqTax || 0) + (+d.eduTax || 0)
  const m = d.months
  // TODO: 카드 수수료 범위(연 10~18%)는 실제 카드사 정책과 다를 수 있어 별도 확인 필요
  const lo = total * .10 * (m / 12)
  const hi = total * .18 * (m / 12)

  return (
    <>
      <div className="card">
        <div className="sect">🏛️ 위택스에서 확인한 취득세를 입력해주세요</div>
        <p className="fsub">
          <a href="https://www.wetax.go.kr" target="_blank" rel="noreferrer">위택스 바로가기</a>에서 정확한 취득세·지방교육세를 조회할 수 있어요
        </p>
        <Field label="취득세" unit="만원" value={d.acqTax} onChange={v => set('acqTax', v)} placeholder="0" />
        <Field label="지방교육세" unit="만원" value={d.eduTax} onChange={v => set('eduTax', v)} placeholder="0" />
        <Verdict ok={true} label="합계" amount={fmt(total)} />
      </div>

      <div className="card">
        <div className="sect">🙋 내 상황을 알려주세요</div>
        <div className="flabel" style={{ marginBottom: 8 }}>생애최초 주택 구매예요?</div>
        <div className="chips">
          <Chip on={d.isFirst} onClick={() => set('isFirst', true)}>맞아요</Chip>
          <Chip on={!d.isFirst} onClick={() => set('isFirst', false)}>아니에요</Chip>
        </div>
        {d.isFirst && (
          <p className="fsub" style={{ marginBottom: 0 }}>생애최초 감면 대상이에요. 위택스에서 확인해보세요</p>
        )}
        <div className="flabel" style={{ marginBottom: 8, marginTop: 14 }}>자녀가 있거나 곧 태어나요?</div>
        <div className="chips">
          {BABY_OPTIONS.map(([val, l]) => (
            <Chip key={val} on={d.baby === val} onClick={() => set('baby', val)}>{l}</Chip>
          ))}
        </div>
        {d.baby !== 'none' && (
          <p className="fsub" style={{ marginBottom: 0 }}>신생아 감면 대상이에요. 위택스에서 확인해보세요</p>
        )}
      </div>

      <div className="card">
        <div className="flabel" style={{ marginBottom: 8 }}>카드 할부로 내면?</div>
        <div className="chips">
          {[2, 3, 4, 6, 12].map(x => (
            <Chip key={x} on={m === x} onClick={() => set('months', x)}>{x}개월</Chip>
          ))}
        </div>
        <div className="row"><span className="l">월 납부액</span><span className="r">{fmt(total / m)}</span></div>
        {/* TODO: 카드사별 수수료/무이자 할부 정책이 매달 바뀌어서 이 범위 표시를 유지할지 별도 확인 필요 */}
        <div className="row"><span className="l">예상 수수료 (연 10~18%)</span><span className="r minus">{fmt(lo)} ~ {fmt(hi)}</span></div>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 10, lineHeight: 1.6 }}>
          위택스 일시불은 수수료 0원. <b>카드사 앱에서 이번 달 무이자 할부 이벤트를 확인하세요</b> — 매달 바뀌어요!
        </p>
      </div>

      <button className="pbtn" style={{ marginTop: 14 }} onClick={() => go(3)}>입주 후 매달 얼마 남을까?</button>
    </>
  )
}
