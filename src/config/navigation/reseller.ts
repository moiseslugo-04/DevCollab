import { LayoutDashboard, ShoppingCart, FileText } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import type { NavItem } from '@/types/navigation'

export const resellerNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.reseller.root,
    icon: LayoutDashboard,
  },
  {
    label: 'New Order',
    href: ROUTES.reseller.newOrder,
    icon: ShoppingCart,
  },
  {
    label: 'My Orders',
    href: ROUTES.reseller.orders,
    icon: FileText,
  },
]
