const mongoose = require('mongoose');
const { SALARY_STATUSES, PAYMENT_METHODS } = require('../config/constants');

const trainerSalarySchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.BANK_TRANSFER,
    },
    transactionReference: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SALARY_STATUSES),
      default: SALARY_STATUSES.PENDING,
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    disputeReason: {
      type: String,
      default: '',
    },
    disputedAt: {
      type: Date,
      default: null,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate salary records for same trainer, month and year
trainerSalarySchema.index({ trainer: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('TrainerSalary', trainerSalarySchema);

