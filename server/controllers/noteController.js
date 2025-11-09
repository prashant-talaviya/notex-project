const Note = require('../models/Note');
const { parsePDF } = require('../utils/pdfParser');

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const note = new Note({
      userId: req.user.userId,
      title,
      content
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload PDF note
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const pdfText = await parsePDF(req.file.buffer);
    const title = req.body.title || req.file.originalname.replace('.pdf', '');

    const note = new Note({
      userId: req.user.userId,
      title,
      content: pdfText
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error('Upload PDF Error:', error);
    res.status(500).json({ message: 'Server error during PDF upload' });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Update Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

