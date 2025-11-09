const express = require('express');
const router = express.Router();
const { generateAIAction, callGeminiAPI } = require('../utils/geminiAPI');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/action', async (req, res) => {
  try {
    const { action, noteId } = req.body;

    if (!action || !noteId) {
      return res.status(400).json({ message: 'Please provide action and noteId' });
    }

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const result = await generateAIAction(action, note.content);
    res.json({ result });
  } catch (error) {
    console.error('AI Action Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// General chat endpoint (without note context)
router.post('/general-chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Please provide a question' });
    }

    // Use a general prompt for general chat
    const prompt = `You are a helpful AI assistant. Answer the following question clearly and concisely:

Question: ${question}

Please provide a helpful and accurate answer:`;

    const answer = await callGeminiAPI(prompt);
    res.json({ answer });
  } catch (error) {
    console.error('General Chat Error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error',
      answer: 'I apologize, but I could not generate a response at this time. Please try again later.'
    });
  }
});

module.exports = router;
