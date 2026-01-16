'use client'

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

// this need to refactor

export interface Variacao {
  id?: number
  nome?: string
  valor?: number
  status?: 'Ativo' | 'Inativo'
}

export interface Model {
  id: number
  nome: string
  acabamento: string
  unidade_cobranca: string
  peso: number
  estoque: 'Sim' | 'Não'
  status: 'Ativo' | 'Inativo'

  largura: number
  altura: number
  espessura: number

  campo_extra_titulo: string
  campo_extra_abreviacao: string
  campo_extra_unidade: string

  dupla_face: 'Sim' | 'Não'

  acao_producao: number
  largura_producao: number
  altura_producao: number
  usinagem_como_servico: number

  percentual_markup: number
  percentual_margem_liquida_padrao: number
  percentual_margem_liquida_minima: number

  valor_final: number

  descricao_cliente: string

  codigo_fiscal: string
  gtin: string
  codigo_beneficio: string
  ncm: string
  cest: string

  origem: string
  cfop: string
  cst_icms: string
  percentual_ipi: number
  enquadramento_ipi: string
  cst_ipi: string
  ipi_incluso: 'Sim' | 'Não'

  descricao_fiscal: string

  variacoes: Variacao[]
}

export interface Product {
  id: number
  categoria: string
  nome: string
  status: 'Ativo' | 'Inativo'
  modelos: Model[]
}

interface Props {
  product: Product
  handleEditProduct?: (product: Product) => void
}
export function ProductCard({ product, handleEditProduct }: Props) {
  return (
    <Card key={product.id}>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div>
            <CardTitle>{product.nome}</CardTitle>
            <CardDescription className='mt-1'>{product.status}</CardDescription>
          </div>
          <Badge>{product.categoria}</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='text-sm'>
          <p className='text-muted-foreground'>Template Size:</p>
          <p className='font-medium'>
            {0} x {0}
            {1}
          </p>
        </div>

        <div className='text-sm'>
          <p className='text-muted-foreground'>Materials:</p>
          <div className='flex flex-wrap gap-1 mt-1'>
            {product.modelos.map((material) => (
              <Badge key={material.id} variant='outline' className='text-xs'>
                {material.acabamento}
              </Badge>
            ))}
          </div>
        </div>

        <div className='text-sm'>
          <p className='text-muted-foreground'>Trim Settings:</p>
          <p className='font-medium text-xs'>
            Bleed: {0}mm, Safe Zone: {0}mm
          </p>
        </div>

        <div className='flex gap-2 pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='flex-1 bg-transparent'
            onClick={
              handleEditProduct ? () => handleEditProduct(product) : () => {}
            }
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
