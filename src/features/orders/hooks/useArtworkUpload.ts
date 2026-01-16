import { ArtworkValidationResult } from '@/src/lib/artwork-validator'
import { useState } from 'react'

export function useArtworkUpload() {
  const [artworkFile, setArtworkFile] = useState<File | null>(null)
  const [artworkValidation, setArtworkValidation] =
    useState<ArtworkValidationResult | null>(null)

  const canProceed = !!artworkFile && !!artworkValidation

  return {
    artworkFile,
    artworkValidation,
    setArtworkFile,
    setArtworkValidation,
    canProceed,
  }
}
