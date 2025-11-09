const Note = require('../models/Note');
const Chat = require('../models/Chat');
const QuickNote = require('../models/QuickNote');
const { generateDailyTip } = require('../utils/geminiAPI');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get counts
    const notesCount = await Note.countDocuments({ userId });
    const conversationsCount = await Chat.distinct('noteId', { userId }).then(ids => ids.length);
    const quickNotesCount = await QuickNote.countDocuments({ userId });

    // Get recent notes (3 latest)
    const recentNotes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title content createdAt');

    // Get daily tip
    const dailyTip = await generateDailyTip();

    res.json({
      notesCount,
      conversationsCount,
      quickNotesCount,
      recentNotes,
      dailyTip
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

