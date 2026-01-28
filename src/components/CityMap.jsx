import { useState } from 'react'
import '../styles/CityMap.css'

function CityMap() {
  const [is3D, setIs3D] = useState(true)
  const [showLayers, setShowLayers] = useState(false)

  // Toggle between 2D and 3D view (placeholder)
  const toggle2D3D = () => {
    setIs3D(!is3D)
    console.log(`Switched to ${is3D ? '2D' : '3D'} view`)
  }

  // Toggle layers panel
  const toggleLayers = () => {
    setShowLayers(!showLayers)
    console.log('Layers panel toggled')
  }

  // Measurement tool placeholder
  const handleMeasurement = () => {
    console.log('Measurement tool clicked - functionality to be implemented')
    alert('Measurement tool will be implemented soon!')
  }

  // Reset camera placeholder
  const resetCamera = () => {
    console.log('Camera reset to Hochvolthaus')
    alert('3D Map viewer will be implemented soon!')
  }

  return (
    <div className="city-map-wrapper">
      {/* Custom Toolbar Overlay */}
      <div className="city-map-toolbar">
        <div className="toolbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <span>3D City Map</span>
        </div>
        
        <div className="toolbar-buttons">
          <button 
            className={`toolbar-btn ${!is3D ? 'active' : ''}`}
            onClick={toggle2D3D}
            title={is3D ? 'Switch to 2D' : 'Switch to 3D'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {is3D ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </>
              ) : (
                <>
                  <path d="M12 3L2 9l10 6 10-6-10-6z" />
                  <path d="M2 17l10 6 10-6" />
                  <path d="M2 12l10 6 10-6" />
                </>
              )}
            </svg>
            <span>{is3D ? '2D' : '3D'}</span>
          </button>
          
          <button 
            className={`toolbar-btn ${showLayers ? 'active' : ''}`}
            onClick={toggleLayers}
            title="Toggle Layers"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>Layers</span>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={handleMeasurement}
            title="Measure Distance"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h20" />
              <path d="M6 8v8" />
              <path d="M18 8v8" />
              <path d="M12 6v4" />
              <path d="M12 14v4" />
            </svg>
            <span>Measure</span>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={resetCamera}
            title="Reset View"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Layers Panel (togglable) */}
      {showLayers && (
        <div className="layers-panel">
          <h4>Map Layers</h4>
          <label className="layer-item">
            <input type="checkbox" defaultChecked />
            <span>3D Buildings</span>
          </label>
          <label className="layer-item">
            <input type="checkbox" defaultChecked />
            <span>Terrain</span>
          </label>
          <label className="layer-item">
            <input type="checkbox" defaultChecked />
            <span>Satellite Imagery</span>
          </label>
          <label className="layer-item">
            <input type="checkbox" />
            <span>Street Labels</span>
          </label>
        </div>
      )}

      {/* Placeholder for 3D Map */}
      <div className="map-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🗺️</div>
          <h3>3D City Map</h3>
          <p>Interactive geospatial visualization coming soon!</p>
          <div className="placeholder-features">
            <span>• 3D Building Models</span>
            <span>• Satellite Imagery</span>
            <span>• Terrain Analysis</span>
            <span>• Urban Planning Tools</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="map-attribution">
        Interactive Map • Coming Soon
      </div>
    </div>
  )
}

export default CityMap
