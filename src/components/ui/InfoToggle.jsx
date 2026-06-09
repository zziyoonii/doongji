import { useState } from 'react'

export default function InfoToggle({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs text-amber-600 underline decoration-dotted cursor-pointer"
      >
        이게 뭐예요? {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-gray-600 leading-relaxed text-left">
          {children}
        </div>
      )}
    </div>
  )
}
