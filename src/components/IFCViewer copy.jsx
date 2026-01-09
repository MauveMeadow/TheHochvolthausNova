import React, { useEffect, useRef, useState } from 'react';
import * as OBC from '@thatopen/components';
import * as THREE from 'three';

const IFCViewer = () => {
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const componentsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const ifcLoaderRef = useRef(null);
  const modelRef = useRef(null);
  const gridRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fileInput, setFileInput] = useState(null);

  // Initialize 3D World
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Create components instance
      const components = new OBC.Components();
      componentsRef.current = components;

      // Create world using Worlds manager
      const worlds = components.get(OBC.Worlds);
      const world = worlds.create();
      worldRef.current = world;

      // Set up scene using SimpleScene
      world.scene = new OBC.SimpleScene(components);
      world.scene.setup();
      const scene = world.scene.three;
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x202932);

      // Set up renderer using SimpleRenderer
      world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
      const renderer = world.renderer;
      rendererRef.current = renderer;

      // Set up camera using SimpleCamera
      world.camera = new OBC.SimpleCamera(components);
      const camera = world.camera.three;
      cameraRef.current = camera;
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
      
      components.init();

      // Add Ambient Light (soft overall lighting)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      // Add Directional Light (shadows and definition)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.far = 50;
      scene.add(directionalLight);

      // Create and add Grid
      const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
      gridHelper.position.y = 0;
      scene.add(gridHelper);
      gridRef.current = gridHelper;

      // Add Axes Helper for reference
      const axesHelper = new THREE.AxesHelper(10);
      scene.add(axesHelper);

      // Initialize IFC Loader
      const ifcLoader = new OBC.IfcLoader(components);
      ifcLoaderRef.current = ifcLoader;
      ifcLoader.settings.wasm = {
        path: '/wasm/',
        absolute: true,
      };

      // Handle window resize
      const handleResize = () => {
        if (!world || !worldRef.current) return;
        world.renderer.resize();
        world.camera.updateAspect();
      };

      // Set initial renderer size
      world.renderer.resize();
      world.camera.updateAspect();

      window.addEventListener('resize', handleResize);

      // Animation loop using OBC renderer's update method
      const animate = () => {
        requestAnimationFrame(animate);
        world.renderer.update();
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Error initializing 3D viewer:', error);
    }
  }, []);

  // Load IFC File
  const loadIfc = async (file) => {
    if (!ifcLoaderRef.current || !worldRef.current || !cameraRef.current) {
      console.error('3D viewer not initialized');
      return;
    }

    setIsLoading(true);
    try {
      const url = URL.createObjectURL(file);
      const model = await ifcLoaderRef.current.load(url);
      
      if (model) {
        modelRef.current = model;

        // Add model to scene
        sceneRef.current.add(model);

        // Calculate bounding box and auto-fit camera
        const boundingBox = new THREE.Box3().setFromObject(model);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = cameraRef.current.fov * (Math.PI / 180); // convert vertical FOV to radians
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

        cameraZ *= 1.5; // Add some padding

        cameraRef.current.position.copy(center);
        cameraRef.current.position.z += cameraZ;
        cameraRef.current.lookAt(center);
        cameraRef.current.updateProjectionMatrix();

        console.log('IFC model loaded successfully');
      }

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error loading IFC file:', error);
      alert('Failed to load IFC file. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.ifc')) {
      loadIfc(file);
    } else {
      alert('Please select a valid .ifc file');
    }
  };

  return (
    <div style={styles.container}>
      {/* 3D Viewer Canvas Container */}
      <div ref={containerRef} style={styles.canvas} />

      {/* UI Overlay */}
      <div style={styles.overlay}>
        {/* Upload Section */}
        <div style={styles.uploadSection}>
          <input
            ref={(input) => setFileInput(input)}
            type="file"
            accept=".ifc"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={isLoading}
          />
          <button
            onClick={() => fileInput?.click()}
            style={{
              ...styles.button,
              ...styles.uploadButton,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '📁 Upload IFC'}
          </button>
        </div>

        {/* Tools Section (Future Use) */}
        <div style={styles.toolsSection}>
          <button
            style={{ ...styles.button, ...styles.toolButton }}
            title="Coming soon"
            disabled
          >
            ✂️ Section
          </button>
          <button
            style={{ ...styles.button, ...styles.toolButton }}
            title="Coming soon"
            disabled
          >
            📏 Measure
          </button>
          <button
            style={{ ...styles.button, ...styles.toolButton }}
            title="Coming soon"
            disabled
          >
            ℹ️ Properties
          </button>
        </div>

        {/* Status Info */}
        {modelRef.current && (
          <div style={styles.statusInfo}>
            ✓ Model loaded
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px',
  },
  uploadSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadLabel: {
    display: 'inline-block',
  },
  fileInput: {
    display: 'none',
  },
  button: {
    pointerEvents: 'all',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
  },
  toolsSection: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  toolButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  statusInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#00ff00',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    width: 'fit-content',
    backdropFilter: 'blur(10px)',
  },
};

export default IFCViewer;
