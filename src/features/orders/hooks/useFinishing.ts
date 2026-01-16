import { useState } from 'react'

export function useFinishing() {
  const [quantity, setQuantity] = useState(1)
  const [selectedFinishing, setSelectedFinishing] = useState<string[]>([])

  const canProceed = quantity > 0 && selectedFinishing.length > 0

  return {
    quantity,
    setQuantity,
    selectedFinishing,
    setSelectedFinishing,
    canProceed,
  }
}
