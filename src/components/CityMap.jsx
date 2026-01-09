import { useEffect, useRef, useState } from 'react'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import '../styles/CityMap.css'

function CityMap() {
  const cesiumContainer = useRef(null)
  const viewerRef = useRef(null)
  const [is3D, setIs3D] = useState(true)
  const [showLayers, setShowLayers] = useState(false)

  useEffect(() => {
    if (!cesiumContainer.current || viewerRef.current) return

    // Initialize Cesium Viewer without default imagery
    const viewer = new Cesium.Viewer(cesiumContainer.current, {
      baseLayerPicker: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      shadows: false,
      shouldAnimate: true,
      sceneMode: Cesium.SceneMode.SCENE3D,
      // Use false to disable default imagery, we'll add our own
      imageryProvider: false
    })

    viewerRef.current = viewer

    // Add OpenStreetMap tiles as imagery layer
    const osmImagery = new Cesium.UrlTemplateImageryProvider({
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      maximumLevel: 19,
      credit: 'OpenStreetMap contributors'
    })
    viewer.imageryLayers.addImageryProvider(osmImagery)
    
    // Remove sky/atmosphere for a cleaner look
    viewer.scene.skyBox = undefined
    viewer.scene.sun = undefined
    viewer.scene.moon = undefined
    viewer.scene.skyAtmosphere = undefined
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#e8ecf2')
    
    // Make globe visible with proper settings
    viewer.scene.globe.depthTestAgainstTerrain = false
    viewer.scene.globe.showGroundAtmosphere = false
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#e8ecf2')

    // Set camera directly to Munich Hochvolthaus location
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(11.569124, 48.150773, 800),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0
      }
    })

    // Cleanup on unmount
    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [])

  // Toggle between 2D and 3D view
  const toggle2D3D = () => {
    if (!viewerRef.current) return
    
    if (is3D) {
      viewerRef.current.scene.morphTo2D(1)
    } else {
      viewerRef.current.scene.morphTo3D(1)
    }
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

  // Reset camera to Hochvolthaus
  const resetCamera = () => {
    if (!viewerRef.current) return
    
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(11.569124, 48.150773, 800),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0
      },
      duration: 1.5
    })
    console.log('Camera reset to Hochvolthaus')
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

      {/* Cesium Container */}
      <div 
        ref={cesiumContainer} 
        className="cesium-container"
      />

      {/* Attribution */}
      <div className="map-attribution">
        Powered by CesiumJS • © OpenStreetMap contributors
      </div>
    </div>
  )
}

export default CityMap
