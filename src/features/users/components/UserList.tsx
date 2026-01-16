import { Badge } from '@/components/ui/badge'
import { type User } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CheckCircle, XCircle } from 'lucide-react'

interface Props {
  users: User[]
  handleStatusUpdate: (userId: string, status: 'approved' | 'rejected') => void
  isUpdating: string | null
}
export function UserList({ users, handleStatusUpdate, isUpdating }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reseller Accounts</CardTitle>
        <CardDescription>
          Review and approve reseller applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((u) => u.role === 'reseller')
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.status === 'pending' && (
                      <Badge
                        variant='outline'
                        className='bg-yellow-50 text-yellow-700 border-yellow-200'
                      >
                        Pending
                      </Badge>
                    )}
                    {user.status === 'approved' && (
                      <Badge
                        variant='outline'
                        className='bg-green-50 text-green-700 border-green-200'
                      >
                        Approved
                      </Badge>
                    )}
                    {user.status === 'rejected' && (
                      <Badge
                        variant='outline'
                        className='bg-red-50 text-red-700 border-red-200'
                      >
                        Rejected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    {user.status === 'pending' && (
                      <div className='flex gap-2 justify-end'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleStatusUpdate(user.id, 'approved')
                          }
                          disabled={isUpdating === user.id}
                          className='text-green-600 hover:text-green-700'
                        >
                          <CheckCircle className='h-4 w-4 mr-1' />
                          Approve
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() =>
                            handleStatusUpdate(user.id, 'rejected')
                          }
                          disabled={isUpdating === user.id}
                          className='text-red-600 hover:text-red-700'
                        >
                          <XCircle className='h-4 w-4 mr-1' />
                          Reject
                        </Button>
                      </div>
                    )}
                    {user.status !== 'pending' && (
                      <span className='text-sm text-muted-foreground'>
                        No actions
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
