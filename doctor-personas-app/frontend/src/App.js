import React, { useState, useEffect } from 'react';
import PersonaCard from './components/PersonaCard';
import Globe from './components/Globe';
import './App.css';

function App() {
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCancer, setSelectedCancer] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await fetch('/api/personas');
      const data = await response.json();
      if (data.success) {
        setPersonas(data.data);
        setFilteredPersonas(data.data);
      }
    } catch (error) {
      console.error('Error fetching personas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = personas;

    if (selectedCancer) {
      filtered = filtered.filter(persona =>
        persona.specialty.toLowerCase().includes(selectedCancer.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(persona =>
        persona.location.toLowerCase().includes(selectedRegion.toLowerCase())
      );
    }

    setFilteredPersonas(filtered);
  };

  const handleDiagnosisSubmit = async () => {
    if (!diagnosisText.trim()) return;

    try {
      const response = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagnosis_text: diagnosisText,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFilteredPersonas(data.data);
      }
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
    }
  };

  const cancerTypes = ['breast', 'lung', 'colorectal', 'leukemia', 'prostate'];
  const regions = ['USA', 'UK', 'India', 'Japan', 'China', 'Nigeria', 'South Africa', 'Brazil', 'Mexico'];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏥 AI Doctor Consultation Platform</h1>
        <p>Preview how doctors worldwide might respond to your cancer diagnosis</p>
      </header>

      <main>
        <section className="diagnosis-input">
          <h2>Share Your Diagnosis</h2>
          <textarea
            value={diagnosisText}
            onChange={(e) => setDiagnosisText(e.target.value)}
            placeholder="Paste your cancer diagnosis or medical report here..."
            rows={4}
            cols={80}
          />
          <button onClick={handleDiagnosisSubmit} disabled={!diagnosisText.trim()}>
            Get Doctor Opinions
          </button>
        </section>

        <section className="filters">
          <h2>Filter Doctors</h2>
          <div className="filter-controls">
            <select 
              value={selectedCancer} 
              onChange={(e) => setSelectedCancer(e.target.value)}
            >
              <option value="">All Cancer Types</option>
              {cancerTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Cancer
                </option>
              ))}
            </select>

            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>

            <button onClick={handleFilter}>Apply Filters</button>
          </div>
        </section>

        <Globe personas={filteredPersonas} />

        <section className="personas-grid">
          <h2>Doctor Personas ({filteredPersonas.length})</h2>
          {loading ? (
            <div className="loading">Loading doctors...</div>
          ) : (
            <div className="grid">
              {filteredPersonas.map(persona => (
                <PersonaCard key={persona.id} persona={persona} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>⚠️ This is a demo platform for educational purposes. Always consult with qualified medical professionals.</p>
      </footer>
    </div>
  );
}

export default App;
