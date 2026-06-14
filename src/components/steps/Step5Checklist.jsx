import { useApp } from '../../context/useApp'
import { CHECKS, addDays, formatDateKo } from '../../utils/calc'
import { downloadIcsEvent, downloadIcsAll } from '../../utils/ics'

export default function Step5Checklist() {
  const { d, set, toggleDone, go } = useApp()
  const hasDate = !!d.balanceDate

  const allEvents = hasDate
    ? CHECKS.flatMap(({ days: phaseDays, items }) =>
        items.map(it => ({ title: it.text, date: addDays(d.balanceDate, it.days ?? phaseDays) }))
      )
    : []

  return (
    <>
      <div className="card">
        <div className="sect">📅 잔금일이 언제예요?</div>
        <div className="frow">
          <input
            type="date"
            value={d.balanceDate}
            onChange={e => set('balanceDate', e.target.value)}
          />
        </div>
        {hasDate ? (
          <button className="pbtn" onClick={() => downloadIcsAll(allEvents)}>
            🗓️ 전체 일정 캘린더에 추가
          </button>
        ) : (
          <p className="fsub" style={{ marginBottom: 0 }}>잔금일을 입력하면 날짜가 자동으로 채워져요</p>
        )}
      </div>

      {CHECKS.map(({ phase, days: phaseDays, items }) => (
        <div className="card" key={phase}>
          <div className="sect">🪺 {phase}</div>
          {items.map(it => {
            const date = hasDate ? addDays(d.balanceDate, it.days ?? phaseDays) : null
            return (
              <div key={it.text} className={`check ${d.done[it.text] ? 'done' : ''}`}>
                <button className="check-toggle" onClick={() => toggleDone(it.text)}>
                  <span>{d.done[it.text] ? '✅' : '⬜'}</span>
                </button>
                <span className="check-body">
                  <span className="check-text" style={{ lineHeight: 1.5 }}>{it.text}</span>
                  {date && <span className="check-due">{formatDateKo(date)}까지</span>}
                  {it.link && (
                    <a className="check-link" href={it.link} target="_blank" rel="noreferrer">{it.linkLabel}</a>
                  )}
                </span>
                {date && (
                  <button className="check-cal" onClick={() => downloadIcsEvent(it.text, date)} aria-label="캘린더에 추가">
                    📅
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ))}

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
