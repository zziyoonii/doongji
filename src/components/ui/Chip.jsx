export default function Chip({ on, onClick, children }) {
  return (
    <button className={`chip ${on ? 'on' : ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
