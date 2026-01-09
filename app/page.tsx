'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Printer } from 'lucide-react'
import { Login } from '@/features/auth/components/Login'
import { Register } from '@/features/auth/components/Register'

export default function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4'>
            <Printer className='w-8 h-8' />
          </div>
          <h1 className='text-3xl font-bold text-balance'>PrintShop Pro</h1>
          <p className='text-muted-foreground mt-2'>
            Professional print ordering platform
          </p>
        </div>

        <Tabs defaultValue='login' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='login'>Login</TabsTrigger>
            <TabsTrigger value='register'>Register</TabsTrigger>
          </TabsList>
          <Login />
          <Register />
        </Tabs>
      </div>
    </div>
  )
}
