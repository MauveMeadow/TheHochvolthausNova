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
          
          <h1 className="mb-12">
            The Hochvolthaus Nova
          </h1>
          
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

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <button className="btn btn-primary">
              Explore the Design
            </button>
            <button className="btn btn-secondary">
              View Timeline
            </button>
          </motion.div>
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

        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="mb-6 text-center">A Vision for Sustainable Development</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="mb-4 text-primary">The Challenge</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Hochvolthaus, originally constructed between 1957 and 1963 as a high-voltage research 
                facility, stands as a landmark of post-war technical architecture. Today, it presents a unique 
                opportunity to demonstrate how historic engineering buildings can be repurposed into dynamic 
                educational environments.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-primary">Our Approach</h3>
              <p className="text-muted-foreground leading-relaxed">
                This redesign project represents a fundamental shift in how we approach urban architecture. 
                By integrating cutting-edge sustainable technologies with timeless design principles, we're 
                creating a space that serves both present needs and future generations while preserving the 
                building's architectural legacy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 bg-primary text-white rounded-3xl p-12"
        >
          <h2 className="mb-8 text-center">Project Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-white/80">Floor Levels</div>
            </div>
            <div className="text-center border-l border-r border-white/20">
              <div className="text-4xl font-bold mb-2">22m</div>
              <div className="text-white/80">Building Height</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1957</div>
              <div className="text-white/80">Original Construction</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Overview
