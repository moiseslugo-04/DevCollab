'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, DollarSign } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import {
  FINISHING_OPTIONS,
  PRODUCTS,
  type FinishingOption,
} from '@/lib/products'

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
    <DashboardLayout
      title='Finishing Options'
      description='Manage finishing options and product compatibility'
    >
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold'>Finishing Options</h2>
          <p className='text-muted-foreground'>
            Create and manage finishing options available for products
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateFinishing}>
              <Plus className='mr-2 h-4 w-4' />
              Add Finishing Option
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFinishing
                  ? 'Edit Finishing Option'
                  : 'Create New Finishing Option'}
              </DialogTitle>
              <DialogDescription>
                {editingFinishing
                  ? 'Update finishing option details'
                  : 'Add a new finishing option to the catalog'}
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Option Name</Label>
                <Input
                  id='name'
                  defaultValue={editingFinishing?.name}
                  placeholder='Lamination'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  defaultValue={editingFinishing?.description}
                  placeholder='Describe the finishing option'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='cost'>Additional Cost ($)</Label>
                <Input
                  id='cost'
                  type='number'
                  step='0.01'
                  defaultValue={editingFinishing?.additionalCost}
                  placeholder='15.00'
                />
              </div>

              <div className='space-y-2'>
                <Label>Product Compatibility</Label>
                <div className='border rounded-lg p-3 bg-muted/50'>
                  <p className='text-sm text-muted-foreground'>
                    Finishing options are associated with specific product
                    materials. Manage compatibility in the Products page.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFinishing}>
                Save Finishing Option
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

                <Button
                  variant='outline'
                  size='sm'
                  className='w-full bg-transparent'
                  onClick={() => handleEditFinishing(finishing)}
                >
                  <Edit className='mr-2 h-3 w-3' />
                  Edit Option
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
