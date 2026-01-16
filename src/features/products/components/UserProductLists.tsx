'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Package } from 'lucide-react'
import ProductComposition from '@/components/shared/ProductComposition'

const products = [
  {
    id: 1,
    name: 'Produto A',
    description: 'Descrição breve do produto A',
    price: 'R$ 12,90',
  },
  {
    id: 2,
    name: 'Produto B',
    description: 'Descrição breve do produto B',
    price: 'R$ 18,50',
  },
]

export function UserProductsList() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 m'>
      {products.map((product) => (
        <Card key={product.id}>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm font-medium'>
              {product.name}
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>

          <CardContent className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              {product.description}
            </p>

            <div className='text-lg font-semibold'>{product.price}</div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className='w-full'>Adicionar ao carrinho</Button>
              </DialogTrigger>

              <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                  <DialogTitle>Configurar produto</DialogTitle>
                </DialogHeader>
                <ProductComposition />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
