// Orders management

export type ArtworkStatus = 'ok' | 'needs-adjustment'
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  userName: string
  userEmail: string
  productId: string
  productName: string
  materialId: string
  materialName: string
  quantity: number
  finishingOptions: string[]
  artworkFile: {
    name: string
    size: number
    type: string
    url: string
  }
  artworkStatus: ArtworkStatus
  artworkNotes?: string
  totalCost: number
  status: OrderStatus
  createdAt: string
}

// Mock orders database
const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2024-001',
    userId: '2',
    userName: 'John Reseller',
    userEmail: 'reseller1@example.com',
    productId: 'bc-001',
    productName: 'Business Cards',
    materialId: 'mat-001',
    materialName: '350gsm Silk',
    quantity: 500,
    finishingOptions: ['lamination', 'rounded-corners'],
    artworkFile: {
      name: 'business-card-design.pdf',
      size: 2456789,
      type: 'application/pdf',
      url: '/placeholder.svg?height=100&width=150',
    },
    artworkStatus: 'ok',
    totalCost: 125.5,
    status: 'completed',
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2024-002',
    userId: '4',
    userName: 'Mike Distributor',
    userEmail: 'reseller3@example.com',
    productId: 'fly-001',
    productName: 'Flyers A5',
    materialId: 'mat-003',
    materialName: '170gsm Gloss',
    quantity: 1000,
    finishingOptions: ['folding'],
    artworkFile: {
      name: 'flyer-promo.pdf',
      size: 3789456,
      type: 'application/pdf',
      url: '/placeholder.svg?height=100&width=150',
    },
    artworkStatus: 'needs-adjustment',
    artworkNotes:
      'Design extends beyond trim area. Please adjust or approve additional cutting cost.',
    totalCost: 245.0,
    status: 'processing',
    createdAt: '2024-02-15T14:20:00Z',
  },
]

export function getAllOrders(): Order[] {
  return MOCK_ORDERS.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getUserOrders(userId: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getOrderById(id: string): Order | undefined {
  return MOCK_ORDERS.find((o) => o.id === id)
}

export async function createOrder(
  order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>
): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newOrder: Order = {
    ...order,
    id: `ord-${Date.now()}`,
    orderNumber: `ORD-2024-${String(MOCK_ORDERS.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  }

  MOCK_ORDERS.push(newOrder)
  return newOrder
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const order = MOCK_ORDERS.find((o) => o.id === orderId)
  if (order) {
    order.status = status
  }

  return { success: true }
}
