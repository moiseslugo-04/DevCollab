import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
interface Props {
  stat: number | string
  title: string
  subTitle: string
  Icon: LucideIcon
}
export function StatCard({ stat, title, subTitle, Icon }: Props) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{stat}</div>
        <p className='text-xs text-muted-foreground'>{subTitle}</p>
      </CardContent>
    </Card>
  )
}
