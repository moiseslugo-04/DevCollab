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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, ArrowRight } from 'lucide-react'
import { PRODUCTS, type Product } from '@/lib/products'
interface Props {
  selectedProduct: Product | null
  selectedMaterial: string
  setSelectedMaterial: (material: string) => void
  handleProductSelect: (productId: string) => void
  canProceed: boolean
  setCurrentStep: (step: number) => void
  handleDownloadTemplate: () => void
  next: () => void
}
export function ProductSelection({
  handleProductSelect,
  selectedProduct,
  selectedMaterial,
  setSelectedMaterial,
  setCurrentStep,
  handleDownloadTemplate,
  next,
  canProceed,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Product & Material</CardTitle>
        <CardDescription>
          Choose the product type and material for your order
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <Label className='text-base font-semibold mb-4 block'>
            Product Type
          </Label>
          <RadioGroup
            value={selectedProduct?.id || ''}
            onValueChange={handleProductSelect}
          >
            <div className='grid gap-4 md:grid-cols-2'>
              {PRODUCTS.map((product) => (
                <div key={product.id} className='relative'>
                  <RadioGroupItem
                    value={product.id}
                    id={product.id}
                    className='peer sr-only'
                  />
                  <Label
                    htmlFor={product.id}
                    className='flex flex-col gap-2 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5'
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <p className='font-semibold'>{product.name}</p>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {product.description}
                        </p>
                        <p className='text-xs text-muted-foreground mt-2'>
                          Template: {product.templateSize.width}x
                          {product.templateSize.height}
                          {product.templateSize.unit}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {selectedProduct && (
          <Alert className='bg-blue-50 border-blue-200'>
            <Download className='h-4 w-4 text-blue-600' />
            <AlertDescription>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-semibold text-blue-900'>
                    Need the template file?
                  </p>
                  <p className='text-sm text-blue-700'>
                    Download the correct gabarito for {selectedProduct.name}
                  </p>
                </div>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleDownloadTemplate}
                  className='ml-4 bg-transparent'
                >
                  <Download className='mr-2 h-4 w-4' />
                  Download
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {selectedProduct && (
          <div>
            <Label className='text-base font-semibold mb-4 block'>
              Material
            </Label>
            <RadioGroup
              value={selectedMaterial}
              onValueChange={setSelectedMaterial}
            >
              <div className='space-y-3'>
                {selectedProduct.materials.map((material) => (
                  <div key={material.id} className='relative'>
                    <RadioGroupItem
                      value={material.id}
                      id={material.id}
                      className='peer sr-only'
                    />
                    <Label
                      htmlFor={material.id}
                      className='flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5'
                    >
                      <div className='flex-1'>
                        <p className='font-medium'>{material.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {material.description}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

        <div className='flex   justify-end'>
          <Button onClick={next} disabled={!canProceed}>
            Next Step
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
