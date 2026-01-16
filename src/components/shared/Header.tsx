'use client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

import { LogOut, User } from 'lucide-react'
import { getCurrentUser, logout, type User as UserType } from '@/lib/auth'
import { navigationByRole } from '@/config/navigation'
import Image from 'next/image'
import { HeaderSkeleton } from './HeaderSkeleton'
export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push('/')
    } else {
      setUser(currentUser)
    }
  }, [router])

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return null
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const navItems = navigationByRole[user.role]
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Link
              href={user.role === 'admin' ? '/admin' : '/dashboard'}
              className='flex items-center gap-3'
            >
              <div className='flex items-center justify-center w-24  rounded-lg  text-primary-foreground'>
                <Image
                  src={'/logo.png'}
                  width={50}
                  height={70}
                  alt='Disk Lacre Logo'
                />
              </div>
              <div>
                <h1 className='text-md font-semibold'>DiskLacre System</h1>
                <p className='text-xs text-muted-foreground capitalize'>
                  {user.role} Portal
                </p>
              </div>
            </Link>

            <nav className='hidden md:flex items-center gap-1'>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size='sm'
                      className='gap-2'
                    >
                      <Icon className='h-4 w-4' />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='relative h-10 w-10 rounded-full'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {user.name}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='md:hidden'>
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className='cursor-pointer'>
                        <Icon className='mr-2 h-4 w-4' />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem disabled>
                <User className='mr-2 h-4 w-4' />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </Suspense>
  )
}
