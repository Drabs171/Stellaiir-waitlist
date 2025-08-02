'use client'

import { Users, TrendingUp, Mail, UserMinus } from 'lucide-react'

interface StatsData {
  overview: {
    totalSignups: number
    signupsToday: number
    signupsThisWeek: number
    signupsThisMonth: number
    activeSubscribers: number
    unsubscribeCount: number
    unsubscribeRate: string
  }
  emails: {
    totalSent: number
    totalFailed: number
    successRate: string
  }
  referrals: {
    totalReferrals: number
    usersWithReferrals: number
    conversionRate: string
  }
}

interface StatsCardsProps {
  data: StatsData
}

export default function StatsCards({ data }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Signups',
      value: data.overview.totalSignups.toLocaleString(),
      subtitle: `${data.overview.signupsToday} today, ${data.overview.signupsThisWeek} this week`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Subscribers',
      value: data.overview.activeSubscribers.toLocaleString(),
      subtitle: `${data.overview.unsubscribeRate} unsubscribe rate`,
      icon: Mail,
      color: 'bg-green-500'
    },
    {
      title: 'Email Success Rate',
      value: data.emails.successRate,
      subtitle: `${data.emails.totalSent} sent, ${data.emails.totalFailed} failed`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Referral Users',
      value: data.referrals.usersWithReferrals.toLocaleString(),
      subtitle: `${data.referrals.conversionRate} conversion rate`,
      icon: UserMinus,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </p>
              <p className="text-xs text-gray-500">
                {card.subtitle}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}