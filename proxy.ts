import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export function proxy(res: NextRequest) {
  const currentUser = getCurrentUser()

  return NextResponse.next()
}
