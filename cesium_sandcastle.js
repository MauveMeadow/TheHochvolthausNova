// ==================== CESIUM CONFIGURATION ====================
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZTQyMjc5My0wNWMxLTQwYjItYTQ2Ny1hN2NmMWQzZTU1ODgiLCJpZCI6Mzc5Njc4LCJpYXQiOjE3Njg1NjY1ODJ9.uNoYxXVWAb2rKHk2u5Etox_rRfq7IUnCFsAK_424OiQ';

const MODEL_ASSET_ID_1 = '4392344';
const MODEL_ASSET_ID_2 = '4392629';
const OSM_BUILDINGS_ASSET_ID = '96188'; // Cesium OSM Buildings
let viewer;
let modelPrimitive1 = null;
let modelPrimitive2 = null;
let model1Visible = true; // Track visibility of first model
let model2Visible = true; // Track visibility of second model
let osmBuildingsPrimitive = null;
let osmBuildingsVisible = false;
let selectedEntity = null;
let currentTime = Cesium.JulianDate.now();

// Element visibility tracking
let hiddenElements = new Map(); // Store hidden elements and their original state
let selectedElementForHiding = null; // Track currently selected element for hiding

// Create CSS styles dynamically
const style = document.createElement('style');
style.textContent = `
    .control-panel {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 100;
        min-width: 250px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .control-panel h3 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 16px;
        border-bottom: 2px solid #007bff;
        padding-bottom: 8px;
    }
    
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .control-btn {
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
    }
    
    .control-btn:hover {
        background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 123, 255, 0.4);
    }
    
    .control-btn:active {
        transform: translateY(0);
    }
    
    .dropdown-menu {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        background: white;
        transition: all 0.3s ease;
        margin-top: 10px;
    }
    
    .dropdown-menu:hover {
        border-color: #007bff;
        box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2);
    }
    
    .info-box {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.98);
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 100;
        max-width: 380px;
        max-height: 600px;
        overflow-y: auto;
        border-left: 4px solid #28a745;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .info-box h3 {
        margin: 0 0 15px 0;
        color: #333;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .close-btn {
        background: #dc3545;
        color: white;
        border: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .close-btn:hover {
        background: #c82333;
        transform: rotate(90deg);
    }
    
    .property-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .property-item {
        padding: 10px 12px;
        background: #f8f9fa;
        border-radius: 6px;
        border-left: 3px solid #ccc;
        word-break: break-word;
    }
    
    .property-item.important {
        background: linear-gradient(135deg, #fff3cd 0%, #fffbea 100%);
        border-left-color: #ffc107;
        font-weight: 500;
    }
    
    .property-key {
        color: #495057;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
    }
    
    .property-value {
        color: #212529;
        font-size: 14px;
        word-wrap: break-word;
    }
    
    .time-info {
        position: absolute;
        bottom: 20px;
        left: 10px;
        background: rgba(30, 30, 30, 0.85);
        color: #fff;
        padding: 15px 18px;
        border-radius: 8px;
        font-size: 13px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        z-index: 90;
        min-width: 250px;
        border-left: 4px solid #28a745;
    }
    
    .time-display {
        margin-bottom: 10px;
        font-weight: 600;
    }
    
    .time-display strong {
        color: #28a745;
        font-weight: 700;
    }
    
    .time-info > div {
        margin: 6px 0;
        line-height: 1.5;
    }
    
    .status-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 200;
        animation: fadeInOut 3s ease-in-out;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        10%, 90% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ==================== INITIALIZATION ====================
async function initializeViewer() {
    try {
        // Ensure required DOM elements exist
        ensureElementsExist();

        // Create viewer with Cesium World Terrain
        viewer = new Cesium.Viewer('cesiumContainer', {
            terrain: Cesium.Terrain.fromWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            }),
            shadows: true,
            shouldAnimate: true
        });

        // Configure viewer for better visibility
        viewer.scene.shadowMap.enabled = true;
        viewer.scene.shadowMap.softShadows = true;
        viewer.scene.shadowMap.darkness = 0.5;
        viewer.scene.globe.enableLighting = true;
        viewer.scene.lightSource = new Cesium.DirectionalLight({
            direction: new Cesium.Cartesian3(0.1, 0.2, 1)
        });

        console.log('Viewer initialized with Cesium World Terrain');

        // Load 3D model
        await loadModel();

        // Setup UI
        setupControlPanel();
        updateTimeDisplay();

        // Setup pick handler for clicking elements
        setupPickHandler();

        console.log('Initialization complete');
    } catch (error) {
        console.error('Initialization error:', error);
        showStatusMessage('Error initializing viewer: ' + error.message);
    }
}

// Ensure all required DOM elements exist
function ensureElementsExist() {
    if (!document.getElementById('cesiumContainer')) {
        const container = document.createElement('div');
        container.id = 'cesiumContainer';
        container.style.cssText = 'width: 100%; height: 100%; position: relative; overflow: hidden;';
        document.body.appendChild(container);
    }

    if (!document.getElementById('controlPanel')) {
        const panel = document.createElement('div');
        panel.id = 'controlPanel';
        panel.className = 'control-panel';
        document.body.appendChild(panel);
    }

    if (!document.getElementById('timeInfo')) {
        const timeInfo = document.createElement('div');
        timeInfo.id = 'timeInfo';
        timeInfo.className = 'time-info';
        document.body.appendChild(timeInfo);
    }
}

// ==================== MODEL LOADING ====================
async function loadModel() {
    try {
        console.log(`Loading 3D models...`);
        console.log(`Asset 1 ID: ${MODEL_ASSET_ID_1}`);
        console.log(`Asset 2 ID: ${MODEL_ASSET_ID_2}`);

        // Load both tilesets in parallel
        const [tileset1, tileset2] = await Promise.all([
            Cesium.Cesium3DTileset.fromIonAssetId(MODEL_ASSET_ID_1, {
                maximumScreenSpaceError: 16
            }),
            Cesium.Cesium3DTileset.fromIonAssetId(MODEL_ASSET_ID_2, {
                maximumScreenSpaceError: 16
            })
        ]);

        modelPrimitive1 = viewer.scene.primitives.add(tileset1);
        modelPrimitive2 = viewer.scene.primitives.add(tileset2);
        
        // Small delay to ensure primitives are added to scene
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Both tilesets added to scene, zooming to view...');
        
        // Zoom to first model (you can adjust this to zoom to both if needed)
        await viewer.zoomTo(modelPrimitive1, new Cesium.HeadingPitchRange(0, -Math.PI / 6, 0));

        console.log('Models loaded successfully and zoomed to view');
        showStatusMessage('Models loaded successfully!');
    } catch (error) {
        console.error('Model loading error:', error);
        // Try fallback zoom
        try {
            if (modelPrimitive1) {
                await viewer.zoomTo(modelPrimitive1);
                console.log('Fallback zoom succeeded');
            }
        } catch (e) {
            console.error('Fallback zoom also failed:', e);
        }
        showStatusMessage('Models loaded (zoom error handled)');
    }
}

// ==================== PICK HANDLER ====================
function setupPickHandler() {
    const canvas = viewer.canvas;
    canvas.addEventListener('click', function onCanvasClick(e) {
        const pickedObject = viewer.scene.pick(new Cesium.Cartesian2(e.clientX, e.clientY));

        if (Cesium.defined(pickedObject) && pickedObject.id) {
            displayElementInfo(pickedObject.id);
        } else if (Cesium.defined(pickedObject) && pickedObject.primitive) {
            console.log('Clicked on 3D Tileset primitive (properties unavailable for this asset type)');
        } else {
            // Deselect if clicking on empty space
            if (selectedEntity) {
                selectedEntity.color = undefined;
                selectedEntity = null;
            }
            closeInfoBox();
        }
    });
}

// ==================== ELEMENT INFO DISPLAY ====================
function displayElementInfo(entity) {
    selectedEntity = entity;
    selectedElementForHiding = entity;

    // Highlight selected element in yellow
    if (entity.color !== undefined) {
        entity.color = Cesium.Color.YELLOW.withAlpha(0.7);
    }

    const properties = getEntityProperties(entity);
    renderInfoBox(properties);

    console.log('Element selected:', properties);
}

function getEntityProperties(entity) {
    const props = {};

    // Get all properties from entity
    if (entity.properties) {
        for (let key in entity.properties) {
            if (entity.properties.hasOwnProperty(key)) {
                const value = entity.properties[key];
                props[key] = Cesium.defined(value) ? value.getValue(Cesium.JulianDate.now()) : 'N/A';
            }
        }
    }

    // Add direct properties
    const directProps = ['id', 'name', 'description', 'categoryName', 'Family', 'Type', 'Level'];
    for (let prop of directProps) {
        if (entity[prop] !== undefined && !props[prop]) {
            props[prop] = entity[prop];
        }
    }

    return props;
}

function renderInfoBox(properties) {
    // Remove existing info box if present
    closeInfoBox();

    const infoBox = document.createElement('div');
    infoBox.className = 'info-box';
    infoBox.id = 'infoBox';

    // Important properties to highlight
    const importantProps = ['categoryName', 'Family', 'Type', 'Level', 'name', 'id'];

    // Create header with close button
    let htmlContent = '<h3>Element Properties <button class="close-btn" id="closeBtn">✕</button></h3>';
    htmlContent += '<div class="property-list">';

    // Render properties
    for (let key in properties) {
        if (properties.hasOwnProperty(key)) {
            const value = properties[key];
            const isImportant = importantProps.includes(key);
            const className = isImportant ? 'property-item important' : 'property-item';

            htmlContent += `
                <div class="${className}">
                    <div class="property-key">${escapeHtml(key)}</div>
                    <div class="property-value">${escapeHtml(String(value))}</div>
                </div>
            `;
        }
    }

    htmlContent += '</div>';
    infoBox.innerHTML = htmlContent;

    document.body.appendChild(infoBox);

    // Add close button event listener
    document.getElementById('closeBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        closeInfoBox();
        if (selectedEntity && selectedEntity.color !== undefined) {
            selectedEntity.color = undefined;
            selectedEntity = null;
        }
    });
}

function closeInfoBox() {
    const infoBox = document.getElementById('infoBox');
    if (infoBox) {
        infoBox.remove();
    }
}

// ==================== CONTROL PANEL ====================
function setupControlPanel() {
    const controlPanel = document.getElementById('controlPanel');
    if (!controlPanel) {
        console.warn('Control panel element not found, creating it');
        const newPanel = document.createElement('div');
        newPanel.id = 'controlPanel';
        newPanel.className = 'control-panel';
        document.body.appendChild(newPanel);
    }

    const panel = document.getElementById('controlPanel');

    let panelHtml = '<h3>☀️ Shadow Simulation</h3>';
    panelHtml += '<div class="button-group">';
    panelHtml += '<button class="control-btn" id="setDateTimeBtn" style="font-size: 16px;">📅 Set Date/Time</button>';
    panelHtml += '<button class="control-btn" id="resetCameraBtn" style="font-size: 16px;">🎥 Reset Camera</button>';
    panelHtml += '</div>';
    
    panelHtml += '<label style="margin-top: 15px; display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">Asset Visibility:</label>';
    panelHtml += '<div class="button-group">';
    panelHtml += '<button class="control-btn" id="model1Btn" style="font-size: 14px;">👁️ Asset 1 (4392344): ON</button>';
    panelHtml += '<button class="control-btn" id="model2Btn" style="font-size: 14px;">👁️ Asset 2 (4392629): ON</button>';
    panelHtml += '<button class="control-btn" id="osmBuildingsBtn" style="font-size: 14px;">🏢 OSM Buildings: OFF</button>';
    panelHtml += '</div>';
    
    panelHtml += '<label style="margin-top: 15px; display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">Element Visibility:</label>';
    panelHtml += '<div class="button-group">';
    panelHtml += '<button class="control-btn" id="hideSelectedBtn" style="font-size: 14px; background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);">👁️ Hide Selected</button>';
    panelHtml += '<button class="control-btn" id="showAllBtn" style="font-size: 14px; background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);">👁️ Show All Hidden</button>';
    panelHtml += '<div style="text-align: center; padding: 10px; background: rgba(0,0,0,0.1); border-radius: 6px; margin-top: 8px; font-size: 13px; color: #666;">Hidden elements: <span id="hiddenCount">0</span></div>';
    panelHtml += '</div>';
    
    panelHtml += '<label style="margin-top: 15px; display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">Quick Time Selection:</label>';
    panelHtml += '<select class="dropdown-menu" id="quickTimeSelect">';
    panelHtml += '<option value="">-- Select Time --</option>';
    panelHtml += '<option value="current">Current Time</option>';
    panelHtml += '<option value="08:00">Morning (08:00 CET)</option>';
    panelHtml += '<option value="12:00">Noon (12:00 CET)</option>';
    panelHtml += '<option value="15:00">Afternoon (15:00 CET)</option>';
    panelHtml += '<option value="18:00">Evening (18:00 CET)</option>';
    panelHtml += '</select>';

    panel.innerHTML = panelHtml;

    // Add event listeners with small delay to ensure elements are rendered
    setTimeout(() => {
        const setBtn = document.getElementById('setDateTimeBtn');
        const resetBtn = document.getElementById('resetCameraBtn');
        const model1Btn = document.getElementById('model1Btn');
        const model2Btn = document.getElementById('model2Btn');
        const osmBtn = document.getElementById('osmBuildingsBtn');
        const hideSelectedBtn = document.getElementById('hideSelectedBtn');
        const showAllBtn = document.getElementById('showAllBtn');
        const quickSelect = document.getElementById('quickTimeSelect');

        if (setBtn) {
            setBtn.addEventListener('click', setDateTimePrompt);
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', resetCamera);
        }
        if (model1Btn) {
            model1Btn.addEventListener('click', toggleModel1);
        }
        if (model2Btn) {
            model2Btn.addEventListener('click', toggleModel2);
        }
        if (osmBtn) {
            osmBtn.addEventListener('click', toggleOSMBuildings);
        }
        if (hideSelectedBtn) {
            hideSelectedBtn.addEventListener('click', hideSelectedElement);
        }
        if (showAllBtn) {
            showAllBtn.addEventListener('click', showAllHiddenElements);
        }
        if (quickSelect) {
            quickSelect.addEventListener('change', function(e) {
                if (e.target.value) {
                    handleQuickTimeSelect(e.target.value);
                    // Reset dropdown to placeholder
                    setTimeout(() => {
                        e.target.value = '';
                    }, 100);
                }
            });
        }
    }, 100);
}

// ==================== DATE/TIME CONTROL ====================
function setDateTimePrompt() {
    const dateInput = prompt('Enter date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);

    if (dateInput === null) return; // User cancelled

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateInput)) {
        showStatusMessage('Invalid date format. Use YYYY-MM-DD');
        return;
    }

    const timeInput = prompt('Enter time in CET (HH:MM):', '12:00');

    if (timeInput === null) return; // User cancelled

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(timeInput)) {
        showStatusMessage('Invalid time format. Use HH:MM');
        return;
    }

    setDateTimeFromInput(dateInput, timeInput);
}

function setDateTimeFromInput(dateString, timeString) {
    try {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes] = timeString.split(':').map(Number);

        // Create date in CET
        const date = new Date(year, month - 1, day, hours, minutes, 0);

        // Convert CET to UTC
        const cetOffset = getCETOffset(date); // Returns offset in minutes
        const utcDate = new Date(date.getTime() - cetOffset * 60000);

        currentTime = Cesium.JulianDate.fromDate(utcDate);

        // Update viewer time
        viewer.clock.currentTime = currentTime;

        // Update shadows
        updateShadowDirection();
        updateTimeDisplay();

        console.log(`Time set to: ${dateString} ${timeString} CET (UTC: ${utcDate.toISOString()})`);
        showStatusMessage(`Time set to: ${dateString} ${timeString} CET`);
    } catch (error) {
        console.error('Date/Time parsing error:', error);
        showStatusMessage('Error parsing date/time');
    }
}

function handleQuickTimeSelect(value) {
    if (value === 'current') {
        currentTime = Cesium.JulianDate.now();
    } else {
        // Keep current date, only change time
        const cesiumDate = Cesium.JulianDate.toDate(currentTime);
        const [hours, minutes] = value.split(':').map(Number);

        const date = new Date(cesiumDate.getFullYear(), cesiumDate.getMonth(), cesiumDate.getDate(), hours, minutes, 0);
        const cetOffset = getCETOffset(date);
        const utcDate = new Date(date.getTime() - cetOffset * 60000);

        currentTime = Cesium.JulianDate.fromDate(utcDate);
    }

    viewer.clock.currentTime = currentTime;
    updateShadowDirection();
    updateTimeDisplay();

    const displayDate = Cesium.JulianDate.toDate(currentTime);
    console.log(`Quick time selected: ${displayDate.toISOString()}`);
}

// ==================== SHADOW CALCULATION ====================
function updateShadowDirection() {
    const date = Cesium.JulianDate.toDate(currentTime);

    // Get sun position (simplified calculation)
    const sunPosition = calculateSunPosition(date);

    if (viewer.scene.lightSource) {
        viewer.scene.lightSource.direction = sunPosition;
    }

    console.log(`Shadow direction updated for: ${date.toISOString()}`);
}

function calculateSunPosition(date) {
    // Simplified sun position calculation
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    const hourOfDay = date.getHours() + date.getMinutes() / 60;

    // Solar declination (simplified)
    const declination = 23.44 * Math.sin((dayOfYear - 81) * Math.PI / 182.6) * Math.PI / 180;

    // Hour angle
    const hourAngle = (hourOfDay - 12) * 15 * Math.PI / 180;

    // Simple directional vector
    const x = Math.cos(declination) * Math.sin(hourAngle);
    const y = Math.sin(declination);
    const z = Math.cos(declination) * Math.cos(hourAngle);

    return new Cesium.Cartesian3(x, y, z);
}

// ==================== TIME CONVERSION ====================
function getCETOffset(date) {
    // Check if date is in CEST (summer time) or CET (winter time)
    // CEST: Last Sunday of March to Last Sunday of October
    const year = date.getFullYear();
    const lastSundayMarch = getLastSunday(year, 2); // March
    const lastSundayOctober = getLastSunday(year, 9); // October

    if (date >= lastSundayMarch && date < lastSundayOctober) {
        // CEST: UTC+2
        return -120;
    } else {
        // CET: UTC+1
        return -60;
    }
}

function getLastSunday(year, month) {
    const date = new Date(year, month + 1, 0); // Last day of month
    while (date.getDay() !== 0) {
        date.setDate(date.getDate() - 1);
    }
    return date;
}

// ==================== DISPLAY UPDATES ====================
function updateTimeDisplay() {
    const dateUtc = Cesium.JulianDate.toDate(currentTime);
    const cetOffset = getCETOffset(dateUtc);
    const cetDate = new Date(dateUtc.getTime() + cetOffset * 60000);

    const timeInfo = document.getElementById('timeInfo');
    if (!timeInfo) return; // Element doesn't exist yet, skip update
    
    const dateStr = cetDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const timeStr = cetDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    let html = '<div class="time-display"><strong>Current Time:</strong></div>';
    html += `<div style="font-size: 16px; font-weight: 600; margin: 8px 0;">${dateStr}</div>`;
    html += `<div style="font-size: 16px; font-weight: 600;">${timeStr} CET</div>`;

    timeInfo.innerHTML = html;
}

function resetCamera() {
    if (modelPrimitive1) {
        viewer.zoomTo(modelPrimitive1, new Cesium.HeadingPitchRange(0, -Math.PI / 6, 0));
        console.log('Camera reset');
    }
}

// ==================== ASSET 1 & 2 TOGGLE ====================
function toggleModel1() {
    if (!modelPrimitive1) {
        console.warn('Asset 1 not loaded');
        showStatusMessage('Asset 1 not loaded');
        return;
    }

    if (model1Visible) {
        // Hide Asset 1
        modelPrimitive1.show = false;
        model1Visible = false;
        document.getElementById('model1Btn').textContent = '👁️ Asset 1 (4392344): OFF';
        console.log('Asset 1 hidden');
        showStatusMessage('Asset 1 disabled');
    } else {
        // Show Asset 1
        modelPrimitive1.show = true;
        model1Visible = true;
        document.getElementById('model1Btn').textContent = '👁️ Asset 1 (4392344): ON';
        console.log('Asset 1 visible');
        showStatusMessage('Asset 1 enabled');
    }
}

function toggleModel2() {
    if (!modelPrimitive2) {
        console.warn('Asset 2 not loaded');
        showStatusMessage('Asset 2 not loaded');
        return;
    }

    if (model2Visible) {
        // Hide Asset 2
        modelPrimitive2.show = false;
        model2Visible = false;
        document.getElementById('model2Btn').textContent = '👁️ Asset 2 (4392629): OFF';
        console.log('Asset 2 hidden');
        showStatusMessage('Asset 2 disabled');
    } else {
        // Show Asset 2
        modelPrimitive2.show = true;
        model2Visible = true;
        document.getElementById('model2Btn').textContent = '👁️ Asset 2 (4392629): ON';
        console.log('Asset 2 visible');
        showStatusMessage('Asset 2 enabled');
    }
}

// ==================== OSM BUILDINGS TOGGLE ====================
async function toggleOSMBuildings() {
    try {
        if (osmBuildingsVisible) {
            // Hide OSM Buildings
            if (osmBuildingsPrimitive) {
                viewer.scene.primitives.remove(osmBuildingsPrimitive);
                osmBuildingsPrimitive = null;
            }
            osmBuildingsVisible = false;
            document.getElementById('osmBuildingsBtn').textContent = '🏢 OSM Buildings: OFF';
            console.log('OSM Buildings hidden');
            showStatusMessage('OSM Buildings disabled');
        } else {
            // Load and show OSM Buildings
            console.log('Loading OSM Buildings...');
            const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(OSM_BUILDINGS_ASSET_ID, {
                maximumScreenSpaceError: 8
            });
            
            osmBuildingsPrimitive = viewer.scene.primitives.add(buildingsTileset);
            osmBuildingsVisible = true;
            document.getElementById('osmBuildingsBtn').textContent = '🏢 OSM Buildings: ON';
            console.log('OSM Buildings loaded and visible');
            showStatusMessage('OSM Buildings enabled');
        }
    } catch (error) {
        console.error('Error toggling OSM Buildings:', error);
        showStatusMessage('Error loading OSM Buildings: ' + error.message);
    }
}

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showStatusMessage(message) {
    const statusDiv = document.createElement('div');
    statusDiv.className = 'status-message';
    statusDiv.textContent = message;
    document.body.appendChild(statusDiv);

    setTimeout(() => {
        statusDiv.remove();
    }, 3000);
}

// ==================== ELEMENT VISIBILITY CONTROL ====================
function hideSelectedElement() {
    if (!selectedElementForHiding) {
        showStatusMessage('No element selected. Click on an element first.');
        return;
    }

    // Store the element's original state
    if (!hiddenElements.has(selectedElementForHiding)) {
        hiddenElements.set(selectedElementForHiding, {
            originalColor: selectedElementForHiding.color,
            originalShow: selectedElementForHiding.show
        });
    }

    // Hide the element
    selectedElementForHiding.show = false;
    
    // Update counter
    updateHiddenCounter();
    
    console.log('Element hidden. Total hidden:', hiddenElements.size);
    showStatusMessage(`Element hidden (${hiddenElements.size} hidden)`);
    
    // Clear selection and close info box
    selectedElementForHiding = null;
    closeInfoBox();
}

function showAllHiddenElements() {
    if (hiddenElements.size === 0) {
        showStatusMessage('No hidden elements to show.');
        return;
    }

    // Restore all hidden elements
    hiddenElements.forEach((state, element) => {
        element.show = true;
        element.color = state.originalColor;
    });

    hiddenElements.clear();
    updateHiddenCounter();
    
    console.log('All hidden elements restored');
    showStatusMessage('All hidden elements are now visible!');
}

function updateHiddenCounter() {
    const counter = document.getElementById('hiddenCount');
    if (counter) {
        counter.textContent = hiddenElements.size;
    }
}

// ==================== AUTO-UPDATE TIME DISPLAY ====================
setInterval(updateTimeDisplay, 1000);

// ==================== START APPLICATION ====================
initializeViewer();
