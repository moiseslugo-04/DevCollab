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
import { useRegister } from '../hooks/useRegister'
export function Register() {
  const { handleRegister, isLoading, success, error } = useRegister()
  return (
    <TabsContent value='register'>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Register as a new reseller partner</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className='space-y-4'>
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className='border-green-500 text-green-700 bg-green-50'>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <Label htmlFor='reg-name'>Full Name</Label>
              <Input
                id='reg-name'
                name='name'
                type='text'
                placeholder='John Doe'
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='reg-email'>Email</Label>
              <Input
                id='reg-email'
                name='email'
                type='email'
                placeholder='you@example.com'
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='reg-password'>Password</Label>
              <Input
                id='reg-password'
                name='password'
                type='password'
                placeholder='••••••••'
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Register
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  )
}
