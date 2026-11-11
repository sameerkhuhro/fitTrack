const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['membership', 'payment', 'salary', 'workout', 'announcement', 'general'],
      default: 'general',
      index: true,
    },
    relatedEntity: {
      entityType: { type: String, default: null },
      entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Used for deduplication of scheduled alerts
    dedupKey: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);

