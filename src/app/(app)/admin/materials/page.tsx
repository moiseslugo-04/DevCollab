import { getMaterialsList } from '@/features/products/product.service'
import { Finished, FinishedUI } from '@/lib/products'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign } from 'lucide-react'
export default async function MaterialPage() {
  const material: Finished[] = await getMaterialsList()
  function mapAcabamentoToUI(acabamento: Finished): FinishedUI {
    return {
      id: acabamento.id,
      nome: acabamento.nome,
      categoria: acabamento.categoria,
      unidade: acabamento.unidade_custo,
      preco: acabamento.valor_custo,
      estoque: acabamento.controle_estoque === 'Sim',
      status: acabamento.status,
    }
  }
  const parseMaterial = material.map((finished) => mapAcabamentoToUI(finished))

  return (
    <>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-balance'>
          Gestão de Materias Primas e Acabamentos
        </h2>
        <p className='text-muted-foreground mt-2'>
          Gerenciar materiais e modelos.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {parseMaterial.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <CardTitle className='text-lg'>{product.nome}</CardTitle>
                <Badge variant='secondary' className='flex items-center gap-1'>
                  <span className='flex items-center'>
                    R<DollarSign className='h-3 w-3' />
                  </span>
                  {product.preco.toFixed(2)}
                </Badge>
              </div>
              <CardDescription>{product.categoria}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {/*     <div className='text-sm'>
                  <p className='text-muted-foreground mb-2'>Compatible with:</p>
                  {compatibleProducts.length > 0 ? (
                    <div className='flex flex-wrap gap-1'>
                      {compatibleProducts.map((product) => (
                        <Badge
                          key={product.id}
                          variant='outline'
                          className='text-xs'
                        >
                          {product.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      No products assigned yet
                    </p>
                  )}
                </div> */}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
