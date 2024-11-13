import React, { useState } from 'react';
import { jokeService } from '../../services/supabaseService';

function PunchlinePhase({ jokeData, setJokeData }) {
  const [punchline, setPunchline] = useState(jokeData.punchline || '');

  const handleSave = async () => {
    try {
      const updatedJoke = await jokeService.saveJoke({
        ...jokeData,
        punchline
      });
      setJokeData(updatedJoke);
    } catch (error) {
      console.error('Error saving punchline:', error);
    }
  };

  return (
    <div className="phase-container">
      <h2>Punchline Development</h2>
      <div className="premise-review">
        <h3>Premise:</h3>
        <p>{jokeData.premise}</p>
        <h3>Parallels:</h3>
        <ul>
          {jokeData.parallels?.map((parallel, index) => (
            <li key={index}>{parallel}</li>
          ))}
        </ul>
      </div>
      <textarea
        value={punchline}
        onChange={(e) => setPunchline(e.target.value)}
        placeholder="Write your punchline here..."
        rows={3}
      />
      <button onClick={handleSave}>Save Joke</button>
    </div>
  );
}

export default PunchlinePhase; 