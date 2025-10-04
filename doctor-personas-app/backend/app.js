const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Load personas data at startup
let personas = [];
try {
  const personasPath = path.join(__dirname, 'personas.json');
  const personasData = fs.readFileSync(personasPath, 'utf8');
  personas = JSON.parse(personasData);
  console.log(`✅ Loaded ${personas.length} doctor personas`);
} catch (error) {
  console.error('❌ Error loading personas.json:', error.message);
  process.exit(1);
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Doctor Personas API is running!',
    endpoints: [
      'GET /api/personas - Get all personas',
      'GET /api/personas/:id - Get specific persona',
      'POST /api/consult - Generate consultation preview'
    ],
    totalPersonas: personas.length
  });
});

// GET /api/personas - Return all personas
app.get('/api/personas', (req, res) => {
  try {
    res.json({
      success: true,
      count: personas.length,
      data: personas
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch personas'
    });
  }
});

// GET /api/personas/:id - Return specific persona
app.get('/api/personas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const persona = personas.find(p => p.id === id);
    
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Persona with id "${id}" not found`
      });
    }

    res.json({
      success: true,
      data: persona
    });
  } catch (error) {
    console.error('Error fetching persona:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch persona'
    });
  }
});

// POST /api/consult - Generate consultation preview
app.post('/api/consult', async (req, res) => {
  try {
    const { personaId, patientSummary } = req.body;

    // Validation
    if (!personaId || !patientSummary) {
      return res.status(400).json({
        success: false,
        error: 'Both personaId and patientSummary are required'
      });
    }

    // Find the persona
    const persona = personas.find(p => p.id === personaId);
    if (!persona) {
      return res.status(404).json({
        success: false,
        error: `Persona with id "${personaId}" not found`
      });
    }

    // Generate AI consultation using Gemini
    const prompt = `You are ${persona.name}, an oncologist specializing in ${persona.specialty} at ${persona.hospital}, ${persona.location}.
Style: ${persona.style.tone} — ${persona.style.communication}.
Decision-making: ${persona.style.decision_making}.
Focus areas: ${persona.focus.join(', ')}.
Experience: ${persona.experience}.

Patient case: ${patientSummary}

Respond as this doctor would in a consultation, previewing how they would talk to the patient. Keep it conversational, empathetic, and true to their communication style. Do not provide a new diagnosis - focus on explaining the situation and potential next steps in this doctor's unique voice.

Limit response to 200-300 words.`;

    console.log(`🤖 Generating consultation for Dr. ${persona.name}...`);

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const consultationResponse = response.text();

    res.json({
      success: true,
      data: {
        persona: {
          id: persona.id,
          name: persona.name,
          specialty: persona.specialty,
          location: persona.location,
          style: persona.style
        },
        patientSummary,
        consultation: consultationResponse,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating consultation:', error);
    
    // Handle Gemini specific errors
    if (error.message?.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Gemini API key. Please check your GEMINI_API_KEY in .env file.'
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(402).json({
        success: false,
        error: 'Gemini API quota exceeded. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate consultation preview',
      details: error.message
    });
  }
});

// Debug endpoint (remove before production)
// app.get('/api/debug/models', ...)

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Doctor Personas API running on port ${PORT}`);
  console.log(`📋 Loaded ${personas.length} doctor personas`);
  console.log(`🌍 Access at: http://localhost:${PORT}`);
  console.log('📝 Make sure to set GEMINI_API_KEY in your .env file');
});

module.exports = app;