import { motion } from 'framer-motion'
import { useState } from 'react'
import { Database, Map, Box, FileCode, Cloud } from 'lucide-react'
import IFCViewer from './IFCViewer'
import FormaViewer from './FormaViewer'
import CityMap from './CityMap'
import DashboardToggle from './DashboardToggle'

function Models3D() {
  const [activeModel, setActiveModel] = useState(null)

  const handleSelectItem = (item) => {
    // Map the dashboard item ids to the viewer types
    const viewerMap = {
      'model-viewer': 'ifc',
      'environmental': 'forma',
      'arcgis': 'arcgis',
      'cesium': '3dcitydb'
    }
    setActiveModel(viewerMap[item.id] || item.id)
  }

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
          <h1 className="mb-6">Model Explorer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the Hochvolthaus through multiple 3D visualization platforms, 
            each offering unique insights into the building's design and data.
          </p>
        </div>

        {/* Dashboard Toggle */}
        <DashboardToggle onSelectItem={handleSelectItem} />

        {/* Model Viewer Container - Only show when an item is selected */}
        {activeModel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="model-viewer-container mt-8"
          >
            {activeModel === 'ifc' ? (
              <IFCViewer />
            ) : activeModel === '3dcitydb' ? (
              <CityMap />
            ) : activeModel === 'forma' ? (
              <FormaViewer />
            ) : activeModel === 'arcgis' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white mx-auto mb-6"
                    style={{ backgroundColor: '#3b82f6' }}
                  >
                    <Map className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl mb-3">ArcGIS Analysis</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Interactive mapping and spatial analysis tools
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm">
                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                    <span>ArcGIS viewer will be integrated here</span>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}

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
