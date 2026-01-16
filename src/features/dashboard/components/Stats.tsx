import { Users, Package, Clock, TrendingUp } from 'lucide-react'
import { StatCard } from './StatCard'
export function Stats() {
  const pendingUsers = 2
  const approvedResellers = 1
  const totalOrders = 2
  const completedOrders = 1
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8'>
      <StatCard
        title='Pending Approvals'
        subTitle='Awaiting review'
        stat={pendingUsers}
        Icon={Clock}
      />
      <StatCard
        title=' Active Resellers'
        subTitle='Approved accounts'
        stat={approvedResellers}
        Icon={Users}
      />
      <StatCard
        title=' Total Orders'
        subTitle='All time'
        stat={totalOrders}
        Icon={Package}
      />
      <StatCard
        title='Completion Rate'
        subTitle={`${completedOrders} completed`}
        stat={`50%`}
        Icon={TrendingUp}
      />
    </div>
  )
}
