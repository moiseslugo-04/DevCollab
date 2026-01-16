'use client'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { getCompatibleFinishing } from '@/lib/products'

/* {
    selectedFinishing,
    setQuantity,
    setSelectedFinishing,
    quantity,
  } */

type Step = 1 | 2 | 3 | 4
interface Props {
  quantity: number
  setQuantity: (quantity: number) => void
  selectedFinishing: string[]
  canProceed: boolean
  selectedMaterial: string
  productId: string
  handleFinishingToggle: (id: string) => void
  setCurrentStep: (step: number) => void
  next: () => void
  prev: () => void
}
export function FinishingOptions({
  quantity,
  setQuantity,
  selectedMaterial,
  productId,
  handleFinishingToggle,
  selectedFinishing,
  setCurrentStep,
  canProceed,
  next,
  prev,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quantity & Finishing Options</CardTitle>
        <CardDescription>
          Select quantity and compatible finishing options
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <Label htmlFor='quantity' className='text-base font-semibold'>
            Quantity
          </Label>
          <Input
            id='quantity'
            type='number'
            min='1'
            value={quantity}
            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
            className='mt-2 max-w-xs'
          />
        </div>

        <div>
          <Label className='text-base font-semibold mb-2 block'>
            Finishing Options
          </Label>
          <p className='text-sm text-muted-foreground mb-2'>
            Only compatible options for your selected material are shown
          </p>
          <div className='grid grid-cols-2 gap-2'>
            {getCompatibleFinishing(selectedMaterial, productId).map(
              (finishing) => (
                <div
                  key={finishing.id}
                  className='flex items-start gap-3 p-4 border rounded-lg hover:bg-accent cursor-pointer'
                  onClick={() => handleFinishingToggle(finishing.id)}
                >
                  <Checkbox
                    id={finishing.id}
                    checked={selectedFinishing.includes(finishing.id)}
                    onCheckedChange={() => handleFinishingToggle(finishing.id)}
                  />
                  <div className='flex-1'>
                    <Label
                      htmlFor={finishing.id}
                      className='cursor-pointer font-medium'
                    >
                      {finishing.name}
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      {finishing.description}
                    </p>
                    <p className='text-sm font-medium text-accent mt-1'>
                      +${finishing.additionalCost.toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            )}
            {getCompatibleFinishing(selectedMaterial, productId).length ===
              0 && (
              <p className='text-sm text-muted-foreground p-4 border rounded-lg'>
                No finishing options available for this material
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-between'>
          <Button variant='outline' onClick={() => setCurrentStep(2)}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <Button onClick={next} disabled={!canProceed}>
            Review Order
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
