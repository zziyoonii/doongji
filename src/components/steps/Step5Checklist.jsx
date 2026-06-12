import { useApp } from '../../context/useApp'
import { CHECKS } from '../../utils/calc'
import PlusLock from '../ui/PlusLock'

export default function Step5Checklist() {
  const { d, toggleDone, go } = useApp()

  const list = (
    <>
      {CHECKS.map(([ph, items]) => (
        <div className="card" key={ph}>
          <div className="sect">🪺 {ph}</div>
          {items.map(it => (
            <button key={it} className={`check ${d.done[it] ? 'done' : ''}`} onClick={() => toggleDone(it)}>
              <span>{d.done[it] ? '✅' : '⬜'}</span>
              <span style={{ lineHeight: 1.5 }}>{it}</span>
            </button>
          ))}
        </div>
      ))}
    </>
  )

  return (
    <>
      <PlusLock teaser={'잔금일 전후로 챙길 16가지,\n하나라도 놓치면 수백만원이 왔다 갔다 해요.'}>
        {list}
      </PlusLock>

      <button
        className="pbtn"
        style={{ marginTop: 14, background: 'var(--surface)', color: 'var(--nest)', border: '1.5px solid var(--nest)' }}
        onClick={() => go(0)}
      >
        처음부터 다시 계산하기
      </button>
    </>
  )
}
