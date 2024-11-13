import React, { useState, useEffect } from 'react';
import ReferenceList from './components/ReferenceList/ReferenceList';
import Header from './components/Layout/Header';
import { jokeService } from './services/supabaseService';
import AddedReferences from './components/JokeEditor/AddedReferences';
import './styles/index.css';

function App() {
  const [jokes, setJokes] = useState([]);
  const [currentJoke, setCurrentJoke] = useState({
    id: null,
    title: '',
    premise: '',
    punchline: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJokes();
  }, []);

  const loadJokes = async () => {
    try {
      const { data } = await jokeService.getJokes();
      if (data) setJokes(data);
    } catch (error) {
      console.error('Error loading jokes:', error);
      setError(error.message || 'Error connecting to database');
    }
  };

  const handleSave = async () => {
    try {
      const savedJoke = await jokeService.saveJoke(currentJoke);
      setCurrentJoke(savedJoke);
      loadJokes(); // Refresh the jokes list
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (jokeId) => {
    if (window.confirm('Are you sure you want to delete this joke?')) {
      try {
        await jokeService.deleteJoke(jokeId);
        if (currentJoke.id === jokeId) {
          startNewJoke();
        }
        loadJokes();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const startNewJoke = () => {
    setCurrentJoke({
      id: null,
      title: '',
      premise: '',
      punchline: '',
    });
  };

  const selectJoke = (joke) => {
    setCurrentJoke(joke);
  };

  return (
    <div className="app">
      <Header />
      {error && (
        <div className="error-message" style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          margin: '10px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <div className="main-content">
        <div className="joke-workspace">
          <div className="joke-list">
            <h2>My Jokes</h2>
            <button onClick={startNewJoke} className="new-joke-btn">New Joke</button>
            <div className="jokes-container">
              {jokes.map(joke => (
                <div 
                  key={joke.id} 
                  className={`joke-item ${joke.id === currentJoke.id ? 'selected' : ''}`}
                >
                  <div onClick={() => selectJoke(joke)}>
                    <h3>{joke.title || 'Untitled Joke'}</h3>
                    <p>{joke.premise.substring(0, 50)}...</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(joke.id);
                    }}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="joke-editor">
            <div className="joke-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={currentJoke.title || ''}
                  onChange={(e) => setCurrentJoke({...currentJoke, title: e.target.value})}
                  placeholder="Give your joke a name..."
                />
              </div>
              <div className="form-group">
                <label>Premise:</label>
                <textarea
                  value={currentJoke.premise || ''}
                  onChange={(e) => setCurrentJoke({...currentJoke, premise: e.target.value})}
                  placeholder="Write your premise here..."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Punchline:</label>
                <textarea
                  value={currentJoke.punchline || ''}
                  onChange={(e) => setCurrentJoke({...currentJoke, punchline: e.target.value})}
                  placeholder="Write your punchline here..."
                  rows={3}
                />
              </div>
              <div className="added-references-container">
                <AddedReferences jokeId={currentJoke.id} />
              </div>
              <button onClick={handleSave} className="save-btn">Save Joke</button>
            </div>
          </div>
        </div>
        <ReferenceList jokeId={currentJoke.id} />
      </div>
    </div>
  );
}

export default App; 