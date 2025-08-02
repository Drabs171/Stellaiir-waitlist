'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, RefreshCw, Calendar } from 'lucide-react'
import AuthGuard from '@/components/admin/AuthGuard'
import StatsCards from '@/components/admin/StatsCards'
import SignupChart from '@/components/admin/SignupChart'
import TopReferrers from '@/components/admin/TopReferrers'
import ExportButton from '@/components/admin/ExportButton'
import SearchFilter, { FilterState } from '@/components/admin/SearchFilter'
import AnimatedButton from '@/components/ui/AnimatedButton'
import { PageTransition, StaggerContainer, FadeInWhenVisible } from '@/components/ui/PageTransition'
import { SkeletonStats, SkeletonChart, SkeletonTable } from '@/components/ui/Skeleton'
import { fadeInUp } from '@/lib/animations'

interface DashboardData {
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
    byType: {
      welcome: { sent: number; failed: number }
      milestone: { sent: number; failed: number }
      admin: { sent: number; failed: number }
    }
  }
  referrals: {
    totalReferrals: number
    usersWithReferrals: number
    conversionRate: string
    avgReferralsPerUser: string
  }
  topReferrers: Array<{
    email: string
    referralCount: number
  }>
  signupTrend: Array<{
    date: string
    signups: number
  }>
  period: string
}

interface SignupData {
  id: string
  email: string
  position: number
  referralCode: string
  referralCount: number
  referredBy: {
    email: string
    referralCode: string
  } | null
  joinedAt: string
  emailSent: boolean
  lastEmailSent: string | null
  emailFailures: number
  unsubscribed: boolean
}

interface SignupsResponse {
  data: SignupData[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [signupsData, setSignupsData] = useState<SignupsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSignups, setIsLoadingSignups] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    startDate: '',
    endDate: '',
    hasReferrals: '',
    isReferred: '',
    emailSent: '',
    unsubscribed: ''
  })
  const [period, setPeriod] = useState('30')
  const router = useRouter()

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/stats?days=${period}`, {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setDashboardData(data)
      setError('')
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [period, router])

  const fetchSignupsData = useCallback(async (page = 1, searchFilters = filters) => {
    try {
      setIsLoadingSignups(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...searchFilters
      })

      const response = await fetch(`/api/admin/signups?${params}`, {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch signups data')
      }

      const data = await response.json()
      setSignupsData(data)
    } catch (error) {
      console.error('Error fetching signups data:', error)
    } finally {
      setIsLoadingSignups(false)
    }
  }, [filters, router])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    fetchSignupsData(1, filters)
    setCurrentPage(1)
  }, [filters])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/admin/login')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchSignupsData(page, filters)
  }

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [])

  const handleSearch = () => {
    fetchSignupsData(1, filters)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AuthGuard>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
          {/* Subtle background animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, 100, -50, 0],
                  y: [0, -100, 50, 0],
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            ))}
          </div>

          {/* Header */}
          <motion.header 
            className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 relative z-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Genome AI Waitlist Management
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                    </select>
                  </div>
                  
                  <AnimatedButton
                    onClick={fetchDashboardData}
                    disabled={isLoading}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </AnimatedButton>
                  
                  <ExportButton filters={{ includeUnsubscribed: false }} />
                  
                  <AnimatedButton
                    onClick={handleLogout}
                    variant="danger"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </AnimatedButton>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatePresence>
              {error && (
                <motion.div
                  className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6 backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm text-red-700">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading States */}
            {isLoading && !dashboardData && (
              <StaggerContainer className="space-y-8">
                <motion.div variants={fadeInUp}>
                  <SkeletonStats />
                </motion.div>
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  variants={fadeInUp}
                >
                  <SkeletonChart />
                  <SkeletonChart />
                </motion.div>
              </StaggerContainer>
            )}

            {/* Dashboard Content */}
            <AnimatePresence>
              {dashboardData && (
                <StaggerContainer className="space-y-8">
                  {/* Stats Cards */}
                  <motion.div variants={fadeInUp}>
                    <StatsCards data={dashboardData} />
                  </motion.div>

                  {/* Charts Row */}
                  <motion.div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    variants={fadeInUp}
                  >
                    <FadeInWhenVisible>
                      <SignupChart 
                        data={dashboardData.signupTrend} 
                        period={dashboardData.period} 
                      />
                    </FadeInWhenVisible>
                    <FadeInWhenVisible delay={0.1}>
                      <TopReferrers 
                        data={dashboardData.topReferrers} 
                        period={dashboardData.period} 
                      />
                    </FadeInWhenVisible>
                  </motion.div>
                </StaggerContainer>
              )}
            </AnimatePresence>

            {/* User List Section */}
            <FadeInWhenVisible delay={0.2}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Waitlist Signups
                  </h2>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <SearchFilter
                    onFiltersChange={handleFiltersChange}
                    onSearch={handleSearch}
                    isLoading={isLoadingSignups}
                  />
                </motion.div>

                {/* Loading State for Table */}
                {isLoadingSignups && !signupsData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SkeletonTable rows={10} columns={5} />
                  </motion.div>
                )}

                {/* Signups Table */}
                <AnimatePresence>
                  {signupsData && (
                    <motion.div
                      className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-white/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="px-6 py-4 border-b border-gray-200/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-lg font-medium text-gray-900">
                          {signupsData.pagination.total.toLocaleString()} users
                        </h3>
                      </motion.div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referrals
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/50">
                        {signupsData.data.map((signup, index) => (
                          <motion.tr 
                            key={signup.id} 
                            className="hover:bg-gray-50/80 transition-colors duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ 
                              backgroundColor: 'rgba(59, 130, 246, 0.05)',
                              transition: { duration: 0.2 }
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{signup.position}
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{signup.email}</div>
                            {signup.referredBy && (
                              <div className="text-xs text-gray-500">
                                Referred by: {signup.referredBy.email}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {signup.referralCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(signup.joinedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                signup.unsubscribed
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {signup.unsubscribed ? 'Unsubscribed' : 'Active'}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                signup.emailSent
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {signup.emailSent ? 'Email Sent' : 'Pending'}
                              </span>
                            </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                {/* Pagination */}
                {signupsData.pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!signupsData.pagination.hasPrev}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!signupsData.pagination.hasNext}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{' '}
                          <span className="font-medium">
                            {(currentPage - 1) * 20 + 1}
                          </span>{' '}
                          to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * 20, signupsData.pagination.total)}
                          </span>{' '}
                          of{' '}
                          <span className="font-medium">
                            {signupsData.pagination.total}
                          </span>{' '}
                          results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!signupsData.pagination.hasPrev}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!signupsData.pagination.hasNext}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading indicator for additional data */}
                <AnimatePresence>
                  {isLoadingSignups && signupsData && (
                    <motion.div
                      className="text-center py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <p className="mt-2 text-gray-600">Loading signups...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInWhenVisible>
          </main>
        </div>
      </PageTransition>
    </AuthGuard>
  )
}