import { useApp } from './context/useApp'
import { STEPS, STEP_SHORT } from './utils/calc'
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

  return (
    <div id="app">
      <header style={{ padding: '22px 0 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>🪺 둥지</h1>
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2 }}>처음 집 살 때, 계산은 둥지가 할게요</p>
        </div>
        {!isPlus && (
          <button
            style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', background: 'var(--egg)', padding: '7px 14px', borderRadius: 99 }}
            onClick={openPaywall}
          >
            PLUS
          </button>
        )}
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
        <p>계산 결과는 참고용이에요. 실제 한도·세율·금리는 은행과 위택스에서 꼭 확인하세요.</p>
        <div className="app-footer" style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>Made by <strong style={{ color: 'var(--ink)' }}>김지윤 (Qoo)</strong></span>
          <span>·</span>
          <a href="https://jiyoonportfolio.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
          <span>·</span>
          <a href="https://github.com/zziyoonii" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/aroundjiyoon/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span>·</span>
          <a href="https://npm-run-ops.tistory.com/" target="_blank" rel="noopener noreferrer">Blog</a>
        </div>
      </footer>

      <Paywall />
    </div>
  )
}
