'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, DollarSign } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import {
  FINISHING_OPTIONS,
  PRODUCTS,
  type FinishingOption,
} from '@/lib/products'
import { AddFinished } from '@/features/products/components/AddFinished'

export default function AdminFinishingPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFinishing, setEditingFinishing] =
    useState<FinishingOption | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/')
    }
  }, [router])

  const handleCreateFinishing = () => {
    setEditingFinishing(null)
    setIsDialogOpen(true)
  }

  const handleEditFinishing = (finishing: FinishingOption) => {
    setEditingFinishing(finishing)
    setIsDialogOpen(true)
  }

  const handleSaveFinishing = () => {
    // Mock save - in real app would update state/database
    setIsDialogOpen(false)
    setEditingFinishing(null)
  }

  const getProductsUsingFinishing = (finishingId: string) => {
    return PRODUCTS.filter((product) =>
      product.materials.some((material) =>
        material.compatibleFinishing.includes(finishingId)
      )
    )
  }

  return (
    <>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-balance'>
          Opções de acabamento
        </h2>
        <p className='text-muted-foreground mt-2'>
          Gerencie as opções de acabamento e a compatibilidade do produto.
        </p>
      </div>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold'>Finishing Options</h2>
          <p className='text-muted-foreground'>
            Create and manage finishing options available for products
          </p>
        </div>
        <AddFinished
          handleCreateFinishing={handleCreateFinishing}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          editingFinishing={editingFinishing}
          handleSaveFinishing={handleSaveFinishing}
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {FINISHING_OPTIONS.map((finishing) => {
          const compatibleProducts = getProductsUsingFinishing(finishing.id)
          return (
            <Card key={finishing.id}>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg'>{finishing.name}</CardTitle>
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    <DollarSign className='h-3 w-3' />
                    {finishing.additionalCost.toFixed(2)}
                  </Badge>
                </div>
                <CardDescription>{finishing.description}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='text-sm'>
                  <p className='text-muted-foreground mb-2'>Compatible with:</p>
                  {compatibleProducts.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {compatibleProducts.map((product) => (
                        <Badge
                          key={product.id}
                          variant='outline'
                          className='text-xs'
                        >
                          {product.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      No products assigned yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
