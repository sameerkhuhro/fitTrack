const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide exercise name'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'full_body'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    targetMuscles: [
      {
        type: String,
        trim: true,
      },
    ],
    equipment: {
      type: String,
      default: 'None',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);

