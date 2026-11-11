const mongoose = require('mongoose');
const { MEMBERSHIP_STATUSES, MEMBERSHIP_PAYMENT_STATUSES } = require('../config/constants');

const membershipSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: null,
      index: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(MEMBERSHIP_STATUSES),
      default: MEMBERSHIP_STATUSES.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(MEMBERSHIP_PAYMENT_STATUSES),
      default: MEMBERSHIP_PAYMENT_STATUSES.UNPAID,
      index: true,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    activatedBy: {
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

module.exports = mongoose.model('Membership', membershipSchema);

