import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function LocationMap() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  // TUM Campus coordinates (Garching Campus)
  const tumCoords = [48.26249, 11.67309]
  // Hochvolthaus approximate location (near TUM)
  const hochvoltHausCoords = [48.26450, 11.67550]

  useEffect(() => {
    if (map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([48.2630, 11.6730], 15)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: 0
    }).addTo(map.current)

    // Custom icons
    const tumIcon = L.divIcon({
      html: `<div class="custom-marker tum-marker">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#001960" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>`,
      className: 'leaflet-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    const hochvoltIcon = L.divIcon({
      html: `<div class="custom-marker hochvolt-marker">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d4183d" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3" fill="white"/>
        </svg>
      </div>`,
      className: 'leaflet-div-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    // Add markers
    const tumMarker = L.marker(tumCoords, { icon: tumIcon })
      .addTo(map.current)
      .bindPopup('<div class="popup-content"><h3>TUM Campus</h3><p>Technische Universität München</p></div>')

    const hochvoltMarker = L.marker(hochvoltHausCoords, { icon: hochvoltIcon })
      .addTo(map.current)
      .bindPopup('<div class="popup-content"><h3>The Hochvolthaus Nova</h3><p>Sustainable Architecture Project</p></div>')

    // Draw route line
    const routeCoordinates = [tumCoords, hochvoltHausCoords]
    const polyline = L.polyline(routeCoordinates, {
      color: '#001960',
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 5'
    }).addTo(map.current)

    // Add arrow animation path
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    // Fit bounds to show both points
    const group = new L.featureGroup([tumMarker, hochvoltMarker])
    map.current.fitBounds(group.getBounds().pad(0.1), { animate: true })

    setIsLoading(false)

    // Add custom styles
    const style = document.createElement('style')
    style.innerHTML = `
      .custom-marker {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }
      
      .tum-marker svg {
        width: 100%;
        height: 100%;
      }
      
      .hochvolt-marker svg {
        width: 100%;
        height: 100%;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% {
          filter: drop-shadow(0 2px 8px rgba(212, 24, 61, 0.4));
        }
        50% {
          filter: drop-shadow(0 2px 16px rgba(212, 24, 61, 0.6));
        }
      }
      
      .popup-content {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 0;
      }
      
      .popup-content h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
        color: #001960;
      }
      
      .popup-content p {
        margin: 0;
        font-size: 13px;
        color: #666;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="btn btn-secondary mb-8 w-fit inline-flex items-center gap-2">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Location & Route</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover the location of The Hochvolthaus Nova at TUM Campus in Munich. 
            The route is marked from the main TUM campus to our project location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden shadow-xl">
              <div
                ref={mapContainer}
                className="w-full rounded-lg"
                style={{ height: '600px' }}
              >
                {isLoading && (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* TUM Campus Card */}
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">TUM Campus</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Technische Universität München
                  </p>
                  <p className="text-sm font-mono text-primary">
                    48.2625°N, 11.6731°E
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrow */}
            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 bg-primary text-white rounded-full"
              >
                <Navigation size={24} />
              </motion.div>
            </div>

            {/* Hochvolthaus Card */}
            <div className="card bg-gradient-to-br from-red-50 to-white border border-red-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">The Hochvolthaus Nova</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Sustainable Architecture Project
                  </p>
                  <p className="text-sm font-mono text-red-600">
                    48.2645°N, 11.6755°E
                  </p>
                </div>
              </div>
            </div>

            {/* Distance Info */}
            <div className="card bg-secondary">
              <h4 className="font-bold mb-3">Route Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-semibold">~450m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Walking Time:</span>
                  <span className="font-semibold">~6 mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span className="font-semibold">Munich, Germany</span>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=48.26450,11.67550"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              Get Directions →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LocationMap
