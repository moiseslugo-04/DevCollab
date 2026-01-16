import { LayoutDashboard, Package, Wrench } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import type { NavItem } from '@/types/navigation'

export const adminNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.admin.root,
    icon: LayoutDashboard,
  },
  {
    label: 'Produtos',
    href: ROUTES.admin.products,
    icon: Package,
  },
  {
    label: 'matérias-primas',
    href: ROUTES.admin.Materials,
    icon: Wrench,
  },
]
