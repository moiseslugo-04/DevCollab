// Product and finishing options data

export interface Product {
  id: string
  name: string
  description: string
  category: "cards" | "flyers" | "banners" | "brochures"
  materials: Material[]
  templateSize: {
    width: number
    height: number
    unit: "mm" | "in"
  }
  trimArea: {
    bleed: number
    safeZone: number
  }
}

export interface Material {
  id: string
  name: string
  description: string
  compatibleFinishing: string[]
}

export interface FinishingOption {
  id: string
  name: string
  description: string
  additionalCost: number
}

// Mock products
export const PRODUCTS: Product[] = [
  {
    id: "bc-001",
    name: "Business Cards",
    description: "Professional business cards",
    category: "cards",
    templateSize: { width: 90, height: 50, unit: "mm" },
    trimArea: { bleed: 3, safeZone: 5 },
    materials: [
      {
        id: "mat-001",
        name: "350gsm Silk",
        description: "Premium silk finish cardstock",
        compatibleFinishing: ["lamination", "spot-uv", "rounded-corners"],
      },
      {
        id: "mat-002",
        name: "400gsm Matt",
        description: "Extra thick matt cardstock",
        compatibleFinishing: ["lamination", "foil", "rounded-corners"],
      },
    ],
  },
  {
    id: "fly-001",
    name: "Flyers A5",
    description: "Standard A5 promotional flyers",
    category: "flyers",
    templateSize: { width: 148, height: 210, unit: "mm" },
    trimArea: { bleed: 3, safeZone: 5 },
    materials: [
      {
        id: "mat-003",
        name: "170gsm Gloss",
        description: "High quality gloss paper",
        compatibleFinishing: ["folding", "perforation"],
      },
      {
        id: "mat-004",
        name: "200gsm Silk",
        description: "Premium silk finish",
        compatibleFinishing: ["folding", "lamination"],
      },
    ],
  },
  {
    id: "ban-001",
    name: "Pull-up Banner",
    description: "Retractable display banner",
    category: "banners",
    templateSize: { width: 850, height: 2000, unit: "mm" },
    trimArea: { bleed: 0, safeZone: 50 },
    materials: [
      {
        id: "mat-005",
        name: "Standard PVC",
        description: "Durable PVC material",
        compatibleFinishing: ["eyelets"],
      },
      {
        id: "mat-006",
        name: "Premium Fabric",
        description: "High-end fabric material",
        compatibleFinishing: [],
      },
    ],
  },
  {
    id: "bro-001",
    name: "Brochure A4",
    description: "Professional tri-fold brochures",
    category: "brochures",
    templateSize: { width: 297, height: 210, unit: "mm" },
    trimArea: { bleed: 3, safeZone: 5 },
    materials: [
      {
        id: "mat-007",
        name: "150gsm Gloss",
        description: "Standard gloss paper",
        compatibleFinishing: ["folding", "stapling"],
      },
      {
        id: "mat-008",
        name: "170gsm Silk",
        description: "Premium silk finish",
        compatibleFinishing: ["folding", "stapling", "lamination"],
      },
    ],
  },
]

// Mock finishing options
export const FINISHING_OPTIONS: FinishingOption[] = [
  { id: "lamination", name: "Lamination", description: "Protective glossy or matt laminate", additionalCost: 15 },
  { id: "spot-uv", name: "Spot UV", description: "Selective high-gloss UV coating", additionalCost: 35 },
  { id: "foil", name: "Foil Stamping", description: "Metallic foil application", additionalCost: 50 },
  { id: "rounded-corners", name: "Rounded Corners", description: "Rounded corner cutting", additionalCost: 10 },
  { id: "folding", name: "Folding", description: "Professional folding service", additionalCost: 8 },
  { id: "perforation", name: "Perforation", description: "Tear-off perforation", additionalCost: 12 },
  { id: "eyelets", name: "Eyelets", description: "Metal eyelets for hanging", additionalCost: 20 },
  { id: "stapling", name: "Stapling", description: "Professional stapling", additionalCost: 5 },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getFinishingById(id: string): FinishingOption | undefined {
  return FINISHING_OPTIONS.find((f) => f.id === id)
}

export function getCompatibleFinishing(materialId: string, productId: string): FinishingOption[] {
  const product = getProductById(productId)
  if (!product) return []

  const material = product.materials.find((m) => m.id === materialId)
  if (!material) return []

  return FINISHING_OPTIONS.filter((f) => material.compatibleFinishing.includes(f.id))
}
