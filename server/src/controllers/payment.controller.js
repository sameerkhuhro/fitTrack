const Payment = require('../models/Payment');
const Membership = require('../models/Membership');
const Notification = require('../models/Notification');
const { PAYMENT_STATUSES, PAYMENT_METHODS, MEMBERSHIP_PAYMENT_STATUSES, ROLES } = require('../config/constants');

// Helper to generate unique receipt number
const generateReceiptNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `REC-${dateStr}-${randomSuffix}`;
};

// @desc    Submit payment (Member submitting Manual Online proof or Cash request)
// @route   POST /api/v1/payments
// @access  Member
const submitPayment = async (req, res, next) => {
  try {
    const { membershipId, amount, paymentMethod, transactionReference, notes } = req.body;
    const memberId = req.user._id;

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found.',
      });
    }

    if (membership.member.toString() !== memberId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only submit payments for your own membership.',
      });
    }

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero.',
      });
    }

    let proofImage = null;
    if (req.file) {
      proofImage = `/uploads/${req.file.filename}`;
    }

    // Payment status starts as 'submitted' (requires Admin verification)
    const payment = await Payment.create({
      member: memberId,
      membership: membership._id,
      amount: payAmount,
      paymentMethod,
      transactionReference: transactionReference || '',
      proofImage,
      status: PAYMENT_STATUSES.SUBMITTED,
      adminNotes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: paymentMethod === PAYMENT_METHODS.CASH
        ? 'Cash payment intention recorded. Please pay at gym reception for verification.'
        : 'Payment proof submitted. An administrator will verify your payment shortly.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record Cash Payment directly received at Gym (Admin / Receptionist)
// @route   POST /api/v1/payments/cash-received
// @access  Admin
const recordCashPayment = async (req, res, next) => {
  try {
    const { membershipId, memberId, amount, notes } = req.body;

    const membership = await Membership.findById(membershipId);
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership record not found.',
      });
    }

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than zero.',
      });
    }

    const receiptNumber = generateReceiptNumber();

    // Since cash was received and confirmed directly by Admin, status is verified immediately
    const payment = await Payment.create({
      member: memberId || membership.member,
      membership: membership._id,
      amount: payAmount,
      paymentMethod: PAYMENT_METHODS.CASH,
      transactionReference: `CASH-${Date.now()}`,
      status: PAYMENT_STATUSES.VERIFIED,
      receiptNumber,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      adminNotes: notes || 'Cash received and confirmed at gym reception.',
    });

    // Recalculate membership balance and update paymentStatus
    const verifiedPayments = await Payment.find({
      membership: membership._id,
      status: PAYMENT_STATUSES.VERIFIED,
    });
    const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= membership.totalAmount) {
      membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PAID;
    } else if (totalPaid > 0) {
      membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PARTIAL;
    }
    await membership.save();

    // Send notification to member
    await Notification.create({
      recipient: membership.member,
      title: 'Cash Payment Received',
      message: `Your cash payment of Rs. ${payAmount} has been recorded. Receipt: ${receiptNumber}.`,
      type: 'payment',
      relatedEntity: {
        entityType: 'Payment',
        entityId: payment._id,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Cash payment confirmed and recorded successfully.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin verifies a submitted payment
// @route   PATCH /api/v1/payments/:id/verify
// @access  Admin
const verifyPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('membership');
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    if (payment.status === PAYMENT_STATUSES.VERIFIED) {
      return res.status(400).json({
        success: false,
        message: 'Payment is already verified.',
      });
    }

    payment.status = PAYMENT_STATUSES.VERIFIED;
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    payment.receiptNumber = generateReceiptNumber();
    if (req.body.adminNotes) {
      payment.adminNotes = req.body.adminNotes;
    }

    await payment.save();

    // Update the parent membership payment status based on total verified amount
    const membership = await Membership.findById(payment.membership._id);
    if (membership) {
      const verifiedPayments = await Payment.find({
        membership: membership._id,
        status: PAYMENT_STATUSES.VERIFIED,
      });
      const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

      if (totalPaid >= membership.totalAmount) {
        membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PAID;
      } else if (totalPaid > 0) {
        membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PARTIAL;
      }
      await membership.save();
    }

    // Send notification to member
    await Notification.create({
      recipient: payment.member,
      title: 'Payment Verified!',
      message: `Your payment of Rs. ${payment.amount} has been verified. Official Receipt: ${payment.receiptNumber}.`,
      type: 'payment',
      relatedEntity: {
        entityType: 'Payment',
        entityId: payment._id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and receipt generated.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin rejects a submitted payment
// @route   PATCH /api/v1/payments/:id/reject
// @access  Admin
const rejectPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for rejecting the payment.',
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }

    payment.status = PAYMENT_STATUSES.REJECTED;
    payment.rejectionReason = reason;
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    await payment.save();

    // Send notification to member
    await Notification.create({
      recipient: payment.member,
      title: 'Payment Rejected',
      message: `Your payment submission of Rs. ${payment.amount} was rejected. Reason: ${reason}. Please resubmit valid proof.`,
      type: 'payment',
      relatedEntity: {
        entityType: 'Payment',
        entityId: payment._id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Payment rejected.',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/v1/payments
// @access  Admin
const getAllPayments = async (req, res, next) => {
  try {
    const { status, method } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.paymentMethod = method;

    const payments = await Payment.find(filter)
      .populate('member', 'name email phone profileImage')
      .populate({
        path: 'membership',
        populate: { path: 'plan', select: 'name price durationMonths' },
      })
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in member's payments and dues calculation
// @route   GET /api/v1/payments/my
// @access  Member
const getMyPayments = async (req, res, next) => {
  try {
    const memberId = req.user._id;

    const payments = await Payment.find({ member: memberId })
      .populate({
        path: 'membership',
        populate: { path: 'plan', select: 'name price durationMonths' },
      })
      .sort({ createdAt: -1 });

    // Calculate dues based strictly on verified payments vs membership amount
    const memberships = await Membership.find({ member: memberId });
    const totalFees = memberships.reduce((sum, m) => sum + (m.totalAmount || 0), 0);

    const verifiedPaid = payments
      .filter((p) => p.status === PAYMENT_STATUSES.VERIFIED)
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingBalance = Math.max(0, totalFees - verifiedPaid);

    res.status(200).json({
      success: true,
      summary: {
        totalFees,
        verifiedPaid,
        pendingBalance,
      },
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment receipt details
// @route   GET /api/v1/payments/:id
// @access  Admin, Member (self)
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('member', 'name email phone')
      .populate({
        path: 'membership',
        populate: { path: 'plan' },
      })
      .populate('verifiedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    if (req.user.role === ROLES.MEMBER && payment.member._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gym configurable payment account details (for Bank Transfer, JazzCash, Easypaisa)
// @route   GET /api/v1/payments/config/account-details
// @access  Public / Authenticated
const getPaymentAccountDetails = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      bank: {
        name: process.env.BANK_NAME || 'Meezan Bank Ltd',
        title: process.env.BANK_ACCOUNT_TITLE || 'FitTrack Pro Fitness Club',
        number: process.env.BANK_ACCOUNT_NUMBER || '01010102938475',
        iban: process.env.BANK_IBAN || 'PK36MEZN0001010102938475',
      },
      jazzcash: {
        number: process.env.JAZZCASH_NUMBER || '03001234567',
        title: process.env.JAZZCASH_TITLE || 'FitTrack Pro',
      },
      easypaisa: {
        number: process.env.EASYPAISA_NUMBER || '03121234567',
        title: process.env.EASYPAISA_TITLE || 'FitTrack Pro',
      },
    },
  });
};

module.exports = {
  submitPayment,
  recordCashPayment,
  verifyPayment,
  rejectPayment,
  getAllPayments,
  getMyPayments,
  getPaymentById,
  getPaymentAccountDetails,
};
