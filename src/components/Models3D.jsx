import { motion } from 'framer-motion'
import { useState } from 'react'
import { Database, Map, Box, FileCode, Cloud } from 'lucide-react'
import IFCViewer from './IFCViewer'
import FormaViewer from './FormaViewer'
import CityMap from './CityMap'

const modelTypes = [
  {
    id: '3dcitydb',
    name: '3D City Database',
    description: 'Geospatial data visualization with CityGML standards',
    icon: Database,
    color: '#3b82f6'
  },
  {
    id: 'pointcloud',
    name: 'Point Cloud',
    description: 'LiDAR and photogrammetry point cloud exploration',
    icon: Cloud,
    color: '#0ea5e9'
  },
  {
    id: 'arcgis',
    name: 'ArcGIS Analysis',
    description: 'Interactive mapping and spatial analysis tools',
    icon: Map,
    color: '#22c55e'
  },
  {
    id: 'forma',
    name: 'FORMA Model',
    description: 'Building form and massing studies',
    icon: Box,
    color: '#f59e0b'
  },
  {
    id: 'ifc',
    name: 'IFC.js Viewer',
    description: 'Building Information Modeling with material analysis',
    icon: FileCode,
    color: '#8b5cf6'
  }
]

function Models3D() {
  const [activeModel, setActiveModel] = useState('3dcitydb')

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-4">
            Interactive Experience
          </p>
          <h1 className="mb-6">3D Models</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the Hochvolthaus through multiple 3D visualization platforms, 
            each offering unique insights into the building's design and data.
          </p>
        </div>

        {/* Model Type Tabs */}
        <div className="model-viewer-tabs">
          {modelTypes.map((model, index) => {
            const Icon = model.icon
            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setActiveModel(model.id)}
                className={`model-tab ${activeModel === model.id ? 'active' : ''}`}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: model.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4>{model.name}</h4>
                <p>{model.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Model Viewer Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="model-viewer-container"
        >
          {activeModel === 'ifc' ? (
            <IFCViewer />
          ) : activeModel === '3dcitydb' ? (
            <CityMap />
          ) : activeModel === 'forma' ? (
            <FormaViewer />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto mb-6"
                  style={{ backgroundColor: modelTypes.find(m => m.id === activeModel)?.color }}
                >
                  {(() => {
                    const Icon = modelTypes.find(m => m.id === activeModel)?.icon
                    return Icon ? <Icon className="w-12 h-12" /> : null
                  })()}
                </div>
                <h3 className="text-2xl mb-3">
                  {modelTypes.find(m => m.id === activeModel)?.name}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {modelTypes.find(m => m.id === activeModel)?.description}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm">
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                  <span>Model viewer will be integrated here</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="card">
            <h3 className="mb-3">3DCityDB Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• CityGML data integration</li>
              <li>• Geospatial visualization</li>
              <li>• Urban context analysis</li>
              <li>• Multi-level detail (LOD) support</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="mb-3">IFC.js Capabilities</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Building Information Modeling</li>
              <li>• Material property analysis</li>
              <li>• Structural element inspection</li>
              <li>• Quantity take-offs</li>
            </ul>
          </div>
        </motion.div>

        {/* Technical Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 p-6 bg-secondary rounded-xl text-center"
        >
          <p className="text-sm text-muted-foreground">
            <strong>Technical Integration:</strong> The full implementation includes IFC.js for BIM visualization, 
            3DCityDB for geospatial data, ArcGIS for mapping analysis, and FORMA for design exploration.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Models3D
