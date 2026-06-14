import { useState } from 'react'

export default function WhyToggle({ q, children }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="whybtn" onClick={() => setOpen(o => !o)}>{q}</button>
      <div className={`whybox ${open ? 'open' : ''}`}>{children}</div>
    </>
  )
}
