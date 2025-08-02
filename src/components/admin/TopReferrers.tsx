'use client'

import { Trophy, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/animations'

interface ReferrerData {
  email: string
  referralCount: number
}

interface TopReferrersProps {
  data: ReferrerData[]
  period: string
}

export default function TopReferrers({ data, period }: TopReferrersProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Top Referrers
          </h3>
          <p className="text-sm text-gray-600">{period}</p>
        </div>
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-500">No referrals yet</p>
        </motion.div>
      </motion.div>
    )
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
          Top Referrers
        </h3>
        <p className="text-sm text-gray-600">{period}</p>
      </motion.div>
      
      <motion.div 
        className="space-y-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence>
          {data.map((referrer, index) => (
            <motion.div 
              key={referrer.email} 
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-blue-50/50 hover:from-blue-50/80 hover:to-indigo-50/50 transition-all duration-300 border border-gray-100/50"
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg' :
                    'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md'
                  }`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: index < 3 ? [0, -10, 10, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {index < 3 ? (
                    <Trophy className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </motion.div>
                <div>
                  <motion.p 
                    className="text-sm font-medium text-gray-900 truncate max-w-48"
                    whileHover={{ color: '#3b82f6' }}
                  >
                    {referrer.email}
                  </motion.p>
                  <p className="text-xs text-gray-500">
                    Rank #{index + 1}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <motion.p 
                  className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {referrer.referralCount}
                </motion.p>
                <p className="text-xs text-gray-500">
                  referrals
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {data.length === 10 && (
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xs text-gray-500">Showing top 10 referrers</p>
        </motion.div>
      )}
    </motion.div>
  )
}