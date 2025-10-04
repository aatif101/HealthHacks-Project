# Doctor Personas Globe

An interactive 3D globe built with React and react-globe.gl that displays doctor personas from around the world.

## Features

- **Full Screen Interactive Globe**: Immersive 3D Earth visualization that fills the entire viewport
- **Doctor Personas**: View detailed information about doctors from different locations
- **Click Interactions**: Click on red points to see detailed doctor information in a floating panel
- **Floating Info Panel**: Semi-transparent doctor information panel that appears on click with close button
- **Minimal UI**: Clean, distraction-free full screen experience
- **Auto-rotation**: The globe automatically rotates for better engagement

## Technologies Used

- **React 18**: Modern React framework
- **Three.js 0.150.1**: 3D graphics library (custom implementation)
- **TailwindCSS**: Utility-first CSS framework

## Globe Implementation

This project features a **physical Earth globe** built with Three.js and three-globe:

- **Realistic Textures**: NASA Blue Marble Earth imagery with bump mapping
- **Physical Atmosphere**: Light blue atmospheric glow around Earth
- **Starfield**: Subtle star background for space-like ambiance
- **Interactive Points**: Color-coded doctor locations with hover tooltips
- **Click Functionality**: Click points to view doctor details in side panel
- **Interactive Controls**: Mouse-driven rotation, zoom, and auto-rotate option

## Version Compatibility

**Critical**: This project uses exact versions to avoid WebGPU/TSL compatibility issues:

- **three.js**: `0.150.1` (pinned - stable version without experimental modules)
- **react-globe.gl**: `2.29.0` (pinned - avoids WebGPU dependencies)

> **Warning**: DO NOT upgrade these versions. Newer versions (three.js 0.167+, react-globe.gl 2.30+) include experimental WebGPU/TSL modules that cause build failures. The current versions are tested and stable.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Project Structure

```
src/
├── components/
│   ├── Globe.js          # 3D Globe component
│   └── PersonaCard.js    # Doctor information card
├── utils/
│   └── coordinateMapping.js  # City to lat/lng mapping
├── personas.json         # Doctor persona data
├── App.js               # Main application component
├── index.js             # React entry point
└── index.css            # TailwindCSS imports and styles
```

## Doctor Persona Data Structure

Each doctor persona includes:
- **id**: Unique identifier
- **name**: Doctor's full name
- **specialty**: Medical specialty (e.g., "Lung Cancer", "Gynecologic Cancers")
- **location**: City and country (30+ global locations)
- **rating**: Performance rating (3.8-4.9 stars)
- **experience**: Detailed experience information
- **hospital**: Affiliated hospital or institution
- **style**: Communication tone and decision-making approach
- **focus**: Array of focus areas (cancer care, clinical trials, patient support)
- **publications**: Research and publication background
- **languages**: Languages spoken (English, Spanish, Mandarin, etc.)
- **sample_quote**: Representative quote
- **response_examples**: Detailed case study examples

## PhysicalGlobe Component

### Requirements
- **three**: `0.150.1` (exact version required to avoid WebGPU/TSL errors)
- **three-globe**: `2.29.0` (exact version required for compatibility)

### Basic Usage

```jsx
import PhysicalGlobe from './components/PhysicalGlobe';

const points = [
  {
    lat: 35.6762,
    lng: 139.6503,
    label: "Tokyo Doctor",
    color: "#ff4444",
    size: 0.5,
    persona: { /* doctor data */ }
  }
];

<PhysicalGlobe 
  points={points}
  height={520}
  onPointClick={handlePointClick}
/>
```

### GlobePoint Format

```typescript
type GlobePoint = {
  lat: number;           // Latitude coordinate
  lng: number;           // Longitude coordinate  
  label?: string;        // Tooltip text
  color?: string;        // Hex color string (e.g., "#ff4444")
  size?: number;         // Point size (0-1 range, default: 0.5)
  persona?: any;         // Custom data for click handling
}
```

### Data Mapping

The `src/utils/dataAdapter.js` converts doctor personas to GlobePoint format:

- **Color coding**: Specialty-based hex color strings (Cardiology="#ff4444", Neurology="#44ff44", etc.)
- **Size mapping**: Based on doctor rating (4.6-4.9 → 0.3-0.8 size range)
- **Label format**: `"Dr. Name - Specialty"`

## Customization

### Adding New Doctors

1. Edit `src/personas.json` to add new doctor entries
2. If adding new cities, update `src/utils/coordinateMapping.js` with the corresponding lat/lng coordinates
3. Colors and sizes will be automatically assigned based on specialty and rating

### Styling

The application uses TailwindCSS for styling. Key components:
- **Globe styling**: `src/components/PhysicalGlobe.tsx` (Three.js materials and Earth textures)
- **Card styling**: `src/components/PersonaCard.js`
- **Layout styling**: `src/App.js`

## Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (irreversible)

## Troubleshooting

### WebGPU/TSL Import Errors

If you encounter errors like:
```
Module not found: Error: Package path ./webgpu is not exported from package three
Module not found: Error: Package path ./tsl is not exported from package three
```

**Solution**: Ensure you're using the compatible versions specified in this README:
```bash
rm -rf node_modules package-lock.json
npm install three@0.150.1 react-globe.gl@2.29.0
npm start
```

These versions are tested and confirmed to work together without experimental module dependencies.

## License

This project is open source and available under the MIT License.
