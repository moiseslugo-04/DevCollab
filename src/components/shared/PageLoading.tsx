import Image from 'next/image'

interface PageLoadingProps {
  text?: string
}

export function PageLoading({ text = 'Loading...' }: PageLoadingProps) {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background'>
      <Image
        src='/logo.png' // 👉 tu logo aquí
        alt='Logo'
        width={100}
        height={100}
        className='animate-pulse'
      />

      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground'>{text}</span>
        <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground' />
        <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]' />
        <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]' />
      </div>
    </div>
  )
}
