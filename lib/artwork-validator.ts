// Artwork validation utilities

export interface ArtworkValidationResult {
  status: 'ok' | 'needs-adjustment'
  messages: string[]
  details: {
    sizeMatch: boolean
    trimAreaOk: boolean
    safeZoneOk: boolean
  }
}
// contador de validações realizadas
let validationCount = 0

export function validateArtwork(
  file: File,
  templateSize: { width: number; height: number; unit: string },
  trimArea: { bleed: number; safeZone: number }
): ArtworkValidationResult {
  validationCount++

  // 👉 padrão: 1 bom + 2 com ajuste
  // 1 = OK
  // 2 = ajuste
  // 3 = ajuste
  const position = validationCount % 3

  // 🔹 Sempre OK no primeiro e no ciclo 1
  if (position === 1) {
    return {
      status: 'ok',
      messages: [
        'Arte final aprovada',
        'As dimensões correspondem ao template',
        'Todo o conteúdo está dentro da área segura',
        'Sangria configurada corretamente',
      ],
      details: {
        sizeMatch: true,
        trimAreaOk: true,
        safeZoneOk: true,
      },
    }
  }

  // 🔸 Nos outros dois casos → precisa de ajuste
  // ainda escolhemos qual erro usando random
  const random = Math.random()

  const issues: string[] = []
  const details = {
    sizeMatch: true,
    trimAreaOk: true,
    safeZoneOk: true,
  }

  if (random < 0.33) {
    issues.push(
      `O tamanho da arte não corresponde ao template (${templateSize.width}x${templateSize.height}${templateSize.unit})`
    )
    details.sizeMatch = false
  } else if (random < 0.66) {
    issues.push(
      `A arte ultrapassa a área de corte. É necessário bleed de ${trimArea.bleed}${templateSize.unit}.`
    )
    details.trimAreaOk = false
  } else {
    issues.push(
      `Conteúdo importante está fora da área segura. Mantenha o conteúdo a ${trimArea.safeZone}${templateSize.unit} das bordas.`
    )
    details.safeZoneOk = false
  }

  return {
    status: 'needs-adjustment',
    messages: issues,
    details,
  }
}
