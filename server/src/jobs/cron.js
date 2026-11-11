const cron = require('node-cron');
const Membership = require('../models/Membership');
const Notification = require('../models/Notification');
const { MEMBERSHIP_STATUSES } = require('../config/constants');

const checkMembershipExpiries = async () => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    // 1. Check for memberships expired today or earlier that are still marked 'active'
    const expiredMemberships = await Membership.find({
      status: MEMBERSHIP_STATUSES.ACTIVE,
      expiryDate: { $lte: now },
    }).populate('member plan');

    for (const m of expiredMemberships) {
      m.status = MEMBERSHIP_STATUSES.EXPIRED;
      await m.save();

      const dedupKey = `expiry-0d-${m._id}-${todayStr}`;
      try {
        await Notification.create({
          recipient: m.member._id,
          title: 'Membership Expired',
          message: `Your ${m.plan.name} membership has expired. Please renew your membership to continue gym access.`,
          type: 'membership',
          relatedEntity: { entityType: 'Membership', entityId: m._id },
          dedupKey,
        });
      } catch (e) {
        // Ignored if duplicate key exists
      }
    }

    // 2. Alert for memberships expiring in exactly 7 days, 3 days, or 1 day
    const intervals = [7, 3, 1];

    for (const days of intervals) {
      const targetStart = new Date(now);
      targetStart.setDate(targetStart.getDate() + days);
      targetStart.setHours(0, 0, 0, 0);

      const targetEnd = new Date(targetStart);
      targetEnd.setHours(23, 59, 59, 999);

      const expiringSoon = await Membership.find({
        status: MEMBERSHIP_STATUSES.ACTIVE,
        expiryDate: { $gte: targetStart, $lte: targetEnd },
      }).populate('member plan');

      for (const m of expiringSoon) {
        const dedupKey = `expiry-${days}d-${m._id}-${targetStart.toISOString().slice(0, 10)}`;
        try {
          await Notification.create({
            recipient: m.member._id,
            title: `Membership Expiring in ${days} ${days === 1 ? 'Day' : 'Days'}!`,
            message: `Friendly reminder: Your ${m.plan.name} membership will expire on ${new Date(m.expiryDate).toLocaleDateString()}. Renew in your portal to avoid interruption.`,
            type: 'membership',
            relatedEntity: { entityType: 'Membership', entityId: m._id },
            dedupKey,
          });
        } catch (e) {
          // Ignored if duplicate key exists
        }
      }
    }
  } catch (error) {
    console.error('[FitTrack Cron Error]', error);
  }
};

const initCronJobs = () => {
  // Run daily at midnight: 00:00
  cron.schedule('0 0 * * *', () => {
    console.log('[FitTrack Cron] Executing daily membership expiry & reminder check...');
    checkMembershipExpiries();
  });

  console.log('[FitTrack Cron] Scheduled notification tasks initialized.');
};

module.exports = initCronJobs;

