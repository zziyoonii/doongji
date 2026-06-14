import { useState } from 'react'
import { useApp } from '../context/useApp'

export default function Paywall() {
  const { paywallOpen, closePaywall, buy } = useApp()
  const [buying, setBuying] = useState(false)

  const handleBuy = async () => {
    setBuying(true)
    await buy()
    setBuying(false)
  }

  return (
    <div className={`paywall ${paywallOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="둥지 PLUS 구매">
      <button className="pw-bg" aria-label="닫기" onClick={closePaywall}></button>
      <div className="pw-sheet">
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 34 }}>🪺</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>둥지 PLUS</h2>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 4 }}>평생 한 번뿐인 첫 집, 수백만원 아끼는 계산까지</p>
        </div>
        <div className="perk">
          <span style={{ fontSize: 20 }}>🧾</span>
          <div><div className="pt">내 상황별 취득세 감면 최적화</div><div className="pd">생애최초·신생아·임신 중 — 최대 500만원 아끼는 법</div></div>
        </div>
        <div className="perk">
          <span style={{ fontSize: 20 }}>💳</span>
          <div><div className="pt">카드 할부 수수료 시뮬레이션</div><div className="pd">몇 개월 할부가 유리한지 한눈에</div></div>
        </div>
        <div className="perk">
          <span style={{ fontSize: 20 }}>📅</span>
          <div><div className="pt">월 상환 + 생활비 여유 계산</div><div className="pd">입주 후 매달 얼마가 남는지 미리 확인</div></div>
        </div>
        <div className="perk" style={{ borderBottom: 'none', marginBottom: 14 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div><div className="pt">잔금일 체크리스트</div><div className="pd">전입신고·감면 신청까지 놓치지 않게</div></div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 24, fontWeight: 800 }}>4,900원</span>
          <span style={{ fontSize: 13, color: 'var(--ink-soft)', marginLeft: 6 }}>1회 결제 · 평생 이용</span>
        </div>
        <button className="pbtn" onClick={handleBuy} disabled={buying}>{buying ? '결제 진행 중…' : '잠금 해제하기'}</button>
        <button style={{ width: '100%', marginTop: 10, fontSize: 14, color: 'var(--ink-soft)', padding: 8 }} onClick={closePaywall}>나중에 할게요</button>
      </div>
    </div>
  )
}
