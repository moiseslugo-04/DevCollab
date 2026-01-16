import { Skeleton } from '@/components/ui/skeleton'

export function HeaderSkeleton() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        {/* Left */}
        <div className='flex items-center gap-6'>
          {/* Logo + title */}
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-20 rounded-lg' />
            <div className='space-y-1'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-20' />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className='hidden md:flex items-center gap-1'>
            <Skeleton className='h-8 w-20 rounded-md' />
            <Skeleton className='h-8 w-24 rounded-md' />
            <Skeleton className='h-8 w-20 rounded-md' />
          </nav>
        </div>

        {/* Right avatar */}
        <Skeleton className='h-10 w-10 rounded-full' />
      </div>
    </header>
  )
}
