'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { FINISHING_OPTIONS, Product } from '@/lib/products'
import { ArtworkStatus } from '@/lib/orders'
import { OrderProduct } from '@/features/orders/hooks/useOrderReview'
import { ArtworkValidationResult } from '@/lib/artwork-validator'
import { useState } from 'react'
interface Props {
  isProcessing: boolean
  calculateTotal: (
    quantity: number,
    finishes: string[],
    status: ArtworkStatus
  ) => number
  submitOrder: () => Promise<void>
  quantity: number
  product: OrderProduct
  artworkFile: File
  artworkValidation: ArtworkValidationResult
  prev: () => void
}
export function Review({
  isProcessing,
  calculateTotal,
  submitOrder,
  product,
  quantity,
  artworkFile,
  artworkValidation,
  prev,
}: Props) {
  const [orderNotes, setOrderNotes] = useState<string>('')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
        <CardDescription>
          Please review your order details before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <Label className='text-sm text-muted-foreground'>Product</Label>
              <p className='font-medium'>{product.name}</p>
            </div>
            <div>
              <Label className='text-sm text-muted-foreground'>Material</Label>
              <p className='font-medium'>
                {product.materials.find((m) => m.id === product.material)?.name}
              </p>
            </div>
            <div>
              <Label className='text-sm text-muted-foreground'>Quantity</Label>
              <p className='font-medium'>{quantity}</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <Label className='text-sm text-muted-foreground'>
                Artwork File
              </Label>
              <p className='font-medium'>{artworkFile.name}</p>
            </div>
            <div>
              <Label className='text-sm text-muted-foreground'>
                Artwork Status
              </Label>
              <Badge
                variant={
                  artworkValidation.status === 'ok' ? 'default' : 'secondary'
                }
                className='mt-1'
              >
                {artworkValidation.status === 'ok'
                  ? 'OK for production'
                  : 'Needs manual adjustment'}
              </Badge>
            </div>
            <div>
              <Label className='text-sm text-muted-foreground'>
                Finishing Options
              </Label>
              <div className='flex flex-wrap gap-2 mt-1'>
                {product.finishes.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>None selected</p>
                ) : (
                  product.finishes.map((fId) => {
                    const finishing = FINISHING_OPTIONS.find(
                      (f) => f.id === fId
                    )
                    return (
                      <Badge key={fId} variant='outline'>
                        {finishing?.name}
                      </Badge>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='border-t pt-4'>
          <div className='flex justify-between items-center text-lg font-semibold'>
            <span>Estimated Total:</span>
            <span className='text-2xl text-primary'>
              $
              {calculateTotal(
                quantity,
                product.finishes,
                artworkValidation.status
              ).toFixed(2)}
            </span>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Payment required before production begins
          </p>
        </div>

        <div>
          <Label htmlFor='notes'>Order Notes (Optional)</Label>
          <Textarea
            id='notes'
            placeholder='Add any special instructions or notes for your order...'
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className='mt-2'
          />
        </div>

        <div className='flex justify-between'>
          <Button variant='outline' onClick={() => prev()}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <Button onClick={submitOrder} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' />
                Submit Order
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
