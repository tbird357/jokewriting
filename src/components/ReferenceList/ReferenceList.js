import React, { useState } from 'react';
import { referenceService } from '../../services/supabaseService';

function ReferenceList({ jokeId }) {
  const [newItem, setNewItem] = useState('');

  const referenceTypes = [
    'people',
    'places',
    'things',
    'words',
    'phrases',
    'cliches',
    'events'
  ];

  const handleAddItem = async (type) => {
    if (!jokeId || !newItem.trim()) return;
    
    try {
      await referenceService.saveReference(jokeId, type, newItem);
      setNewItem('');
    } catch (error) {
      console.error('Error adding reference:', error);
    }
  };

  if (!jokeId) {
    return (
      <div className="reference-list">
        <h2>References</h2>
        <p>Select or create a joke to add references</p>
      </div>
    );
  }

  return (
    <div className="reference-list">
      <h2>Add References</h2>
      <div className="reference-input">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Type here..."
          className="reference-text-input"
        />
        <div className="reference-buttons">
          {referenceTypes.map(type => (
            <button
              key={type}
              onClick={() => handleAddItem(type)}
              className="reference-type-btn"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReferenceList; 