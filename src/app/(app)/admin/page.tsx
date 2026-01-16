'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getAllUsers, updateUserStatus, type User } from '@/lib/auth'
import { getAllOrders, type Order } from '@/lib/orders'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { OrderList } from '@/features/orders/components/admin/OrderList'
import { UserList } from '@/features/users/components/UserList'
import { Stats } from '@/features/dashboard/components/Stats'

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/')
      return
    }

    setUsers(getAllUsers())
    setOrders(getAllOrders())
  }, [router])

  const handleStatusUpdate = async (
    userId: string,
    status: 'approved' | 'rejected'
  ) => {
    setIsUpdating(userId)
    await updateUserStatus(userId, status)
    setUsers(getAllUsers())
    setIsUpdating(null)
  }

  return (
    <section>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-balance'>Admin Dashboard</h2>
        <p className='text-muted-foreground mt-2'>
          Manage reseller accounts and monitor orders
        </p>
      </div>
      {/* Stats Cards */}
      <Stats />
      {/* Tabs for Users and Orders */}
      <Tabs defaultValue='users' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='users'>User Management</TabsTrigger>
          <TabsTrigger value='orders'>All Orders</TabsTrigger>
        </TabsList>
        <TabsContent value='users' className='space-y-4'>
          <UserList
            users={users}
            handleStatusUpdate={handleStatusUpdate}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value='orders' className='space-y-4'>
          <OrderList orders={orders} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
