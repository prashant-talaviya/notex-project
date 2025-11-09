const express = require('express');
const router = express.Router();
const quickNoteController = require('../controllers/quickNoteController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', quickNoteController.getQuickNotes);
router.post('/', quickNoteController.createQuickNote);
router.put('/:id', quickNoteController.updateQuickNote);
router.delete('/:id', quickNoteController.deleteQuickNote);

module.exports = router;

