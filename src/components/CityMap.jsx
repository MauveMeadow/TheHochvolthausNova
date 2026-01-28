import { useState, useEffect, useRef, useCallback } from 'react'
import '../styles/CityMap.css'

// Cesium Ion Configuration
const CESIUM_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTQyMjc5My0wNWMxLTQwYjItYTQ2Ny1hN2NmMWQzZTU1ODgiLCJpZCI6Mzc5Njc4LCJpYXQiOjE3Njg1NjY1ODJ9.uNoYxXVWAb2rKHk2u5Etox_rRfq7IUnCFsAK_424OiQ'
const MODEL_ASSET_ID_1 = 4392344
const MODEL_ASSET_ID_2 = 4392629
const OSM_BUILDINGS_ASSET_ID = 96188

function CityMap() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Loading Cesium...')
  const [error, setError] = useState(null)
  const [model1Visible, setModel1Visible] = useState(true)
  const [model2Visible, setModel2Visible] = useState(true)
  const [osmBuildingsVisible, setOsmBuildingsVisible] = useState(false)
  const [showControlPanel, setShowControlPanel] = useState(true)
  const [hiddenCount, setHiddenCount] = useState(0)
  const [selectedElementInfo, setSelectedElementInfo] = useState(null)
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState({ date: '', timeCET: '', timeUTC: '' })
  const [statusMessage, setStatusMessage] = useState(null)

  const cesiumContainerRef = useRef(null)
  const viewerRef = useRef(null)
  const modelPrimitive1Ref = useRef(null)
  const modelPrimitive2Ref = useRef(null)
  const osmBuildingsPrimitiveRef = useRef(null)
  const currentTimeRef = useRef(null)
  const hiddenElementsRef = useRef(new Map())
  const selectedEntityRef = useRef(null)
  const cesiumLoadedRef = useRef(false)

  // Show status message
  const showStatus = useCallback((message) => {
    setStatusMessage(message)
    setTimeout(() => setStatusMessage(null), 3000)
  }, [])

  // Get CET/CEST offset
  const getCETOffset = useCallback((date) => {
    const year = date.getFullYear()
    const getLastSunday = (y, month) => {
      const d = new Date(y, month + 1, 0)
      while (d.getDay() !== 0) d.setDate(d.getDate() - 1)
      return d
    }
    const lastSundayMarch = getLastSunday(year, 2)
    const lastSundayOctober = getLastSunday(year, 9)
    return (date >= lastSundayMarch && date < lastSundayOctober) ? -120 : -60
  }, [])

  // Update time display
  const updateTimeDisplay = useCallback(() => {
    if (!currentTimeRef.current || !window.Cesium) return
    
    const dateUtc = window.Cesium.JulianDate.toDate(currentTimeRef.current)
    const cetOffset = getCETOffset(dateUtc)
    const cetDate = new Date(dateUtc.getTime() + cetOffset * 60000)
    
    setCurrentTimeDisplay({
      date: cetDate.toLocaleDateString('en-CA'),
      timeCET: cetDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' CET',
      timeUTC: dateUtc.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' UTC'
    })
  }, [getCETOffset])

  // Calculate sun position
  const calculateSunPosition = useCallback((date) => {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
    const hourOfDay = date.getHours() + date.getMinutes() / 60
    const declination = 23.44 * Math.sin((dayOfYear - 81) * Math.PI / 182.6) * Math.PI / 180
    const hourAngle = (hourOfDay - 12) * 15 * Math.PI / 180
    const x = Math.cos(declination) * Math.sin(hourAngle)
    const y = Math.sin(declination)
    const z = Math.cos(declination) * Math.cos(hourAngle)
    return new window.Cesium.Cartesian3(x, y, z)
  }, [])

  // Update shadow direction
  const updateShadowDirection = useCallback(() => {
    if (!currentTimeRef.current || !viewerRef.current || !window.Cesium) return
    const date = window.Cesium.JulianDate.toDate(currentTimeRef.current)
    const sunPosition = calculateSunPosition(date)
    if (viewerRef.current.scene.lightSource) {
      viewerRef.current.scene.lightSource.direction = sunPosition
    }
  }, [calculateSunPosition])

  // Load Cesium script
  useEffect(() => {
    if (cesiumLoadedRef.current) return

    const loadCesium = async () => {
      // Check if Cesium is already loaded
      if (window.Cesium) {
        cesiumLoadedRef.current = true
        return
      }

      // Load Cesium CSS
      if (!document.querySelector('link[href*="cesium"]')) {
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Widgets/widgets.css'
        document.head.appendChild(cssLink)
      }

      // Load Cesium JS
      if (!document.querySelector('script[src*="cesium"]')) {
        const script = document.createElement('script')
        script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.104/Cesium.js'
        script.async = true
        
        script.onload = () => {
          cesiumLoadedRef.current = true
        }
        
        script.onerror = () => {
          setError('Failed to load Cesium library')
          setIsLoading(false)
        }
        
        document.head.appendChild(script)
      }
    }

    loadCesium()
  }, [])

  // Initialize Cesium viewer
  useEffect(() => {
    if (!cesiumContainerRef.current) return

    let initAttempts = 0
    const maxAttempts = 50

    const initViewer = async () => {
      if (!window.Cesium) {
        initAttempts++
        if (initAttempts < maxAttempts) {
          setTimeout(initViewer, 200)
        } else {
          setError('Cesium library failed to load')
          setIsLoading(false)
        }
        return
      }

      try {
        setLoadingMessage('Initializing viewer...')
        
        // Set Cesium Ion token
        window.Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN

        // Create viewer
        const viewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
          terrain: window.Cesium.Terrain.fromWorldTerrain({
            requestWaterMask: true,
            requestVertexNormals: true
          }),
          shadows: true,
          shouldAnimate: true,
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false
        })

        // Configure shadows
        viewer.scene.shadowMap.enabled = true
        viewer.scene.shadowMap.softShadows = true
        viewer.scene.shadowMap.darkness = 0.5
        viewer.scene.globe.enableLighting = true
        viewer.scene.lightSource = new window.Cesium.DirectionalLight({
          direction: new window.Cesium.Cartesian3(0.1, 0.2, 1)
        })

        viewerRef.current = viewer
        currentTimeRef.current = window.Cesium.JulianDate.now()

        setLoadingMessage('Loading 3D models...')

        // Load models
        try {
          const [tileset1, tileset2] = await Promise.all([
            window.Cesium.Cesium3DTileset.fromIonAssetId(MODEL_ASSET_ID_1, { maximumScreenSpaceError: 16 }),
            window.Cesium.Cesium3DTileset.fromIonAssetId(MODEL_ASSET_ID_2, { maximumScreenSpaceError: 16 })
          ])

          modelPrimitive1Ref.current = viewer.scene.primitives.add(tileset1)
          modelPrimitive2Ref.current = viewer.scene.primitives.add(tileset2)

          await new Promise(resolve => setTimeout(resolve, 500))
          await viewer.zoomTo(modelPrimitive1Ref.current, new window.Cesium.HeadingPitchRange(0, -Math.PI / 6, 0))
          
          showStatus('Models loaded successfully!')
        } catch (modelError) {
          console.error('Model loading error:', modelError)
          showStatus('Models loaded (some features may be limited)')
        }

        // Setup click handler
        const canvas = viewer.canvas
        canvas.addEventListener('click', (e) => {
          const rect = canvas.getBoundingClientRect()
          const pickedObject = viewer.scene.pick(new window.Cesium.Cartesian2(e.clientX - rect.left, e.clientY - rect.top))

          if (window.Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id
            selectedEntityRef.current = entity
            
            const props = {}
            if (entity.properties) {
              for (let key in entity.properties) {
                if (entity.properties.hasOwnProperty(key)) {
                  const value = entity.properties[key]
                  props[key] = window.Cesium.defined(value) ? value.getValue(window.Cesium.JulianDate.now()) : 'N/A'
                }
              }
            }
            const directProps = ['id', 'name', 'description', 'categoryName', 'Family', 'Type', 'Level']
            directProps.forEach(prop => {
              if (entity[prop] !== undefined && !props[prop]) props[prop] = entity[prop]
            })
            
            setSelectedElementInfo(props)
          } else {
            selectedEntityRef.current = null
            setSelectedElementInfo(null)
          }
        })

        setIsLoading(false)
        updateTimeDisplay()
        updateShadowDirection()

      } catch (err) {
        console.error('Viewer initialization error:', err)
        setError('Failed to initialize 3D viewer: ' + err.message)
        setIsLoading(false)
      }
    }

    initViewer()

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [showStatus, updateTimeDisplay, updateShadowDirection])

  // Time display update interval
  useEffect(() => {
    const interval = setInterval(updateTimeDisplay, 1000)
    return () => clearInterval(interval)
  }, [updateTimeDisplay])

  // Toggle model 1 visibility
  const toggleModel1 = useCallback(() => {
    if (!modelPrimitive1Ref.current) {
      showStatus('Asset 1 not loaded')
      return
    }
    const newVisible = !model1Visible
    modelPrimitive1Ref.current.show = newVisible
    setModel1Visible(newVisible)
    showStatus(`Asset 1 ${newVisible ? 'enabled' : 'disabled'}`)
  }, [model1Visible, showStatus])

  // Toggle model 2 visibility
  const toggleModel2 = useCallback(() => {
    if (!modelPrimitive2Ref.current) {
      showStatus('Asset 2 not loaded')
      return
    }
    const newVisible = !model2Visible
    modelPrimitive2Ref.current.show = newVisible
    setModel2Visible(newVisible)
    showStatus(`Asset 2 ${newVisible ? 'enabled' : 'disabled'}`)
  }, [model2Visible, showStatus])

  // Toggle OSM buildings
  const toggleOSMBuildings = useCallback(async () => {
    if (!viewerRef.current || !window.Cesium) return

    try {
      if (osmBuildingsVisible) {
        if (osmBuildingsPrimitiveRef.current) {
          viewerRef.current.scene.primitives.remove(osmBuildingsPrimitiveRef.current)
          osmBuildingsPrimitiveRef.current = null
        }
        setOsmBuildingsVisible(false)
        showStatus('OSM Buildings disabled')
      } else {
        const buildingsTileset = await window.Cesium.Cesium3DTileset.fromIonAssetId(OSM_BUILDINGS_ASSET_ID, {
          maximumScreenSpaceError: 8
        })
        osmBuildingsPrimitiveRef.current = viewerRef.current.scene.primitives.add(buildingsTileset)
        setOsmBuildingsVisible(true)
        showStatus('OSM Buildings enabled')
      }
    } catch (err) {
      console.error('Error toggling OSM Buildings:', err)
      showStatus('Error loading OSM Buildings')
    }
  }, [osmBuildingsVisible, showStatus])

  // Set date/time
  const setDateTime = useCallback(() => {
    const dateInput = prompt('Enter date (YYYY-MM-DD):', new Date().toISOString().split('T')[0])
    if (!dateInput) return
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      showStatus('Invalid date format. Use YYYY-MM-DD')
      return
    }

    const timeInput = prompt('Enter time in CET (HH:MM):', '12:00')
    if (!timeInput) return
    
    if (!/^\d{2}:\d{2}$/.test(timeInput)) {
      showStatus('Invalid time format. Use HH:MM')
      return
    }

    try {
      const [year, month, day] = dateInput.split('-').map(Number)
      const [hours, minutes] = timeInput.split(':').map(Number)
      const date = new Date(year, month - 1, day, hours, minutes, 0)
      const cetOffset = getCETOffset(date)
      const utcDate = new Date(date.getTime() - cetOffset * 60000)
      
      currentTimeRef.current = window.Cesium.JulianDate.fromDate(utcDate)
      viewerRef.current.clock.currentTime = currentTimeRef.current
      
      updateShadowDirection()
      updateTimeDisplay()
      showStatus(`Time set to: ${dateInput} ${timeInput} CET`)
    } catch (err) {
      showStatus('Error setting date/time')
    }
  }, [getCETOffset, showStatus, updateShadowDirection, updateTimeDisplay])

  // Quick time selection
  const handleQuickTime = useCallback((value) => {
    if (!viewerRef.current || !window.Cesium) return

    if (value === 'current') {
      currentTimeRef.current = window.Cesium.JulianDate.now()
    } else {
      const cesiumDate = window.Cesium.JulianDate.toDate(currentTimeRef.current)
      const [hours, minutes] = value.split(':').map(Number)
      const date = new Date(cesiumDate.getFullYear(), cesiumDate.getMonth(), cesiumDate.getDate(), hours, minutes, 0)
      const cetOffset = getCETOffset(date)
      const utcDate = new Date(date.getTime() - cetOffset * 60000)
      currentTimeRef.current = window.Cesium.JulianDate.fromDate(utcDate)
    }

    viewerRef.current.clock.currentTime = currentTimeRef.current
    updateShadowDirection()
    updateTimeDisplay()
    showStatus(`Time set to ${value === 'current' ? 'current time' : value + ' CET'}`)
  }, [getCETOffset, showStatus, updateShadowDirection, updateTimeDisplay])

  // Reset camera
  const resetCamera = useCallback(() => {
    if (!viewerRef.current || !modelPrimitive1Ref.current) return
    viewerRef.current.zoomTo(modelPrimitive1Ref.current, new window.Cesium.HeadingPitchRange(0, -Math.PI / 6, 0))
    showStatus('Camera reset')
  }, [showStatus])

  // Hide selected element
  const hideSelectedElement = useCallback(() => {
    if (!selectedEntityRef.current) {
      showStatus('No element selected. Click on an element first.')
      return
    }

    const entity = selectedEntityRef.current
    if (!hiddenElementsRef.current.has(entity)) {
      hiddenElementsRef.current.set(entity, {
        originalColor: entity.color,
        originalShow: entity.show
      })
    }
    entity.show = false
    setHiddenCount(hiddenElementsRef.current.size)
    showStatus(`Element hidden (${hiddenElementsRef.current.size} hidden)`)
    selectedEntityRef.current = null
    setSelectedElementInfo(null)
  }, [showStatus])

  // Show all hidden elements
  const showAllHiddenElements = useCallback(() => {
    if (hiddenElementsRef.current.size === 0) {
      showStatus('No hidden elements to show.')
      return
    }

    hiddenElementsRef.current.forEach((state, element) => {
      element.show = true
      element.color = state.originalColor
    })
    hiddenElementsRef.current.clear()
    setHiddenCount(0)
    showStatus('All hidden elements are now visible!')
  }, [showStatus])

  return (
    <div className="city-map-wrapper cesium-wrapper">
      {/* Cesium Container */}
      <div ref={cesiumContainerRef} className="cesium-container" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="cesium-loading-overlay">
          <div className="cesium-loading-content">
            <div className="cesium-spinner"></div>
            <p>{loadingMessage}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="cesium-error-overlay">
          <div className="cesium-error-content">
            <span className="error-icon">⚠️</span>
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="cesium-status-message">{statusMessage}</div>
      )}

      {/* Control Panel */}
      {!isLoading && !error && (
        <div className={`cesium-control-panel ${showControlPanel ? '' : 'collapsed'}`}>
          <button 
            className="panel-toggle"
            onClick={() => setShowControlPanel(!showControlPanel)}
            title={showControlPanel ? 'Collapse' : 'Expand'}
          >
            {showControlPanel ? '◀' : '▶'}
          </button>
          
          {showControlPanel && (
            <>
              <h3>☀️ Shadow Simulation</h3>
              
              <div className="control-section">
                <button className="cesium-btn" onClick={setDateTime}>📅 Set Date/Time</button>
                <button className="cesium-btn" onClick={resetCamera}>🎥 Reset Camera</button>
              </div>

              <div className="control-section">
                <label className="section-label">Asset Visibility:</label>
                <button className={`cesium-btn ${model1Visible ? 'active' : 'inactive'}`} onClick={toggleModel1}>
                  👁️ Asset 1: {model1Visible ? 'ON' : 'OFF'}
                </button>
                <button className={`cesium-btn ${model2Visible ? 'active' : 'inactive'}`} onClick={toggleModel2}>
                  👁️ Asset 2: {model2Visible ? 'ON' : 'OFF'}
                </button>
                <button className={`cesium-btn ${osmBuildingsVisible ? 'active' : 'inactive'}`} onClick={toggleOSMBuildings}>
                  🏢 OSM Buildings: {osmBuildingsVisible ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="control-section">
                <label className="section-label">Element Visibility:</label>
                <button className="cesium-btn orange" onClick={hideSelectedElement}>👁️ Hide Selected</button>
                <button className="cesium-btn purple" onClick={showAllHiddenElements}>👁️ Show All Hidden</button>
                <div className="hidden-counter">Hidden elements: {hiddenCount}</div>
              </div>

              <div className="control-section">
                <label className="section-label">Quick Time Selection:</label>
                <select className="cesium-select" onChange={(e) => { if(e.target.value) { handleQuickTime(e.target.value); e.target.value = '' } }}>
                  <option value="">-- Select Time --</option>
                  <option value="current">Current Time</option>
                  <option value="08:00">Morning (08:00 CET)</option>
                  <option value="12:00">Noon (12:00 CET)</option>
                  <option value="15:00">Afternoon (15:00 CET)</option>
                  <option value="18:00">Evening (18:00 CET)</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Element Info Box */}
      {selectedElementInfo && (
        <div className="cesium-info-box">
          <h3>
            Element Properties
            <button className="close-btn" onClick={() => setSelectedElementInfo(null)}>✕</button>
          </h3>
          <div className="property-list">
            {Object.entries(selectedElementInfo).map(([key, value]) => (
              <div key={key} className={`property-item ${['categoryName', 'Family', 'Type', 'Level', 'name', 'id'].includes(key) ? 'important' : ''}`}>
                <div className="property-key">{key}</div>
                <div className="property-value">{String(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Info Display */}
      {!isLoading && !error && (
        <div className="cesium-time-info">
          <div className="time-display"><strong>Current Time:</strong></div>
          <div className="time-date">{currentTimeDisplay.date}</div>
          <div className="time-cet">{currentTimeDisplay.timeCET}</div>
          <div className="time-utc">{currentTimeDisplay.timeUTC}</div>
        </div>
      )}

      {/* Attribution */}
      <div className="cesium-attribution">
        Powered by <a href="https://cesium.com" target="_blank" rel="noopener noreferrer">Cesium</a> | 3D Geospatial Visualization
      </div>
    </div>
  )
}

export default CityMap
