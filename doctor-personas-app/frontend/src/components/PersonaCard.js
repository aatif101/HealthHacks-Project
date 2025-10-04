import React, { useState } from 'react';
import './PersonaCard.css';

function PersonaCard({ persona }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStyleEmoji = (tone) => {
    const emojiMap = {
      'empathetic': '💙',
      'blunt': '⚡',
      'data-driven': '📊',
      'cautious': '🔍',
      'optimistic': '☀️',
      'holistic': '🌿',
      'cost-sensitive': '💰',
      'trial-focused': '🧪',
      'precise': '🎯',
      'methodical': '📋'
    };
    return emojiMap[tone] || '👨‍⚕️';
  };

  const getRegionFlag = (location) => {
    const flagMap = {
      'USA': '🇺🇸', 'Boston': '🇺🇸', 'Houston': '🇺🇸', 'Los Angeles': '🇺🇸',
      'UK': '🇬🇧', 'London': '🇬🇧', 'Edinburgh': '🇬🇧', 'Manchester': '🇬🇧',
      'India': '🇮🇳', 'Mumbai': '🇮🇳', 'Delhi': '🇮🇳', 'Ahmedabad': '🇮🇳',
      'Japan': '🇯🇵', 'Tokyo': '🇯🇵', 'Osaka': '🇯🇵',
      'China': '🇨🇳', 'Shanghai': '🇨🇳',
      'Nigeria': '🇳🇬', 'Lagos': '🇳🇬',
      'South Africa': '🇿🇦', 'Cape Town': '🇿🇦',
      'Brazil': '🇧🇷', 'São Paulo': '🇧🇷',
      'Mexico': '🇲🇽', 'Mexico City': '🇲🇽'
    };
    
    for (const [key, flag] of Object.entries(flagMap)) {
      if (location.includes(key)) return flag;
    }
    return '🌍';
  };

  return (
    <div className="persona-card">
      <div className="persona-header">
        <div className="persona-title">
          <h3>{persona.name}</h3>
          <div className="persona-badges">
            <span className="location-badge">
              {getRegionFlag(persona.location)} {persona.location}
            </span>
            <span className="style-badge">
              {getStyleEmoji(persona.style.tone)} {persona.style.tone}
            </span>
          </div>
        </div>
        <div className="persona-rating">
          ⭐ {persona.rating}
        </div>
      </div>

      <div className="persona-specialty">
        <strong>{persona.specialty}</strong>
      </div>

      <div className="persona-hospital">
        🏥 {persona.hospital}
      </div>

      <div className="persona-experience">
        👨‍⚕️ {persona.experience}
      </div>

      <div className="persona-quote">
        <em>"{persona.sample_quote}"</em>
      </div>

      <div className="persona-focus">
        <strong>Focus Areas:</strong>
        <div className="focus-tags">
          {persona.focus.map((area, index) => (
            <span key={index} className="focus-tag">{area}</span>
          ))}
        </div>
      </div>

      <button 
        className="toggle-details"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? 'Hide Details' : 'Show More'}
      </button>

      {showDetails && (
        <div className="persona-details">
          <div className="communication-style">
            <strong>Communication Style:</strong>
            <p>{persona.style.communication}</p>
          </div>
          
          <div className="decision-making">
            <strong>Decision Making:</strong>
            <p>{persona.style.decision_making}</p>
          </div>

          <div className="languages">
            <strong>Languages:</strong>
            <span>{persona.languages.join(', ')}</span>
          </div>

          {persona.publications && persona.publications.length > 0 && (
            <div className="publications">
              <strong>Recent Publications:</strong>
              <ul>
                {persona.publications.map((pub, index) => (
                  <li key={index}>{pub}</li>
                ))}
              </ul>
            </div>
          )}

          {persona.response_examples && persona.response_examples.length > 0 && (
            <div className="sample-response">
              <strong>Sample Consultation:</strong>
              <div className="case-example">
                <em>Case: {persona.response_examples[0].case}</em>
                <p>"{persona.response_examples[0].sample_response}"</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="persona-actions">
        <button className="consult-btn">
          💬 Get Consultation
        </button>
        <button className="compare-btn">
          ⚖️ Add to Compare
        </button>
      </div>
    </div>
  );
}

export default PersonaCard;
