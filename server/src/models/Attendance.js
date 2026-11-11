const mongoose = require('mongoose');
const { ATTENDANCE_STATUSES } = require('../config/constants');

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateString: {
      type: String,
      required: true, // Format: YYYY-MM-DD
    },
    checkIn: {
      type: Date,
      default: Date.now,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUSES),
      default: ATTENDANCE_STATUSES.PRESENT,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate check-in on the same date for the same member
attendanceSchema.index({ member: 1, dateString: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

