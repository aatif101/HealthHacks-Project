import { getCoordinatesForLocation } from './coordinateMapping';

/**
 * Converts doctor personas to GlobePoint format for PhysicalGlobe
 * @param {Array} personas - Array of doctor persona objects
 * @returns {Array} Array of GlobePoint objects
 */
export const convertPersonasToGlobePoints = (personas) => {
  return personas.map(persona => {
    const coords = getCoordinatesForLocation(persona.location);
    
    return {
      lat: coords.lat,
      lng: coords.lng,
      label: `${persona.name} - ${persona.specialty}`,
      color: getSpecialtyColor(persona.specialty),
      size: getPointSize(persona.rating),
      // Store the full persona data for click handling
      persona: persona
    };
  });
};

/**
 * Get color based on medical specialty
 * @param {string} specialty - Medical specialty
 * @returns {string} Hex color string
 */
const getSpecialtyColor = (specialty) => {
  const specialtyColors = {
    'Cardiology': '#ff4444',        // Red - heart
    'Neurology': '#44ff44',         // Green - brain/nerves
    'Pediatrics': '#ffff44',        // Yellow - children
    'Oncology': '#ff44ff',          // Magenta - cancer treatment
    'Orthopedics': '#44ffff',       // Cyan - bones/joints
    'Dermatology': '#ffa500',       // Orange - skin
    'Psychiatry': '#9966ff',        // Purple - mental health
    'Emergency Medicine': '#ff6644', // Red-orange - emergency
    'Family Medicine': '#66ff44',   // Light green - general
    'Endocrinology': '#4466ff'      // Blue - hormones
  };

  return specialtyColors[specialty] || '#e5e5e5'; // Default light gray
};

/**
 * Get point size based on doctor rating
 * @param {number} rating - Doctor rating (1-5)
 * @returns {number} Point size (0-1 range)
 */
const getPointSize = (rating) => {
  // Map rating (4.6-4.9) to point size (0.3-0.8)
  const minRating = 4.6;
  const maxRating = 4.9;
  const minSize = 0.3;
  const maxSize = 0.8;
  
  const normalizedRating = Math.max(0, Math.min(1, (rating - minRating) / (maxRating - minRating)));
  return minSize + (normalizedRating * (maxSize - minSize));
};

/**
 * Get doctor persona from a GlobePoint click event
 * @param {Object} globePoint - The clicked globe point
 * @returns {Object} Doctor persona object
 */
export const getPersonaFromGlobePoint = (globePoint) => {
  return globePoint.persona;
};
