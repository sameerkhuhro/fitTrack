const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide workout plan title'],
      trim: true,
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
    description: {
      type: String,
      default: '',
    },
    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise',
          required: true,
        },
        sets: {
          type: Number,
          default: 3,
        },
        reps: {
          type: String,
          default: '10-12',
        },
        restSeconds: {
          type: Number,
          default: 60,
        },
        notes: {
          type: String,
          default: '',
        },
      },
    ],
    scheduleDays: [
      {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);

