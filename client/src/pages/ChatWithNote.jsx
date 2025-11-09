import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesAPI, chatAPI } from '../services/api';
import ChatBox from '../components/ChatBox';
import './ChatWithNote.css';

const ChatWithNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNote();
    fetchChatHistory();
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const response = await notesAPI.getNote(noteId);
      setNote(response.data);
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Note not found');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await chatAPI.getChatHistory(noteId);
      setChats(response.data.reverse()); // Show oldest first
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (question) => {
    if (!question.trim()) return;

    setSending(true);
    const userMessage = { question, answer: '', isUser: true, timestamp: new Date() };
    setChats((prev) => [...prev, userMessage]);

    try {
      const response = await chatAPI.chatWithNote(noteId, question);
      const aiMessage = {
        question: response.data.question,
        answer: response.data.answer,
        isUser: false,
        timestamp: new Date()
      };
      setChats((prev) => [...prev.filter((c) => c !== userMessage), aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to get response. Please try again.');
      setChats((prev) => prev.filter((c) => c !== userMessage));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button onClick={() => navigate('/notes')} className="back-btn">
          ← Back to Notes
        </button>
        <h1>💬 Chat with Note</h1>
        <h2 className="note-title-chat">{note.title}</h2>
      </div>

      <div className="chat-container">
        <div className="chat-history">
          <div className="note-preview">
            <h3>Note Content:</h3>
            <div className="note-preview-content">
              <p>{note.content}</p>
            </div>
          </div>

          <div className="chat-messages">
            <h3>Conversation:</h3>
            {chats.length === 0 ? (
              <p className="no-chats">No conversations yet. Ask a question to get started!</p>
            ) : (
              chats.map((chat, index) => (
                <div key={index} className={`chat-message ${chat.isUser ? 'user-message' : 'ai-message'}`}>
                  <div className="message-header">
                    <span className="message-author">
                      {chat.isUser ? '👤 You' : '🤖 AI'}
                    </span>
                    <span className="message-time">
                      {new Date(chat.timestamp || chat.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-content">
                    {chat.isUser ? (
                      <p><strong>Q:</strong> {chat.question}</p>
                    ) : (
                      <>
                        <p><strong>Q:</strong> {chat.question}</p>
                        <p><strong>A:</strong> {chat.answer}</p>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <ChatBox onSendMessage={handleSendMessage} sending={sending} />
      </div>
    </div>
  );
};

export default ChatWithNote;

