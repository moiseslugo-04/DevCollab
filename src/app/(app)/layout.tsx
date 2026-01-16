import { Header } from '@/components/shared/Header'
import { Analytics } from '@vercel/analytics/next'
import { ReactNode } from 'react'

export default function LayoutApp({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-fit bg-background'>
      <Header />
      {/* Main Content */}
      <main className='container py-8'>{children}</main>
    </div>
  )
}
