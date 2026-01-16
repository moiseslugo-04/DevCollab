import { UserRole } from '@/lib/auth'
import { adminNavItems } from './admin'
import { resellerNavItems } from './reseller'
import type { NavItem } from '@/types/navigation'

export const navigationByRole: Record<UserRole, NavItem[]> = {
  admin: adminNavItems,
  reseller: resellerNavItems,
}
