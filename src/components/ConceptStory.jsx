import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Building2, Landmark, Leaf, ChevronRight, Play, Layers, Calendar } from 'lucide-react'
import ArchitectureCarousel from './ArchitectureCarousel'

const conceptData = [
  {
    id: 'legacy',
    title: 'Legacy & Evolution',
    icon: Clock,
    text: 'Tracing the history from 1957 to present. Preserving the Second Munich School heritage.',
    description: 'The Hochvolthaus stands as a testament to post-war German engineering architecture, embodying the material-driven aesthetic that defined an era of reconstruction and innovation.',
    visualType: 'timeline',
    color: '#001960'
  },
  {
    id: 'architecture',
    title: 'Architectural Intervention',
    icon: Building2,
    text: 'Adaptive reuse strategy combining heritage preservation with modern needs.',
    description: 'Our approach carefully balances the preservation of historically significant elements while introducing contemporary spatial solutions for academic collaboration.',
    visualType: 'carousel',
    color: '#3b82f6'
  },
  {
    id: 'urban',
    title: 'Urban Integration',
    icon: Landmark,
    text: 'Landscape strategy connecting the building to the TUM campus.',
    description: 'The redesign creates seamless transitions between interior and exterior spaces, establishing visual and physical connections to the broader campus environment.',
    visualType: 'video',
    color: '#22c55e'
  },
  {
    id: 'sustainability',
    title: 'Sustainable Performance',
    icon: Leaf,
    text: 'Optimizing thermal insulation and facade design for profitability and efficiency.',
    description: 'Advanced building systems and facade interventions achieve significant energy performance improvements while respecting the original architectural character.',
    visualType: 'diagram',
    color: '#f59e0b'
  }
]

const timelineData = [
  { year: '1957', event: 'Construction begins under Werner Eichberg' },
  { year: '1963', event: 'Building completion and inauguration' },
  { year: '1985', event: 'Heritage designation achieved' },
  { year: '2020', event: 'Adaptive reuse assessment initiated' },
  { year: '2025', event: 'ITBE Fusion Lab redesign proposal' }
]

// Timeline Component
const TimelineVisual = () => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
      
      <div className="space-y-8">
        {timelineData.map((item, index) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="flex items-center gap-6 relative"
          >
            {/* Year bubble */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Calendar className="w-5 h-5" />
            </div>
            
            {/* Content */}
            <div className="flex-1 bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-lg font-bold text-primary mb-1">{item.year}</div>
              <div className="text-sm text-muted-foreground">{item.event}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
)

// Floor Plan Placeholder
const FloorPlanVisual = () => (
  <div className="h-full flex items-center justify-center p-8">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md aspect-square"
    >
      {/* Floor plan representation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100 overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Room representations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-8 left-8 right-8 h-24 bg-primary/10 rounded-lg border-2 border-primary/30 flex items-center justify-center"
        >
          <span className="text-sm font-medium text-primary">Collaboration Space</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-40 left-8 w-32 h-32 bg-blue-500/10 rounded-lg border-2 border-blue-500/30 flex items-center justify-center"
        >
          <span className="text-xs font-medium text-blue-600 text-center">Lab<br/>Area</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute top-40 right-8 w-32 h-32 bg-green-500/10 rounded-lg border-2 border-green-500/30 flex items-center justify-center"
        >
          <span className="text-xs font-medium text-green-600 text-center">Meeting<br/>Rooms</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute bottom-8 left-8 right-8 h-16 bg-amber-500/10 rounded-lg border-2 border-amber-500/30 flex items-center justify-center"
        >
          <span className="text-sm font-medium text-amber-600">Central Corridor</span>
        </motion.div>
      </div>
      
      {/* Label */}
      <div className="absolute -bottom-12 left-0 right-0 text-center">
        <span className="text-sm text-muted-foreground">Interactive 3D Floor Plan</span>
      </div>
    </motion.div>
  </div>
)

// Video Placeholder
const VideoVisual = () => (
  <div className="h-full flex items-center justify-center p-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-lg aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Video thumbnail gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      
      {/* Play button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white hover:scale-110 transition-all shadow-lg">
          <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
        </div>
      </motion.div>
      
      {/* Video info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="text-white font-semibold mb-1">Campus Walkthrough</div>
        <div className="text-white/70 text-sm">Experience the urban integration firsthand</div>
      </div>
      
      {/* Duration badge */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-xs">
        3:42
      </div>
    </motion.div>
  </div>
)

// Facade Diagram
const FacadeDiagramVisual = () => (
  <div className="h-full flex items-center justify-center p-8">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-sm"
    >
      {/* Facade layers */}
      <div className="space-y-3">
        {[
          { name: 'Exterior Cladding', color: '#64748b', thickness: '30mm' },
          { name: 'Air Gap', color: '#94a3b8', thickness: '50mm' },
          { name: 'Thermal Insulation', color: '#fbbf24', thickness: '120mm' },
          { name: 'Vapor Barrier', color: '#3b82f6', thickness: '5mm' },
          { name: 'Structural Wall', color: '#1e293b', thickness: '200mm' },
          { name: 'Interior Finish', color: '#f1f5f9', thickness: '15mm' }
        ].map((layer, index) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <div 
              className="w-16 h-10 rounded-lg shadow-md flex items-center justify-center"
              style={{ backgroundColor: layer.color }}
            >
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{layer.name}</div>
              <div className="text-xs text-muted-foreground">{layer.thickness}</div>
            </div>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(parseInt(layer.thickness) / 200) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: layer.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Performance metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200"
      >
        <div className="text-sm font-semibold text-green-800 mb-2">Performance Improvement</div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">65%</div>
            <div className="text-xs text-green-700">Energy Reduction</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">U=0.18</div>
            <div className="text-xs text-green-700">W/m²K</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
)

const ConceptStory = () => {
  const [activeSection, setActiveSection] = useState('legacy')
  
  const activeData = conceptData.find(item => item.id === activeSection)

  const renderVisual = () => {
    switch (activeData?.visualType) {
      case 'timeline':
        return <TimelineVisual />
      case 'carousel':
        return <ArchitectureCarousel />
      case 'video':
        return <VideoVisual />
      case 'diagram':
        return <FacadeDiagramVisual />
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm uppercase tracking-wide text-muted-foreground mb-4"
        >
          Explore
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          The Concept
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Understanding the historical significance, architectural innovation, and urban integration of the Hochvolthaus redesign project.
        </motion.p>
      </div>

      {/* Tabs - Matching 3D Models Toggle Style */}
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {conceptData.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="flex items-center gap-4 border-none cursor-pointer"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, var(--primary) 0%, #1a3a8a 100%)'
                    : 'var(--secondary)',
                  color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  borderRadius: '1rem',
                  padding: '1rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: isActive 
                    ? '0 4px 20px rgba(0, 25, 96, 0.25)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: isActive 
                    ? '0 6px 25px rgba(0, 25, 96, 0.35)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="whitespace-nowrap">
                  {item.id === 'legacy' ? 'History' : 
                   item.id === 'architecture' ? 'Architecture' :
                   item.id === 'urban' ? 'Urban Design' : 'Sustainability'}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Content Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Content Details */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activeData?.color }}
                >
                  {activeData && <activeData.icon className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{activeData?.title}</h3>
                  <p className="text-muted-foreground text-sm">Section {conceptData.findIndex(i => i.id === activeSection) + 1} of 4</p>
                </div>
              </div>
              
              <p className="text-lg text-foreground mb-4">{activeData?.text}</p>
              <p className="text-muted-foreground leading-relaxed">{activeData?.description}</p>
              
              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-100">
                {conceptData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="group relative"
                  >
                    <div 
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeSection === item.id 
                          ? 'scale-125' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: activeSection === item.id ? item.color : undefined 
                      }}
                    />
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  Click to navigate
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - Visual Display */}
        <div className="lg:sticky lg:top-24 h-fit">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-secondary to-white rounded-3xl overflow-hidden shadow-lg border border-gray-100"
            style={{ minHeight: '500px' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                {renderVisual()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          {/* Visual Label */}
          <motion.div
            key={`label-${activeSection}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <span 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: activeData?.color }}
            >
              {activeData && <activeData.icon className="w-4 h-4" />}
              {activeData?.title}
            </span>
          </motion.div>
        </div>
      </div>


    </div>
  )
}

export default ConceptStory
