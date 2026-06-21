export default function Chip({ on, onClick, disabled, children }) {
  return (
    <button className={`chip ${on ? 'on' : ''} ${disabled ? 'disabled' : ''}`} onClick={disabled ? undefined : onClick} disabled={disabled}>
      {children}
    </button>
  )
}
