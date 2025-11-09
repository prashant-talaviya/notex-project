import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI, aiAPI } from '../services/api';
import './AIShortcuts.css';

const AIShortcuts = () => {
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [result, setResult] = useState('');
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedNote) {
      alert('Please select a note first');
      return;
    }

    setLoading(true);
    setAction(actionType);
    setResult('');

    try {
      const response = await aiAPI.performAction(actionType, selectedNote);
      setResult(response.data.result);
    } catch (error) {
      console.error('Error performing AI action:', error);
      alert('Failed to perform AI action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { id: 'summarize', label: 'Summarize', icon: '📄' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'explain', label: 'Explain', icon: '💡' },
    { id: 'flashcards', label: 'Flashcards', icon: '🎴' }
  ];

  return (
    <div className="ai-shortcuts card">
      <h2 className="section-title">🤖 AI Study Tools</h2>
      
      <div className="ai-shortcuts-content">
        <div className="ai-notes-selector">
          <label>Select a note:</label>
          <select
            className="input"
            value={selectedNote}
            onChange={(e) => {
              setSelectedNote(e.target.value);
              setResult('');
            }}
          >
            <option value="">-- Choose a note --</option>
            {notes.map((note) => (
              <option key={note._id} value={note._id}>
                {note.title}
              </option>
            ))}
          </select>
        </div>

        <div className="ai-actions-grid">
          {actions.map((actionItem) => (
            <button
              key={actionItem.id}
              onClick={() => handleAction(actionItem.id)}
              className="ai-action-btn"
              disabled={loading || !selectedNote}
            >
              <span className="ai-action-icon">{actionItem.icon}</span>
              <span className="ai-action-label">{actionItem.label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="ai-loading">
            <div className="spinner"></div>
            <p>Processing with AI...</p>
          </div>
        )}

        {result && (
          <div className="ai-result">
            <h3>{action.charAt(0).toUpperCase() + action.slice(1)} Result:</h3>
            <div className="ai-result-content">
              <pre>{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIShortcuts;

