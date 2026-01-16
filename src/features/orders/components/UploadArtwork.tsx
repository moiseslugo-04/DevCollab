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
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  validateArtwork,
  type ArtworkValidationResult,
} from '@/lib/artwork-validator'
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
} from 'lucide-react'
import { useState } from 'react'
interface Props {
  artworkFile: File | null
  artworkValidation: ArtworkValidationResult | null
  setArtworkFile: (file: File) => void
  setArtworkValidation: (result: ArtworkValidationResult) => void
  canProceed: boolean
  setCurrentStep: (step: number) => void
  next: () => void
  prev: () => void
}
export function UploadArtwork({
  canProceed,
  setArtworkFile,
  setArtworkValidation,
  artworkFile,
  artworkValidation,
  next,
  prev,
}: Props) {
  // Step 2: Artwork Upload
  const [isProcessing, setIsProcessing] = useState(false)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.custom(() => (
        <div className='relative inset-0 flex items-center justify-center pointer-events-none'>
          <div className=' absolute top-5 pointer-events-auto rounded-xl bg-black/80 text-white px-6 py-4 shadow-lg'>
            Please upload a PDF/X, PDF/X-1a, or PDF files
          </div>
        </div>
      ))
      return
    }

    setIsProcessing(true)
    setArtworkFile(file)

    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, use a default template size for validation
    const result = validateArtwork(
      file,
      { width: 100, height: 140, unit: 'mm' },
      { bleed: 3, safeZone: 5 }
    )
    setArtworkValidation(result)
    setIsProcessing(false)
  }

  return (
    <Card className='overflow-y-scroll'>
      <CardHeader>
        <CardTitle>Envie sua arte</CardTitle>
        <CardDescription>
          Faça o upload de arquivos PDF, PNG ou JPG. Validaremos sua arte
          automaticamente.%
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3  overflow-scroll'>
        <Label
          htmlFor='artwork-upload'
          className='flex justify-center items-center  flex-col border-2 border-dashed border-border rounded-lg px-12  py-8 text-center '
        >
          <div className=''>
            <Upload className='mx-auto h-10 w-12 text-muted-foreground mb-2' />

            <p className='cursor-pointer text-primary hover:text-primary/80 font-medium text-lg mx-auto'>
              Clique para carregar ou arraste e solte.
            </p>

            <Input
              id='artwork-upload'
              type='file'
              accept='.pdf,.png,.jpg,.jpeg'
              className='hidden'
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            <p className='text-sm text-muted-foreground mt-2'>
              PDF, PNG or JPG (MAX. 50MB)
            </p>
          </div>
        </Label>

        {isProcessing && (
          <Alert>
            <Loader2 className='h-4 w-4 animate-spin' />
            <AlertDescription>...</AlertDescription>
          </Alert>
        )}

        {artworkFile && artworkValidation && (
          <div className='space-y-4'>
            <Alert
              variant={
                artworkValidation.status === 'ok' ? 'default' : 'destructive'
              }
              className='border-green-500 text-green-700 bg-green-50'
            >
              <CheckCircle className='h-4 w-4' />
              <AlertDescription>
                <p className='font-semibold mb-2 text-black'>
                  Artwork OK for production
                </p>
              </AlertDescription>
            </Alert>

            <div className='flex items-center justify-between p-4 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <FileText className='h-8 w-8 text-muted-foreground' />
                <div>
                  <p className='font-medium'>{artworkFile.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {(artworkFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  artworkValidation.status === 'ok' ? 'default' : 'secondary'
                }
              >
                {artworkValidation.status === 'ok' ? 'Ready' : 'Needs Review'}
              </Badge>
            </div>
          </div>
        )}

        <div className='flex justify-between'>
          <Button variant='outline' onClick={prev}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <Button onClick={next} disabled={!canProceed}>
            Next Step
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
