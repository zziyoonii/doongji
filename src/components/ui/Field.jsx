import { useState } from 'react'

function toRaw(value) {
  return value === 0 ? '' : String(value ?? '')
}

export default function Field({ label, sub, unit, value, onChange }) {
  const [raw, setRaw] = useState(() => toRaw(value))
  const [prevValue, setPrevValue] = useState(value)

  if (value !== prevValue && value !== (+raw || 0)) {
    setPrevValue(value)
    setRaw(toRaw(value))
  } else if (value !== prevValue) {
    setPrevValue(value)
  }

  const handleChange = e => {
    let v = e.target.value
    if (v.length > 1 && v[0] === '0' && v[1] !== '.') {
      v = v.replace(/^0+/, '') || '0'
    }
    setRaw(v)
    onChange(+v || 0)
  }

  return (
    <>
      <div className="flabel">{label}</div>
      {sub && <div className="fsub">{sub}</div>}
      <div className="frow">
        <input
          type="number"
          inputMode="decimal"
          value={raw}
          onChange={handleChange}
        />
        <span>{unit}</span>
      </div>
    </>
  )
}
