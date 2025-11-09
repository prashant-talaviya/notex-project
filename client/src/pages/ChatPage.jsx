import React, { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../services/api';
import './ChatPage.css';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('generalChats');
    if (savedChats) {
      try {
        setChats(JSON.parse(savedChats));
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('generalChats', JSON.stringify(chats));
    }
  }, [chats]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const questionText = input.trim();
    setInput('');
    setSending(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: questionText,
      timestamp: new Date().toISOString()
    };
    
    setChats((prev) => [...prev, userMessage]);

    try {
      const response = await aiAPI.generalChat(questionText);
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.answer || 'I apologize, but I could not generate a response.',
        timestamp: new Date().toISOString()
      };
      
      setChats((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I apologize, but I encountered an error. Please make sure your Gemini API key is configured correctly. Error: ${error.response?.data?.message || error.message}`,
        timestamp: new Date().toISOString(),
        error: true
      };
      setChats((prev) => [...prev, aiMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    
    // For now, we'll show a message that file upload is being processed
    // You can enhance this to actually upload and process the file
    const fileMessage = {
      id: Date.now(),
      role: 'user',
      content: `📎 Uploaded file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      timestamp: new Date().toISOString(),
      file: true
    };
    
    setChats((prev) => [...prev, fileMessage]);

    // Simulate file processing
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I've received your file "${file.name}". File upload and processing feature is coming soon! For now, you can upload PDFs through the Notes page and chat with them there.`,
        timestamp: new Date().toISOString()
      };
      setChats((prev) => [...prev, aiResponse]);
      setUploadingFile(false);
    }, 1000);

    // Reset file input
    e.target.value = '';
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all chat history?')) {
      setChats([]);
      localStorage.removeItem('generalChats');
    }
  };

  return (
    <div className="modern-chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleClearChat}>
            <span>+</span> New Chat
          </button>
        </div>
        <div className="chat-history-sidebar">
          {chats.length > 0 && (
            <div className="history-item active">
              <span>💬 Current Chat</span>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h1>NoteX AI Assistant</h1>
          <p>Your intelligent study companion</p>
        </div>

        <div className="messages-container">
          {chats.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-icon">🤖</div>
              <h2>How can I help you today?</h2>
              <p>Ask me anything, and I'll assist you with your studies and notes.</p>
              <div className="suggestion-chips">
                <button 
                  className="suggestion-chip"
                  onClick={() => setInput('Explain quantum physics in simple terms')}
                >
                  Explain quantum physics in simple terms
                </button>
                <button 
                  className="suggestion-chip"
                  onClick={() => setInput('Help me create a study plan')}
                >
                  Help me create a study plan
                </button>
                <button 
                  className="suggestion-chip"
                  onClick={() => setInput('What are effective study techniques?')}
                >
                  What are effective study techniques?
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {chats.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      {message.content && typeof message.content === 'string' 
                        ? message.content.split('\n').map((line, i) => (
                            <p key={i}>{line || '\u00A0'}</p>
                          ))
                        : <p>{String(message.content || '')}</p>
                      }
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="message assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <button
              type="button"
              className="attach-file-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending || uploadingFile}
              title="Attach file"
            >
              📎
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt"
            />
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Message NoteX..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              rows="1"
              disabled={sending}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!input.trim() || sending}
            >
              {sending ? (
                <div className="spinner-small"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>
          <div className="input-footer">
            <p>NoteX can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
