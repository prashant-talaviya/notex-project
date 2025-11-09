const express = require('express');
const router = express.Router();
const multer = require('multer');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authMiddleware);

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNote);
router.post('/', noteController.createNote);
router.post('/upload', upload.single('pdf'), noteController.uploadPDF);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;

