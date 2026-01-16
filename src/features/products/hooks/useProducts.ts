'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { type Product } from '@/lib/products'

export function useProducts() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/')
    }
  }, [router])

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleSaveProduct = () => {
    // Mock save - in real app would update state/database
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  return {
    handleCreateProduct,
    handleSaveProduct,
    handleEditProduct,
    setIsDialogOpen,
    isDialogOpen,
    editingProduct,
  }
}
