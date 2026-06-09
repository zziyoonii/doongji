export default function ResultCard({ label, value, sub, highlight, warn }) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? 'bg-amber-50 border-2 border-amber-400' : warn ? 'bg-red-50 border-2 border-red-300' : 'bg-white border border-gray-100'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-amber-700' : warn ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
