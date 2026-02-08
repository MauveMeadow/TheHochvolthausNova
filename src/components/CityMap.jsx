import { useState, useRef, useEffect } from 'react'
import '../styles/CityMap.css'

function CityMap() {
  const [loadError, setLoadError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setIsLoading(false)
      setLoadError(null)
    }

    const handleError = () => {
      setIsLoading(false)
      setLoadError('Failed to load 3D City Map. Please try again.')
    }

    iframe.addEventListener('load', handleLoad)
    iframe.addEventListener('error', handleError)

    // Set a timeout for loading
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setLoadError('Failed to load 3D City Map. The WASM module initialization failed.')
      }
    }, 10000)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      iframe.removeEventListener('error', handleError)
      clearTimeout(loadTimeout)
    }
  }, [isLoading])

  const styles = {
    errorOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(32, 41, 50, 0.95)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    errorContent: {
      textAlign: 'center',
      color: '#ffffff',
      padding: '40px',
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 59, 48, 0.3)',
    },
    errorIcon: {
      fontSize: '48px',
      margin: '0 0 16px 0',
    },
    errorText: {
      fontSize: '16px',
      color: '#ff3b30',
      margin: '0 0 20px 0',
    },
    retryButton: {
      padding: '12px 24px',
      backgroundColor: '#f59e0b',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  }

  return (
    <div className="city-map-wrapper" style={{ position: 'relative' }}>
      <iframe
        ref={iframeRef}
        src="./cesium-shadow-viewer.html"
        title="3D City Map - Shadow Simulation"
        className="cesium-iframe"
        allowFullScreen
        style={{ display: loadError ? 'none' : 'block' }}
      />
      
      {/* Error Display */}
      {loadError && (
        <div style={styles.errorOverlay}>
          <div style={styles.errorContent}>
            <p style={styles.errorIcon}>⚠️</p>
            <p style={styles.errorText}>Error: {loadError}</p>
            <button 
              style={styles.retryButton}
              onClick={() => {
                setLoadError(null)
                setIsLoading(true)
                if (iframeRef.current) {
                  iframeRef.current.src = './cesium-shadow-viewer.html'
                }
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f59e0b'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CityMap
