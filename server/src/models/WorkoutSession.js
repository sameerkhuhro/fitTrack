const mongoose = require('mongoose');
const { SESSION_STATUSES } = require('../config/constants');

const workoutSessionSchema = new mongoose.Schema(
  {
    workoutPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      default: null,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionDate: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: Object.values(SESSION_STATUSES),
      default: SESSION_STATUSES.SCHEDULED,
      index: true,
    },
    trainerNotes: {
      type: String,
      default: '',
    },
    memberFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);

