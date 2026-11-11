module.exports = {
  ROLES: {
    ADMIN: 'admin',
    TRAINER: 'trainer',
    MEMBER: 'member',
  },
  PAYMENT_METHODS: {
    BANK_TRANSFER: 'bank_transfer',
    JAZZCASH: 'jazzcash',
    EASYPAISA: 'easypaisa',
    CASH: 'cash',
  },
  PAYMENT_STATUSES: {
    SUBMITTED: 'submitted',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
    REFUNDED: 'refunded',
  },
  MEMBERSHIP_STATUSES: {
    PENDING: 'pending',
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
  },
  MEMBERSHIP_PAYMENT_STATUSES: {
    UNPAID: 'unpaid',
    PARTIAL: 'partial',
    PAID: 'paid',
  },
  SALARY_STATUSES: {
    PENDING: 'pending',
    PAID_AWAITING_CONFIRMATION: 'paid_awaiting_confirmation',
    CONFIRMED: 'confirmed',
    DISPUTED: 'disputed',
  },
  SESSION_STATUSES: {
    SCHEDULED: 'scheduled',
    COMPLETED: 'completed',
    MISSED: 'missed',
    CANCELLED: 'cancelled',
  },
  ATTENDANCE_STATUSES: {
    PRESENT: 'present',
    ABSENT: 'absent',
  },
};

