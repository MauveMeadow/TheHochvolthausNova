import '../styles/CityMap.css'

function CityMap() {
  return (
    <div className="city-map-wrapper">
      <iframe
        src="./cesium-shadow-viewer.html"
        title="3D City Map - Shadow Simulation"
        className="cesium-iframe"
        allowFullScreen
      />
    </div>
  )
}

export default CityMap
