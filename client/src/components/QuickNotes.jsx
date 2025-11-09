import React, { useState, useEffect } from 'react';
import { quickNotesAPI } from '../services/api';
import './QuickNotes.css';

const QuickNotes = ({ onUpdate }) => {
  const [quickNotes, setQuickNotes] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchQuickNotes();
  }, []);

  const fetchQuickNotes = async () => {
    try {
      const response = await quickNotesAPI.getQuickNotes();
      setQuickNotes(response.data);
    } catch (error) {
      console.error('Error fetching quick notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      if (editingId) {
        await quickNotesAPI.updateQuickNote(editingId, editContent);
        setEditingId(null);
        setEditContent('');
      } else {
        await quickNotesAPI.createQuickNote(content);
        setContent('');
      }
      await fetchQuickNotes();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving quick note:', error);
      alert('Failed to save quick note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quick note?')) return;

    try {
      await quickNotesAPI.deleteQuickNote(id);
      await fetchQuickNotes();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting quick note:', error);
      alert('Failed to delete quick note');
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
    setContent('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="quick-notes card">
      <h2 className="section-title">⚡ Quick Notes</h2>
      
      <form onSubmit={handleSubmit} className="quick-notes-form">
        {editingId ? (
          <>
            <input
              type="text"
              className="input"
              placeholder="Edit quick note..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="quick-notes-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                Update
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              className="input"
              placeholder="Add a quick note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Add Note
            </button>
          </>
        )}
      </form>

      <div className="quick-notes-list">
        {quickNotes.length === 0 ? (
          <p className="empty-message">No quick notes yet. Add one above!</p>
        ) : (
          quickNotes.map((note) => (
            <div key={note._id} className="quick-note-item">
              <p>{note.content}</p>
              <div className="quick-note-actions">
                <button
                  onClick={() => startEdit(note)}
                  className="btn-edit"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="btn-delete"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickNotes;

