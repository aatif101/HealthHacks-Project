import React, { useState } from 'react';

const PersonaCard = ({ persona, onConsultation }) => {
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [patientInfo, setPatientInfo] = useState('');
  const [consultationResult, setConsultationResult] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);

  if (!persona) {
    return (
      <div className="text-center text-gray-500">
        <p className="text-lg">Click on a point on the globe to view doctor information</p>
      </div>
    );
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }

    return stars;
  };

  const handleConsultation = async () => {
    if (!patientInfo.trim()) {
      alert('Please enter patient information');
      return;
    }

    setIsConsulting(true);
    try {
      const result = await onConsultation(persona, patientInfo);
      setConsultationResult(result);
      setShowConsultForm(false);
    } catch (error) {
      alert(`Consultation failed: ${error.message}`);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{persona.name}</h2>
        <p className="text-lg text-blue-600 font-medium">{persona.specialty}</p>
        <p className="text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {persona.location}
        </p>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <div className="flex items-center">
          <div className="flex mr-2">
            {renderStars(persona.rating)}
          </div>
          <span className="text-gray-600 font-medium">{persona.rating}/5</span>
        </div>
      </div>

      {/* Experience */}
      {persona.experience && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Experience</h3>
          <p className="text-gray-600 text-sm">{persona.experience}</p>
        </div>
      )}

      {/* Hospital */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Hospital</h3>
        <p className="text-gray-600">{persona.hospital}</p>
      </div>

      {/* Focus Areas */}
      {persona.focus && persona.focus.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Focus Areas</h3>
          <div className="flex flex-wrap gap-1">
            {persona.focus.map((area, index) => (
              <span 
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {persona.languages && persona.languages.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Languages</h3>
          <div className="flex flex-wrap gap-1">
            {persona.languages.map((language, index) => (
              <span 
                key={index}
                className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Communication Style */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Communication Style</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-600">Tone:</span>
            <span className="ml-2 text-gray-700">{persona.style.tone}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Communication:</span>
            <span className="ml-2 text-gray-700">{persona.style.communication}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Decision Making:</span>
            <span className="ml-2 text-gray-700">{persona.style.decision_making}</span>
          </div>
        </div>
      </div>

      {/* Sample Quote */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded mb-4">
        <p className="text-sm italic text-gray-700">"{persona.sample_quote}"</p>
      </div>

      {/* Consultation Section */}
      {onConsultation && (
        <div className="border-t border-gray-200 pt-4">
          {!showConsultForm && !consultationResult && (
            <button
              onClick={() => setShowConsultForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              💬 Get AI Consultation
            </button>
          )}

          {showConsultForm && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Patient Information</h4>
              <textarea
                value={patientInfo}
                onChange={(e) => setPatientInfo(e.target.value)}
                placeholder="Enter patient diagnosis, symptoms, or medical history..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleConsultation}
                  disabled={isConsulting || !patientInfo.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {isConsulting ? 'Consulting...' : 'Get Consultation'}
                </button>
                <button
                  onClick={() => setShowConsultForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {consultationResult && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">AI Consultation Result</h4>
                <button
                  onClick={() => {
                    setConsultationResult(null);
                    setPatientInfo('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {consultationResult.consultation}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                Generated: {new Date(consultationResult.generatedAt).toLocaleString()}
              </div>
              <button
                onClick={() => setShowConsultForm(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                New Consultation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonaCard;
