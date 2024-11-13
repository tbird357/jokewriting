import React, { useState, useEffect } from 'react';
import { jokeService } from '../../services/supabaseService';

function IdeaPhase({ jokeData, setJokeData, nextPhase }) {
  const [premise, setPremise] = useState(jokeData.premise);

  const handleSave = async () => {
    try {
      const updatedJoke = await jokeService.saveJoke({
        ...jokeData,
        premise
      });
      setJokeData(updatedJoke);
      nextPhase();
    } catch (error) {
      console.error('Error saving premise:', error);
    }
  };

  return (
    <div className="phase-container">
      <h2>Premise Development</h2>
      <textarea
        value={premise}
        onChange={(e) => setPremise(e.target.value)}
        placeholder="Write your joke premise here..."
        rows={5}
      />
      <button onClick={handleSave}>Save & Continue</button>
    </div>
  );
}

export default IdeaPhase; 