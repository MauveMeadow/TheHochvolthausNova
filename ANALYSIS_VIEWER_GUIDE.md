# AnalysisViewer Integration Guide

## Component Overview

The `AnalysisViewer.jsx` component is a professional dashboard for displaying Autodesk Forma analysis results. It features a 3-column layout with interactive tabs, image uploads, and detailed metrics.

## Features Implemented

### 1. **3-Column Layout**
- **Left Sidebar**: List of 6 analysis types with active state highlighting
  - Sun Hours
  - Daylight Potential
  - Wind Comfort
  - Microclimate
  - Noise Analysis
  - Carbon Footprint

- **Center Stage**: Large image display area with:
  - Placeholder images (via placeholder.com)
  - File upload functionality to replace with custom screenshots
  - Smooth transitions between analyses

- **Right Panel**: Statistics & Insights showing:
  - 4 key metrics per analysis type
  - Color-coded values matching the analysis type
  - Export button for generating reports

### 2. **State Management**
- `activeTab`: Tracks the currently selected analysis
- `customImages`: Object storing uploaded images by analysis ID

### 3. **Data Structure** (ANALYSIS_DATA)
Each analysis includes:
- `id`: Unique identifier
- `title`: Display name
- `icon`: Lucide icon component
- `description`: Brief explanation
- `imageUrl`: Placeholder image URL
- `metrics`: Array of metric objects with label, value, and unit
- `color`: Brand color for the analysis type

### 4. **Image Upload Feature**
- File input accepts image files (JPG, PNG, etc.)
- Images are converted to data URLs and stored in state
- Custom images replace placeholders instantly
- Upload area appears on hover over the image

### 5. **Professional Design**
- Autodesk Forma-inspired color scheme (white/grey)
- Primary color: `#001960` (navy blue)
- Secondary color: `#f5f5f7` (light grey)
- Smooth transitions and hover effects
- Responsive layout

## How It's Already Integrated

The route has been added to `src/App.jsx`:

```jsx
import AnalysisViewer from './components/AnalysisViewer'

// Inside Routes:
<Route path="/analysis" element={<AnalysisViewer />} />
```

## Accessing the Dashboard

Simply navigate to:
```
http://localhost:3000/analysis
```

## Customizing the Analysis Data

To add or modify analysis types, edit the `ANALYSIS_DATA` object in `AnalysisViewer.jsx`:

```jsx
const ANALYSIS_DATA = {
  'custom-analysis': {
    id: 'custom-analysis',
    title: 'Custom Analysis',
    icon: CustomIcon,
    description: 'Description here',
    imageUrl: 'https://your-image-url.com/image.jpg',
    metrics: [
      { label: 'Metric 1', value: '123', unit: 'unit' },
      { label: 'Metric 2', value: '456', unit: 'unit' },
      // Add up to 4 metrics
    ],
    color: '#FF0000',
  },
  // ... other analyses
}
```

## Uploading Real Forma Screenshots

1. Go to `/analysis`
2. Select an analysis type from the left sidebar
3. Click the "Upload Image" button that appears on hover
4. Select your exported Forma screenshot
5. The image will replace the placeholder instantly

## Exporting Reports

The "Export Report" button is ready for backend integration. To implement:

```jsx
const handleExportReport = () => {
  // Add export logic here (PDF generation, etc.)
}
```

## Styling Customization

All styles are defined in the `styles` object at the bottom of the component. Modify any of these to change colors, spacing, or layout:

- `styles.container`: Main container
- `styles.header`: Header section
- `styles.sidebar`: Left sidebar
- `styles.imageContainer`: Center image area
- `styles.rightPanel`: Right statistics panel

## Browser Compatibility

- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design (though optimized for desktop view)
- File upload works with all common image formats

## Next Steps

1. Replace placeholder images with your actual Forma screenshots
2. Update metrics with real analysis data
3. Implement PDF export functionality if needed
4. Add API integration to fetch live analysis data (optional)
5. Add to Navigation menu for easy access (optional)

## Adding to Navigation Menu

To add a link in your navigation, update `src/components/Navigation.jsx`:

```jsx
const navItems = [
  // ... existing items
  {
    id: 'analysis',
    label: 'Analysis Dashboard',
    path: '/analysis'
  }
]
```

## Performance Notes

- Images are stored as data URLs in component state
- For better performance with many images, consider using a state management library (Redux, Zustand)
- Large image files may impact performance; compress images before uploading

---

**Component Created**: AnalysisViewer.jsx
**Route Added**: /analysis
**Status**: Ready to use ✓
