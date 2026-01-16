'use client'
import type React from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  return (
    <main className='container py-8'>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-balance'>{title}</h2>
        {description && (
          <p className='text-muted-foreground mt-2'>{description}</p>
        )}
      </div>
      {children}
    </main>
  )
}
