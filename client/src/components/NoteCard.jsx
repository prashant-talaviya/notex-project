import React from 'react';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete, onChat }) => {
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return 'No content';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="note-card card">
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>
      
      <p className="note-content">{truncateContent(note.content)}</p>

      <div className="note-card-actions">
        <button onClick={onChat} className="btn btn-primary">
          💬 Chat
        </button>
        <button onClick={onEdit} className="btn btn-secondary">
          ✏️ Edit
        </button>
        <button onClick={onDelete} className="btn btn-danger">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;

