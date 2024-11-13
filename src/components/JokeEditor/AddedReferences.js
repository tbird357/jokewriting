import React, { useState, useEffect } from 'react';
import { referenceService } from '../../services/supabaseService';

function AddedReferences({ jokeId }) {
  const [references, setReferences] = useState({});
  const [elaborations, setElaborations] = useState({});

  const referenceTypes = [
    'people',
    'places',
    'things',
    'words',
    'phrases',
    'cliches',
    'events'
  ];

  useEffect(() => {
    if (jokeId) {
      loadReferences();
    } else {
      setReferences({});
      setElaborations({});
    }
  }, [jokeId]);

  const loadReferences = async () => {
    try {
      const data = await referenceService.getReferences(jokeId);
      const groupedReferences = data.reduce((acc, ref) => {
        if (!acc[ref.type]) acc[ref.type] = [];
        acc[ref.type].push(ref);
        return acc;
      }, {});
      setReferences(groupedReferences);
      
      const newElaborations = {};
      data.forEach(ref => {
        newElaborations[ref.id] = ref.elaboration || '';
      });
      setElaborations(newElaborations);
    } catch (error) {
      console.error('Error loading references:', error);
    }
  };

  const handleDeleteReference = async (referenceId) => {
    try {
      await referenceService.deleteReference(referenceId);
      loadReferences();
    } catch (error) {
      console.error('Error deleting reference:', error);
    }
  };

  const handleElaborationChange = async (refId, value) => {
    try {
      await referenceService.updateElaboration(refId, value);
      setElaborations(prev => ({
        ...prev,
        [refId]: value
      }));
    } catch (error) {
      console.error('Error updating elaboration:', error);
    }
  };

  return (
    <div className="added-references">
      {referenceTypes.map(type => {
        const typeReferences = references[type] || [];
        if (typeReferences.length === 0) return null;

        return (
          <div key={type} className="reference-category">
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <div className="reference-items">
              {typeReferences.map(ref => (
                <div key={ref.id} className="reference-item-container">
                  <div className="reference-item">
                    <span>{ref.item}</span>
                    <button 
                      onClick={() => handleDeleteReference(ref.id)}
                      className="delete-reference-btn"
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={elaborations[ref.id] || ''}
                    onChange={(e) => handleElaborationChange(ref.id, e.target.value)}
                    placeholder="Add notes or elaboration..."
                    className="elaboration-textarea"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AddedReferences; 