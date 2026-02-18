import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as WebIFC from 'web-ifc';
import { Grid, Scissors, Trash2, Eye, EyeOff, Move, Maximize2, Minimize2 } from 'lucide-react';

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
  const gridRef = useRef(null);
  const modelBaseYRef = useRef(0); // Store the model's base Y position
  const modelCenterRef = useRef(new THREE.Vector3()); // Store the model's center position
  const modelSizeRef = useRef(new THREE.Vector3()); // Store the model's size
  const planeHelpersRef = useRef([]); // Store plane helper visualizations
  const dragPlaneRef = useRef(null); // The clipping plane being dragged
  const dragStartPointRef = useRef(null); // Starting point of drag
  const isDraggingPlaneRef = useRef(false); // Whether we're currently dragging a plane

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
  
  // Grid settings state
  const [gridVisible, setGridVisible] = useState(true);
  const [gridElevation, setGridElevation] = useState(0);
  
  // Clipping plane state
  const [clippingEnabled, setClippingEnabled] = useState(true);
  const [clippingPlanes, setClippingPlanes] = useState([]); // Array of {id, plane, enabled, position, normal}
  const [clipperMode, setClipperMode] = useState(false); // Whether double-click creates clipping planes
  const [selectedClipPlane, setSelectedClipPlane] = useState(null); // Currently selected plane for dragging
  const [isDraggingClipPlane, setIsDraggingClipPlane] = useState(false); // UI state for dragging
  const [isHoveringClipPlane, setIsHoveringClipPlane] = useState(false); // Cursor state for hovering
  
  // Maximize state
  const [isMaximized, setIsMaximized] = useState(false);

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
        renderer.localClippingEnabled = true; // Enable clipping planes support
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

        // Add Grid Helper - A plane grid that the IFC model sits on
        // Make it large enough to be visible with big models
        const gridSize = 1000; // Large grid size
        const gridDivisions = 100; // Creates 10m spacing for visibility
        const gridHelper = new THREE.GridHelper(
          gridSize, 
          gridDivisions, 
          new THREE.Color(0x666666), // Center line color (brighter)
          new THREE.Color(0x444444)  // Grid line color
        );
        gridHelper.position.y = 0; // Grid at y=0 level initially
        gridHelper.material.opacity = 0.8;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
        gridRef.current = gridHelper;

        // Add Axes Helper (larger for visibility)
        const axesHelper = new THREE.AxesHelper(50);
        scene.add(axesHelper);

        if (disposedRef.current) return;

        // Initialize web-ifc
        setLoadingProgress('Initializing WebIFC...');
        console.log('Initializing WebIFC...');
        
        const ifcApi = new WebIFC.IfcAPI();
        ifcApiRef.current = ifcApi;
        
        // Set WASM path using jsdelivr CDN with explicit absolute path
        ifcApi.SetWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.75/', true);
        console.log('WASM path set to CDN: https://cdn.jsdelivr.net/npm/web-ifc@0.0.75/');
        
        setLoadingProgress('Loading WASM module...');
        // Initialize web-ifc
        await ifcApi.Init();
        console.log('WebIFC initialized successfully');

        if (disposedRef.current) return;

        // Fetch the IFC file
        setLoadingProgress('Fetching IFC file...');
        
        // Use base path for GitHub Pages deployment
        const basePath = import.meta.env.BASE_URL || '/';
        console.log('Fetching IFC file with basePath:', basePath);
        
        let response = await fetch(`${basePath}Hochvolthaus.ifc`);
        if (!response.ok) {
          console.log('Hochvolthaus.ifc not found, trying Project1.ifc...');
          response = await fetch(`${basePath}Project1.ifc`);
        }
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
        console.log('Model min Y:', boundingBox.min.y, 'max Y:', boundingBox.max.y);

        // Store the model's base Y position for grid elevation reference
        modelBaseYRef.current = boundingBox.min.y;
        // Store model center and size for Views navigation
        modelCenterRef.current.copy(center);
        modelSizeRef.current.copy(size);

        // Position the grid at the bottom of the model and center it horizontally
        if (gridRef.current) {
          gridRef.current.position.set(center.x, boundingBox.min.y, center.z);
          console.log('Grid positioned at:', gridRef.current.position);
        }

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

  // Handle resize when maximized state changes
  useEffect(() => {
    if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
    
    // Small delay to allow CSS transition to complete
    const timer = setTimeout(() => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [isMaximized]);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);

  // Update grid visibility
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = gridVisible;
    }
  }, [gridVisible]);

  // Update grid elevation (move grid to different storey level)
  // gridElevation is relative to the model's base (ground floor)
  useEffect(() => {
    if (gridRef.current) {
      // Add the elevation offset to the model's base Y position
      const newY = modelBaseYRef.current + gridElevation;
      gridRef.current.position.y = newY;
      console.log('Grid elevation updated to:', newY, '(base:', modelBaseYRef.current, '+ offset:', gridElevation, ')');
    }
  }, [gridElevation]);

  // Update renderer clipping planes when clipping state changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const activePlanes = clippingPlanes
      .filter(cp => cp.enabled && clippingEnabled)
      .map(cp => cp.plane);
    
    // Apply clipping planes to all materials in the scene
    sceneRef.current.traverse((object) => {
      if (object.isMesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => {
          material.clippingPlanes = activePlanes.length > 0 ? activePlanes : null;
          material.clipShadows = true;
          material.needsUpdate = true;
        });
      }
    });
    
    // Update plane helper visibility
    planeHelpersRef.current.forEach(helper => {
      const clipPlane = clippingPlanes.find(cp => cp.id === helper.userData.clipId);
      if (clipPlane) {
        helper.visible = clipPlane.enabled && clippingEnabled;
      }
    });
  }, [clippingPlanes, clippingEnabled]);

  // Create a new clipping plane at intersection point
  const createClippingPlane = useCallback((point, normal) => {
    // Use the face normal directly - it points outward from the clicked surface
    // We'll use this for visualization, but invert it for the actual clipping plane
    // so it doesn't cut anything initially
    const clippingNormal = normal.clone().negate(); // Inverted for clipping (points INTO model)
    
    const plane = new THREE.Plane();
    plane.setFromNormalAndCoplanarPoint(clippingNormal, point);
    
    const id = Date.now();
    const newClippingPlane = {
      id,
      plane,
      enabled: true,
      position: point.clone(),
      normal: clippingNormal.clone(),
    };

    // Create a visual helper group for the clipping plane
    const helperGroup = new THREE.Group();
    helperGroup.userData.clipId = id;
    helperGroup.userData.isHelper = true;
    helperGroup.userData.normal = clippingNormal.clone();
    
    // Arrow parameters
    const arrowLength = 12;
    const arrowHeadLength = 4.5;
    const arrowHeadRadius = 2.2;
    
    // Create arrow using Three.js ArrowHelper for simplicity and reliability
    // Red arrow - points in clipping normal direction (INTO the model, cutting direction)
    const redArrowDir = clippingNormal.clone().normalize();
    const redArrow = new THREE.ArrowHelper(
      redArrowDir,
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      0xff0000, // Red
      arrowHeadLength,
      arrowHeadRadius
    );
    redArrow.userData.clipId = id;
    redArrow.userData.isHelper = true;
    redArrow.userData.isArrow = true;
    redArrow.userData.isDraggable = true;
    redArrow.userData.arrowDirection = 1;
    redArrow.renderOrder = 999; // Render on top
    redArrow.traverse((child) => {
      child.userData.clipId = id;
      child.userData.isHelper = true;
      child.userData.isArrow = true;
      child.userData.isDraggable = true;
      child.userData.arrowDirection = 1;
      child.renderOrder = 999;
      if (child.material) {
        child.material.side = THREE.DoubleSide;
        child.material.depthTest = false; // Always render on top
        child.material.depthWrite = false;
        child.material.transparent = true;
        child.material.clippingPlanes = null;
      }
    });
    
    // Blue arrow - points OPPOSITE to clipping normal (OUT of model)
    // Use the original face normal directly (not inverted)
    const blueArrowDir = normal.clone().normalize();
    const blueArrow = new THREE.ArrowHelper(
      blueArrowDir,
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      0x0066ff, // Blue
      arrowHeadLength,
      arrowHeadRadius
    );
    blueArrow.userData.clipId = id;
    blueArrow.userData.isHelper = true;
    blueArrow.userData.isArrow = true;
    blueArrow.userData.isDraggable = true;
    blueArrow.userData.arrowDirection = -1;
    blueArrow.renderOrder = 999; // Render on top
    // Fix visibility - always render on top
    blueArrow.traverse((child) => {
      child.userData.clipId = id;
      child.userData.isHelper = true;
      child.userData.isArrow = true;
      child.userData.isDraggable = true;
      child.userData.arrowDirection = -1;
      child.renderOrder = 999;
      if (child.material) {
        child.material.side = THREE.DoubleSide;
        child.material.depthTest = false; // Always render on top
        child.material.depthWrite = false;
        child.material.transparent = true;
        child.material.clippingPlanes = null;
      }
    });
    
    // Create a ring/circle to show the clipping plane position
    const ringGeometry = new THREE.RingGeometry(3, 4, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthTest: false, // Always render on top
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.renderOrder = 999;
    ringMesh.userData.clipId = id;
    ringMesh.userData.isHelper = true;
    
    // Orient the ring to be perpendicular to the normal
    ringMesh.lookAt(clippingNormal);
    
    helperGroup.add(redArrow);
    helperGroup.add(blueArrow);
    helperGroup.add(ringMesh);
    
    // Position the helper at the click point
    helperGroup.position.copy(point);
    
    // Store reference to the plane for updating
    helperGroup.userData.plane = plane;
    
    if (sceneRef.current) {
      sceneRef.current.add(helperGroup);
    }
    planeHelpersRef.current.push(helperGroup);

    setClippingPlanes(prev => [...prev, newClippingPlane]);
    console.log('Created clipping plane at:', point, 'with normal:', clippingNormal);
  }, []);

  // Toggle a specific clipping plane
  const toggleClippingPlane = useCallback((id) => {
    setClippingPlanes(prev => prev.map(cp => 
      cp.id === id ? { ...cp, enabled: !cp.enabled } : cp
    ));
    
    // Update helper visibility
    const helper = planeHelpersRef.current.find(h => h.userData.clipId === id);
    if (helper) {
      helper.visible = !helper.visible;
    }
  }, []);

  // Remove a specific clipping plane
  const removeClippingPlane = useCallback((id) => {
    setClippingPlanes(prev => prev.filter(cp => cp.id !== id));
    if (selectedClipPlane === id) {
      setSelectedClipPlane(null);
    }
    
    // Remove helper from scene
    const helperIndex = planeHelpersRef.current.findIndex(h => h.userData.clipId === id);
    if (helperIndex !== -1) {
      const helper = planeHelpersRef.current[helperIndex];
      if (sceneRef.current) {
        sceneRef.current.remove(helper);
      }
      // Dispose all children (mesh, lines, etc.)
      helper.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      planeHelpersRef.current.splice(helperIndex, 1);
    }
  }, []);

  // Remove all clipping planes
  const removeAllClippingPlanes = useCallback(() => {
    setClippingPlanes([]);
    setSelectedClipPlane(null);
    
    // Remove all helpers from scene
    planeHelpersRef.current.forEach(helper => {
      if (sceneRef.current) {
        sceneRef.current.remove(helper);
      }
      // Dispose all children
      helper.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });
    planeHelpersRef.current = [];
  }, []);

  // Move a clipping plane along its normal by a distance
  const moveClippingPlane = useCallback((id, distance) => {
    setClippingPlanes(prev => prev.map(cp => {
      if (cp.id !== id) return cp;
      
      // Move the position along the normal
      const newPosition = cp.position.clone().addScaledVector(cp.normal, distance);
      
      // Create a new plane at the new position
      const newPlane = new THREE.Plane();
      newPlane.setFromNormalAndCoplanarPoint(cp.normal, newPosition);
      
      // Update the helper position (it's now a Group)
      const helper = planeHelpersRef.current.find(h => h.userData.clipId === id);
      if (helper) {
        helper.position.copy(newPosition);
        helper.userData.plane = newPlane;
      }
      
      return {
        ...cp,
        plane: newPlane,
        position: newPosition,
      };
    }));
  }, []);

  // Handle mouse down on arrow for dragging
  const handlePlaneMouseDown = useCallback((event) => {
    if (!clipperMode || !containerRef.current || !cameraRef.current || !sceneRef.current) return;
    if (clippingPlanes.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    
    // Check if we're clicking on a draggable arrow
    const helpers = planeHelpersRef.current.filter(h => h.visible);
    const intersects = raycasterRef.current.intersectObjects(helpers, true);
    
    if (intersects.length > 0) {
      // Check if we clicked on the arrow (draggable part)
      const clickedObject = intersects[0].object;
      
      // Only start dragging if we clicked on the arrow
      if (!clickedObject.userData.isDraggable && !clickedObject.userData.isArrow) {
        return;
      }
      
      // Find the parent helper group with clipId
      let helperGroup = clickedObject;
      while (helperGroup && !helperGroup.userData.clipId) {
        helperGroup = helperGroup.parent;
      }
      
      if (helperGroup && helperGroup.userData.clipId) {
        const clipPlane = clippingPlanes.find(cp => cp.id === helperGroup.userData.clipId);
        if (clipPlane) {
          event.stopPropagation();
          event.preventDefault();
          isDraggingPlaneRef.current = true;
          dragPlaneRef.current = clipPlane;
          dragStartPointRef.current = intersects[0].point.clone();
          setSelectedClipPlane(clipPlane.id);
          setIsDraggingClipPlane(true);
          
          // Disable orbit controls while dragging
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
        }
      }
    }
  }, [clipperMode, clippingPlanes]);

  // Handle mouse move for dragging plane
  const handlePlaneMouseMove = useCallback((event) => {
    if (!isDraggingPlaneRef.current || !dragPlaneRef.current || !containerRef.current || !cameraRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Create a plane perpendicular to camera for mouse tracking
    const cameraDirection = new THREE.Vector3();
    cameraRef.current.getWorldDirection(cameraDirection);
    
    const trackingPlane = new THREE.Plane();
    trackingPlane.setFromNormalAndCoplanarPoint(cameraDirection, dragStartPointRef.current);
    
    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    
    const currentPoint = new THREE.Vector3();
    raycasterRef.current.ray.intersectPlane(trackingPlane, currentPoint);
    
    if (currentPoint) {
      // Calculate movement along the clipping plane's normal
      const movement = currentPoint.clone().sub(dragStartPointRef.current);
      const distance = movement.dot(dragPlaneRef.current.normal);
      
      if (Math.abs(distance) > 0.01) {
        moveClippingPlane(dragPlaneRef.current.id, distance);
        dragStartPointRef.current = currentPoint.clone();
        
        // Update the dragPlaneRef to the updated plane
        const updatedPlane = clippingPlanes.find(cp => cp.id === dragPlaneRef.current.id);
        if (updatedPlane) {
          dragPlaneRef.current = updatedPlane;
        }
      }
    }
  }, [clippingPlanes, moveClippingPlane]);

  // Handle mouse up to stop dragging
  const handlePlaneMouseUp = useCallback(() => {
    if (isDraggingPlaneRef.current) {
      isDraggingPlaneRef.current = false;
      dragPlaneRef.current = null;
      dragStartPointRef.current = null;
      setIsDraggingClipPlane(false);
      
      // Re-enable orbit controls
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
    }
  }, []);

  // Add drag event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !modelLoaded) return;

    // Hover detection for arrow handles
    const handleMouseMoveForHover = (event) => {
      if (!clipperMode || isDraggingPlaneRef.current || planeHelpersRef.current.length === 0) {
        if (isHoveringClipPlane) setIsHoveringClipPlane(false);
        return;
      }
      
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
      const helpers = planeHelpersRef.current.filter(h => h.visible);
      const intersects = raycasterRef.current.intersectObjects(helpers, true);
      
      // Only show grab cursor when hovering over the arrow (draggable part)
      let isOverArrow = false;
      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        isOverArrow = hoveredObject.userData.isDraggable || hoveredObject.userData.isArrow;
      }
      
      setIsHoveringClipPlane(isOverArrow);
    };

    container.addEventListener('mousedown', handlePlaneMouseDown);
    container.addEventListener('mousemove', handleMouseMoveForHover);
    window.addEventListener('mousemove', handlePlaneMouseMove);
    window.addEventListener('mouseup', handlePlaneMouseUp);
    
    return () => {
      container.removeEventListener('mousedown', handlePlaneMouseDown);
      container.removeEventListener('mousemove', handleMouseMoveForHover);
      window.removeEventListener('mousemove', handlePlaneMouseMove);
      window.removeEventListener('mouseup', handlePlaneMouseUp);
    };
  }, [modelLoaded, clipperMode, isHoveringClipPlane, handlePlaneMouseDown, handlePlaneMouseMove, handlePlaneMouseUp]);

  // Handle double-click for creating clipping planes
  const handleDoubleClick = useCallback((event) => {
    if (!clipperMode || !containerRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
    
    // Get all meshes from the scene (excluding helpers, grid, etc.)
    const meshes = [];
    sceneRef.current.traverse((object) => {
      if (object.isMesh && !object.userData.isHelper && object.name !== 'InfiniteGrid') {
        meshes.push(object);
      }
    });

    const intersects = raycasterRef.current.intersectObjects(meshes, true);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const point = intersection.point.clone();
      
      // Use the face normal to align the clipping plane with the surface
      const faceNormal = intersection.face.normal.clone();
      
      // Transform normal from local to world space
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersection.object.matrixWorld);
      faceNormal.applyMatrix3(normalMatrix).normalize();
      
      // The clipping plane cuts everything on the positive side of the normal
      // So we use the face normal (pointing outward from the surface)
      createClippingPlane(point, faceNormal);
    }
  }, [clipperMode, createClippingPlane]);

  // Add double-click event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !modelLoaded) return;

    container.addEventListener('dblclick', handleDoubleClick);
    return () => container.removeEventListener('dblclick', handleDoubleClick);
  }, [modelLoaded, handleDoubleClick]);

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
    <div style={{
      ...styles.container,
      ...(isMaximized ? styles.containerMaximized : {}),
      cursor: isDraggingClipPlane ? 'grabbing' : (isHoveringClipPlane ? 'grab' : 'default')
    }}>
      {/* Maximize/Minimize Button */}
      <button
        style={styles.maximizeButton}
        onClick={() => setIsMaximized(!isMaximized)}
        title={isMaximized ? 'Exit Fullscreen' : 'Fullscreen'}
      >
        {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

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
            {showInfoPanel ? '✕' : 'Layers'}
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
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'grid' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('grid')}
                >
                  Grid
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'clipper' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('clipper')}
                >
                  Clipper
                </button>
                <button
                  style={{
                    ...styles.tab,
                    ...(activeTab === 'views' ? styles.activeTab : {})
                  }}
                  onClick={() => setActiveTab('views')}
                >
                  Views
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

                {/* Grid Tab */}
                {activeTab === 'grid' && (
                  <div style={styles.gridSettingsContainer}>
                    <p style={styles.hint}>
                      <Grid size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Control the reference grid plane
                    </p>
                    
                    {/* Grid Visibility Toggle */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridToggleLabel}>
                        <input
                          type="checkbox"
                          checked={gridVisible}
                          onChange={(e) => setGridVisible(e.target.checked)}
                          style={styles.gridCheckbox}
                        />
                        <span>Show Grid Plane</span>
                      </label>
                      <p style={styles.gridDescription}>
                        The grid provides a reference plane for the IFC model positioning
                      </p>
                    </div>

                    {/* Grid Elevation Slider */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridSliderLabel}>
                        Grid Elevation: {gridElevation.toFixed(1)}m
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="50"
                        step="0.5"
                        value={gridElevation}
                        onChange={(e) => setGridElevation(parseFloat(e.target.value))}
                        style={styles.gridSlider}
                      />
                      <div style={styles.gridSliderLabels}>
                        <span>-20m</span>
                        <span>0m</span>
                        <span>50m</span>
                      </div>
                      <p style={styles.gridDescription}>
                        Move the grid to different floor levels to check model alignment
                      </p>
                    </div>

                    {/* Quick Level Buttons */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridSliderLabel}>Quick Levels</label>
                      <div style={styles.quickLevelButtons}>
                        <button
                          style={styles.quickLevelBtn}
                          onClick={() => setGridElevation(0)}
                        >
                          Ground (0m)
                        </button>
                        <button
                          style={styles.quickLevelBtn}
                          onClick={() => setGridElevation(3)}
                        >
                          Level 1 (3m)
                        </button>
                        <button
                          style={styles.quickLevelBtn}
                          onClick={() => setGridElevation(6)}
                        >
                          Level 2 (6m)
                        </button>
                        <button
                          style={styles.quickLevelBtn}
                          onClick={() => setGridElevation(9)}
                        >
                          Level 3 (9m)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Clipper Tab */}
                {activeTab === 'clipper' && (
                  <div style={styles.gridSettingsContainer}>
                    <p style={styles.hint}>
                      <Scissors size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                      Create clipping planes to section the model
                    </p>
                    
                    {/* Clipper Mode Toggle */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridToggleLabel}>
                        <input
                          type="checkbox"
                          checked={clipperMode}
                          onChange={(e) => setClipperMode(e.target.checked)}
                          style={styles.gridCheckbox}
                        />
                        <span>Enable Clipper Mode</span>
                      </label>
                      <p style={styles.gridDescription}>
                        {clipperMode 
                          ? '✓ Double-click to create. Drag red arrow (cut more) or blue arrow (cut less).' 
                          : 'Enable to create clipping planes by double-clicking'}
                      </p>
                    </div>

                    {/* Global Clipping Toggle */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridToggleLabel}>
                        <input
                          type="checkbox"
                          checked={clippingEnabled}
                          onChange={(e) => setClippingEnabled(e.target.checked)}
                          style={styles.gridCheckbox}
                        />
                        <span>Enable Clipping</span>
                      </label>
                      <p style={styles.gridDescription}>
                        Toggle all clipping planes on/off
                      </p>
                    </div>

                    {/* Clipping Planes List */}
                    <div style={styles.gridControlSection}>
                      <div style={styles.clipperHeader}>
                        <label style={styles.gridSliderLabel}>
                          Clipping Planes ({clippingPlanes.length})
                        </label>
                        {clippingPlanes.length > 0 && (
                          <button
                            style={styles.clipperRemoveAllBtn}
                            onClick={removeAllClippingPlanes}
                          >
                            <Trash2 size={14} /> Clear All
                          </button>
                        )}
                      </div>
                      
                      {clippingPlanes.length === 0 ? (
                        <p style={styles.gridDescription}>
                          No clipping planes yet. Enable Clipper Mode and double-click on a surface. Drag the red or blue arrows to adjust the cut.
                        </p>
                      ) : (
                        <div style={styles.clipperPlanesList}>
                          {clippingPlanes.map((cp, index) => (
                            <div 
                              key={cp.id} 
                              style={{
                                ...styles.clipperPlaneItem,
                                ...(selectedClipPlane === cp.id ? styles.clipperPlaneItemSelected : {})
                              }}
                            >
                              <div style={styles.clipperPlaneInfo}>
                                <div style={styles.clipperPlaneNameRow}>
                                  <Move size={14} style={{ opacity: 0.5, marginRight: '6px' }} />
                                  <span style={styles.clipperPlaneName}>Plane {index + 1}</span>
                                </div>
                                <span style={styles.clipperPlanePos}>
                                  ({cp.position.x.toFixed(1)}, {cp.position.y.toFixed(1)}, {cp.position.z.toFixed(1)})
                                </span>
                              </div>
                              <div style={styles.clipperPlaneActions}>
                                <button
                                  style={{
                                    ...styles.clipperActionBtn,
                                    ...(cp.enabled ? {} : styles.clipperDisabledBtn)
                                  }}
                                  onClick={() => toggleClippingPlane(cp.id)}
                                  title={cp.enabled ? 'Disable plane' : 'Enable plane'}
                                >
                                  {cp.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <button
                                  style={{...styles.clipperActionBtn, ...styles.clipperDeleteBtn}}
                                  onClick={() => removeClippingPlane(cp.id)}
                                  title="Remove plane"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Views Tab */}
                {activeTab === 'views' && (
                  <div style={styles.gridSettingsContainer}>
                    <p style={styles.hint}>
                      🏢 Navigate to different floor views
                    </p>
                    
                    {/* Clear Floor Clip Button */}
                    {clippingPlanes.some(cp => cp.isFloorClip) && (
                      <div style={styles.gridControlSection}>
                        <button
                          style={styles.clearFloorClipBtn}
                          onClick={() => {
                            // Remove all floor clip planes
                            const floorClips = clippingPlanes.filter(cp => cp.isFloorClip);
                            floorClips.forEach(cp => removeClippingPlane(cp.id));
                            
                            // Reset to isometric view
                            if (cameraRef.current && controlsRef.current) {
                              const center = modelCenterRef.current;
                              const maxDim = Math.max(modelSizeRef.current.x, modelSizeRef.current.y, modelSizeRef.current.z);
                              const distance = maxDim * 1.2;
                              controlsRef.current.target.copy(center);
                              cameraRef.current.position.set(
                                center.x + distance,
                                center.y + distance * 0.7,
                                center.z + distance
                              );
                              controlsRef.current.update();
                            }
                          }}
                        >
                          ✕ Clear Floor Section &amp; Show Full Model
                        </button>
                      </div>
                    )}
                    
                    {/* Floor Plans List */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridSliderLabel}>Floor Plans</label>
                      <div style={styles.floorPlansList}>
                        {(() => {
                          // Extract all storeys from the spatial structure
                          const floors = [];
                          if (spatialStructure && spatialStructure.length > 0) {
                            spatialStructure.forEach((project) => {
                              project.children?.forEach((site) => {
                                site.children?.forEach((building) => {
                                  building.children?.forEach((storey) => {
                                    floors.push(storey);
                                  });
                                });
                              });
                            });
                          }
                          
                          console.log('Floors found:', floors.length, floors);
                          
                          // If no floors found in IFC, create default floors based on model height
                          if (floors.length === 0 && modelSizeRef.current.y > 0) {
                            const modelHeight = modelSizeRef.current.y;
                            const floorHeight = 3; // Assume 3m per floor
                            const numFloors = Math.max(1, Math.ceil(modelHeight / floorHeight));
                            
                            for (let i = 0; i < numFloors; i++) {
                              floors.push({
                                id: `default-floor-${i}`,
                                name: i === 0 ? 'Ground Floor' : `Floor ${i}`,
                                elevation: i * floorHeight,
                                type: 'Storey'
                              });
                            }
                          }
                          
                          if (floors.length === 0) {
                            return (
                              <p style={styles.gridDescription}>
                                No floor information available. Load a model first.
                              </p>
                            );
                          }
                          
                          // Sort floors by elevation (highest first)
                          floors.sort((a, b) => (b.elevation || 0) - (a.elevation || 0));
                          
                          return floors.map((storey, index) => (
                            <button
                              key={storey.id}
                              style={styles.floorPlanBtn}
                              onClick={() => {
                                const elevation = storey.elevation || 0;
                                console.log('Navigating to floor:', storey.name, 'elevation:', elevation);
                                
                                // Calculate the actual Y position for the clipping plane
                                const clipY = modelBaseYRef.current + elevation + 2.5; // Slightly above floor level
                                
                                // Remove existing floor view clipping planes
                                const existingFloorClips = clippingPlanes.filter(cp => cp.isFloorClip);
                                existingFloorClips.forEach(cp => removeClippingPlane(cp.id));
                                
                                // Create a horizontal clipping plane pointing down (clips everything above)
                                const planeNormal = new THREE.Vector3(0, -1, 0); // Points down
                                const planePoint = new THREE.Vector3(modelCenterRef.current.x, clipY, modelCenterRef.current.z);
                                
                                const plane = new THREE.Plane();
                                plane.setFromNormalAndCoplanarPoint(planeNormal, planePoint);
                                
                                const id = Date.now();
                                const newClippingPlane = {
                                  id,
                                  plane,
                                  enabled: true,
                                  position: planePoint.clone(),
                                  normal: planeNormal.clone(),
                                  isFloorClip: true, // Mark as floor clip for easy removal
                                };
                                
                                // No visual helper for floor clips - just the clipping plane
                                
                                setClippingPlanes(prev => [...prev, newClippingPlane]);
                                setClippingEnabled(true);
                                
                                // Position camera for top-down view of this floor
                                if (cameraRef.current && controlsRef.current) {
                                  const centerX = modelCenterRef.current.x;
                                  const centerZ = modelCenterRef.current.z;
                                  const targetY = modelBaseYRef.current + elevation + 1.5;
                                  
                                  // Top-down view to see the floor plan
                                  const maxDim = Math.max(modelSizeRef.current.x, modelSizeRef.current.z);
                                  controlsRef.current.target.set(centerX, targetY, centerZ);
                                  cameraRef.current.position.set(centerX, targetY + maxDim * 1.2, centerZ + 0.01);
                                  controlsRef.current.update();
                                }
                                
                                // Also set grid to this elevation
                                setGridElevation(elevation);
                              }}
                            >
                              <div style={styles.floorPlanInfo}>
                                <span style={styles.floorPlanName}>{storey.name || `Floor ${floors.length - index}`}</span>
                                <span style={styles.floorPlanElevation}>
                                  Elevation: {storey.elevation !== undefined ? `${storey.elevation.toFixed(2)}m` : 'N/A'}
                                </span>
                              </div>
                              <span style={styles.floorPlanArrow}>→</span>
                            </button>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Quick View Buttons */}
                    <div style={styles.gridControlSection}>
                      <label style={styles.gridSliderLabel}>Quick Views</label>
                      <div style={styles.quickViewButtons}>
                        <button
                          style={styles.quickViewBtn}
                          onClick={() => {
                            if (cameraRef.current && controlsRef.current) {
                              // Top-down view
                              const center = modelCenterRef.current;
                              const maxDim = Math.max(modelSizeRef.current.x, modelSizeRef.current.z);
                              controlsRef.current.target.copy(center);
                              cameraRef.current.position.set(center.x, center.y + maxDim * 1.5, center.z + 0.01);
                              controlsRef.current.update();
                            }
                          }}
                        >
                          🔽 Top View
                        </button>
                        <button
                          style={styles.quickViewBtn}
                          onClick={() => {
                            if (cameraRef.current && controlsRef.current) {
                              // Front view
                              const center = modelCenterRef.current;
                              const maxDim = Math.max(modelSizeRef.current.x, modelSizeRef.current.y);
                              controlsRef.current.target.copy(center);
                              cameraRef.current.position.set(center.x, center.y, center.z + maxDim * 1.5);
                              controlsRef.current.update();
                            }
                          }}
                        >
                          🏠 Front View
                        </button>
                        <button
                          style={styles.quickViewBtn}
                          onClick={() => {
                            if (cameraRef.current && controlsRef.current) {
                              // Side view
                              const center = modelCenterRef.current;
                              const maxDim = Math.max(modelSizeRef.current.z, modelSizeRef.current.y);
                              controlsRef.current.target.copy(center);
                              cameraRef.current.position.set(center.x + maxDim * 1.5, center.y, center.z);
                              controlsRef.current.update();
                            }
                          }}
                        >
                          📐 Side View
                        </button>
                        <button
                          style={styles.quickViewBtn}
                          onClick={() => {
                            if (cameraRef.current && controlsRef.current) {
                              // Isometric view
                              const center = modelCenterRef.current;
                              const maxDim = Math.max(modelSizeRef.current.x, modelSizeRef.current.y, modelSizeRef.current.z);
                              const distance = maxDim * 1.2;
                              controlsRef.current.target.copy(center);
                              cameraRef.current.position.set(
                                center.x + distance,
                                center.y + distance * 0.7,
                                center.z + distance
                              );
                              controlsRef.current.update();
                            }
                          }}
                        >
                          🎯 Isometric
                        </button>
                      </div>
                    </div>
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
          {clippingPlanes.length > 0 && (
            <span> | ✂️ {clippingPlanes.filter(cp => cp.enabled).length} clips active</span>
          )}
        </div>
      )}

      {/* Clipper Mode Indicator */}
      {clipperMode && modelLoaded && !isLoading && (
        <div style={{
          ...styles.clipperModeIndicator,
          ...(isDraggingClipPlane ? { backgroundColor: 'rgba(0, 200, 83, 0.9)' } : {})
        }}>
          <Scissors size={16} />
          <span>
            {isDraggingClipPlane 
              ? 'Dragging... Move to cut the model' 
              : 'Clipper Mode: Double-click to create. Drag arrows to move plane.'}
          </span>
        </div>
      )}

      {/* Controls Info */}
      <div style={styles.controlsInfo}>
        <p>🖱️ Left-click + drag: Rotate</p>
        <p>🖱️ Right-click + drag: Pan</p>
        <p>🖱️ Scroll: Zoom</p>
        <p>🖱️ Click element: Select</p>
        {clipperMode && <p>✂️ Double-click: Create clip plane</p>}
        {clipperMode && clippingPlanes.length > 0 && <p>🔴 Red arrow: Cut more | 🔵 Blue arrow: Cut less</p>}
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
    transition: 'all 0.3s ease',
  },
  containerMaximized: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
  },
  maximizeButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 100,
    width: '44px',
    height: '44px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
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
  clipperModeIndicator: {
    position: 'absolute',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 149, 0, 0.9)',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 25,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
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
    minWidth: '40px',
    height: '40px',
    padding: '0 14px',
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
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
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid transparent',
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
  gridSettingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  gridToggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#ffffff',
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  gridCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  gridControlRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  gridControlLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  colorInput: {
    width: '100%',
    height: '36px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gridSlider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255, 255, 255, 0.2)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
  },
  gridControlSection: {
    marginBottom: '20px',
  },
  gridDescription: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '4px 0 0 0',
    lineHeight: '1.4',
  },
  gridSliderLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '8px',
  },
  gridSliderLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '4px',
  },
  quickLevelButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  quickLevelBtn: {
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  // Clipper styles
  clipperHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  clipperRemoveAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    border: '1px solid rgba(255, 59, 48, 0.4)',
    borderRadius: '4px',
    color: '#ff3b30',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  clipperPlanesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  clipperPlaneItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  clipperPlaneInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  clipperPlaneNameRow: {
    display: 'flex',
    alignItems: 'center',
  },
  clipperPlaneName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#ffffff',
  },
  clipperPlanePos: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace',
    marginLeft: '20px',
  },
  clipperPlaneActions: {
    display: 'flex',
    gap: '6px',
  },
  clipperActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  clipperDisabledBtn: {
    opacity: 0.5,
  },
  clipperDeleteBtn: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderColor: 'rgba(255, 59, 48, 0.4)',
    color: '#ff3b30',
  },
  clipperPlaneItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
  // Views tab styles
  clearFloorClipBtn: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    border: '1px solid rgba(255, 149, 0, 0.5)',
    borderRadius: '8px',
    color: '#ff9500',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  floorPlansList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  floorPlanBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  floorPlanInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  floorPlanName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  floorPlanElevation: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  floorPlanArrow: {
    fontSize: '18px',
    color: '#007AFF',
  },
  quickViewButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  quickViewBtn: {
    padding: '12px 10px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
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
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #007AFF;
      cursor: pointer;
    }
    input[type="range"]::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #007AFF;
      cursor: pointer;
      border: none;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default IFCViewer;
