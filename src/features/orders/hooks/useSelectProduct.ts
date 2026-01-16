'use client'

import { getProductById, Product } from '@/lib/products'
import { useState } from 'react'

export function useSelectProduct() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const handleProductSelect = (productId: string) => {
    const product = getProductById(productId)
    setSelectedProduct(product || null)
    setSelectedMaterial('')
  }

  const canProceed = !!selectedProduct && !!selectedMaterial

  return {
    selectedProduct,
    selectedMaterial,
    setSelectedMaterial,
    handleProductSelect,
    canProceed,
  }
}
