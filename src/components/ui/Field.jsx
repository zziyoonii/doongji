export default function Field({ label, sub, unit, value, onChange }) {
  return (
    <>
      <div className="flabel">{label}</div>
      {sub && <div className="fsub">{sub}</div>}
      <div className="frow">
        <input
          type="number"
          inputMode="decimal"
          value={value ?? ''}
          onChange={e => onChange(+e.target.value || 0)}
        />
        <span>{unit}</span>
      </div>
    </>
  )
}
