// Debug utility to help visualize clustering effects
export const analyzeClusters = (personas) => {
  const locationGroups = {};
  
  // Group personas by location
  personas.forEach(persona => {
    if (!locationGroups[persona.location]) {
      locationGroups[persona.location] = [];
    }
    locationGroups[persona.location].push(persona);
  });
  
  // Find locations with multiple doctors
  const multiDoctorLocations = Object.entries(locationGroups)
    .filter(([location, doctors]) => doctors.length > 1)
    .map(([location, doctors]) => ({
      location,
      count: doctors.length,
      doctors: doctors.map(d => d.name)
    }));
  
  console.log('Locations with multiple doctors:', multiDoctorLocations);
  
  return {
    totalLocations: Object.keys(locationGroups).length,
    totalPersonas: personas.length,
    multiDoctorLocations,
    averageDoctorsPerLocation: personas.length / Object.keys(locationGroups).length
  };
};
