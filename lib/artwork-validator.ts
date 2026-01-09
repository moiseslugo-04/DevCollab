// Artwork validation utilities

export interface ArtworkValidationResult {
  status: "ok" | "needs-adjustment"
  messages: string[]
  details: {
    sizeMatch: boolean
    trimAreaOk: boolean
    safeZoneOk: boolean
  }
}

export function validateArtwork(
  file: File,
  templateSize: { width: number; height: number; unit: string },
  trimArea: { bleed: number; safeZone: number },
): ArtworkValidationResult {
  // Mock validation - in real app, this would analyze the actual file
  // For demo purposes, we'll randomly assign validation results

  const random = Math.random()

  if (random > 0.3) {
    // 70% chance of artwork being OK
    return {
      status: "ok",
      messages: [
        "Artwork dimensions match the template size",
        "Design is within the safe zone",
        "Bleed area is correctly set up",
      ],
      details: {
        sizeMatch: true,
        trimAreaOk: true,
        safeZoneOk: true,
      },
    }
  } else {
    // 30% chance of issues
    const issues: string[] = []
    const details = {
      sizeMatch: true,
      trimAreaOk: true,
      safeZoneOk: true,
    }

    if (random < 0.1) {
      issues.push(
        `Artwork size does not match template (${templateSize.width}x${templateSize.height}${templateSize.unit})`,
      )
      details.sizeMatch = false
    }

    if (random >= 0.1 && random < 0.2) {
      issues.push(`Design extends beyond the trim area. Bleed of ${trimArea.bleed}${templateSize.unit} required.`)
      details.trimAreaOk = false
    }

    if (random >= 0.2 && random < 0.3) {
      issues.push(
        `Important content is outside the safe zone. Keep content ${trimArea.safeZone}${templateSize.unit} from edges.`,
      )
      details.safeZoneOk = false
    }

    return {
      status: "needs-adjustment",
      messages: issues,
      details,
    }
  }
}
