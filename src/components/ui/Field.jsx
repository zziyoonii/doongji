import { useState, useRef } from 'react'
import { manwonToKorean } from '../../utils/calc'

function toRaw(value) {
  return value === 0 ? '' : String(value ?? '')
}

export default function Field({ label, sub, unit, value, onChange, placeholder }) {
  const [raw, setRaw] = useState(() => toRaw(value))
  const [prevValue, setPrevValue] = useState(value)
  const inputRef = useRef(null)

  if (value !== prevValue && value !== (+raw || 0)) {
    setPrevValue(value)
    setRaw(toRaw(value))
  } else if (value !== prevValue) {
    setPrevValue(value)
  }

  const moveCursorToEnd = pos => {
    requestAnimationFrame(() => {
      const el = inputRef.current
      if (!el || el.selectionStart !== el.selectionEnd) return
      el.setSelectionRange(pos, pos)
    })
  }

  const handleChange = e => {
    let v = e.target.value.replace(/[^0-9.]/g, '')
    if (v.length > 1 && v[0] === '0' && v[1] !== '.') {
      v = v.replace(/^0+/, '') || '0'
    }
    setRaw(v)
    onChange(+v || 0)
    moveCursorToEnd(v.length)
  }

  const korean = unit?.startsWith('만원') ? manwonToKorean(value) : ''

  return (
    <>
      <div className="flabel">{label}</div>
      {sub && <div className="fsub">{sub}</div>}
      <div className="frow">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={raw}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={e => moveCursorToEnd(e.target.value.length)}
          onClick={e => moveCursorToEnd(e.target.value.length)}
        />
        <span>{unit}</span>
      </div>
      {korean && <div className="fsub" style={{ marginTop: -2 }}>{korean}</div>}
    </>
  )
}
