'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'

interface SignupTrendData {
  date: string
  signups: number
}

interface SignupChartProps {
  data: SignupTrendData[]
  period: string
}

export default function SignupChart({ data, period }: SignupChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="text-sm font-medium text-gray-900">
            {formatDate(label || '')}
          </p>
          <p className="text-sm text-blue-600">
            Signups: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="mb-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Signup Trend
        </h3>
        <p className="text-sm text-gray-600">{period}</p>
      </motion.div>
      
      <motion.div 
        className="h-80"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0"
              strokeOpacity={0.5}
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tick={{ fill: '#64748b' }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: '#3b82f6', 
                strokeWidth: 1,
                strokeDasharray: '4 4'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="signups" 
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={{ 
                fill: '#3b82f6', 
                strokeWidth: 2, 
                r: 4,
                filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#1d4ed8',
                stroke: '#ffffff',
                strokeWidth: 3,
                filter: 'drop-shadow(0 4px 8px rgba(29, 78, 216, 0.4))'
              }}
              animationBegin={300}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}