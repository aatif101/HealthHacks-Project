import React, { useState, useEffect } from 'react';
import GlobeComponent from './components/Globe';
import PersonaCard from './components/PersonaCard';
import { convertPersonasToGlobePoints } from './utils/coordinateMapping';
import './index.css';

function App() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/personas');
      const data = await response.json();
      
      if (data.success) {
        // Convert personas data to include lat/lng coordinates
        const personasWithCoordinates = convertPersonasToGlobePoints(data.data);
        setPersonas(personasWithCoordinates);
      } else {
        setError(data.error || 'Failed to fetch personas');
      }
    } catch (err) {
      console.error('Error fetching personas:', err);
      setError('Failed to connect to backend. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaClick = (persona) => {
    setSelectedPersona(persona);
  };

  const handleConsultation = async (persona, patientSummary) => {
    if (!patientSummary || !patientSummary.trim()) {
      alert('Please provide patient information for the consultation.');
      return;
    }

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personaId: persona.id,
          patientSummary: patientSummary.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to generate consultation');
      }
    } catch (err) {
      console.error('Consultation error:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white mb-2">Loading Doctor Network</h2>
          <p className="text-gray-300">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchPersonas}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full Screen Globe */}
      <div className="absolute inset-0">
        <GlobeComponent 
          personas={personas}
          onPersonaClick={handlePersonaClick}
        />
      </div>

      {/* Floating Doctor Information Panel */}
      {selectedPersona && (
        <div className="absolute top-4 right-4 z-10 w-96 max-w-[calc(100vw-2rem)]">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Doctor Information</h2>
              <button
                onClick={() => setSelectedPersona(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PersonaCard 
              persona={selectedPersona} 
              onConsultation={handleConsultation}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
