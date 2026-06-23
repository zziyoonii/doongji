import { useState, useEffect } from 'react'
import { AppContext } from './context'
import { DISCOUNTS } from '../utils/calc'

const STATE_KEY = 'dungi-state-v2'
const STEP_KEY = 'dungi-step-v1'

const initialD = {
  price: 0, income: 0, netIncome: 0, existingMonthly: 0, years: 40, loan: 0, age: 0,
  newlywed: false, multichild: false, regulatedArea: false, houseType: 'apt', loanTypeOverride: null,
  deposit: 0, guarantee: 0, oldLoan: 0, cash: 0, stock: 0, borrow: 0,
  fees: [
    { id: 'legal', name: '법무사 보수료', a: 30 },
    { id: 'bond', name: '인지대 + 국민주택채권', a: 65, why: '인지대는 계약서에 붙는 세금, 채권은 의무 매입 후 바로 할인 매도해서 실제론 할인 비용만 내요. 합쳐서 50~100만원 정도예요.' },
    { id: 'manage', name: '관리비 정산 (양쪽 집)', a: 40 },
    { id: 'move', name: '이사비', a: 120 },
    { id: 'agent', name: '중개수수료', a: 225 },
  ],
  isFirst: true, baby: 'none', benefits: [], living: 0, months: 4, done: {}, balanceDate: '',
  acqTax: 0, eduTax: 0,
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
  const [step, setStep] = useState(() => {
    const saved = Number(localStorage.getItem(STEP_KEY))
    return Number.isInteger(saved) && saved >= 0 ? saved : 0
  })
  const [paywallOpen, setPaywallOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(d))
  }, [d])

  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(step))
  }, [step])

  const set = (key, value) => setD(prev => ({ ...prev, [key]: value }))

  const setFee = (i, value) => setD(prev => ({
    ...prev,
    fees: prev.fees.map((f, idx) => idx === i ? { ...f, a: value } : f),
  }))

  const toggleBenefit = id => setD(prev => {
    if (prev.benefits.includes(id)) {
      return { ...prev, benefits: prev.benefits.filter(x => x !== id) }
    }
    const exclusiveWith = DISCOUNTS.find(b => b.id === id)?.exclusiveWith
    const next = exclusiveWith ? prev.benefits.filter(x => x !== exclusiveWith) : prev.benefits
    return { ...prev, benefits: [...next, id] }
  })

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
