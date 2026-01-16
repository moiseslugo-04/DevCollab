'use client'

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
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FinishingOption } from '@/lib/products'

interface Props {
  isDialogOpen: boolean
  handleCreateFinishing: () => void
  setIsDialogOpen: (toggle: boolean) => void
  editingFinishing: FinishingOption | null
  handleSaveFinishing: () => void
}
export function AddFinished({
  isDialogOpen,
  handleCreateFinishing,
  setIsDialogOpen,
  editingFinishing,
  handleSaveFinishing,
}: Props) {
  return (
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
          <Button onClick={handleSaveFinishing}>Save Finishing Option</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
