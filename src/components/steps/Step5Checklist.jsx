import { useEffect } from 'react'
import { useApp } from '../../context/useApp'
import { CHECKS, addDays, formatDateKo, fmt, recommendLoanType } from '../../utils/calc'
import { logScreen, logClick } from '../../utils/analytics'
import { addToCalendar } from '../../utils/ics'
import { openExternal } from '../../utils/openExternal'

export default function Step5Checklist() {
  const { d, set, toggleDone, go } = useApp()
  const hasDate = !!d.balanceDate
  const bondFee = d.fees.find(f => f.id === 'bond')?.a || 0
  const loanType = d.loanTypeOverride || recommendLoanType(d)

  useEffect(() => {
    logScreen('checklist_viewed')
  }, [])

  const onToggleDone = item => {
    toggleDone(item)
    logClick('checklist_item_checked')
  }

  return (
    <>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>🏡</div>
        <div className="sect">새 둥지로 이사하는 날까지, 둥지가 함께할게요!</div>
      </div>

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
          <p className="fsub" style={{ marginBottom: 0 }}>각 항목의 📅를 누르면 그 일정만 캘린더에 추가할 수 있어요</p>
        ) : (
          <p className="fsub" style={{ marginBottom: 0 }}>잔금일을 입력하면 날짜가 자동으로 채워져요</p>
        )}
      </div>

      {CHECKS.map(({ phase, days: phaseDays, items }) => (
        <div className="card" key={phase}>
          <div className="sect">🪺 {phase}</div>
          {items.filter(it => !it.onlyTypes || it.onlyTypes.includes(loanType)).map(it => {
            const date = hasDate ? addDays(d.balanceDate, it.days ?? phaseDays) : null
            const baseText = it.textByType?.[loanType] || it.text
            const text = it.id === 'bondFee' ? `${baseText} (${fmt(bondFee)} 여유있게)` : baseText
            return (
              <div key={it.text} className={`check ${d.done[it.text] ? 'done' : ''}`}>
                <button className="check-toggle" onClick={() => onToggleDone(it.text)}>
                  <span>{d.done[it.text] ? '✅' : '⬜'}</span>
                </button>
                <span className="check-body">
                  <span className="check-text" style={{ lineHeight: 1.5 }}>{text}</span>
                  {date && <span className="check-due">{formatDateKo(date)}까지</span>}
                  {it.link && (
                    <a className="check-link" href={it.link} onClick={e => { e.preventDefault(); openExternal(it.link) }}>{it.linkLabel}</a>
                  )}
                </span>
                {date && (
                  <button className="check-cal" onClick={() => addToCalendar(text, date)} aria-label="캘린더에 추가">
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
