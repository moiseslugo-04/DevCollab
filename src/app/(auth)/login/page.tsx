import { AuthTabs } from '@/features/auth/components/AuthTabs'
import Image from 'next/image'
export default function AuthPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 text-primary-foreground mb-4'>
            <Image
              src={'/logo.png'}
              alt='Disk Lacre Logo'
              width={120}
              height={100}
            />
          </div>
          <h1 className='text-3xl font-bold text-balance'>Disk Lacre System</h1>
          <p className='text-muted-foreground mt-2'>Sistema de revendedor</p>
        </div>
        <AuthTabs />
      </div>
    </div>
  )
}
