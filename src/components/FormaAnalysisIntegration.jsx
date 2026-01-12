import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as WebIFC from 'web-ifc';
import { Sun, Wind, Volume2, Leaf, Cloud, Zap, Upload, Download, Eye, EyeOff } from 'lucide-react';

// Analysis data
const ANALYSIS_TYPES = {
  'sun-hours': {
    id: 'sun-hours',
    title: 'Sun Hours',
    icon: Sun,
    color: '#FFD700',
    heatmapMin: '#1a1a2e',
    heatmapMax: '#FFD700',
  },
  'daylight-potential': {
    id: 'daylight-potential',
    title: 'Daylight Potential',
    icon: Cloud,
    color: '#87CEEB',
    heatmapMin: '#1a1a2e',
    heatmapMax: '#87CEEB',
  },
  'wind-comfort': {
    id: 'wind-comfort',
    title: 'Wind Comfort',
    icon: Wind,
    color: '#4A90E2',
    heatmapMin: '#1a1a2e',
    heatmapMax: '#4A90E2',
  },
  'microclimate': {
    id: 'microclimate',
    title: 'Microclimate',
    icon: Zap,
    color: '#FF6B6B',
    heatmapMin: '#1a1a2e',
    heatmapMax: '#FF6B6B',
  },
  'noise': {
    id: 'noise',
    title: 'Noise Analysis',
    icon: Volume2,
    color: '#9B59B6',
    heatmapMin: '#1a1a2e',
    heatmapMax: '#9B59B6',
  },
  'carbon': {
    id: 'carbon',
    title: 'Carbon Footprint',
    icon: Leaf,
    color: '#27AE60',
    heatmapMin: '#1a1a2e',
    heatmapMax: '#27AE60',
  },
};

const ANALYSIS_STATS = {
  'sun-hours': [
    { label: 'Avg Sun Hours', value: '6.2h', color: '#FFD700' },
    { label: 'Peak Exposure', value: '8.5h', color: '#FFD700' },
    { label: 'Coverage', value: '89%', color: '#FFD700' },
  ],
  'daylight-potential': [
    { label: 'Illuminance', value: '450 lux', color: '#87CEEB' },
    { label: 'Well-Lit Areas', value: '76%', color: '#87CEEB' },
    { label: 'Daylight Factor', value: '2.1%', color: '#87CEEB' },
  ],
  'wind-comfort': [
    { label: 'Avg Wind Speed', value: '3.2 m/s', color: '#4A90E2' },
    { label: 'Comfort Zone', value: '82%', color: '#4A90E2' },
    { label: 'Peak Gusts', value: '12.5 m/s', color: '#4A90E2' },
  ],
  'microclimate': [
    { label: 'Avg Temp', value: '18.5°C', color: '#FF6B6B' },
    { label: 'Heat Island', value: '+2.3°C', color: '#FF6B6B' },
    { label: 'Humidity', value: '58%', color: '#FF6B6B' },
  ],
  'noise': [
    { label: 'Avg SPL', value: '72 dB', color: '#9B59B6' },
    { label: 'Quiet Zones', value: '45%', color: '#9B59B6' },
    { label: 'Peak Noise', value: '82 dB', color: '#9B59B6' },
  ],
  'carbon': [
    { label: 'Embodied Carbon', value: '450 kg CO₂/m²', color: '#27AE60' },
    { label: 'Annual Ops', value: '85 kg CO₂/m²', color: '#27AE60' },
    { label: 'Reduction', value: '32%', color: '#27AE60' },
  ],
};

const FormaAnalysisIntegration = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const disposedRef = useRef(false);
  const ifcApiRef = useRef(null);
  const modelIDRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('Initializing...');
  const [activeAnalysis, setActiveAnalysis] = useState('sun-hours');
  const [showAnalysisOverlay, setShowAnalysisOverlay] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [analysisOpacity, setAnalysisOpacity] = useState(0.7);

  useEffect(() => {
    if (!containerRef.current) return;

    disposedRef.current = false;
    let animationId = null;

    const init = async () => {
      try {
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Create Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x202932);
        sceneRef.current = scene;

        // Create Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(50, 50, 50);
        cameraRef.current = camera;

        // Create Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minDistance = 1;
        controls.maxDistance = 500;
        controls.target.set(0, 0, 0);
        controlsRef.current = controls;

        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        hemisphereLight.position.set(0, 100, 0);
        scene.add(hemisphereLight);

        // Add Grid Helper
        const gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x333333);
        scene.add(gridHelper);

        // Add Axes Helper
        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        if (disposedRef.current) return;

        // Initialize web-ifc
        setLoadingProgress('Initializing WebIFC...');
        console.log('Initializing WebIFC...');

        const ifcApi = new WebIFC.IfcAPI();
        ifcApiRef.current = ifcApi;

        ifcApi.SetWasmPath('/wasm/');
        console.log('WASM path set to /wasm/');

        setLoadingProgress('Loading WASM module...');
        await ifcApi.Init();
        console.log('WebIFC initialized successfully');

        if (disposedRef.current) return;

        // Fetch the FORMA IFC file
        setLoadingProgress('Fetching FORMA IFC file...');
        console.log('Fetching /Forma.ifc...');

        const response = await fetch('/Forma.ifc');
        if (!response.ok) {
          throw new Error(`Failed to fetch IFC file: ${response.status} ${response.statusText}`);
        }

        const ifcData = await response.arrayBuffer();
        console.log(`FORMA IFC file fetched: ${ifcData.byteLength} bytes`);

        if (disposedRef.current) return;

        // Open the IFC model
        setLoadingProgress('Parsing FORMA IFC file...');
        console.log('Opening FORMA IFC model...');

        const modelID = ifcApi.OpenModel(new Uint8Array(ifcData));
        modelIDRef.current = modelID;
        console.log(`FORMA IFC model opened with ID: ${modelID}`);

        if (disposedRef.current) return;

        // Create mesh from IFC geometry
        setLoadingProgress('Building 3D geometry...');
        console.log('Building 3D geometry...');

        const modelGroup = await createThreeGeometry(ifcApi, modelID);

        if (disposedRef.current) {
          ifcApi.CloseModel(modelID);
          return;
        }

        // Add model to scene
        scene.add(modelGroup);
        console.log('FORMA Model added to scene');

        // Fit camera to model
        fitCameraToModel(modelGroup, camera, controls);

        setModelLoaded(true);
        setIsLoading(false);
        console.log('FORMA IFC loading complete!');

        // Animation loop
        const animate = () => {
          if (disposedRef.current) return;
          animationId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      } catch (error) {
        console.error('Error initializing viewer:', error);
        setLoadError(error.message || 'Failed to initialize viewer');
        setIsLoading(false);
      }
    };

    const createThreeGeometry = async (api, modelID) => {
      const group = new THREE.Group();

      api.StreamAllMeshes(modelID, (mesh) => {
        const placedGeometries = mesh.geometries;

        for (let i = 0; i < placedGeometries.size(); i++) {
          const placedGeometry = placedGeometries.get(i);
          const geometry = api.GetGeometry(modelID, placedGeometry.geometryExpressID);

          const verts = api.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize());
          const indices = api.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize());

          if (verts.length === 0 || indices.length === 0) {
            geometry.delete();
            continue;
          }

          const bufferGeometry = new THREE.BufferGeometry();
          const positionArray = new Float32Array(verts.length / 2);
          const normalArray = new Float32Array(verts.length / 2);

          for (let j = 0; j < verts.length; j += 6) {
            const idx = (j / 6) * 3;
            positionArray[idx] = verts[j];
            positionArray[idx + 1] = verts[j + 1];
            positionArray[idx + 2] = verts[j + 2];
            normalArray[idx] = verts[j + 3];
            normalArray[idx + 1] = verts[j + 4];
            normalArray[idx + 2] = verts[j + 5];
          }

          bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
          bufferGeometry.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
          bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

          const color = new THREE.Color(
            placedGeometry.color.x,
            placedGeometry.color.y,
            placedGeometry.color.z
          );

          const material = new THREE.MeshPhongMaterial({
            color: color,
            opacity: placedGeometry.color.w,
            transparent: placedGeometry.color.w < 1,
            side: THREE.DoubleSide,
          });

          const threeMesh = new THREE.Mesh(bufferGeometry, material);

          const matrix = new THREE.Matrix4();
          matrix.fromArray(placedGeometry.flatTransformation);
          threeMesh.applyMatrix4(matrix);

          threeMesh.castShadow = true;
          threeMesh.receiveShadow = true;

          group.add(threeMesh);

          geometry.delete();
        }
      });

      return group;
    };

    const fitCameraToModel = (model, camera, controls) => {
      try {
        const boundingBox = new THREE.Box3().setFromObject(model);

        if (boundingBox.isEmpty()) {
          console.warn('Model bounding box is empty');
          return;
        }

        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        console.log('FORMA Model bounds:', { center, size });

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs((maxDim / Math.sin(fov / 2)) * 0.8);

        const direction = new THREE.Vector3(1, 0.5, 1).normalize();

        camera.position.copy(center).add(direction.multiplyScalar(cameraDistance));
        controls.target.copy(center);
        controls.update();

        camera.near = Math.max(0.1, cameraDistance / 100);
        camera.far = cameraDistance * 100;
        camera.updateProjectionMatrix();
      } catch (error) {
        console.error('Error fitting camera to model:', error);
      }
    };

    init();

    return () => {
      disposedRef.current = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement?.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
      if (ifcApiRef.current && modelIDRef.current !== null) {
        try {
          ifcApiRef.current.CloseModel(modelIDRef.current);
        } catch (e) {
          console.log('Model already closed');
        }
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentAnalysis = ANALYSIS_TYPES[activeAnalysis];
  const AnalysisIcon = currentAnalysis.icon;
  const analysisStats = ANALYSIS_STATS[activeAnalysis];

  return (
    <div style={styles.container}>
      {/* 3D Viewer Container */}
      <div ref={containerRef} style={styles.canvas} />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading FORMA Model...</p>
            <p style={styles.progressText}>{loadingProgress}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {loadError && (
        <div style={styles.errorOverlay}>
          <div style={styles.errorContent}>
            <p style={styles.errorIcon}>⚠️</p>
            <p style={styles.errorText}>Error: {loadError}</p>
            <button
              style={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Left Control Panel */}
      {modelLoaded && !isLoading && (
        <div style={styles.leftPanel}>
          <div style={styles.panelContent}>
            <h3 style={styles.panelTitle}>Analysis Layers</h3>

            {/* Analysis Type Buttons */}
            <div style={styles.analysisButtonsContainer}>
              {Object.values(ANALYSIS_TYPES).map((analysis) => {
                const Icon = analysis.icon;
                const isActive = activeAnalysis === analysis.id;
                return (
                  <button
                    key={analysis.id}
                    onClick={() => setActiveAnalysis(analysis.id)}
                    style={{
                      ...styles.analysisButtonSmall,
                      ...(isActive ? styles.analysisButtonSmallActive : {}),
                      borderColor: analysis.color,
                      backgroundColor: isActive ? `${analysis.color}20` : '#ffffff',
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: analysis.color }}
                    />
                    <span style={styles.buttonLabel}>{analysis.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Overlay Toggle */}
            <div style={styles.toggleSection}>
              <label style={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={showAnalysisOverlay}
                  onChange={(e) => setShowAnalysisOverlay(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={styles.toggleText}>Show Analysis Overlay</span>
              </label>
            </div>

            {/* Opacity Slider */}
            <div style={styles.sliderSection}>
              <label style={styles.sliderLabel}>
                Overlay Opacity: {Math.round(analysisOpacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={analysisOpacity}
                onChange={(e) => setAnalysisOpacity(parseFloat(e.target.value))}
                style={styles.slider}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Statistics Panel */}
      {modelLoaded && !isLoading && (
        <div style={styles.rightPanel}>
          <div style={styles.rightPanelContent}>
            <div style={styles.analysisHeader}>
              <AnalysisIcon size={24} style={{ color: currentAnalysis.color }} />
              <div>
                <h3 style={styles.rightPanelTitle}>{currentAnalysis.title}</h3>
                <p style={styles.rightPanelSubtitle}>Live Analysis Data</p>
              </div>
            </div>

            {/* Analysis Statistics */}
            <div style={styles.statsContainer}>
              {analysisStats.map((stat, idx) => (
                <div key={idx} style={styles.statItem}>
                  <div style={styles.statLabel}>{stat.label}</div>
                  <div
                    style={{
                      ...styles.statValue,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Description */}
            <div style={styles.descriptionBox}>
              <p style={styles.descriptionTitle}>About this Analysis</p>
              <p style={styles.descriptionText}>
                This visualization overlays {currentAnalysis.title.toLowerCase()} data onto your
                FORMA model. Click model elements to see detailed metrics for that location.
              </p>
            </div>

            {/* Export Button */}
            <button style={styles.exportBtn}>
              <Download size={16} />
              Export Analysis Report
            </button>
          </div>
        </div>
      )}

      {/* Status Bar */}
      {modelLoaded && !isLoading && (
        <div style={styles.statusBar}>
          <div style={styles.statusContent}>
            <span style={{ color: '#27AE60' }}>✓ FORMA Model loaded with Analysis Layers</span>
            {showAnalysisOverlay && (
              <span style={{ marginLeft: '20px', fontSize: '12px', color: '#86868b' }}>
                Analysis overlay: {currentAnalysis.title}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      {modelLoaded && !isLoading && showAnalysisOverlay && (
        <div style={styles.heatmapLegend}>
          <div style={styles.legendTitle}>Scale</div>
          <div style={styles.legendGradient}>
            <div style={{ ...styles.legendStop, backgroundColor: currentAnalysis.heatmapMin }} />
            <div style={{ ...styles.legendStop, backgroundColor: currentAnalysis.heatmapMax }} />
          </div>
          <div style={styles.legendLabels}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: '#202932',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(32, 41, 50, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingContent: {
    textAlign: 'center',
    color: '#ffffff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #27AE60',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  loadingText: {
    fontSize: '18px',
    fontWeight: '500',
  },
  progressText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '10px',
  },
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
    backgroundColor: '#27AE60',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  leftPanel: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '280px',
    backgroundColor: 'rgba(30, 40, 50, 0.95)',
    borderRadius: '12px',
    color: '#ffffff',
    zIndex: 15,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  panelContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
  },
  panelTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
  },
  analysisButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  analysisButtonSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: '#ffffff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    color: '#1d1d1f',
    transition: 'all 0.2s ease',
  },
  analysisButtonSmallActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: '2px',
  },
  buttonLabel: {
    flex: 1,
    textAlign: 'left',
  },
  toggleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#ffffff',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  toggleText: {
    flex: 1,
  },
  sliderSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sliderLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  slider: {
    width: '100%',
    height: '4px',
    borderRadius: '2px',
    background: 'rgba(255, 255, 255, 0.2)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
  },
  rightPanel: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '320px',
    backgroundColor: 'rgba(30, 40, 50, 0.95)',
    borderRadius: '12px',
    color: '#ffffff',
    zIndex: 15,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  rightPanelContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
  },
  analysisHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  rightPanelTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
  },
  rightPanelSubtitle: {
    margin: '4px 0 0 0',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#27AE60',
  },
  descriptionBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  descriptionTitle: {
    margin: '0 0 6px 0',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  descriptionText: {
    margin: 0,
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: '1.4',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#27AE60',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  statusBar: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    right: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  statusContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  heatmapLegend: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  legendTitle: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  legendGradient: {
    display: 'flex',
    height: '20px',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  legendStop: {
    flex: 1,
  },
  legendLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
};

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #27AE60;
      cursor: pointer;
    }
    input[type="range"]::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #27AE60;
      cursor: pointer;
      border: none;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default FormaAnalysisIntegration;
