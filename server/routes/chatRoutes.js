const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/:noteId', chatController.chatWithNote);
router.get('/:noteId/history', chatController.getChatHistory);
router.get('/stats/conversations', chatController.getConversationsCount);

module.exports = router;

