const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load personas data
let personas = [];
try {
  const personasData = fs.readFileSync(path.join(__dirname, 'personas.json'), 'utf8');
  personas = JSON.parse(personasData);
  console.log(`Loaded ${personas.length} doctor personas`);
} catch (error) {
  console.error('Error loading personas:', error);
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!', 
    timestamp: new Date().toISOString(),
    personasLoaded: personas.length
  });
});

// Get all personas
app.get('/api/personas', (req, res) => {
  const { cancer_type, region, style, limit } = req.query;
  
  let filteredPersonas = [...personas];
  
  // Filter by cancer type
  if (cancer_type) {
    filteredPersonas = filteredPersonas.filter(persona =>
      persona.specialty.toLowerCase().includes(cancer_type.toLowerCase())
    );
  }
  
  // Filter by region
  if (region) {
    filteredPersonas = filteredPersonas.filter(persona =>
      persona.location.toLowerCase().includes(region.toLowerCase())
    );
  }
  
  // Filter by communication style
  if (style) {
    filteredPersonas = filteredPersonas.filter(persona =>
      persona.style.tone.toLowerCase().includes(style.toLowerCase())
    );
  }
  
  // Limit results
  if (limit) {
    filteredPersonas = filteredPersonas.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    count: filteredPersonas.length,
    data: filteredPersonas
  });
});

// Get persona by ID
app.get('/api/personas/:id', (req, res) => {
  const persona = personas.find(p => p.id === req.params.id);
  
  if (!persona) {
    return res.status(404).json({
      success: false,
      error: 'Persona not found'
    });
  }
  
  res.json({
    success: true,
    data: persona
  });
});

// Get personas by cancer type
app.get('/api/cancer/:type', (req, res) => {
  const cancerType = req.params.type.toLowerCase();
  const matchingPersonas = personas.filter(persona =>
    persona.specialty.toLowerCase().includes(cancerType)
  );
  
  res.json({
    success: true,
    cancer_type: req.params.type,
    count: matchingPersonas.length,
    data: matchingPersonas
  });
});

// Submit diagnosis and get matching personas
app.post('/api/diagnoses', (req, res) => {
  const { diagnosis_text, preferred_regions, preferred_styles } = req.body;
  
  if (!diagnosis_text) {
    return res.status(400).json({
      success: false,
      error: 'Diagnosis text is required'
    });
  }
  
  // Simple cancer type detection
  const cancerTypes = ['breast', 'lung', 'colorectal', 'leukemia', 'prostate'];
  const detectedCancer = cancerTypes.find(type =>
    diagnosis_text.toLowerCase().includes(type)
  );
  
  let matchingPersonas = personas;
  
  // Filter by detected cancer type
  if (detectedCancer) {
    matchingPersonas = matchingPersonas.filter(persona =>
      persona.specialty.toLowerCase().includes(detectedCancer)
    );
  }
  
  // Filter by preferred regions
  if (preferred_regions && preferred_regions.length > 0) {
    matchingPersonas = matchingPersonas.filter(persona =>
      preferred_regions.some(region =>
        persona.location.toLowerCase().includes(region.toLowerCase())
      )
    );
  }
  
  // Filter by preferred styles
  if (preferred_styles && preferred_styles.length > 0) {
    matchingPersonas = matchingPersonas.filter(persona =>
      preferred_styles.includes(persona.style.tone)
    );
  }
  
  res.json({
    success: true,
    detected_cancer_type: detectedCancer,
    matching_personas: matchingPersonas.length,
    data: matchingPersonas.slice(0, 6) // Limit to 6 for comparison
  });
});

app.listen(PORT, () => {
  console.log(`🏥 Doctor Personas API running on port ${PORT}`);
  console.log(`📊 Loaded ${personas.length} doctor personas`);
});

module.exports = app;
