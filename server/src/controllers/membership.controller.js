const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { MEMBERSHIP_STATUSES, MEMBERSHIP_PAYMENT_STATUSES, ROLES } = require('../config/constants');

// @desc    Submit a membership request for a plan
// @route   POST /api/v1/memberships/request
// @access  Member
const requestMembership = async (req, res, next) => {
  try {
    const { planId, notes } = req.body;
    const memberId = req.user._id;

    const plan = await MembershipPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Selected membership plan is invalid or inactive.',
      });
    }

    // Check if the member already has an active or pending membership
    const existingActive = await Membership.findOne({
      member: memberId,
      status: { $in: [MEMBERSHIP_STATUSES.ACTIVE, MEMBERSHIP_STATUSES.PENDING] },
    });

    if (existingActive) {
      if (existingActive.status === MEMBERSHIP_STATUSES.PENDING) {
        return res.status(400).json({
          success: false,
          message: 'You already have a pending membership request. Please proceed to payment or wait for admin approval.',
          membershipId: existingActive._id,
        });
      }
      if (existingActive.status === MEMBERSHIP_STATUSES.ACTIVE) {
        return res.status(400).json({
          success: false,
          message: 'You already have an active membership. You can request a renewal closer to expiry.',
        });
      }
    }

    // Create the membership in PENDING status
    // Neither selects dates nor activates until approved by Admin
    const membership = await Membership.create({
      member: memberId,
      plan: plan._id,
      totalAmount: plan.price,
      status: MEMBERSHIP_STATUSES.PENDING,
      paymentStatus: MEMBERSHIP_PAYMENT_STATUSES.UNPAID,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Membership request submitted successfully. Please submit your payment to proceed with activation.',
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all memberships (Admin) with filter by status
// @route   GET /api/v1/memberships
// @access  Admin
const getAllMemberships = async (req, res, next) => {
  try {
    const { status, memberId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (memberId) filter.member = memberId;

    const memberships = await Membership.find(filter)
      .populate('member', 'name email phone profileImage assignedTrainer')
      .populate('plan', 'name durationMonths price features')
      .populate('activatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memberships.length,
      data: memberships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in member's memberships
// @route   GET /api/v1/memberships/my
// @access  Member
const getMyMemberships = async (req, res, next) => {
  try {
    const memberships = await Membership.find({ member: req.user._id })
      .populate('plan', 'name durationMonths price features')
      .sort({ createdAt: -1 });

    const activeMembership = memberships.find((m) => m.status === MEMBERSHIP_STATUSES.ACTIVE) || null;
    const pendingMembership = memberships.find((m) => m.status === MEMBERSHIP_STATUSES.PENDING) || null;

    // Calculate days remaining if active
    let daysRemaining = 0;
    if (activeMembership && activeMembership.expiryDate) {
      const now = new Date();
      const diffMs = new Date(activeMembership.expiryDate) - now;
      daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    res.status(200).json({
      success: true,
      data: {
        activeMembership,
        pendingMembership,
        daysRemaining,
        history: memberships,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single membership by ID
// @route   GET /api/v1/memberships/:id
// @access  Admin, Member (self)
const getMembershipById = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id)
      .populate('member', 'name email phone')
      .populate('plan')
      .populate('activatedBy', 'name');

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership record not found.',
      });
    }

    if (req.user.role === ROLES.MEMBER && membership.member._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own membership.',
      });
    }

    const payments = await Payment.find({ membership: membership._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        membership,
        payments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin activates membership
// @route   PATCH /api/v1/memberships/:id/activate
// @access  Admin
const activateMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id).populate('plan');
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found.',
      });
    }

    if (membership.status === MEMBERSHIP_STATUSES.ACTIVE) {
      return res.status(400).json({
        success: false,
        message: 'This membership is already active.',
      });
    }

    // Check payment sum
    const verifiedPayments = await Payment.find({
      membership: membership._id,
      status: 'verified',
    });
    const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

    // Calculate dates based on plan duration in months
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMonth(expiryDate.getMonth() + membership.plan.durationMonths);

    // If there is any previously active membership for this member, mark it expired/archived
    await Membership.updateMany(
      {
        member: membership.member,
        _id: { $ne: membership._id },
        status: MEMBERSHIP_STATUSES.ACTIVE,
      },
      { status: MEMBERSHIP_STATUSES.EXPIRED }
    );

    membership.status = MEMBERSHIP_STATUSES.ACTIVE;
    membership.startDate = startDate;
    membership.expiryDate = expiryDate;
    membership.activatedAt = new Date();
    membership.activatedBy = req.user._id;

    if (totalPaid >= membership.totalAmount) {
      membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PAID;
    } else if (totalPaid > 0) {
      membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PARTIAL;
    } else {
      membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.UNPAID;
    }

    await membership.save();

    // Create In-App Notification for Member
    await Notification.create({
      recipient: membership.member,
      title: 'Membership Activated!',
      message: `Your ${membership.plan.name} membership has been activated. Valid until ${expiryDate.toLocaleDateString()}. Welcome to FitTrack Pro!`,
      type: 'membership',
      relatedEntity: {
        entityType: 'Membership',
        entityId: membership._id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Membership successfully activated.',
      data: membership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request renewal for an active/expiring membership (creates a NEW historical record)
// @route   POST /api/v1/memberships/:id/renew
// @access  Member
const requestRenewal = async (req, res, next) => {
  try {
    const oldMembership = await Membership.findById(req.params.id).populate('plan');
    if (!oldMembership) {
      return res.status(404).json({
        success: false,
        message: 'Membership not found.',
      });
    }

    if (req.user.role === ROLES.MEMBER && oldMembership.member.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.',
      });
    }

    // Check if there is already a pending renewal request
    const existingPending = await Membership.findOne({
      member: oldMembership.member,
      status: MEMBERSHIP_STATUSES.PENDING,
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'A renewal/membership request is already pending verification.',
      });
    }

    // Creates a new membership record rather than overwriting historical membership data
    const newMembership = await Membership.create({
      member: oldMembership.member,
      plan: oldMembership.plan._id,
      totalAmount: oldMembership.plan.price,
      status: MEMBERSHIP_STATUSES.PENDING,
      paymentStatus: MEMBERSHIP_PAYMENT_STATUSES.UNPAID,
      notes: `Renewal of membership ${oldMembership._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Membership renewal requested successfully. Please submit your payment.',
      data: newMembership,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestMembership,
  getAllMemberships,
  getMyMemberships,
  getMembershipById,
  activateMembership,
  requestRenewal,
};
