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
import { ArrowLeft, Send } from 'lucide-react'
import { FINISHING_OPTIONS } from '@/lib/products'
import { ArtworkStatus } from '@/lib/orders'
import { OrderProduct } from '@/features/orders/hooks/useOrderReview'
import { ArtworkValidationResult } from '@/lib/artwork-validator'
import { useState } from 'react'

interface Props {
  calculateTotal: (
    quantity: number,
    finishes: string[],
    status: ArtworkStatus
  ) => number
  quantity: number
  product: OrderProduct
  artworkFile: File
  artworkValidation: ArtworkValidationResult
  prev: () => void
}

export function Review({
  calculateTotal,
  product,
  quantity,
  artworkFile,
  artworkValidation,
  prev,
}: Props) {
  const [orderNotes, setOrderNotes] = useState('')

  const materialName = product.materials.find(
    (m) => m.id === product.material
  )?.name

  const finishingNames =
    product.finishes.length > 0
      ? product.finishes
          .map((fId) => FINISHING_OPTIONS.find((f) => f.id === fId)?.name)
          .join(', ')
      : 'Nenhum'

  const total = calculateTotal(
    quantity,
    product.finishes,
    artworkValidation.status
  ).toFixed(2)

  const mailtoLink = `mailto:enviodl@gmail.com?subject=${encodeURIComponent(
    `Pedido - ${product.name}`
  )}&body=${encodeURIComponent(`
Olá,

Gostaria de realizar o seguinte pedido:

Produto: ${product.name}
Material: ${materialName}
Quantidade: ${quantity}
Acabamentos: ${finishingNames}

Arquivo de arte: ${artworkFile.name}
Status da arte: ${
    artworkValidation.status === 'ok'
      ? 'OK para produção'
      : 'Necessita ajuste manual'
  }

Total estimado: R$ ${total}

Observações:
${orderNotes || 'Sem observações'}

Obrigado.
`)}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisar pedido</CardTitle>
        <CardDescription>
          Revise os detalhes do pedido antes de enviar
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div>
              <Label className='text-sm text-muted-foreground'>Produto</Label>
              <p className='font-medium'>{product.name}</p>
            </div>

            <div>
              <Label className='text-sm text-muted-foreground'>Material</Label>
              <p className='font-medium'>{materialName}</p>
            </div>

            <div>
              <Label className='text-sm text-muted-foreground'>
                Quantidade
              </Label>
              <p className='font-medium'>{quantity}</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <Label className='text-sm text-muted-foreground'>
                Arquivo de arte
              </Label>
              <p className='font-medium'>{artworkFile.name}</p>
            </div>

            <div>
              <Label className='text-sm text-muted-foreground'>
                Status da arte
              </Label>
              <Badge
                variant={
                  artworkValidation.status === 'ok' ? 'default' : 'secondary'
                }
                className='mt-1'
              >
                {artworkValidation.status === 'ok'
                  ? 'OK para produção'
                  : 'Necessita ajuste manual'}
              </Badge>
            </div>

            <div>
              <Label className='text-sm text-muted-foreground'>
                Acabamentos
              </Label>
              <div className='flex flex-wrap gap-2 mt-1'>
                {product.finishes.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    Nenhum selecionado
                  </p>
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
            <span>Total estimado:</span>
            <span className='text-2xl text-primary'>R$ {total}</span>
          </div>
          <p className='text-sm text-muted-foreground mt-1'>
            Pagamento necessário antes do início da produção
          </p>
        </div>

        <div>
          <Label htmlFor='notes'>Observações do pedido (opcional)</Label>
          <Textarea
            id='notes'
            placeholder='Adicione instruções ou observações...'
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className='mt-2'
          />
        </div>

        <div className='flex justify-between'>
          <Button variant='outline' onClick={prev}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar
          </Button>

          <Button asChild>
            <a href={mailtoLink}>
              <Send className='mr-2 h-4 w-4' />
              Enviar pedido
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
