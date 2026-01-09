'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useLogin } from '@/features/auth/hooks/useLogin'

export function Login() {
  // all about
  const { handleLogin, isLoading, error } = useLogin()
  return (
    <TabsContent value='login'>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className='space-y-4'>
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='text'
                placeholder='you@example.com'
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                required
                disabled={isLoading}
              />
            </div>

            <div className='text-sm text-muted-foreground'>
              <p className='font-medium mb-1'>Demo credentials:</p>
              <p>Admin: admin / demo123</p>
              <p>Reseller: reseller1 / demo123</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  )
}
