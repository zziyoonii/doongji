import { useState } from 'react'

export default function Tooltip({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold leading-none cursor-pointer hover:bg-amber-200 transition-colors"
        aria-label="설명 보기"
      >
        ?
      </button>
      {open && (
        <span className="absolute z-10 mt-1 p-3 bg-white border border-amber-200 rounded-xl shadow-lg text-sm text-gray-600 max-w-xs leading-relaxed">
          {children}
          <button
            onClick={() => setOpen(false)}
            className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
          >
            닫기
          </button>
        </span>
      )}
    </span>
  )
}
