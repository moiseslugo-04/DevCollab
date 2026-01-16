'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Search,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getUserOrders, type Order } from '@/lib/orders'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== 'reseller') {
      router.push('/')
      return
    }

    setOrders(getUserOrders(currentUser.id))
  }, [router])

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-balance'>Meus pedidos</h2>
        <p className='text-muted-foreground mt-2'>
          Veja e gerencie todos os seus pedidos.
        </p>
      </div>
      <Card>
        <CardHeader>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                Track and review your print orders
              </CardDescription>
            </div>
            <div className='relative w-full sm:w-72'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search orders...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className='text-center py-12'>
              <Package className='mx-auto h-12 w-12 text-muted-foreground/50' />
              <h3 className='mt-4 text-lg font-semibold'>
                {searchQuery ? 'No orders found' : 'No orders yet'}
              </h3>
              <p className='text-sm text-muted-foreground mt-2'>
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by creating your first order'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => router.push('/dashboard/new-order')}
                  className='mt-4'
                >
                  Create Order
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Artwork</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
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
                      {new Date(order.createdAt).toLocaleDateString()}
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
                      {order.artworkStatus === 'ok' ? (
                        <div className='flex items-center gap-1 text-green-600'>
                          <CheckCircle className='h-4 w-4' />
                          <span className='text-sm'>OK</span>
                        </div>
                      ) : (
                        <div className='flex items-center gap-1 text-amber-600'>
                          <AlertCircle className='h-4 w-4' />
                          <span className='text-sm'>Needs adjustment</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      ${order.totalCost.toFixed(2)}
                    </TableCell>
                    <TableCell className='text-right'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className='h-4 w-4 mr-1' />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-2xl'>
                          <DialogHeader>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Complete information for {order.orderNumber}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className='space-y-6'>
                              <div className='grid gap-6 md:grid-cols-2'>
                                <div className='space-y-4'>
                                  <div>
                                    <Label className='text-sm text-muted-foreground'>
                                      Order Number
                                    </Label>
                                    <p className='font-medium'>
                                      {selectedOrder.orderNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className='text-sm text-muted-foreground'>
                                      Product
                                    </Label>
                                    <p className='font-medium'>
                                      {selectedOrder.productName}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className='text-sm text-muted-foreground'>
                                      Material
                                    </Label>
                                    <p className='font-medium'>
                                      {selectedOrder.materialName}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className='text-sm text-muted-foreground'>
                                      Quantity
                                    </Label>
                                    <p className='font-medium'>
                                      {selectedOrder.quantity}
                                    </p>
                                  </div>
                                </div>

                                <div className='space-y-4'>
                                  <div>
                                    <Label className='text-sm text-muted-foreground flex items-center gap-2'>
                                      <Calendar className='h-4 w-4' />
                                      Order Date
                                    </Label>
                                    <p className='font-medium'>
                                      {new Date(
                                        selectedOrder.createdAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className='text-sm text-muted-foreground'>
                                      Status
                                    </Label>
                                    <Badge
                                      variant={
                                        selectedOrder.status === 'completed'
                                          ? 'default'
                                          : selectedOrder.status ===
                                            'processing'
                                          ? 'secondary'
                                          : 'outline'
                                      }
                                      className='mt-1 capitalize'
                                    >
                                      {selectedOrder.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label className='text-sm text-muted-foreground flex items-center gap-2'>
                                      <DollarSign className='h-4 w-4' />
                                      Total Cost
                                    </Label>
                                    <p className='text-2xl font-bold text-primary'>
                                      ${selectedOrder.totalCost.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className='border-t pt-4'>
                                <Label className='text-sm text-muted-foreground flex items-center gap-2 mb-3'>
                                  <FileText className='h-4 w-4' />
                                  Artwork Information
                                </Label>
                                <div className='bg-muted/50 p-4 rounded-lg space-y-3'>
                                  <div className='flex justify-between'>
                                    <span className='text-sm'>File name:</span>
                                    <span className='font-medium text-sm'>
                                      {selectedOrder.artworkFile.name}
                                    </span>
                                  </div>
                                  <div className='flex justify-between'>
                                    <span className='text-sm'>File size:</span>
                                    <span className='font-medium text-sm'>
                                      {(
                                        selectedOrder.artworkFile.size /
                                        1024 /
                                        1024
                                      ).toFixed(2)}{' '}
                                      MB
                                    </span>
                                  </div>
                                  <div className='flex justify-between items-center'>
                                    <span className='text-sm'>Status:</span>
                                    <Badge
                                      variant={
                                        selectedOrder.artworkStatus === 'ok'
                                          ? 'default'
                                          : 'secondary'
                                      }
                                    >
                                      {selectedOrder.artworkStatus === 'ok'
                                        ? 'OK for production'
                                        : 'Needs adjustment'}
                                    </Badge>
                                  </div>
                                  {selectedOrder.artworkNotes && (
                                    <div className='pt-2 border-t'>
                                      <p className='text-sm text-muted-foreground mb-1'>
                                        Notes:
                                      </p>
                                      <p className='text-sm'>
                                        {selectedOrder.artworkNotes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {selectedOrder.finishingOptions.length > 0 && (
                                <div className='border-t pt-4'>
                                  <Label className='text-sm text-muted-foreground mb-3 block'>
                                    Finishing Options
                                  </Label>
                                  <div className='flex flex-wrap gap-2'>
                                    {selectedOrder.finishingOptions.map(
                                      (option) => (
                                        <Badge key={option} variant='outline'>
                                          {option}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
