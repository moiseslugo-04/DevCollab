// Dados de produtos e opções de acabamento

export interface Product {
  id: string
  name: string
  description: string
  category: 'cards' | 'flyers' | 'banners' | 'brochures'
  materials: Material[]
  templateSize: {
    width: number
    height: number
    unit: 'mm' | 'in'
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

// Produtos mock (apenas 2)
export const PRODUCTS: Product[] = [
  {
    id: 'cracha-001',
    name: 'Crachá PVC',
    description: 'Crachá em PVC para identificação profissional',
    category: 'cards',
    templateSize: { width: 10, height: 14, unit: 'mm' },
    trimArea: { bleed: 3, safeZone: 5 },
    materials: [
      {
        id: 'mat-pvc',
        name: 'PVC Cartão',
        description: 'Material PVC resistente para crachás',
        compatibleFinishing: [
          'cristal',
          'holografia',
          'furo-duplo',
          'furo-unico-redondo',
          'furo-unico-quadrado',
        ],
      },
    ],
  },
  {
    id: 'cordao-001',
    name: 'Cordão Personalizado',
    description: 'Cordão personalizado para crachá',
    category: 'banners',
    templateSize: { width: 24.899, height: 840, unit: 'mm' },
    trimArea: { bleed: 3, safeZone: 5 },
    materials: [
      {
        id: 'mat-cordao',
        name: 'Tecido Poliéster',
        description: 'Cordão em poliéster resistente',
        compatibleFinishing: [
          'puntera-unica',
          'puntera-dupla',
          'jacare-metal',
          'mosquetao-plastico',
        ],
      },
    ],
  },
]

// Opções de acabamento mock
export const FINISHING_OPTIONS: FinishingOption[] = [
  // Crachá PVC
  {
    id: 'cristal',
    name: 'Cristal',
    description: 'Acabamento cristal transparente',
    additionalCost: 10,
  },
  {
    id: 'holografia',
    name: 'Holografia',
    description: 'Efeito holográfico decorativo',
    additionalCost: 25,
  },
  {
    id: 'furo-duplo',
    name: 'Furo Duplo',
    description: 'Dois furos para presilha',
    additionalCost: 8,
  },
  {
    id: 'furo-unico-redondo',
    name: 'Furo Único Redondo',
    description: 'Furo único com formato redondo',
    additionalCost: 6,
  },
  {
    id: 'furo-unico-quadrado',
    name: 'Furo Único Quadrado',
    description: 'Furo único com formato quadrado',
    additionalCost: 6,
  },

  // Cordão
  {
    id: 'puntera-unica',
    name: 'Ponteira Única',
    description: 'Uma ponteira de acabamento',
    additionalCost: 5,
  },
  {
    id: 'puntera-dupla',
    name: 'Ponteira Dupla',
    description: 'Duas ponteiras de acabamento',
    additionalCost: 8,
  },
  {
    id: 'jacare-metal',
    name: 'Jacaré de Metal',
    description: 'Clipe tipo jacaré em metal',
    additionalCost: 12,
  },
  {
    id: 'mosquetao-plastico',
    name: 'Mosquetão Plástico',
    description: 'Mosquetão em material plástico',
    additionalCost: 6,
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getFinishingById(id: string): FinishingOption | undefined {
  return FINISHING_OPTIONS.find((f) => f.id === id)
}

export function getCompatibleFinishing(
  materialId: string,
  productId: string
): FinishingOption[] {
  const product = getProductById(productId)
  if (!product) return []

  const material = product.materials.find((m) => m.id === materialId)
  if (!material) return []

  return FINISHING_OPTIONS.filter((f) =>
    material.compatibleFinishing.includes(f.id)
  )
}
