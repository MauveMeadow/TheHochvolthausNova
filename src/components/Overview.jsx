import { motion } from 'framer-motion'
import { Building2, MapPin, Calendar, Users } from 'lucide-react'

const stats = [
  { icon: Building2, label: 'Total Area', value: '9,730 m²' },
  { icon: Users, label: 'Capacity', value: '2,500 people' },
  { icon: Calendar, label: 'Timeline', value: '24 months' },
  { icon: MapPin, label: 'Location', value: 'Munich, Germany' }
]

function Overview() {
  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground mb-6"
          >
            Architectural Redesign 2025
          </motion.div>
          
          {/* Building Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative w-full max-w-5xl mx-auto mb-12"
          >
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <Building2 className="w-32 h-32 mx-auto mb-6 text-primary opacity-20" />
                  <p className="text-muted-foreground text-lg">
                    Building visualization placeholder
                    <br />
                    <span className="text-sm">Add your Hochvolthaus image here</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            A transformative approach to sustainable architecture that blends modern design 
            principles with environmental consciousness, creating spaces that inspire and endure.
          </motion.p>


        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="card text-center"
              >
                <Icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <div className="text-2xl font-medium">{stat.value}</div>
              </motion.div>
            )
          })}
        </motion.div>

      </motion.div>
    </div>
  )
}

export default Overview
