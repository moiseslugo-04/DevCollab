'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle, Package, Settings, Send } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { FINISHING_OPTIONS, type Product } from '@/lib/products'

import { ProductSelection } from '@/features/orders/components/ProductSelection'
import { UploadArtwork } from '@/features/orders/components/UploadArtwork'
import { FinishingOptions } from '@/features/orders/components/FinishingOptions'
import { Review } from '@/features/orders/components/OrderReview'
import { Progress } from '@/components/ui/progress'
import { useOrderStep } from '@/features/orders/hooks/useOrderStep'
import { useSelectProduct } from '@/features/orders/hooks/useSelectProduct'
import { useArtworkUpload } from '@/features/orders/hooks/useArtworkUpload'
import { useFinishing } from '@/features/orders/hooks/useFinishing'
import {
  OrderProduct,
  useOrderReview,
} from '@/features/orders/hooks/useOrderReview'

export default function NewOrderPage() {
  const { currentStep, setCurrentStep, next, prev, progress } = useOrderStep()
  const router = useRouter()

  // Step 1: Product Selection
  const productStep = useSelectProduct()

  //step 2
  const artworkStep = useArtworkUpload()
  // Step 3: Finishing Options
  const finishingStep = useFinishing()

  // Step 4: Review

  const product = {
    material: productStep.selectedMaterial,
    ...productStep.selectedProduct,
    finishes: finishingStep.selectedFinishing,
    quantity: finishingStep.quantity,
  } as OrderProduct
  const reviewStep = useOrderReview({
    product,
    artworkFile: artworkStep.artworkFile,
    artworkValidation: artworkStep.artworkValidation,
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'reseller') {
      router.push('/')
    }
  }, [router])

  const handleDownloadTemplate = () => {
    if (!productStep.selectedProduct) return

    // Mock template download - in real app would download actual file
    const link = document.createElement('a')
    link.href = `/placeholder.svg?height=400&width=400&query=template-${productStep.selectedProduct.id}`
    link.download = `${productStep.selectedProduct.name
      .toLowerCase()
      .replace(/\s+/g, '-')}-template.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function handleFinishingToggle(id: string) {
    const isFuro = id.includes('furo')

    // 👉 se for furo = seleção única
    if (isFuro) {
      // se já está selecionado → desmarca
      if (finishingStep.selectedFinishing.includes(id)) {
        finishingStep.setSelectedFinishing([])
      } else {
        // só mantém esse furo ativo
        const onlyFuros = FINISHING_OPTIONS.map((f) => f.id).filter((fid) =>
          fid.includes('furo')
        )

        // remove todos os furos anteriores
        const withoutFuros = finishingStep.selectedFinishing.filter(
          (fid) => !onlyFuros.includes(fid)
        )

        finishingStep.setSelectedFinishing([...withoutFuros, id])
      }

      return
    }

    // 👉 se NÃO é furo = múltipla seleção normal
    if (finishingStep.selectedFinishing.includes(id)) {
      finishingStep.setSelectedFinishing(
        finishingStep.selectedFinishing.filter((f) => f !== id)
      )
    } else {
      finishingStep.setSelectedFinishing([
        ...finishingStep.selectedFinishing,
        id,
      ])
    }
  }

  const stepsTitles = [
    { number: 1, name: 'Select Product', icon: Package },
    { number: 2, name: 'Upload Artwork', icon: Upload },
    { number: 3, name: 'Choose Options', icon: Settings },
    { number: 4, name: 'Review & Submit', icon: Send },
  ]

  return (
    <div>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-balance'>Criar novo pedido</h2>
        <p className='text-muted-foreground mt-2'>
          Siga os passos para criar seu pedido de impressão.
        </p>
      </div>
      {/* Progress Bar */}
      <div className='mb-8'>
        <Progress value={progress} className='h-2 mb-4' />
        <div className='grid grid-cols-4 gap-4'>
          {stepsTitles.map((step) => {
            const StepIcon = step.icon
            const isActive = currentStep === step.number
            const isCompleted = currentStep > step.number

            return (
              <div key={step.number} className='flex flex-col items-center'>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className='w-6 h-6' />
                  ) : (
                    <StepIcon className='w-6 h-6' />
                  )}
                </div>
                <span
                  className={`text-sm font-medium text-center ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Product Selection */}
      {currentStep === 1 && (
        <ProductSelection
          setCurrentStep={setCurrentStep}
          next={next}
          handleDownloadTemplate={handleDownloadTemplate}
          {...productStep}
        />
      )}
      {/* Step 2:  Upload Artwork  */}
      {currentStep === 2 && productStep.canProceed && (
        <UploadArtwork
          {...artworkStep}
          setCurrentStep={setCurrentStep}
          next={next}
          prev={prev}
        />
      )}

      {/* Step 3: Finishing Options */}
      {currentStep === 3 && artworkStep.canProceed && (
        <FinishingOptions
          {...finishingStep}
          productId={productStep.selectedProduct?.id!}
          selectedMaterial={productStep.selectedMaterial}
          handleFinishingToggle={handleFinishingToggle}
          setCurrentStep={setCurrentStep}
          next={next}
          prev={prev}
        />
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && finishingStep.canProceed && (
        <Review
          {...reviewStep}
          prev={prev}
          product={product}
          quantity={finishingStep.quantity}
          artworkFile={artworkStep.artworkFile!}
          artworkValidation={artworkStep.artworkValidation!}
        />
      )}
    </div>
  )
}
