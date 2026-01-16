import type React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'
import { Header } from '@/components/shared/Header'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Disk Lacre - Reseller System',
  description: 'B2B print ordering platform for resellers',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`font-sans antialiased p-4`} suppressHydrationWarning>
        <div className='min-h-fit bg-background '>
          <Header />
          {/* Main Content */}
          <main className='container py-8'>{children}</main>
        </div>
        <Analytics />
        <Toaster
          closeButton
          position='top-center'
          toastOptions={{
            className: 'min-w-[360px] whitespace-normal',
          }}
        />
      </body>
    </html>
  )
}
