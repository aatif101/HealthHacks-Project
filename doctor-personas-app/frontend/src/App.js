import React, { useState, useEffect } from 'react';
import GlobeComponent from './components/Globe';
import PersonaCard from './components/PersonaCard';
import { convertPersonasToGlobePoints } from './utils/coordinateMapping';
import './index.css';

function App() {
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientInput, setPatientInput] = useState('');
  const [selectedCancerType, setSelectedCancerType] = useState('');
  const [consultationResults, setConsultationResults] = useState([]);
  const [isConsulting, setIsConsulting] = useState(false);

  // Extract unique cancer types from personas
  const cancerTypes = [
    'All Cancer Types',
    'Lung Cancer',
    'Breast Cancer',
    'Gynecologic Cancers',
    'Colorectal Cancer',
    'Pancreatic Cancer',
    'Gastrointestinal Oncology',
    'Head & Neck Cancer',
    'Liver Cancer',
    'Pediatric Oncology',
    'Hematologic Malignancies',
    'Medical Oncology',
    'Radiation Oncology',
    'Surgical Oncology',
    'Immunotherapy'
  ];

  useEffect(() => {
    fetchPersonas();
  }, []);

  useEffect(() => {
    filterPersonas();
  }, [personas, selectedCancerType]);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/personas');
      const data = await response.json();
      
      if (data.success) {
        const personasWithCoordinates = convertPersonasToGlobePoints(data.data);
        setPersonas(personasWithCoordinates);
        setFilteredPersonas(personasWithCoordinates);
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

  const filterPersonas = () => {
    if (!selectedCancerType || selectedCancerType === 'All Cancer Types') {
      setFilteredPersonas(personas);
    } else {
      const filtered = personas.filter(persona => 
        persona.specialty.toLowerCase().includes(selectedCancerType.toLowerCase()) ||
        persona.focus?.some(focus => focus.toLowerCase().includes(selectedCancerType.toLowerCase()))
      );
      setFilteredPersonas(filtered);
    }
  };

  const handlePersonaClick = (persona) => {
    setSelectedPersona(persona);
  };

  const handleGetConsultations = async () => {
    if (!patientInput.trim()) {
      alert('Please describe your medical situation or diagnosis');
      return;
    }

    setIsConsulting(true);
    setConsultationResults([]);

    // Get top 3-5 relevant doctors based on cancer type
    const relevantDoctors = filteredPersonas.slice(0, 5);
    
    try {
      const consultations = await Promise.all(
        relevantDoctors.map(async (persona) => {
          try {
            const response = await fetch('/api/consult', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                personaId: persona.id,
                patientSummary: patientInput.trim()
              })
            });

            const data = await response.json();
            if (data.success) {
              return { persona, consultation: data.data };
            }
            return null;
          } catch (err) {
            console.error(`Error consulting ${persona.name}:`, err);
            return null;
          }
        })
      );

      const validConsultations = consultations.filter(Boolean);
      setConsultationResults(validConsultations);
    } catch (err) {
      console.error('Consultation error:', err);
      alert('Failed to get consultations. Please try again.');
    } finally {
      setIsConsulting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 mt-6">Loading Global Medical Network</h2>
          <p className="text-blue-300">Connecting to AI-powered oncologists worldwide...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connection Failed</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchPersonas}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Globe Section - Top 60% */}
      <div className="relative h-[60vh] w-full">
        <GlobeComponent 
          personas={filteredPersonas}
          onPersonaClick={handlePersonaClick}
        />
        
        {/* Floating Header */}
        <div className="absolute top-6 left-6 z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Medical Consultation
          </h1>
          <p className="text-blue-300 text-lg">
            Connect with {filteredPersonas.length} oncologists worldwide
          </p>
        </div>
      </div>

      {/* Input Section - Bottom 40% */}
      <div className="h-[40vh] bg-gradient-to-t from-slate-800 to-transparent p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            
            {/* Main Input Area - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Describe Your Medical Situation
              </h2>
              
              {/* Futuristic Input Box */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-sm"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-1">
                  <textarea
                    value={patientInput}
                    onChange={(e) => setPatientInput(e.target.value)}
                    placeholder="Enter your diagnosis, symptoms, or medical concerns here..."
                    className="w-full h-32 bg-transparent text-white placeholder-gray-400 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                    rows={4}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGetConsultations}
                disabled={isConsulting || !patientInput.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isConsulting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Getting AI Consultations...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Get AI Medical Consultations</span>
                  </div>
                )}
              </button>
            </div>

            {/* Cancer Type Selector - Takes 1 column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Cancer Type
              </h3>
              
              {/* Futuristic Dropdown */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-xl">
                  <select
                    value={selectedCancerType}
                    onChange={(e) => setSelectedCancerType(e.target.value)}
                    className="w-full bg-transparent text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    {cancerTypes.map((type) => (
                      <option key={type} value={type} className="bg-slate-800 text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{filteredPersonas.length}</div>
                  <div className="text-sm text-gray-400">Available Doctors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Results Modal */}
      {consultationResults.length > 0 && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-600">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">AI Medical Consultations</h2>
                <button
                  onClick={() => setConsultationResults([])}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {consultationResults.map((result, index) => (
                <div key={index} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {result.persona.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{result.persona.name}</h3>
                      <p className="text-blue-300">{result.persona.specialty}</p>
                      <p className="text-gray-400 text-sm">{result.persona.location}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {result.consultation.consultation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Doctor Info Panel */}
      {selectedPersona && (
        <div className="fixed top-4 right-4 z-40 w-96 max-w-[calc(100vw-2rem)]">
          <div className="bg-slate-800/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Doctor Profile</h2>
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <PersonaCard persona={selectedPersona} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;