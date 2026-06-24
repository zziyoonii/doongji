export default function ConfirmSheet({ open, title, body, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className={`paywall ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <button className="pw-bg" aria-label="닫기" onClick={onCancel}></button>
      <div className="pw-sheet">
        <h2 style={{ fontSize: 17, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>{title}</h2>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 18 }}>{body}</p>
        <button className="pbtn" onClick={onConfirm}>{confirmLabel}</button>
        <button style={{ width: '100%', marginTop: 10, fontSize: 14, color: 'var(--ink-soft)', padding: 8 }} onClick={onCancel}>다시 확인할게요</button>
      </div>
    </div>
  )
}
