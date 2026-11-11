const mongoose = require('mongoose');

const progressRecordSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weightKg: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [20, 'Weight must be realistic'],
    },
    heightCm: {
      type: Number,
      default: null,
    },
    waistCm: {
      type: Number,
      default: null,
    },
    chestCm: {
      type: Number,
      default: null,
    },
    armsCm: {
      type: Number,
      default: null,
    },
    hipsCm: {
      type: Number,
      default: null,
    },
    bodyFatPercentage: {
      type: Number,
      default: null,
    },
    recordedDate: {
      type: Date,
      default: Date.now,
      index: true,
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

module.exports = mongoose.model('ProgressRecord', progressRecordSchema);

