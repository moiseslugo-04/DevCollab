import { PageLoading } from '@/components/shared/PageLoading'
import { DashBoardLayout } from '@/features/dashboard/components/DashBoardLayout'
import {
  Product,
  ProductCard,
} from '@/features/products/components/ProductCard'
import { getProductList } from '@/features/products/product.service'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function AdminProductsPage() {
  const products = (await getProductList()) as Product[]
  if (!products) return notFound()
  return (
    <>
      <DashBoardLayout />
      <Suspense fallback={<PageLoading text='carregando produtos' />}>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Suspense>
    </>
  )
}
