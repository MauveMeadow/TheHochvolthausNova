# Hochvolthaus Nova - Architectural Redesign Website

A modern, interactive website showcasing the architectural redesign of the Hochvolthaus building at the Technical University of Munich.

## 🚀 Features

- **Smooth Scrolling Sections**: Navigate through 5 main sections with smooth scrolling
- **Tab Navigation**: Quick access to different sections via top navigation bar
- **Responsive Design**: Fully responsive layout that works on all devices
- **Apple-Inspired Design**: Clean, minimal aesthetic following Figma design system
- **3D Model Integration**: Ready for integration with 3DCityDB, ArcGIS, FORMA, and IFC.js
- **Interactive Elements**: Animated components using Framer Motion

## 📋 Sections

1. **Overview** - Project introduction and key statistics
2. **The Concept** - Historical timeline and architectural vision
3. **The Hub** - Interactive floor plan navigation (7 levels)
4. **3D Models** - Multiple 3D visualization platforms
5. **The Minds** - Team members with contact information

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **CSS3** - Custom styling (Figma design system)

## 📦 Installation

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/
   - Version 16 or higher recommended

2. **Open Terminal in VS Code**
   - Press `Ctrl + ` (backtick)
   - Or go to View > Terminal

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - The site will automatically open at `http://localhost:3000`
   - If not, manually navigate to the URL shown in terminal

## 🎨 Customization

### Updating Colors
Edit `styles/global.css` and modify the CSS variables in `:root`:
```css
:root {
  --primary: #001960;
  --secondary: #f5f5f7;
  /* etc... */
}
```

### Adding Team Members
Edit `src/components/TheMinds.jsx` and update the `teamMembers` array.

### Integrating 3D Models
Edit `src/components/Models3D.jsx` to integrate:
- **3DCityDB**: Geospatial visualization
- **ArcGIS**: Mapping and analysis
- **FORMA**: Building massing
- **IFC.js**: BIM viewer with material checking

## 📁 Project Structure

```
Website 1/
├── index.html              # Main HTML file
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── styles/
│   └── global.css          # Global styles (Figma design system)
└── src/
    ├── main.jsx            # Entry point
    ├── App.jsx             # Main app component
    └── components/
        ├── Navigation.jsx   # Top navigation bar
        ├── Overview.jsx     # Section 1
        ├── TheConcept.jsx   # Section 2
        ├── TheHub.jsx       # Section 3
        ├── Models3D.jsx     # Section 4
        └── TheMinds.jsx     # Section 5
```

## 🔧 Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` folder, ready for deployment.

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Next Steps

1. **Add Real Images**: Replace placeholder images with actual building photos
2. **Integrate 3D Viewers**: 
   - Set up IFC.js for BIM visualization
   - Connect 3DCityDB for geospatial data
   - Integrate ArcGIS API
   - Add FORMA model viewer
3. **Add Interactive Floor Plans**: Implement detailed floor plans for each level
4. **Connect Backend**: Add data persistence if needed

## 👥 Team

- Mays Alsheikh
- Samin Eghbali
- Antonia-Ioulia Pozatzidou
- Rafael Rodrigues Giglio
- Chandana Mahesh
- Tinhanzo Wang

**Course**: Fusion Lab - ITBE Master's Program  
**University**: Technical University of Munich (TUM)  
**Year**: 2025-2026

## 📄 License

This project is part of an academic course at TUM.

## 🆘 Need Help?

If you encounter issues:
1. Make sure Node.js is installed: `node --version`
2. Delete `node_modules` and run `npm install` again
3. Check the browser console for errors (F12)
4. Contact the team at info@fusionlab.tum.de
