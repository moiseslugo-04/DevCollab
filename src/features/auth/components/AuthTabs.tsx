'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Login } from '@/features/auth/components/Login'
import { Register } from '@/features/auth/components/Register'
export function AuthTabs() {
  return (
    <Tabs defaultValue='login' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='login'>Login</TabsTrigger>
        <TabsTrigger value='register'>Register</TabsTrigger>
      </TabsList>
      <Login />
      <Register />
    </Tabs>
  )
}
