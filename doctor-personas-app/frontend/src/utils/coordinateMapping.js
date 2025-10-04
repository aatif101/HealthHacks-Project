// Mapping of city names to approximate lat/lng coordinates
export const cityCoordinates = {
  // North America
  "Durham, USA": { lat: 35.9940, lng: -78.8986 },
  "San Diego, USA": { lat: 32.7157, lng: -117.1611 },
  "New York, USA": { lat: 40.7128, lng: -74.0060 },
  "Mexico City, Mexico": { lat: 19.4326, lng: -99.1332 },
  
  // South America
  "Sao Paulo, Brazil": { lat: -23.5505, lng: -46.6333 },
  "São Paulo, Brazil": { lat: -23.5505, lng: -46.6333 },
  "Rio de Janeiro, Brazil": { lat: -22.9068, lng: -43.1729 },
  "Buenos Aires, Argentina": { lat: -34.6118, lng: -58.3960 },
  "Bogotá, Colombia": { lat: 4.7110, lng: -74.0721 },
  
  // Europe
  "London, UK": { lat: 51.5074, lng: -0.1278 },
  "Paris, France": { lat: 48.8566, lng: 2.3522 },
  "Munich, Germany": { lat: 48.1351, lng: 11.5820 },
  "Berlin, Germany": { lat: 52.5200, lng: 13.4050 },
  "Madrid, Spain": { lat: 40.4168, lng: -3.7038 },
  
  // Asia
  "Tokyo, Japan": { lat: 35.6762, lng: 139.6503 },
  "Chiba, Japan": { lat: 35.6074, lng: 140.1065 },
  "Seoul, South Korea": { lat: 37.5665, lng: 126.9780 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Guangzhou, China": { lat: 23.1291, lng: 113.2644 },
  "Ahmedabad, India": { lat: 23.0225, lng: 72.5714 },
  "Chennai, India": { lat: 13.0827, lng: 80.2707 },
  "Mumbai, India": { lat: 19.0760, lng: 72.8777 },
  
  // Africa
  "Lagos, Nigeria": { lat: 6.5244, lng: 3.3792 },
  "Johannesburg, South Africa": { lat: -26.2041, lng: 28.0473 },
  "Cape Town, South Africa": { lat: -33.9249, lng: 18.4241 },
  
  // Legacy entries (kept for compatibility)
  "Cairo, Egypt": { lat: 30.0444, lng: 31.2357 },
  "Sydney, Australia": { lat: -33.8688, lng: 151.2093 },
  "Moscow, Russia": { lat: 55.7558, lng: 37.6176 }
};

// Function to get coordinates for a location
export const getCoordinatesForLocation = (location) => {
  return cityCoordinates[location] || { lat: 0, lng: 0 };
};

// Function to convert personas data to globe points
export const convertPersonasToGlobePoints = (personas) => {
  return personas.map(persona => {
    const coords = getCoordinatesForLocation(persona.location);
    return {
      ...persona,
      lat: coords.lat,
      lng: coords.lng
    };
  });
};
