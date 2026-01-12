import React, { useState } from 'react';
import { Sun, Wind, Volume2, Leaf, Cloud, Zap, Upload, Download } from 'lucide-react';

// Analysis data with metadata
const ANALYSIS_DATA = {
  'sun-hours': {
    id: 'sun-hours',
    title: 'Sun Hours',
    icon: Sun,
    description: 'Annual sun exposure analysis',
    imageUrl: 'https://via.placeholder.com/1200x700/FFD700/1a1a1a?text=Sun+Hours+Analysis',
    metrics: [
      { label: 'Average Sun Hours', value: '6.2h', unit: 'per day' },
      { label: 'Peak Exposure', value: '8.5h', unit: 'in summer' },
      { label: 'Winter Minimum', value: '3.8h', unit: 'per day' },
      { label: 'Coverage', value: '89%', unit: 'of building' },
    ],
    color: '#FFD700',
  },
  'daylight-potential': {
    id: 'daylight-potential',
    title: 'Daylight Potential',
    icon: Cloud,
    description: 'Natural lighting distribution assessment',
    imageUrl: 'https://via.placeholder.com/1200x700/87CEEB/1a1a1a?text=Daylight+Potential',
    metrics: [
      { label: 'Average Illuminance', value: '450', unit: 'lux' },
      { label: 'Well-Lit Areas', value: '76%', unit: 'of space' },
      { label: 'Daylight Factor', value: '2.1%', unit: 'average' },
      { label: 'Uniformity', value: 'Good', unit: 'distribution' },
    ],
    color: '#87CEEB',
  },
  'wind-comfort': {
    id: 'wind-comfort',
    title: 'Wind Comfort',
    icon: Wind,
    description: 'Pedestrian wind comfort analysis',
    imageUrl: 'https://via.placeholder.com/1200x700/4A90E2/1a1a1a?text=Wind+Comfort+Analysis',
    metrics: [
      { label: 'Average Wind Speed', value: '3.2', unit: 'm/s' },
      { label: 'Comfort Zone', value: '82%', unit: 'of area' },
      { label: 'Peak Gusts', value: '12.5', unit: 'm/s' },
      { label: 'Dominant Direction', value: 'NW', unit: 'wind' },
    ],
    color: '#4A90E2',
  },
  'microclimate': {
    id: 'microclimate',
    title: 'Microclimate',
    icon: Zap,
    description: 'Local climate and temperature distribution',
    imageUrl: 'https://via.placeholder.com/1200x700/FF6B6B/1a1a1a?text=Microclimate+Analysis',
    metrics: [
      { label: 'Avg Temperature', value: '18.5°C', unit: 'in shade' },
      { label: 'Heat Island Effect', value: '+2.3°C', unit: 'vs baseline' },
      { label: 'Humidity', value: '58%', unit: 'average' },
      { label: 'Thermal Comfort', value: 'Moderate', unit: 'conditions' },
    ],
    color: '#FF6B6B',
  },
  'noise': {
    id: 'noise',
    title: 'Noise Analysis',
    icon: Volume2,
    description: 'Sound pressure level distribution',
    imageUrl: 'https://via.placeholder.com/1200x700/9B59B6/1a1a1a?text=Noise+Analysis',
    metrics: [
      { label: 'Average SPL', value: '72', unit: 'dB' },
      { label: 'Quiet Zones', value: '45%', unit: 'of area' },
      { label: 'Peak Noise', value: '82', unit: 'dB' },
      { label: 'Primary Source', value: 'Traffic', unit: 'noise' },
    ],
    color: '#9B59B6',
  },
  'carbon': {
    id: 'carbon',
    title: 'Carbon Footprint',
    icon: Leaf,
    description: 'Embodied and operational carbon analysis',
    imageUrl: 'https://via.placeholder.com/1200x700/27AE60/1a1a1a?text=Carbon+Analysis',
    metrics: [
      { label: 'Embodied Carbon', value: '450', unit: 'kg CO₂/m²' },
      { label: 'Annual Operations', value: '85', unit: 'kg CO₂/m²' },
      { label: '50-Year Total', value: '4,750', unit: 'kg CO₂/m²' },
      { label: 'Carbon Reduction', value: '32%', unit: 'vs baseline' },
    ],
    color: '#27AE60',
  },
};

const AnalysisViewer = () => {
  const [activeTab, setActiveTab] = useState('sun-hours');
  const [customImages, setCustomImages] = useState({});

  const currentAnalysis = ANALYSIS_DATA[activeTab];
  const displayImage = customImages[activeTab] || currentAnalysis.imageUrl;

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result;
        setCustomImages((prev) => ({
          ...prev,
          [activeTab]: imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Autodesk Forma Analysis Dashboard</h1>
          <p style={styles.headerSubtitle}>
            Comprehensive building performance simulation results
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div style={styles.mainContent}>
        {/* Left Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            <h2 style={styles.sidebarTitle}>Analysis Types</h2>
            <div style={styles.analysisList}>
              {Object.values(ANALYSIS_DATA).map((analysis) => {
                const Icon = analysis.icon;
                const isActive = activeTab === analysis.id;
                return (
                  <button
                    key={analysis.id}
                    onClick={() => setActiveTab(analysis.id)}
                    style={{
                      ...styles.analysisButton,
                      ...(isActive ? styles.analysisButtonActive : {}),
                      borderLeftColor: analysis.color,
                    }}
                  >
                    <Icon
                      size={20}
                      style={{
                        color: isActive ? analysis.color : '#86868b',
                      }}
                    />
                    <div style={styles.buttonText}>
                      <span style={styles.buttonTitle}>{analysis.title}</span>
                      <span style={styles.buttonDesc}>{analysis.description}</span>
                    </div>
                    {isActive && <div style={styles.activeIndicator} />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center Stage */}
        <div style={styles.centerStage}>
          <div style={styles.imageContainer}>
            <img
              src={displayImage}
              alt={currentAnalysis.title}
              style={styles.image}
            />
            <div style={styles.imageOverlay}>
              <label style={styles.uploadLabel}>
                <Upload size={20} />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={styles.fileInput}
                />
              </label>
            </div>
          </div>

          {/* Analysis Title & Description */}
          <div style={styles.analysisInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {React.createElement(currentAnalysis.icon, {
                size: 28,
                style: { color: currentAnalysis.color },
              })}
              <div>
                <h2 style={styles.analysisTitle}>{currentAnalysis.title}</h2>
                <p style={styles.analysisDescription}>
                  {currentAnalysis.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <aside style={styles.rightPanel}>
          <div style={styles.rightPanelContent}>
            <h3 style={styles.panelTitle}>Statistics & Insights</h3>

            <div style={styles.metricsContainer}>
              {currentAnalysis.metrics.map((metric, idx) => (
                <div key={idx} style={styles.metricCard}>
                  <div style={styles.metricHeader}>
                    <span style={styles.metricLabel}>{metric.label}</span>
                    <span style={styles.metricUnit}>{metric.unit}</span>
                  </div>
                  <div
                    style={{
                      ...styles.metricValue,
                      color: currentAnalysis.color,
                    }}
                  >
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Export Button */}
            <button style={styles.exportButton}>
              <Download size={18} />
              <span>Export Report</span>
            </button>

            {/* Info Box */}
            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>About this Analysis</p>
              <p style={styles.infoText}>
                This simulation provides comprehensive insights into building
                performance. Results are calculated using advanced environmental
                analysis algorithms and represent realistic conditions.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#001960',
    color: '#ffffff',
    padding: '3rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  headerTitle: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 320px',
    gap: '24px',
    padding: '32px 24px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    '@media (max-width: 1200px)': {
      gridTemplateColumns: '1fr',
      gap: '24px',
    },
  },
  sidebar: {
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '24px',
  },
  sidebarContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: 0,
  },
  analysisList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  analysisButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e7',
    borderLeft: '3px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    position: 'relative',
  },
  analysisButtonActive: {
    backgroundColor: '#f5f5f7',
    borderColor: '#001960',
  },
  buttonText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  buttonTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1d1d1f',
  },
  buttonDesc: {
    fontSize: '11px',
    color: '#86868b',
  },
  activeIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#001960',
  },
  centerStage: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f7',
    aspectRatio: '16/9',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  uploadLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: 'rgba(0, 25, 96, 0.9)',
    color: '#ffffff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  fileInput: {
    display: 'none',
  },
  analysisInfo: {
    padding: '20px',
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analysisTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: 0,
  },
  analysisDescription: {
    fontSize: '13px',
    color: '#86868b',
    margin: '4px 0 0 0',
  },
  rightPanel: {
    backgroundColor: '#f5f5f7',
    borderRadius: '12px',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '24px',
  },
  rightPanelContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: 0,
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e5e7',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  metricLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1d1d1f',
  },
  metricUnit: {
    fontSize: '11px',
    color: '#86868b',
  },
  metricValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#001960',
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#001960',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e5e5e7',
  },
  infoTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1d1d1f',
    margin: '0 0 8px 0',
  },
  infoText: {
    fontSize: '12px',
    color: '#86868b',
    lineHeight: '1.5',
    margin: 0,
  },
};

export default AnalysisViewer;
