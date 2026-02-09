import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Leaf, Map, Building2, Globe } from 'lucide-react'

const categories = [
  { 
    id: 'building', 
    label: 'Building & Structure',
    icon: Building2,
  },
  { 
    id: 'urban', 
    label: 'Urban Geospatial',
    icon: Globe,
  }
]

const contentData = {
  building: [
    {
      id: 'model-viewer',
      name: 'Model Viewer',
      context: 'IFC data',
      icon: Box,
      color: '#8b5cf6'
    },
    {
      id: 'environmental',
      name: 'Environmental Analysis',
      context: 'Forma data',
      icon: Leaf,
      color: '#22c55e'
    }
  ],
  urban: [
    {
      id: 'arcgis',
      name: 'Analysis Zones',
      context: 'Spatial analysis',
      icon: Map,
      color: '#3b82f6'
    },
    {
      id: 'cesium',
      name: 'Volumetric Environment',
      context: 'Cesium',
      icon: Building2,
      color: '#f59e0b'
    }
  ]
}

const DashboardToggle = ({ onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState('building')
  const [selectedItem, setSelectedItem] = useState(null)

  const handleItemClick = (item) => {
    setSelectedItem(item.id)
    if (onSelectItem) {
      onSelectItem(item)
    }
  }

  return (
    <div className="w-full">
      {/* Toggle Buttons - Building Levels Style */}
      <div className="flex flex-col items-center mb-8">
        {/* Button Group */}
        <div className="inline-flex gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = activeCategory === category.id
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="flex items-center gap-4 border-none cursor-pointer"
                style={{ 
                  background: isSelected 
                    ? 'linear-gradient(135deg, var(--primary) 0%, #1a3a8a 100%)'
                    : 'var(--secondary)',
                  color: isSelected ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '1.25rem 2rem',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  outline: 'none',
                  boxShadow: isSelected 
                    ? '0 4px 20px rgba(0, 25, 96, 0.25)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: isSelected 
                    ? '0 6px 25px rgba(0, 25, 96, 0.35)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-6 h-6" />
                <span className="whitespace-nowrap">{category.label}</span>
              </motion.button>
            )
          })}
        </div>
        
        {/* Description text below toggle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-4 text-sm text-center"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {activeCategory === 'building' 
              ? 'Model Analysis (IFC) & Environmental Studies (FORMA)'
              : 'Spatial Analysis (ArcGIS) and City Database (Cesium)'
            }
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Content Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
        >
          {contentData[activeCategory].map((item, index) => {
            const Icon = item.icon
            const isSelected = selectedItem === item.id
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => handleItemClick(item)}
                className="group cursor-pointer"
              >
                <div 
                  className="relative p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: isSelected ? 'var(--primary)' : 'var(--card)',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    color: isSelected ? 'var(--primary-foreground)' : 'var(--foreground)'
                  }}
                >
                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${item.color}15`,
                    }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: isSelected ? 'white' : item.color }}
                    />
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-lg font-semibold mb-1"
                    style={{ color: isSelected ? 'white' : 'var(--foreground)' }}
                  >
                    {item.name}
                  </h3>

                  {/* Context */}
                  <p 
                    className="text-sm"
                    style={{ 
                      color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)' 
                    }}
                  >
                    {item.context}
                  </p>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    >
                      <svg 
                        className="w-4 h-4" 
                        style={{ color: 'var(--primary)' }}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Category description */}
      <motion.p
        key={`desc-${activeCategory}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-sm"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {activeCategory === 'building' 
          ? 'Explore building models and environmental simulations'
          : 'Analyze urban landscapes and geospatial data'
        }
      </motion.p>
    </div>
  )
}

export default DashboardToggle
