import { ArtworkValidationResult } from '@/lib/artwork-validator'
import { getCurrentUser } from '@/lib/auth'
import { ArtworkStatus, createOrder } from '@/lib/orders'
import { FINISHING_OPTIONS, Product } from '@/lib/products'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export type OrderProduct = Product & {
  quantity: number
  finishes: string[]
  material: string
}
type OrderInput = {
  product: OrderProduct
  artworkFile: File | null
  artworkValidation: ArtworkValidationResult | null
}
export function useOrderReview({
  product,
  artworkFile,
  artworkValidation,
}: OrderInput) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { push } = useRouter()
  const calculateTotal = (
    quantity: number,
    finishes: string[],
    status: ArtworkStatus
  ) => {
    let base = quantity * 0.25 // Mock base price
    finishes.forEach((fId) => {
      const finishing = FINISHING_OPTIONS.find((f) => f.id === fId)
      if (finishing) base += finishing.additionalCost
    })
    if (status === 'needs-adjustment') {
      base += 25 // Additional cost for manual adjustment
    }
    return base
  }

  const submitOrder = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser || !product || !artworkFile || !artworkValidation) return

    setIsProcessing(true)

    const material = product.materials.find((m) => m.id === product.material)

    const order = await createOrder({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      productId: product.id,
      productName: product.name,
      materialId: product.material,
      materialName: material?.name || '',
      quantity: product.quantity,
      finishingOptions: product.finishes,
      artworkFile: {
        name: artworkFile.name,
        size: artworkFile.size,
        type: artworkFile.type,
        url: URL.createObjectURL(artworkFile),
      },
      artworkStatus: artworkValidation.status,
      artworkNotes:
        artworkValidation.status === 'needs-adjustment'
          ? artworkValidation.messages.join('; ')
          : undefined,
      totalCost: calculateTotal(
        product.quantity,
        product.finishes,
        artworkValidation.status
      ),
      status: 'pending',
    })
    // Mock email sending
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsProcessing(false)
    push(`/dashboard/payment?orderId=${order.id}`)
  }

  return {
    isProcessing,
    calculateTotal,
    submitOrder,
  }
}
