const express = require('express');
const router = express.Router();

const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// GET /api/v1/notifications  -> lista del usuario actual
router.get('/', protect, async (req, res) => {
  try {
    let user_id = req.user.id;
    if (typeof user_id === 'string') user_id = parseInt(user_id, 10);

    const notifications = await Notification.find({ user_id })
      .sort({ created_at: -1 })
      .limit(50)
      .exec();

    res.json({
      success: true,
      count: notifications.length,
      items: notifications.map((n) => ({
        id: n._id.toString(),
        title: n.title,
        body: n.body,
        read: n.read,
        createdAt: n.created_at,
      })),
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/v1/notifications/read-all -> marcar todas como leídas
router.patch('/read-all', protect, async (req, res) => {
  try {
    let user_id = req.user.id;
    if (typeof user_id === 'string') user_id = parseInt(user_id, 10);

    await Notification.updateMany(
      { user_id, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
