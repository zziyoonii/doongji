import { useEffect } from 'react'
import { useApp } from './context/useApp'
import { STEPS, STEP_SHORT } from './utils/calc'
import { setupPlusAccessoryButton } from './utils/navAccessory'
import Step1Loan from './components/steps/Step1Loan'
import Step2Cash from './components/steps/Step2Cash'
import Step3Tax from './components/steps/Step3Tax'
import Step4Monthly from './components/steps/Step4Monthly'
import Step5Checklist from './components/steps/Step5Checklist'
import Paywall from './components/Paywall'

const STEP_COMPONENTS = [Step1Loan, Step2Cash, Step3Tax, Step4Monthly, Step5Checklist]

export default function App() {
  const { step, go, isPlus, openPaywall } = useApp()
  const StepComponent = STEP_COMPONENTS[step]

  useEffect(() => {
    if (isPlus) return
    let cleanup = () => {}
    setupPlusAccessoryButton(openPaywall).then(fn => { cleanup = fn })
    return () => cleanup()
  }, [isPlus, openPaywall])

  return (
    <div id="app">
      <header style={{ padding: '22px 0 14px' }}>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>처음 집 살 때, 계산은 둥지가 할게요</p>
      </header>

      <nav className="stepper" aria-label="진행 단계">
        <div className="stepper-track">
          <div className="stepper-track-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>
        {STEPS.map((s, i) => (
          <button
            key={s}
            title={s}
            onClick={() => go(i)}
            className={`stepper-item ${i < step ? 'done' : i === step ? 'active' : 'upcoming'}`}
          >
            <span className="step-badge">🥚</span>
            <span className="step-label">{STEP_SHORT[i]}</span>
          </button>
        ))}
      </nav>

      <main>
        <StepComponent />
      </main>

      <footer style={{ marginTop: 36, fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.7, textAlign: 'center' }}>
        <p>이 앱은 참고용 계산 도구예요. 금융 상품을 중개하거나 권유하지 않아요.<br />실제 대출 가능 여부는 해당 기관에서 확인하세요.</p>
        <div className="app-footer" style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>Made by <strong style={{ color: 'var(--ink)' }}>김지윤 (Qoo)</strong></span>
        </div>
      </footer>

      <Paywall />
    </div>
  )
}
