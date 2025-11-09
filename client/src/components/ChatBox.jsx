import React, { useState } from 'react';
import './ChatBox.css';

const ChatBox = ({ onSendMessage, sending }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || sending) return;

    onSendMessage(question);
    setQuestion('');
  };

  return (
    <div className="chatbox card">
      <h3 className="chatbox-title">Ask a Question</h3>
      <form onSubmit={handleSubmit} className="chatbox-form">
        <textarea
          className="textarea chatbox-textarea"
          placeholder="Ask anything about this note..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows="4"
          disabled={sending}
        />
        <button
          type="submit"
          className="btn btn-primary chatbox-button"
          disabled={sending || !question.trim()}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div className="chatbox-suggestions">
        <p className="suggestions-title">Suggestions:</p>
        <div className="suggestions-list">
          <button
            className="suggestion-btn"
            onClick={() => setQuestion('Summarize this note')}
            disabled={sending}
          >
            Summarize this note
          </button>
          <button
            className="suggestion-btn"
            onClick={() => setQuestion('What are the key points?')}
            disabled={sending}
          >
            What are the key points?
          </button>
          <button
            className="suggestion-btn"
            onClick={() => setQuestion('Explain this in simple terms')}
            disabled={sending}
          >
            Explain in simple terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

