import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as OBC from '@thatopen/components';

const IfcViewerNew = () => {
  const containerRef = useRef(null);
  const componentsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState('Initializing...');

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    const init = async () => {
      try {
        // --- 1. Basic Setup ---
        setLoadingProgress('Setting up 3D environment...');
        const components = new OBC.Components();
        componentsRef.current = components;

        const worlds = components.get(OBC.Worlds);
        const world = worlds.create();

        // Set up scene, renderer, and camera
        world.scene = new OBC.SimpleScene(components);
        world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
        world.camera = new OBC.SimpleCamera(components);

        components.init();

        // Configure camera position to look at the building
        await world.camera.controls.setLookAt(50, 50, 50, 0, 0, 0);

        // Setup scene with default lighting and grid
        world.scene.setup();

        // Add custom background color
        world.scene.three.background = new THREE.Color(0x202932);

        // Add grid
        components.get(OBC.Grids).create(world);

        if (disposed) return;

        // --- 2. IFC Loader with CDN WASM (THE KEY FIX) ---
        setLoadingProgress('Setting up IFC loader...');
        const ifcLoader = components.get(OBC.IfcLoader);

        // Configure WASM to load from CDN - THIS FIXES THE 404 ERROR
        await ifcLoader.setup({
          autoSetWasm: false,
          wasm: {
            path: "https://unpkg.com/web-ifc@0.0.75/",
            absolute: true
          }
        });
        console.log("IFC Loader ready with WASM from CDN");

        if (disposed) return;

        // --- 3. Fragments Manager with Worker ---
        setLoadingProgress('Initializing fragments manager...');
        const githubUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
        const fetchedUrl = await fetch(githubUrl);
        const workerBlob = await fetchedUrl.blob();
        const workerFile = new File([workerBlob], "worker.mjs", {
          type: "text/javascript",
        });
        const workerUrl = URL.createObjectURL(workerFile);
        
        const fragments = components.get(OBC.FragmentsManager);
        fragments.init(workerUrl);

        // Update fragments when camera moves
        world.camera.controls.addEventListener("update", () => fragments.core.update());

        // When model is loaded, add it to scene
        fragments.list.onItemSet.add(({ value: model }) => {
          model.useCamera(world.camera.three);
          world.scene.three.add(model.object);
          fragments.core.update(true);
        });

        // Remove z fighting
        fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
          if (!("isLodMaterial" in material && material.isLodMaterial)) {
            material.polygonOffset = true;
            material.polygonOffsetUnits = 1;
            material.polygonOffsetFactor = Math.random();
          }
        });

        if (disposed) return;

        // --- 4. Load the IFC Model ---
        setLoadingProgress('Fetching IFC file...');
        
        // Try to load the Hochvolthaus.ifc file from public folder
        const basePath = import.meta.env.BASE_URL || '/';
        let modelUrl = `${basePath}Hochvolthaus.ifc`;
        
        // Fallback to different files
        let response;
        try {
          response = await fetch(modelUrl);
          if (!response.ok) {
            throw new Error('Hochvolthaus.ifc not found');
          }
        } catch (e) {
          console.log('Trying Project1.ifc...');
          modelUrl = `${basePath}Project1.ifc`;
          try {
            response = await fetch(modelUrl);
            if (!response.ok) {
              throw new Error('Project1.ifc not found');
            }
          } catch (e2) {
            // Final fallback to sample model
            console.log('Using sample model from That Open...');
            modelUrl = "https://thatopen.github.io/engine_components/resources/ifc/school_str.ifc";
            response = await fetch(modelUrl);
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch IFC file: ${response.status}`);
        }

        setLoadingProgress('Parsing IFC model...');
        const data = await response.arrayBuffer();
        const buffer = new Uint8Array(data);

        if (disposed) return;

        setLoadingProgress('Building 3D geometry...');
        await ifcLoader.load(buffer, false, "Hochvolthaus", {
          processData: {
            progressCallback: (progress) => {
              setLoadingProgress(`Loading: ${Math.round(progress * 100)}%`);
              console.log('Loading progress:', progress);
            }
          }
        });

        // Fit camera to model
        const [model] = fragments.list.values();
        if (model) {
          const box = new THREE.Box3().setFromObject(model.object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const distance = maxDim * 2;

          await world.camera.controls.setLookAt(
            center.x + distance,
            center.y + distance,
            center.z + distance,
            center.x,
            center.y,
            center.z
          );
        }

        console.log('IFC Model loaded successfully!');
        setIsLoading(false);

      } catch (error) {
        console.error('Error initializing IFC viewer:', error);
        setLoadError(error.message || 'Failed to initialize viewer');
        setIsLoading(false);
      }
    };

    init();

    // Cleanup when component unmounts
    return () => {
      disposed = true;
      if (componentsRef.current) {
        componentsRef.current.dispose();
        componentsRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(32, 41, 50, 0.95)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              borderTop: '3px solid #007AFF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ fontSize: '16px', color: '#007AFF' }}>{loadingProgress}</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {loadError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(32, 41, 50, 0.95)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '40px',
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 59, 48, 0.3)',
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 16px' }}>⚠️</p>
            <p style={{ fontSize: '16px', color: '#FF3B30', margin: '0 0 20px' }}>
              Error: {loadError}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                backgroundColor: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* 3D Viewer Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#202932',
          borderRadius: '1rem',
          overflow: 'hidden',
        }}
      />

      {/* Controls hint */}
      {!isLoading && !loadError && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
        }}>
          <span>🖱️ Left click + drag: Rotate</span>
          <span style={{ marginLeft: '12px' }}>🖱️ Right click + drag: Pan</span>
          <span style={{ marginLeft: '12px' }}>🖱️ Scroll: Zoom</span>
        </div>
      )}

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default IfcViewerNew;
