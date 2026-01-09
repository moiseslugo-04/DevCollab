'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Package, Plus, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getUserOrders, type Order } from '@/lib/orders'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<Order[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // First effect: Check auth and load orders once
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'reseller') {
      router.push('/')
      return
    }

    setOrders(getUserOrders(currentUser.id))
  }, [router])

  // Second effect: Handle success message based on URL params
  useEffect(() => {
    const orderSuccess = searchParams.get('order') === 'success'
    const paymentSuccess = searchParams.get('payment') === 'success'

    if (orderSuccess || paymentSuccess) {
      setShowSuccessMessage(true)

      // Clear the URL parameter after showing message
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
        router.replace('/dashboard')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, router])

  const totalOrders = orders.length
  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length
  const completedOrders = orders.filter((o) => o.status === 'completed').length
  const artworkIssues = orders.filter(
    (o) => o.artworkStatus === 'needs-adjustment'
  ).length

  return (
    <DashboardLayout
      title='My Dashboard'
      description='Manage your orders and create new ones'
    >
      {showSuccessMessage && (
        <Alert className='mb-6 bg-green-50 border-green-200'>
          <CheckCircle className='h-4 w-4 text-green-600' />
          <AlertDescription>
            <p className='font-semibold text-green-900'>
              OPedido criado com sucesso!
            </p>
            <p className='text-sm text-green-700'>
              Seu pedido foi enviado e aguarda confirmação de pagamento.
              Verifique seu e-mail para mais detalhes.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total de Pedidos
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalOrders}</div>
            <p className='text-xs text-muted-foreground'>All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Em Andamento</CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingOrders}</div>
            <p className='text-xs text-muted-foreground'>Pedidos ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Concluídos</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completedOrders}</div>
            <p className='text-xs text-muted-foreground'>Pedidos finalizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Problemas na Arte
            </CardTitle>
            <AlertCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{artworkIssues}</div>
            <p className='text-xs text-muted-foreground'>
              Necessitam de atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='mb-8'>
        <Card className='bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20'>
          <CardHeader>
            <CardTitle>Pronto para criar um novo pedido?</CardTitle>
            <CardDescription>
              Envie sua arte, escolha os produtos e tenha seu pedido processado
              rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/dashboard/new-order')}
              size='lg'
              className='gap-2'
            >
              <Plus className='h-5 w-5' />
              Create New Order
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>View and track your order history</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className='text-center py-12'>
              <Package className='mx-auto h-12 w-12 text-muted-foreground/50' />
              <h3 className='mt-4 text-lg font-semibold'>No orders yet</h3>
              <p className='text-sm text-muted-foreground mt-2'>
                Get started by creating your first order
              </p>
              <Button
                onClick={() => router.push('/dashboard/new-order')}
                className='mt-4'
                variant='outline'
              >
                Create Order
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido #</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status da Arte</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className='font-medium'>
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className='font-medium'>{order.productName}</div>
                        <div className='text-sm text-muted-foreground'>
                          {order.materialName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      {order.artworkStatus === 'ok' ? (
                        <Badge
                          variant='outline'
                          className='bg-green-50 text-green-700 border-green-200'
                        >
                          <CheckCircle className='h-3 w-3 mr-1' />
                          OK
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='bg-amber-50 text-amber-700 border-amber-200'
                        >
                          <AlertCircle className='h-3 w-3 mr-1' />
                          Needs adjustment
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'processing'
                            ? 'secondary'
                            : 'outline'
                        }
                        className='capitalize'
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      ${order.totalCost.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

export default function ResellerDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
