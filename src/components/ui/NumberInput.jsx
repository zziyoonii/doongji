export default function NumberInput({ label, value, onChange, unit = '만원', placeholder, min = 0, max, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition-all">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className="flex-1 px-4 py-3 text-base outline-none bg-transparent"
        />
        <span className="px-3 text-sm text-gray-400 bg-gray-50 self-stretch flex items-center border-l border-gray-200">
          {unit}
        </span>
      </div>
    </div>
  )
}
