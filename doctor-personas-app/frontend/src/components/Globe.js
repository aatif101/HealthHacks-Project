import React, { useEffect, useRef } from 'react';
import './Globe.css';

function Globe({ personas }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simplified world map representation
    drawWorldMap(ctx, canvas.width, canvas.height);
    
    // Plot personas on the map
    plotPersonas(ctx, personas, canvas.width, canvas.height);
    
  }, [personas]);

  const drawWorldMap = (ctx, width, height) => {
    // Simple world map outline
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#f8f9fa';

    // Draw continents as simple shapes
    // North America
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.3, width * 0.1, height * 0.15, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // South America
    ctx.beginPath();
    ctx.ellipse(width * 0.25, height * 0.65, width * 0.06, height * 0.2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Europe
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.25, width * 0.05, height * 0.08, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Africa
    ctx.beginPath();
    ctx.ellipse(width * 0.52, height * 0.5, width * 0.08, height * 0.2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Asia
    ctx.beginPath();
    ctx.ellipse(width * 0.75, height * 0.35, width * 0.15, height * 0.2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Australia
    ctx.beginPath();
    ctx.ellipse(width * 0.8, height * 0.7, width * 0.05, height * 0.06, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  };

  const plotPersonas = (ctx, personas, width, height) => {
    // Map locations to approximate coordinates
    const locationMap = {
      'Boston': { x: 0.22, y: 0.28 },
      'Houston': { x: 0.18, y: 0.35 },
      'Los Angeles': { x: 0.12, y: 0.35 },
      'London': { x: 0.48, y: 0.22 },
      'Edinburgh': { x: 0.47, y: 0.18 },
      'Manchester': { x: 0.48, y: 0.2 },
      'Mumbai': { x: 0.68, y: 0.42 },
      'Delhi': { x: 0.7, y: 0.35 },
      'Ahmedabad': { x: 0.69, y: 0.4 },
      'Tokyo': { x: 0.85, y: 0.32 },
      'Osaka': { x: 0.84, y: 0.34 },
      'Shanghai': { x: 0.8, y: 0.35 },
      'Lagos': { x: 0.5, y: 0.48 },
      'Cape Town': { x: 0.52, y: 0.68 },
      'São Paulo': { x: 0.28, y: 0.65 },
      'Mexico City': { x: 0.15, y: 0.42 }
    };

    // Count personas by location for clustering
    const locationCounts = {};
    personas.forEach(persona => {
      const city = persona.location.split(', ')[0];
      locationCounts[city] = (locationCounts[city] || 0) + 1;
    });

    // Draw personas as dots
    Object.entries(locationCounts).forEach(([city, count]) => {
      const coords = locationMap[city];
      if (coords) {
        const x = coords.x * width;
        const y = coords.y * height;
        
        // Base circle
        ctx.beginPath();
        ctx.arc(x, y, Math.max(8, Math.min(20, count * 4)), 0, 2 * Math.PI);
        ctx.fillStyle = getLocationColor(city);
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Count label
        if (count > 1) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(count, x, y);
        }
        
        // City label
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(city, x, y + 25);
      }
    });
  };

  const getLocationColor = (city) => {
    const colorMap = {
      // USA - Blue
      'Boston': '#4285f4',
      'Houston': '#4285f4', 
      'Los Angeles': '#4285f4',
      
      // UK - Red
      'London': '#ea4335',
      'Edinburgh': '#ea4335',
      'Manchester': '#ea4335',
      
      // India - Orange
      'Mumbai': '#fbbc04',
      'Delhi': '#fbbc04',
      'Ahmedabad': '#fbbc04',
      
      // East Asia - Green
      'Tokyo': '#34a853',
      'Osaka': '#34a853',
      'Shanghai': '#34a853',
      
      // Africa - Purple
      'Lagos': '#9c27b0',
      'Cape Town': '#9c27b0',
      
      // Latin America - Teal
      'São Paulo': '#00bcd4',
      'Mexico City': '#00bcd4'
    };
    
    return colorMap[city] || '#666';
  };

  return (
    <div className="globe-container">
      <h3>🌍 Global Doctor Network</h3>
      <div className="globe-wrapper">
        <canvas 
          ref={canvasRef} 
          className="globe-canvas"
          width="800" 
          height="400"
        />
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#4285f4'}}></div>
            <span>USA</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#ea4335'}}></div>
            <span>UK/Europe</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#fbbc04'}}></div>
            <span>India</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#34a853'}}></div>
            <span>East Asia</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#9c27b0'}}></div>
            <span>Africa</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{backgroundColor: '#00bcd4'}}></div>
            <span>Latin America</span>
          </div>
        </div>
      </div>
      <p className="globe-description">
        Showing {personas.length} oncologists across {new Set(personas.map(p => p.location.split(', ')[0])).size} cities worldwide
      </p>
    </div>
  );
}

export default Globe;
