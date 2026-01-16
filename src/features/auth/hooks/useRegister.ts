import { register } from '@/lib/auth'
import { useState } from 'react'

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await register(name, email, password)

    if (result.success) {
      setSuccess(
        'Registration successful! Your account is pending admin approval.'
      )
      setIsLoading(false)
    } else {
      setError(result.error || 'Registration failed')
      setIsLoading(false)
    }
  }
  return { handleRegister, isLoading, error, success }
}
