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
  const [hasSearched, setHasSearched] = useState(false);
  const [consultationResults, setConsultationResults] = useState({});
  const [loadingConsultations, setLoadingConsultations] = useState({});

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
    if (hasSearched) {
      filterPersonas();
    }
  }, [personas, selectedCancerType, patientInput, hasSearched]);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/personas');
      const data = await response.json();
      
      if (data.success) {
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

  const filterPersonas = () => {
    let filtered = personas;

    // Filter by cancer type
    if (selectedCancerType && selectedCancerType !== 'All Cancer Types') {
      filtered = filtered.filter(persona => 
        persona.specialty.toLowerCase().includes(selectedCancerType.toLowerCase()) ||
        persona.focus?.some(focus => focus.toLowerCase().includes(selectedCancerType.toLowerCase()))
      );
    }

    // Smart filtering based on patient input
    if (patientInput.trim()) {
      const inputLower = patientInput.toLowerCase();
      const keywords = inputLower.split(' ');
      
      filtered = filtered.filter(persona => {
        const searchText = `${persona.specialty} ${persona.focus?.join(' ')} ${persona.name}`.toLowerCase();
        return keywords.some(keyword => 
          keyword.length > 2 && searchText.includes(keyword)
        );
      });
    }

    // Limit to top 8 most relevant doctors
    setFilteredPersonas(filtered.slice(0, 8));
  };

  const handlePersonaClick = (persona) => {
    setSelectedPersona(persona);
  };

  const handleSearch = () => {
    if (!patientInput.trim()) {
      alert('Please describe your medical situation');
      return;
    }
    setHasSearched(true);
  };

  const handleIndividualConsultation = async (persona) => {
    if (!patientInput.trim()) {
      alert('Please describe your medical situation first');
      return;
    }

    const personaId = persona.id;
    setLoadingConsultations(prev => ({ ...prev, [personaId]: true }));

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
        setConsultationResults(prev => ({
          ...prev,
          [personaId]: data.data
        }));
      } else {
        alert(`Consultation failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Consultation error:', err);
      alert('Failed to get consultation. Please try again.');
    } finally {
      setLoadingConsultations(prev => ({ ...prev, [personaId]: false }));
    }
  };

  const resetSearch = () => {
    setHasSearched(false);
    setPatientInput('');
    setSelectedCancerType('');
    setConsultationResults({});
    setSelectedPersona(null);
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

  // Landing Page - Before Search
  if (!hasSearched) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                AI Medical
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Consultation</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                Get personalized insights from world-class oncologists
              </p>
              <p className="text-lg text-blue-300">
                Connect with {personas.length} AI-powered cancer specialists worldwide
              </p>
            </div>

            {/* Main Input Area */}
            <div className="space-y-6 animate-slide-up">
              {/* Input Box */}
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-sm"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-2">
                  <textarea
                    value={patientInput}
                    onChange={(e) => setPatientInput(e.target.value)}
                    placeholder="Describe your medical situation, diagnosis, or concerns..."
                    className="w-full h-32 bg-transparent text-white placeholder-gray-400 p-6 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-lg"
                    rows={4}
                  />
                </div>
              </div>

              {/* Cancer Type Selector */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-sm"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl">
                    <select
                      value={selectedCancerType}
                      onChange={(e) => setSelectedCancerType(e.target.value)}
                      className="w-full bg-transparent text-white p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 appearance-none cursor-pointer text-center"
                    >
                      <option value="" className="bg-slate-800 text-white">Select Cancer Type (Optional)</option>
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
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={!patientInput.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl hover:shadow-blue-500/25 text-lg"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Find My Doctors</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-delayed">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Network</h3>
                <p className="text-gray-400">Access oncologists from top medical centers worldwide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-gray-400">Get personalized insights based on your specific case</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-gray-400">Your medical information is protected and confidential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main View - After Search
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-slate-800/80 backdrop-blur-sm border-b border-slate-600/50 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={resetSearch}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">AI Medical Consultation</h1>
        </div>
        <div className="text-sm text-gray-400">
          Found {filteredPersonas.length} specialists
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Globe Section - Left 3/4 */}
        <div className="w-3/4 relative">
          <GlobeComponent 
            personas={filteredPersonas}
            onPersonaClick={handlePersonaClick}
          />
        </div>

        {/* Doctor List - Right 1/4 */}
        <div className="w-1/4 bg-slate-800/90 backdrop-blur-sm border-l border-slate-600/50 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Available Specialists</h2>
            
            <div className="space-y-4">
              {filteredPersonas.map((persona) => (
                <div key={persona.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {persona.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{persona.name}</h3>
                      <p className="text-xs text-blue-300 truncate">{persona.specialty}</p>
                      <p className="text-xs text-gray-400 truncate">{persona.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-gray-300 text-sm">{persona.rating}</span>
                    </div>
                    <button
                      onClick={() => handlePersonaClick(persona)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Consultation Button */}
                  <button
                    onClick={() => handleIndividualConsultation(persona)}
                    disabled={loadingConsultations[persona.id]}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    {loadingConsultations[persona.id] ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                        <span>Consulting...</span>
                      </div>
                    ) : (
                      "See what this doctor might say"
                    )}
                  </button>

                  {/* Consultation Result */}
                  {consultationResults[persona.id] && (
                    <div className="mt-3 bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-semibold text-green-400">Consultation</h4>
                        <button
                          onClick={() => setConsultationResults(prev => {
                            const newResults = { ...prev };
                            delete newResults[persona.id];
                            return newResults;
                          })}
                          className="text-gray-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-xs text-gray-200 leading-relaxed max-h-32 overflow-y-auto">
                        {consultationResults[persona.id].consultation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedPersona && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-600">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Doctor Profile</h2>
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <PersonaCard persona={selectedPersona} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;