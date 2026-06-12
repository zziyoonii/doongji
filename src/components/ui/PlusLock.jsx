import { useApp } from '../../context/useApp'

export default function PlusLock({ teaser, children }) {
  const { isPlus, openPaywall } = useApp()

  if (isPlus) return children

  return (
    <div className="locked">
      <div className="blur" aria-hidden="true">{children}</div>
      <div className="gate">
        <div style={{ fontSize: 26 }}>🔒</div>
        <p>{teaser}</p>
        <button className="gatebtn" onClick={openPaywall}>둥지 PLUS로 보기 · 4,900원</button>
      </div>
    </div>
  )
}
