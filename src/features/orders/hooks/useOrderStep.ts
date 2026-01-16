'use client'

import { useState } from 'react'

// useWizardSteps (generic name for reuse)
export function useOrderStep(totalStep = 4) {
  const [currentStep, setCurrentStep] = useState(1)
  const next = () => setCurrentStep((s) => Math.min(s + 1, totalStep))
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const progress = (currentStep / totalStep) * 100

  return {
    prev,
    next,
    setCurrentStep,
    currentStep,
    progress,
    isFirst: currentStep === 1,
    isLast: currentStep === totalStep,
  }
}
