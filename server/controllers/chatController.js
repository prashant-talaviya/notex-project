const Chat = require('../models/Chat');
const Note = require('../models/Note');
const { askGemini } = require('../utils/geminiAPI');

// Chat with note
exports.chatWithNote = async (req, res) => {
  try {
    const { question } = req.body;
    const { noteId } = req.params;

    if (!question) {
      return res.status(400).json({ message: 'Please provide a question' });
    }

    // Get note
    const note = await Note.findOne({
      _id: noteId,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Get answer from Gemini
    const answer = await askGemini(question, note.content);

    // Save chat to database
    const chat = new Chat({
      userId: req.user.userId,
      noteId,
      question,
      answer
    });

    await chat.save();

    res.json({
      question,
      answer,
      chatId: chat._id
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: error.message || 'Server error during chat' });
  }
};

// Get chat history for a note
exports.getChatHistory = async (req, res) => {
  try {
    const { noteId } = req.params;

    const chats = await Chat.find({
      noteId,
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations count for user
exports.getConversationsCount = async (req, res) => {
  try {
    const count = await Chat.distinct('noteId', { userId: req.user.userId }).then(ids => ids.length);
    res.json({ count });
  } catch (error) {
    console.error('Get Conversations Count Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

