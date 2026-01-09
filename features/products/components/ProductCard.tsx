import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/products'
interface Props {
  product: Product
  handleEditProduct: (product: Product) => void
}
export function ProductCard({ product, handleEditProduct }: Props) {
  return (
    <Card key={product.id}>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription className='mt-1'>
              {product.description}
            </CardDescription>
          </div>
          <Badge>{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='text-sm'>
          <p className='text-muted-foreground'>Template Size:</p>
          <p className='font-medium'>
            {product.templateSize.width} x {product.templateSize.height}{' '}
            {product.templateSize.unit}
          </p>
        </div>

        <div className='text-sm'>
          <p className='text-muted-foreground'>Materials:</p>
          <div className='flex flex-wrap gap-1 mt-1'>
            {product.materials.map((material) => (
              <Badge key={material.id} variant='outline' className='text-xs'>
                {material.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className='text-sm'>
          <p className='text-muted-foreground'>Trim Settings:</p>
          <p className='font-medium text-xs'>
            Bleed: {product.trimArea.bleed}mm, Safe Zone:{' '}
            {product.trimArea.safeZone}mm
          </p>
        </div>

        <div className='flex gap-2 pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex-1 bg-transparent'
            onClick={() => handleEditProduct(product)}
          >
            <Edit className='mr-2 h-3 w-3' />
            Edit
          </Button>
          <Button variant='outline' size='sm' className='flex-1 bg-transparent'>
            <FileDown className='mr-2 h-3 w-3' />
            Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
