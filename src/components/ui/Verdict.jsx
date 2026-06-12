export default function Verdict({ ok, label, amount, sub }) {
  return (
    <div className={`verdict ${ok ? 'ok' : 'ng'}`}>
      <div>
        <div className="vl">{label}</div>
        {sub && <div className="vs">{sub}</div>}
      </div>
      <div className="va">{amount}</div>
    </div>
  )
}
