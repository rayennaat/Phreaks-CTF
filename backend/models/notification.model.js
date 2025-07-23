const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  seenBy: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seenAt: { type: Date, default: Date.now }
  }]
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;