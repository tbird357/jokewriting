import React, { useState } from 'react';
import { jokeService } from '../../services/supabaseService';

function ParallelsPhase({ jokeData, setJokeData, nextPhase }) {
  const [parallel, setParallel] = useState('');
  const [parallels, setParallels] = useState(jokeData?.parallels || []);

  const handleAddParallel = () => {
    if (!parallel.trim()) return;
    const newParallels = [...parallels, parallel];
    setParallels(newParallels);
    setParallel('');
  };

  const handleRemoveParallel = (index) => {
    const newParallels = parallels.filter((_, i) => i !== index);
    setParallels(newParallels);
  };

  const handleSave = async () => {
    try {
      const updatedJoke = await jokeService.saveJoke({
        ...jokeData,
        parallels: parallels
      });
      if (updatedJoke) {
        setJokeData(updatedJoke);
        nextPhase();
      }
    } catch (error) {
      console.error('Error saving parallels:', error);
    }
  };

  return (
    <div className="phase-container">
      <h2>Parallel Development</h2>
      <div className="premise-review">
        <h3>Premise:</h3>
        <p>{jokeData?.premise || 'No premise yet'}</p>
      </div>
      <div className="parallel-input">
        <input
          type="text"
          value={parallel}
          onChange={(e) => setParallel(e.target.value)}
          placeholder="Add a parallel..."
        />
        <button onClick={handleAddParallel}>Add</button>
      </div>
      <div className="parallels-list">
        {parallels.map((p, index) => (
          <div key={index} className="parallel-item">
            <span>{p}</span>
            <button onClick={() => handleRemoveParallel(index)}>×</button>
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Save & Continue</button>
    </div>
  );
}

export default ParallelsPhase; 