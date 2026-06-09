import { useState } from 'react'
import Step1Loan from './components/steps/Step1Loan'
import Step2Cash from './components/steps/Step2Cash'
import Step3Tax from './components/steps/Step3Tax'
import Step4Monthly from './components/steps/Step4Monthly'
import Step5Checklist from './components/steps/Step5Checklist'

const STEPS = [
  { id: 1, label: '대출 한도', icon: '🏦', short: '대출' },
  { id: 2, label: '필요 현금', icon: '💰', short: '현금' },
  { id: 3, label: '취득세', icon: '📄', short: '세금' },
  { id: 4, label: '월 상환', icon: '📅', short: '월납' },
  { id: 5, label: '체크리스트', icon: '✅', short: '체크' },
]

export default function App() {
  const [step, setStep] = useState(1)
  const [stepData, setStepData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
  })

  const updateStep = (num, data) => {
    setStepData(prev => ({ ...prev, [`step${num}`]: data }))
  }

  const goTo = (n) => setStep(Math.max(1, Math.min(5, n)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="text-2xl">🪺</div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">둥지</h1>
            <p className="text-xs text-gray-400">생애최초 주택 구매 계산기</p>
          </div>
        </div>
      </header>

      {/* 스텝 인디케이터 */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-2 py-2">
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all text-center ${
                  step === s.id
                    ? 'bg-amber-400 text-white'
                    : s.id < step
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                <span className="text-base leading-none">{s.icon}</span>
                <span className="text-[10px] mt-0.5 leading-none font-medium">{s.short}</span>
              </button>
            ))}
          </div>
          <div className="flex mt-2 px-1 bg-gray-100 rounded-full h-1 overflow-hidden">
            <div
              className="h-1 bg-amber-400 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 스텝 컨텐츠 */}
      <main className="max-w-lg mx-auto px-4 py-6 pb-28">
        {step === 1 && (
          <Step1Loan data={stepData.step1} onChange={d => updateStep(1, d)} />
        )}
        {step === 2 && (
          <Step2Cash data={stepData.step2} onChange={d => updateStep(2, d)} prevData={stepData.step1} />
        )}
        {step === 3 && (
          <Step3Tax data={stepData.step3} onChange={d => updateStep(3, d)} prevData={stepData.step1} />
        )}
        {step === 4 && (
          <Step4Monthly data={stepData.step4} onChange={d => updateStep(4, d)} prevData={stepData.step1} />
        )}
        {step === 5 && (
          <Step5Checklist prevData={stepData} />
        )}
      </main>

      {/* 푸터 */}
      <footer className="max-w-lg mx-auto px-4 py-6 flex items-center justify-center gap-2 flex-wrap text-xs text-gray-400">
        <span>Made by <strong className="text-gray-600">김지윤 (Qoo)</strong></span>
        <span>·</span>
        <a href="https://jiyoonportfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Portfolio</a>
        <span>·</span>
        <a href="https://github.com/zziyoonii" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">GitHub</a>
        <span>·</span>
        <a href="https://www.linkedin.com/in/aroundjiyoon/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">LinkedIn</a>
        <span>·</span>
        <a href="https://npm-run-ops.tistory.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">Blog</a>
      </footer>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => goTo(step - 1)}
              className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm transition-all hover:border-gray-300 active:scale-95"
            >
              ← 이전
            </button>
          )}
          {step < 5 && (
            <button
              onClick={() => goTo(step + 1)}
              className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 bg-amber-400 text-white hover:bg-amber-500 shadow-md shadow-amber-200"
            >
              {step === 4 ? '체크리스트 보기 →' : '다음 단계 →'}
            </button>
          )}
          {step === 5 && (
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-semibold text-sm transition-all hover:bg-gray-200 active:scale-95"
            >
              처음부터 다시
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
