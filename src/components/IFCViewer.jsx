import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as WebIFC from 'web-ifc';

// IFC Type names mapping
const IFC_TYPES = {
  [WebIFC.IFCPROJECT]: 'Project',
  [WebIFC.IFCSITE]: 'Site',
  [WebIFC.IFCBUILDING]: 'Building',
  [WebIFC.IFCBUILDINGSTOREY]: 'Building Storey',
  [WebIFC.IFCSPACE]: 'Space',
  [WebIFC.IFCWALL]: 'Wall',
  [WebIFC.IFCWALLSTANDARDCASE]: 'Wall',
  [WebIFC.IFCWINDOW]: 'Window',
  [WebIFC.IFCDOOR]: 'Door',
  [WebIFC.IFCSLAB]: 'Slab',
  [WebIFC.IFCROOF]: 'Roof',
  [WebIFC.IFCCOLUMN]: 'Column',
  [WebIFC.IFCBEAM]: 'Beam',
  [WebIFC.IFCSTAIR]: 'Stair',
  [WebIFC.IFCRAILING]: 'Railing',
  [WebIFC.IFCFURNISHINGELEMENT]: 'Furniture',
  [WebIFC.IFCFURNITURE]: 'Furniture',
  [WebIFC.IFCCOVERING]: 'Covering',
  [WebIFC.IFCPLATE]: 'Plate',
  [WebIFC.IFCMEMBER]: 'Member',
  [WebIFC.IFCCURTAINWALL]: 'Curtain Wall',
  [WebIFC.IFCOPENINGELEMENT]: 'Opening',
  [WebIFC.IFCFLOWSEGMENT]: 'Flow Segment',
  [WebIFC.IFCFLOWTERMINAL]: 'Flow Terminal',
  [WebIFC.IFCFLOWFITTING]: 'Flow Fitting',
  [WebIFC.IFCBUILDINGELEMENTPROXY]: 'Building Element',
};

const IFCViewer = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const disposedRef = useRef(false);
  const ifcApiRef = useRef(null);
  const modelIDRef = useRef(null);
  const meshToExpressIdRef = useRef(new Map());
  const expressIdToMeshRef = useRef(new Map());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const originalMaterialsRef = useRef(new Map());

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('Initializing...');
  
  // Model information state
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementProperties, setElementProperties] = useState(null);
  const [spatialStructure, setSpatialStructure] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('properties');

  // Get element properties from IFC
  const getElementProperties = useCallback(async (expressId) => {
    const api = ifcApiRef.current;
    const modelID = modelIDRef.current;
    
    if (!api || modelID === null) return null;

    try {
      // Get the element line
      const element = api.GetLine(modelID, expressId);
      
      // Get element type name
      const typeId = api.GetLineType(modelID, expressId);
      const typeName = IFC_TYPES[typeId] || `Type ${typeId}`;
      
      // Basic properties
      const properties = {
        expressId,
        type: typeName,
        ifcType: typeId,
        name: element.Name?.value || 'Unnamed',
        description: element.Description?.value || '',
        objectType: element.ObjectType?.value || '',
        tag: element.Tag?.value || '',
        globalId: element.GlobalId?.value || '',
      };

      // Get property sets
      const propertySets = [];
      try {
        const psets = api.GetPropertySets(modelID, expressId);
        for (const pset of psets) {
          const psetData = {
            name: pset.Name?.value || 'Property Set',
            properties: {}
          };
          
          if (pset.HasProperties) {
            for (const prop of pset.HasProperties) {
              if (prop && prop.Name) {
                const propName = prop.Name.value;
                let propValue = '';
                
                if (prop.NominalValue) {
                  propValue = prop.NominalValue.value;
                } else if (prop.Value) {
                  propValue = prop.Value.value;
                }
                
                psetData.properties[propName] = propValue;
              }
            }
          }
          
          propertySets.push(psetData);
        }
      } catch (e) {
        console.log('Could not get property sets:', e);
      }

      // Get type properties
      let typeProperties = null;
      try {
        const typeProps = api.GetTypeProperties(modelID, expressId);
        if (typeProps && typeProps.length > 0) {
          typeProperties = typeProps.map(tp => ({
            name: tp.Name?.value || 'Type Property',
            value: tp.Value?.value || tp.NominalValue?.value || ''
          }));
        }
      } catch (e) {
        console.log('Could not get type properties:', e);
      }

      // Get material info
      let materials = [];
      try {
        const matInfo = api.GetMaterialsProperties(modelID, expressId);
        if (matInfo && matInfo.length > 0) {
          materials = matInfo.map(m => ({
            name: m.Name?.value || 'Material',
            thickness: m.LayerThickness?.value || m.Thickness?.value || ''
          }));
        }
      } catch (e) {
        console.log('Could not get material info:', e);
      }

      return {
        ...properties,
        propertySets,
        typeProperties,
        materials
      };
    } catch (error) {
      console.error('Error getting element properties:', error);
      return null;
    }
  }, []);

  // Get spatial structure
  const getSpatialStructure = useCallback(() => {
    const api = ifcApiRef.current;
    const modelID = modelIDRef.current;
    
    if (!api || modelID === null) return;

    try {
      const structure = [];
      
      // Get project
      const projects = api.GetLineIDsWithType(modelID, WebIFC.IFCPROJECT);
      for (let i = 0; i < projects.size(); i++) {
        const projectId = projects.get(i);
        const project = api.GetLine(modelID, projectId);
        
        const projectData = {
          id: projectId,
          type: 'Project',
          name: project.Name?.value || 'Project',
          children: []
        };

        // Get sites
        const sites = api.GetLineIDsWithType(modelID, WebIFC.IFCSITE);
        for (let j = 0; j < sites.size(); j++) {
          const siteId = sites.get(j);
          const site = api.GetLine(modelID, siteId);
          
          const siteData = {
            id: siteId,
            type: 'Site',
            name: site.Name?.value || 'Site',
            children: []
          };

          // Get buildings
          const buildings = api.GetLineIDsWithType(modelID, WebIFC.IFCBUILDING);
          for (let k = 0; k < buildings.size(); k++) {
            const buildingId = buildings.get(k);
            const building = api.GetLine(modelID, buildingId);
            
            const buildingData = {
              id: buildingId,
              type: 'Building',
              name: building.Name?.value || 'Building',
              children: []
            };

            // Get storeys
            const storeys = api.GetLineIDsWithType(modelID, WebIFC.IFCBUILDINGSTOREY);
            for (let l = 0; l < storeys.size(); l++) {
              const storeyId = storeys.get(l);
              const storey = api.GetLine(modelID, storeyId);
              
              buildingData.children.push({
                id: storeyId,
                type: 'Storey',
                name: storey.Name?.value || `Storey ${l + 1}`,
                elevation: storey.Elevation?.value || 0
              });
            }
            
            // Sort storeys by elevation
            buildingData.children.sort((a, b) => (b.elevation || 0) - (a.elevation || 0));
            
            siteData.children.push(buildingData);
          }
          
          projectData.children.push(siteData);
        }
        
        structure.push(projectData);
      }
      
      setSpatialStructure(structure);
    } catch (error) {
      console.error('Error getting spatial structure:', error);
    }
  }, []);

  // Get categories
  const getCategories = useCallback(() => {
    const api = ifcApiRef.current;
    const modelID = modelIDRef.current;
    
    if (!api || modelID === null) return;

    try {
      const categoryData = [];
      
      // List of IFC types to check
      const typesToCheck = [
        { type: WebIFC.IFCWALL, name: 'Walls' },
        { type: WebIFC.IFCWALLSTANDARDCASE, name: 'Standard Walls' },
        { type: WebIFC.IFCWINDOW, name: 'Windows' },
        { type: WebIFC.IFCDOOR, name: 'Doors' },
        { type: WebIFC.IFCSLAB, name: 'Slabs' },
        { type: WebIFC.IFCROOF, name: 'Roofs' },
        { type: WebIFC.IFCCOLUMN, name: 'Columns' },
        { type: WebIFC.IFCBEAM, name: 'Beams' },
        { type: WebIFC.IFCSTAIR, name: 'Stairs' },
        { type: WebIFC.IFCRAILING, name: 'Railings' },
        { type: WebIFC.IFCFURNISHINGELEMENT, name: 'Furnishing' },
        { type: WebIFC.IFCCOVERING, name: 'Coverings' },
        { type: WebIFC.IFCPLATE, name: 'Plates' },
        { type: WebIFC.IFCMEMBER, name: 'Members' },
        { type: WebIFC.IFCCURTAINWALL, name: 'Curtain Walls' },
        { type: WebIFC.IFCSPACE, name: 'Spaces' },
        { type: WebIFC.IFCBUILDINGELEMENTPROXY, name: 'Building Elements' },
      ];

      for (const { type, name } of typesToCheck) {
        try {
          const elements = api.GetLineIDsWithType(modelID, type);
          const count = elements.size();
          if (count > 0) {
            const elementIds = [];
            for (let i = 0; i < count; i++) {
              elementIds.push(elements.get(i));
            }
            categoryData.push({
              type,
              name,
              count,
              elementIds
            });
          }
        } catch (e) {
          // Type not found in model
        }
      }
      
      // Sort by count
      categoryData.sort((a, b) => b.count - a.count);
      setCategories(categoryData);
    } catch (error) {
      console.error('Error getting categories:', error);
    }
  }, []);

  // Highlight selected element
  const highlightElement = useCallback((mesh, select = true) => {
    if (select) {
      // Store original material
      if (!originalMaterialsRef.current.has(mesh.uuid)) {
        originalMaterialsRef.current.set(mesh.uuid, mesh.material);
      }
      
      // Apply highlight material
      mesh.material = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
        emissive: 0x553300,
        emissiveIntensity: 0.3
      });
    } else {
      // Restore original material
      const originalMaterial = originalMaterialsRef.current.get(mesh.uuid);
      if (originalMaterial) {
        mesh.material.dispose();
        mesh.material = originalMaterial;
        originalMaterialsRef.current.delete(mesh.uuid);
      }
    }
  }, []);

  // Clear all highlights
  const clearHighlights = useCallback(() => {
    originalMaterialsRef.current.forEach((material, uuid) => {
      const mesh = sceneRef.current?.getObjectByProperty('uuid', uuid);
      if (mesh) {
        mesh.material.dispose();
        mesh.material = material;
      }
    });
    originalMaterialsRef.current.clear();
  }, []);

  // Handle element click
  const handleClick = useCallback(async (event) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    // Get all meshes
    const meshes = [];
    sceneRef.current.traverse((object) => {
      if (object.isMesh && meshToExpressIdRef.current.has(object.uuid)) {
        meshes.push(object);
      }
    });
    
    const intersects = raycasterRef.current.intersectObjects(meshes, false);
    
    // Clear previous selection
    clearHighlights();
    
    if (intersects.length > 0) {
      const mesh = intersects[0].object;
      const expressId = meshToExpressIdRef.current.get(mesh.uuid);
      
      if (expressId) {
        highlightElement(mesh, true);
        setSelectedElement({ expressId, mesh });
        
        // Get properties
        const props = await getElementProperties(expressId);
        setElementProperties(props);
        setActiveTab('properties');
      }
    } else {
      setSelectedElement(null);
      setElementProperties(null);
    }
  }, [clearHighlights, highlightElement, getElementProperties]);

  // Select element by expressId (from UI)
  const selectElementById = useCallback(async (expressId) => {
    clearHighlights();
    
    const meshUuid = expressIdToMeshRef.current.get(expressId);
    if (meshUuid) {
      const mesh = sceneRef.current?.getObjectByProperty('uuid', meshUuid);
      if (mesh) {
        highlightElement(mesh, true);
        setSelectedElement({ expressId, mesh });
        
        // Focus camera on element
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        controlsRef.current?.target.copy(center);
        controlsRef.current?.update();
      }
    }
    
    const props = await getElementProperties(expressId);
    setElementProperties(props);
    setActiveTab('properties');
  }, [clearHighlights, highlightElement, getElementProperties]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Reset disposed flag on mount
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
        
        // Set WASM path
        ifcApi.SetWasmPath('/wasm/');
        console.log('WASM path set to /wasm/');
        
        setLoadingProgress('Loading WASM module...');
        await ifcApi.Init();
        console.log('WebIFC initialized successfully');

        if (disposedRef.current) return;

        // Fetch the IFC file
        setLoadingProgress('Fetching IFC file...');
        console.log('Fetching /Project1.ifc...');
        
        const response = await fetch('/Project1.ifc');
        if (!response.ok) {
          throw new Error(`Failed to fetch IFC file: ${response.status} ${response.statusText}`);
        }
        
        const ifcData = await response.arrayBuffer();
        console.log(`IFC file fetched: ${ifcData.byteLength} bytes`);

        if (disposedRef.current) return;

        // Open the IFC model
        setLoadingProgress('Parsing IFC file...');
        console.log('Opening IFC model...');
        
        const modelID = ifcApi.OpenModel(new Uint8Array(ifcData));
        modelIDRef.current = modelID;
        console.log(`IFC model opened with ID: ${modelID}`);

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
        console.log('Model added to scene');

        // Fit camera to model
        fitCameraToModel(modelGroup, camera, controls);

        // NOTE: We keep the model open so we can query properties
        // Don't close: ifcApi.CloseModel(modelID);

        setModelLoaded(true);
        setIsLoading(false);
        console.log('IFC loading complete!');

        // Animation loop
        const animate = () => {
          if (disposedRef.current) return;
          animationId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

      } catch (error) {
        console.error('Error initializing IFC viewer:', error);
        setLoadError(error.message || 'Failed to initialize viewer');
        setIsLoading(false);
      }
    };

    // Create Three.js geometry from IFC data
    const createThreeGeometry = async (api, modelID) => {
      const group = new THREE.Group();
      
      // Get all flat meshes from the model
      api.StreamAllMeshes(modelID, (mesh) => {
        const expressId = mesh.expressID;
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

          // Create Three.js BufferGeometry
          const bufferGeometry = new THREE.BufferGeometry();
          
          // Vertices are in format: x, y, z, nx, ny, nz (6 floats per vertex)
          const positionArray = new Float32Array(verts.length / 2);
          const normalArray = new Float32Array(verts.length / 2);
          
          for (let j = 0; j < verts.length; j += 6) {
            const idx = j / 6 * 3;
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

          // Get color from placed geometry
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
          
          // Store expressId mapping for raycasting
          meshToExpressIdRef.current.set(threeMesh.uuid, expressId);
          expressIdToMeshRef.current.set(expressId, threeMesh.uuid);
          
          // Apply transformation matrix
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

        console.log('Model bounds:', { center, size });

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 0.8;

        const direction = new THREE.Vector3(1, 0.5, 1).normalize();
        
        camera.position.copy(center).add(direction.multiplyScalar(cameraDistance));
        controls.target.copy(center);
        controls.update();

        // Adjust near/far planes
        camera.near = Math.max(0.1, cameraDistance / 100);
        camera.far = cameraDistance * 100;
        camera.updateProjectionMatrix();

      } catch (error) {
        console.error('Error fitting camera to model:', error);
      }
    };

    init();

    // Cleanup function
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
        if (rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
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
      // Close IFC model
      if (ifcApiRef.current && modelIDRef.current !== null) {
        try {
          ifcApiRef.current.CloseModel(modelIDRef.current);
        } catch (e) {
          console.log('Model already closed');
        }
      }
      // Clear mappings
      meshToExpressIdRef.current.clear();
      expressIdToMeshRef.current.clear();
      originalMaterialsRef.current.clear();
    };
  }, []);

  // Load model info when model is loaded
  useEffect(() => {
    if (modelLoaded) {
      getSpatialStructure();
      getCategories();
    }
  }, [modelLoaded, getSpatialStructure, getCategories]);

  // Add click handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !modelLoaded) return;
    
    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [modelLoaded, handleClick]);

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

  // Render spatial structure tree
  const renderStructureTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: level * 16 }}>
        <div
          style={styles.treeItem}
          onClick={() => selectElementById(node.id)}
        >
          <span style={styles.treeIcon}>
            {node.type === 'Project' && '📁'}
            {node.type === 'Site' && '🌍'}
            {node.type === 'Building' && '🏢'}
            {node.type === 'Storey' && '📐'}
          </span>
          <span>{node.name}</span>
          {node.elevation !== undefined && (
            <span style={styles.elevation}> ({node.elevation.toFixed(2)}m)</span>
          )}
        </div>
        {node.children && renderStructureTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <div style={styles.container}>
      {/* 3D Viewer Container */}
      <div ref={containerRef} style={styles.canvas} />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading IFC Model...</p>
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

      {/* Model Information Panel */}
      {modelLoaded && !isLoading && (
        <>
          {/* Toggle Button */}
          <button
            style={styles.toggleButton}
            onClick={() => setShowInfoPanel(!showInfoPanel)}
          >
            {showInfoPanel ? '✕' : 'ℹ️'}
          </button>

          {showInfoPanel && (
            <div style={styles.infoPanel}>
              <h3 style={styles.panelTitle}>Model Information</h3>
              
              {/* Tabs */}
              <div style={styles.tabs}>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'properties' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('properties')}
                >
                  Properties
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'structure' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('structure')}
                >
                  Structure
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'categories' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('categories')}
                >
                  Categories
                </button>
              </div>

              <div style={styles.tabContent}>
                {/* Properties Tab */}
                {activeTab === 'properties' && (
                  <div>
                    {!selectedElement && (
                      <p style={styles.hint}>
                        💡 Click on any element in the 3D view to see its properties
                      </p>
                    )}
                    
                    {elementProperties && (
                      <div>
                        {/* Basic Info */}
                        <div style={styles.section}>
                          <h4 style={styles.sectionTitle}>Basic Information</h4>
                          <div style={styles.propertyGrid}>
                            <div style={styles.propertyRow}>
                              <span style={styles.propertyLabel}>Type:</span>
                              <span style={styles.propertyValue}>{elementProperties.type}</span>
                            </div>
                            <div style={styles.propertyRow}>
                              <span style={styles.propertyLabel}>Name:</span>
                              <span style={styles.propertyValue}>{elementProperties.name}</span>
                            </div>
                            {elementProperties.description && (
                              <div style={styles.propertyRow}>
                                <span style={styles.propertyLabel}>Description:</span>
                                <span style={styles.propertyValue}>{elementProperties.description}</span>
                              </div>
                            )}
                            {elementProperties.objectType && (
                              <div style={styles.propertyRow}>
                                <span style={styles.propertyLabel}>Object Type:</span>
                                <span style={styles.propertyValue}>{elementProperties.objectType}</span>
                              </div>
                            )}
                            <div style={styles.propertyRow}>
                              <span style={styles.propertyLabel}>Express ID:</span>
                              <span style={styles.propertyValue}>{elementProperties.expressId}</span>
                            </div>
                            {elementProperties.globalId && (
                              <div style={styles.propertyRow}>
                                <span style={styles.propertyLabel}>Global ID:</span>
                                <span style={styles.propertyValue} title={elementProperties.globalId}>
                                  {elementProperties.globalId.substring(0, 22)}...
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Property Sets */}
                        {elementProperties.propertySets?.length > 0 && (
                          <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>Property Sets</h4>
                            {elementProperties.propertySets.map((pset, idx) => (
                              <div key={idx} style={styles.psetContainer}>
                                <h5 style={styles.psetTitle}>{pset.name}</h5>
                                <div style={styles.propertyGrid}>
                                  {Object.entries(pset.properties).map(([key, value]) => (
                                    <div key={key} style={styles.propertyRow}>
                                      <span style={styles.propertyLabel}>{key}:</span>
                                      <span style={styles.propertyValue}>
                                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Materials */}
                        {elementProperties.materials?.length > 0 && (
                          <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>Materials</h4>
                            {elementProperties.materials.map((mat, idx) => (
                              <div key={idx} style={styles.propertyRow}>
                                <span style={styles.propertyLabel}>{mat.name}</span>
                                {mat.thickness && (
                                  <span style={styles.propertyValue}>
                                    Thickness: {mat.thickness}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Structure Tab */}
                {activeTab === 'structure' && (
                  <div style={styles.treeContainer}>
                    {spatialStructure && renderStructureTree(spatialStructure)}
                  </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                  <div>
                    <p style={styles.hint}>
                      Element categories in the model
                    </p>
                    {categories.map((cat) => (
                      <div
                        key={cat.type}
                        style={styles.categoryItem}
                      >
                        <span style={styles.categoryName}>{cat.name}</span>
                        <span style={styles.categoryCount}>{cat.count}</span>
                      </div>
                    ))}
                    
                    {categories.length === 0 && (
                      <p style={styles.hint}>No categories found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Status Info */}
      {modelLoaded && !isLoading && (
        <div style={styles.statusInfo}>
          ✓ Project1.ifc loaded
          {selectedElement && (
            <span> | Selected: #{selectedElement.expressId}</span>
          )}
        </div>
      )}

      {/* Controls Info */}
      <div style={styles.controlsInfo}>
        <p>🖱️ Left-click + drag: Rotate</p>
        <p>🖱️ Right-click + drag: Pan</p>
        <p>🖱️ Scroll: Zoom</p>
        <p>🖱️ Click element: Select</p>
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
    borderTop: '4px solid #007AFF',
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
    backgroundColor: '#007AFF',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statusInfo: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#00ff00',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  controlsInfo: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  // Info Panel Styles
  toggleButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPanel: {
    position: 'absolute',
    top: '20px',
    right: '70px',
    width: '350px',
    maxHeight: 'calc(100vh - 100px)',
    backgroundColor: 'rgba(30, 40, 50, 0.95)',
    borderRadius: '12px',
    color: '#ffffff',
    zIndex: 15,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  panelTitle: {
    margin: 0,
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    padding: '12px 8px',
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#007AFF',
    borderBottom: '2px solid #007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  tabContent: {
    padding: '16px',
    overflowY: 'auto',
    flex: 1,
    maxHeight: 'calc(100vh - 220px)',
  },
  hint: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    margin: '0 0 12px 0',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#007AFF',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  propertyGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  propertyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontSize: '12px',
    padding: '4px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  propertyLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    flex: '0 0 40%',
  },
  propertyValue: {
    color: '#ffffff',
    textAlign: 'right',
    flex: '0 0 55%',
    wordBreak: 'break-word',
  },
  psetContainer: {
    marginBottom: '12px',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
  },
  psetTitle: {
    fontSize: '12px',
    fontWeight: '500',
    margin: '0 0 8px 0',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  treeContainer: {
    fontSize: '13px',
  },
  treeItem: {
    padding: '6px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
  treeIcon: {
    fontSize: '14px',
  },
  elevation: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    marginBottom: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  categoryName: {
    fontSize: '13px',
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: '12px',
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
    color: '#007AFF',
    padding: '2px 8px',
    borderRadius: '10px',
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
  `;
  document.head.appendChild(styleSheet);
}

export default IFCViewer;
