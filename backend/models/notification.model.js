const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Track which users have seen this
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;