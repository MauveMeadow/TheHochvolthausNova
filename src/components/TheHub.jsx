import { motion } from 'framer-motion'
import { Building2, Home, Layers } from 'lucide-react'

const floors = [
  { id: 7, name: 'Roof', level: 'Level 7', description: 'Rooftop terrace and utilities', color: '#6366f1' },
  { id: 6, name: 'Third Floor', level: 'Level 6', description: 'Executive offices', color: '#8b5cf6' },
  { id: 5, name: 'Second Floor', level: 'Level 5', description: 'Private workspaces', color: '#3b82f6' },
  { id: 4, name: 'First Floor', level: 'Level 4', description: 'Main offices', color: '#14b8a6' },
  { id: 3, name: 'Mezzanine', level: 'Level 3', description: 'Gallery and workspace', color: '#eab308' },
  { id: 2, name: 'Ground Floor', level: 'Level 2', description: 'Main entrance and lobby', color: '#22c55e' },
  { id: 1, name: 'Basement', level: 'Level 1', description: 'Storage and parking', color: '#ef4444' }
]

function TheHub() {
  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
            Interactive Hub
          </p>
          <h1 className="mb-6">The Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore each floor of the Hochvolthaus. Navigate through the building's 
            seven levels to discover the spatial organization and functional areas.
          </p>
        </div>

        {/* Floor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {floors.map((floor, index) => (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="card cursor-pointer group hover:shadow-2xl"
              style={{ borderLeft: `4px solid ${floor.color}` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: floor.color }}
                >
                  <span className="text-2xl font-bold">{floor.id}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{floor.level}</div>
                  <h3 className="text-xl font-medium">{floor.name}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{floor.description}</p>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: `${floor.color}20` }}
                >
                  <svg className="w-4 h-4" style={{ color: floor.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <span 
                  className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: floor.color }}
                >
                  View floor plan
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Building Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-secondary rounded-2xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-3 gap-6 lg:gap-12 text-center">
            <div>
              <p className="text-4xl font-medium text-primary mb-2">7</p>
              <p className="text-sm text-muted-foreground">Levels</p>
            </div>
            <div className="border-l border-r border-black/5">
              <p className="text-4xl font-medium text-primary mb-2">~32m</p>
              <p className="text-sm text-muted-foreground">Height</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-primary mb-2">9,730m²</p>
              <p className="text-sm text-muted-foreground">Total Area</p>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            <strong>Note:</strong> Interactive floor plans with room details, event management, 
            and geospatial data visualization are available in the full application.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TheHub
