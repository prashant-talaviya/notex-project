import React from 'react';
import './RecentNotes.css';

const RecentNotes = ({ notes, navigate }) => {
  const handleOpenNote = (noteId) => {
    navigate(`/chat/${noteId}`);
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="recent-notes card">
      <h2 className="section-title">📚 Recent Notes</h2>
      
      <div className="recent-notes-list">
        {notes.length === 0 ? (
          <p className="empty-message">No notes yet. Create your first note!</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="recent-note-item">
              <div className="recent-note-content">
                <h3>{note.title}</h3>
                <p>{truncateContent(note.content)}</p>
                <span className="recent-note-date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => handleOpenNote(note._id)}
                className="btn btn-primary"
              >
                Open
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentNotes;

