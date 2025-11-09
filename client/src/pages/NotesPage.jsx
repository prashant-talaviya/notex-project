import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import './NotesPage.css';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setPdfFile(null);
    setShowModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setPdfFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (pdfFile) {
        // Upload PDF
        await notesAPI.uploadPDF(pdfFile, formData.title || undefined);
      } else if (editingNote) {
        // Update existing note
        await notesAPI.updateNote(editingNote._id, formData.title, formData.content);
      } else {
        // Create new note
        await notesAPI.createNote(formData.title, formData.content);
      }

      setShowModal(false);
      setFormData({ title: '', content: '' });
      setPdfFile(null);
      await fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesAPI.deleteNote(id);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleChatWithNote = (noteId) => {
    navigate(`/chat/${noteId}`);
  };

  if (loading) {
    return (
      <div className="notes-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="notes-header">
        <h1>📚 My Notes</h1>
        <button onClick={handleCreateNote} className="btn btn-primary">
          + Create Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="empty-notes">
          <p>No notes yet. Create your first note to get started!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => handleEditNote(note)}
              onDelete={() => handleDeleteNote(note._id)}
              onChat={() => handleChatWithNote(note._id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingNote ? 'Edit Note' : 'Create Note'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Note title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {!pdfFile && (
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    className="textarea"
                    placeholder="Note content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required={!editingNote || !pdfFile}
                  />
                </div>
              )}

              {!editingNote && (
                <div className="form-group">
                  <label>Or Upload PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPdfFile(file);
                        setFormData({ ...formData, content: '' });
                      }
                    }}
                  />
                  {pdfFile && (
                    <p className="file-info">Selected: {pdfFile.name}</p>
                  )}
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {uploading ? 'Saving...' : editingNote ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;

