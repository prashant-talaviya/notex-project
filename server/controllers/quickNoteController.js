const QuickNote = require('../models/QuickNote');

// Get all quick notes
exports.getQuickNotes = async (req, res) => {
  try {
    const quickNotes = await QuickNote.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(quickNotes);
  } catch (error) {
    console.error('Get Quick Notes Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create quick note
exports.createQuickNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Please provide content' });
    }

    const quickNote = new QuickNote({
      userId: req.user.userId,
      content: content.trim()
    });

    await quickNote.save();
    res.status(201).json(quickNote);
  } catch (error) {
    console.error('Create Quick Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update quick note
exports.updateQuickNote = async (req, res) => {
  try {
    const { content } = req.body;

    const quickNote = await QuickNote.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!quickNote) {
      return res.status(404).json({ message: 'Quick note not found' });
    }

    quickNote.content = content.trim();
    await quickNote.save();

    res.json(quickNote);
  } catch (error) {
    console.error('Update Quick Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete quick note
exports.deleteQuickNote = async (req, res) => {
  try {
    const quickNote = await QuickNote.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!quickNote) {
      return res.status(404).json({ message: 'Quick note not found' });
    }

    await QuickNote.deleteOne({ _id: req.params.id });
    res.json({ message: 'Quick note deleted successfully' });
  } catch (error) {
    console.error('Delete Quick Note Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

