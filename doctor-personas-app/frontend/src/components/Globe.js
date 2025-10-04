import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { spreadPoints } from '../lib/geoCluster.js';
import { analyzeClusters } from '../utils/clusterDebug.js';

const GlobeComponent = ({ personas, onPersonaClick }) => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate the globe
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Apply geo-clustering to prevent overlapping nodes
  const clusteredPersonas = React.useMemo(() => {
    if (!personas || personas.length === 0) return [];
    
    // Debug: Analyze clustering before processing
    console.log('Original personas analysis:', analyzeClusters(personas));
    
    // Use spreadPoints to cluster nearby doctors and fan them out
    const clustered = spreadPoints(personas, 25, 12); // 25km threshold, 12km ring spacing
    
    // Debug: Show clustering results
    console.log('Clustering completed:', {
      originalCount: personas.length,
      clusteredCount: clustered.length,
      clusteredPersonas: clustered.filter(p => p.__origLat !== undefined)
    });
    
    return clustered;
  }, [personas]);

  // Color mapping based on specialty categories
  const getSpecialtyColor = (specialty) => {
    const colorMap = {
      // Cancer specialties - warm reds/oranges
      'Lung Cancer': '#FF4444',
      'Gynecologic Cancers': '#FF69B4',
      'Pancreatic & Colorectal Cancer': '#FF8C00',
      'Immunotherapy, Medical Oncology': '#DC143C',
      'Medical Oncology': '#B22222',
      'Medical and Radiation Oncology': '#FF6347',
      'Gastrointestinal Oncology': '#FF7F50',
      'Gastric & Oesophageal Cancers': '#CD5C5C',
      'Gynae-Oncology and Early Phase Clinical Trials': '#FF1493',
      'Head & Neck, Oral, Laryngeal, Thyroid Cancer': '#FF4500',
      'Breast, Liver, Lung, Esophageal, Gynecological Cancers': '#E9967A',
      'Liver and Solid Tumor Oncology': '#FA8072',
      'Radiation/Clinical Oncology: CNS, Cervical, Breast': '#FF69B4',
      'Clinical/Radiation Oncology: Prostate, Breast, Gynae': '#DA70D6',
      'Medical Oncology, Chemotherapy': '#DC143C',
      'Breast & Gynecologic Oncology': '#FF1493',
      'Surgical & Colorectal Oncology': '#FF6B6B',
      'Medical Oncology, Early Phase Trials': '#FF4757',
      'Pediatric Oncology (Neuroblastoma focus)': '#FFB6C1',
      'Breast & Cervical Cancer': '#FF69B4',
      'Hematologic Malignancies': '#9B59B6',
      'Breast Cancer, Immunotherapy': '#E74C3C',
      'Hematologic Oncology, Bone Marrow Transplant': '#8E44AD',
      'Gynecologic Oncology': '#FF1493',
      'Genitourinary Oncology (Prostate, Bladder, Kidney)': '#3498DB',
      'Lung and Colorectal Oncology': '#2ECC71',
      'Thoracic Oncology': '#16A085',
      'Breast & Ovarian Oncology': '#E91E63',
      'Pediatric Hematology-Oncology': '#9C27B0'
    };
    
    // Default colors for general categories
    if (specialty.includes('Pediatric')) return '#9C27B0';
    if (specialty.includes('Hematologic')) return '#8E44AD';
    if (specialty.includes('Breast')) return '#FF1493';
    if (specialty.includes('Lung') || specialty.includes('Thoracic')) return '#16A085';
    if (specialty.includes('Gastrointestinal') || specialty.includes('Gastric')) return '#F39C12';
    if (specialty.includes('Gynecologic') || specialty.includes('Gynae')) return '#FF69B4';
    
    return colorMap[specialty] || '#FF4444'; // Default red
  };

  // Size based on rating (higher rating = larger dot)
  const getPointSize = (rating) => {
    const baseSize = 0.6; // Smaller base size for proper dot appearance
    const maxBonus = 0.4; // Additional size for top ratings
    const minRating = 3.8;
    const maxRating = 4.9;
    
    const normalizedRating = (rating - minRating) / (maxRating - minRating);
    return baseSize + (normalizedRating * maxBonus);
  };

  return (
    <div className="w-full h-screen relative">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        pointsData={clusteredPersonas}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.012}
        pointColor={(d) => getSpecialtyColor(d.specialty)}
        pointRadius={0.45}
        pointResolution={12}
        
        // Tooltip configuration
        pointLabel={d => `
          <div style="background: rgba(0,0,0,0.9); color: white; padding: 10px; border-radius: 6px; font-size: 12px; border: 2px solid ${getSpecialtyColor(d.specialty)}; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <strong style="color: ${getSpecialtyColor(d.specialty)};">${d.name}</strong><br/>
            <span style="color: #cccccc;">${d.specialty}</span><br/>
            <span style="color: #ffdd44;">★ ${d.rating}/5</span> • <span style="color: #88dd88;">${d.location}</span>
          </div>
        `}
        
        // Click handler - map back by original coordinates when present
        onPointClick={(point) => {
          if (onPersonaClick) {
            // Use original coordinates if available (for clustered points)
            const keyLat = point.__origLat ?? point.lat;
            const keyLng = point.__origLng ?? point.lng;
            
            // Find the original persona by coordinates
            const originalPersona = personas.find(p => 
              Math.abs(p.lat - keyLat) < 0.001 && Math.abs(p.lng - keyLng) < 0.001
            ) || point;
            
            onPersonaClick(originalPersona);
          }
        }}
        
        // Globe styling
        atmosphereColor="lightblue"
        atmosphereAltitude={0.25}
        
        // Controls
        enablePointerInteraction={true}
      />
    </div>
  );
};

export default GlobeComponent;
