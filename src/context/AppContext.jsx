import { useState, useEffect } from 'react'
import { AppContext } from './context'

const STATE_KEY = 'dungi-state-v2'

const initialD = {
  price: 53500, income: 4000, existingMonthly: 0, years: 40, loan: 0,
  newlywed: false, multichild: false, loanTypeOverride: null,
  deposit: 5350, guarantee: 5900, oldLoan: 2250, cash: 7400, stock: 58, borrow: 0,
  fees: [
    { id: 'legal', name: '법무사 보수료', a: 30 },
    { id: 'bond', name: '인지대 + 국민주택채권', a: 65, why: '인지대는 계약서에 붙는 세금, 채권은 의무 매입 후 바로 할인 매도해서 실제론 할인 비용만 내요. 합쳐서 50~100만원 정도예요.' },
    { id: 'manage', name: '관리비 정산 (양쪽 집)', a: 40 },
    { id: 'move', name: '이사비', a: 120 },
    { id: 'agent', name: '중개수수료', a: 225 },
  ],
  isFirst: true, baby: 'none', benefits: ['first'], living: 100, months: 4, done: {}, balanceDate: '',
}

export function AppProvider({ children }) {
  const [d, setD] = useState(() => {
    try {
      const saved = localStorage.getItem(STATE_KEY)
      if (saved) return { ...initialD, ...JSON.parse(saved) }
    } catch {
      // ignore corrupt storage
    }
    return initialD
  })
  const [isPlus, setIsPlus] = useState(true)
  const [step, setStep] = useState(0)
  const [paywallOpen, setPaywallOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(d))
  }, [d])

  const set = (key, value) => setD(prev => ({ ...prev, [key]: value }))

  const setFee = (i, value) => setD(prev => ({
    ...prev,
    fees: prev.fees.map((f, idx) => idx === i ? { ...f, a: value } : f),
  }))

  const toggleBenefit = id => setD(prev => ({
    ...prev,
    benefits: prev.benefits.includes(id) ? prev.benefits.filter(x => x !== id) : [...prev.benefits, id],
  }))

  const toggleDone = item => setD(prev => ({
    ...prev,
    done: { ...prev.done, [item]: !prev.done[item] },
  }))

  const go = i => {
    setStep(i)
    window.scrollTo({ top: 0 })
  }

  const openPaywall = () => setPaywallOpen(true)
  const closePaywall = () => setPaywallOpen(false)
  const buy = async () => {
    await new Promise(r => setTimeout(r, 600))
    setIsPlus(true)
    setPaywallOpen(false)
  }

  return (
    <AppContext.Provider value={{
      d, set, setFee, toggleBenefit, toggleDone,
      isPlus, step, go,
      paywallOpen, openPaywall, closePaywall, buy,
    }}>
      {children}
    </AppContext.Provider>
  )
}
