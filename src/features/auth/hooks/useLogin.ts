import { useState } from 'react'
import { login } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await login(email, password)

    if (result.success && result.user) {
      router.push(result.user.role === 'admin' ? '/admin' : '/')
    } else {
      setError(result.error || 'Login failed')
      setIsLoading(false)
    }
  }

  return { handleLogin, error, isLoading }
}
