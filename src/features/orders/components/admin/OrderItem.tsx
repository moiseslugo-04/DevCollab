import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Order } from '@/lib/orders'
export function OrderItem({ order }: { order: Order }) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{order.orderNumber}</TableCell>
      <TableCell>{order.userName}</TableCell>
      <TableCell>{order.productName}</TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>
        {order.artworkStatus === 'ok' ? (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-700 border-green-200'
          >
            OK for production
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='bg-amber-50 text-amber-700 border-amber-200'
          >
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
        >
          {order.status}
        </Badge>
      </TableCell>
      <TableCell className='text-right font-medium'>
        ${order.totalCost.toFixed(2)}
      </TableCell>
    </TableRow>
  )
}
