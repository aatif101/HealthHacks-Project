import React from 'react';

const PersonaCard = ({ persona }) => {

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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-slate-600 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-white">{persona.name}</h2>
        <p className="text-lg text-blue-400 font-medium">{persona.specialty}</p>
        <p className="text-gray-300 flex items-center">
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
          <span className="text-gray-300 font-medium">{persona.rating}/5</span>
        </div>
      </div>

      {/* Experience */}
      {persona.experience && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">Experience</h3>
          <p className="text-gray-400 text-sm">{persona.experience}</p>
        </div>
      )}

      {/* Hospital */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-1">Hospital</h3>
        <p className="text-gray-400">{persona.hospital}</p>
      </div>

      {/* Focus Areas */}
      {persona.focus && persona.focus.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Focus Areas</h3>
          <div className="flex flex-wrap gap-1">
            {persona.focus.map((area, index) => (
              <span 
                key={index}
                className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-500/30"
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
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Languages</h3>
          <div className="flex flex-wrap gap-1">
            {persona.languages.map((language, index) => (
              <span 
                key={index}
                className="inline-block bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full border border-green-500/30"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Communication Style */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Communication Style</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-400">Tone:</span>
            <span className="ml-2 text-gray-300">{persona.style.tone}</span>
          </div>
          <div>
            <span className="font-medium text-gray-400">Communication:</span>
            <span className="ml-2 text-gray-300">{persona.style.communication}</span>
          </div>
          <div>
            <span className="font-medium text-gray-400">Decision Making:</span>
            <span className="ml-2 text-gray-300">{persona.style.decision_making}</span>
          </div>
        </div>
      </div>

      {/* Sample Quote */}
      <div className="bg-blue-500/10 border-l-4 border-blue-400 p-3 rounded mb-4">
        <p className="text-sm italic text-blue-200">"{persona.sample_quote}"</p>
      </div>

    </div>
  );
};

export default PersonaCard;
