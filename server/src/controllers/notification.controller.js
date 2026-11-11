const Notification = require('../models/Notification');
const User = require('../models/User');
const Membership = require('../models/Membership');
const { ROLES, MEMBERSHIP_STATUSES, MEMBERSHIP_PAYMENT_STATUSES } = require('../config/constants');

// @desc    Get current user's notifications
// @route   GET /api/v1/notifications
// @access  Authenticated
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Authenticated
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user's notifications as read
// @route   PATCH /api/v1/notifications/mark-all-read
// @access  Authenticated
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin sends an announcement or targeted alert
// @route   POST /api/v1/notifications/send
// @access  Admin
const sendAnnouncement = async (req, res, next) => {
  try {
    const { audience, targetUserId, title, message } = req.body;

    let recipients = [];

    if (audience === 'single' && targetUserId) {
      recipients = [targetUserId];
    } else if (audience === 'all_members') {
      const members = await User.find({ role: ROLES.MEMBER, isActive: true }).select('_id');
      recipients = members.map((m) => m._id);
    } else if (audience === 'all_trainers') {
      const trainers = await User.find({ role: ROLES.TRAINER, isActive: true }).select('_id');
      recipients = trainers.map((t) => t._id);
    } else if (audience === 'pending_dues') {
      const pendingMemberships = await Membership.find({
        status: MEMBERSHIP_STATUSES.ACTIVE,
        paymentStatus: { $in: [MEMBERSHIP_PAYMENT_STATUSES.UNPAID, MEMBERSHIP_PAYMENT_STATUSES.PARTIAL] },
      }).select('member');
      recipients = [...new Set(pendingMemberships.map((m) => m.member.toString()))];
    } else if (audience === 'near_expiry') {
      const in7Days = new Date();
      in7Days.setDate(in7Days.getDate() + 7);
      const expiring = await Membership.find({
        status: MEMBERSHIP_STATUSES.ACTIVE,
        expiryDate: { $gte: new Date(), $lte: in7Days },
      }).select('member');
      recipients = [...new Set(expiring.map((m) => m.member.toString()))];
    } else {
      // Default to all active users
      const allUsers = await User.find({ isActive: true }).select('_id');
      recipients = allUsers.map((u) => u._id);
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No recipients matched the selected criteria.',
      });
    }

    const docs = recipients.map((userId) => ({
      recipient: userId,
      title,
      message,
      type: 'announcement',
    }));

    await Notification.insertMany(docs);

    res.status(201).json({
      success: true,
      message: `Announcement delivered to ${recipients.length} recipients.`,
      recipientCount: recipients.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  sendAnnouncement,
};
