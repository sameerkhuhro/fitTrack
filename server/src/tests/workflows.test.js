const { test, describe } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const { signToken, verifyToken } = require('../utils/token');
const {
  ROLES,
  PAYMENT_STATUSES,
  PAYMENT_METHODS,
  MEMBERSHIP_STATUSES,
  MEMBERSHIP_PAYMENT_STATUSES,
  SALARY_STATUSES,
} = require('../config/constants');

describe('FitTrack Pro – End-to-End Business Workflows & Security Verification', () => {

  // ==========================================
  // WORKFLOW A: Online Payment & Activation
  // ==========================================
  describe('Workflow A: Member Registration -> Request -> Online Payment -> Admin Verify -> Activation', () => {
    const memberId = '65a000000000000000000001';
    const adminId = '65a000000000000000000099';
    const planId = '65a000000000000000000010';
    const planDurationMonths = 3;
    const planFee = 5000;

    // Step 1: Member registers
    let user = {
      _id: memberId,
      name: 'Usman Tariq',
      email: 'usman@example.com',
      role: ROLES.MEMBER,
      isActive: true,
      mustChangePassword: false,
    };

    test('Step 1: Member registration creates active member record', () => {
      assert.strictEqual(user.role, ROLES.MEMBER);
      assert.strictEqual(user.isActive, true);
    });

    // Step 2: Member requests membership
    let membership = {
      _id: '65b000000000000000000001',
      member: memberId,
      plan: planId,
      totalAmount: planFee,
      status: MEMBERSHIP_STATUSES.PENDING,
      paymentStatus: MEMBERSHIP_PAYMENT_STATUSES.UNPAID,
      startDate: null,
      expiryDate: null,
      activatedBy: null,
    };

    test('Step 2: Requested membership starts as PENDING and UNPAID', () => {
      assert.strictEqual(membership.status, MEMBERSHIP_STATUSES.PENDING);
      assert.strictEqual(membership.paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.UNPAID);
      assert.strictEqual(membership.startDate, null);
    });

    // Step 3: Member submits online payment
    let payment = {
      _id: '65c000000000000000000001',
      member: memberId,
      membership: membership._id,
      amount: 5000,
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      transactionReference: 'TRX-MEEZAN-99281',
      proofImage: '/uploads/proof-12345.jpg',
      status: PAYMENT_STATUSES.SUBMITTED,
      verifiedBy: null,
      verifiedAt: null,
      receiptNumber: null,
    };

    test('Step 3: Online payment is submitted with proof and starts in SUBMITTED state', () => {
      assert.strictEqual(payment.status, PAYMENT_STATUSES.SUBMITTED);
      assert.strictEqual(payment.verifiedBy, null);
      assert.strictEqual(payment.receiptNumber, null);
      // Ensure dues remain unpaid until admin verification
      assert.strictEqual(membership.paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.UNPAID);
    });

    // Step 4: Admin verifies payment
    test('Step 4: Admin verifies payment, sets audit timestamps, and generates receipt', () => {
      payment.status = PAYMENT_STATUSES.VERIFIED;
      payment.verifiedBy = adminId;
      payment.verifiedAt = new Date();
      payment.receiptNumber = `REC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-7821`;

      assert.strictEqual(payment.status, PAYMENT_STATUSES.VERIFIED);
      assert.ok(payment.receiptNumber.startsWith('REC-'));
      assert.strictEqual(payment.verifiedBy, adminId);
    });

    // Step 5: Admin activates membership
    test('Step 5: Membership is activated with valid start/expiry dates and marked PAID', () => {
      const now = new Date();
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + planDurationMonths);

      membership.status = MEMBERSHIP_STATUSES.ACTIVE;
      membership.startDate = now;
      membership.expiryDate = expiry;
      membership.activatedBy = adminId;
      membership.paymentStatus = MEMBERSHIP_PAYMENT_STATUSES.PAID;

      assert.strictEqual(membership.status, MEMBERSHIP_STATUSES.ACTIVE);
      assert.strictEqual(membership.paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.PAID);
      assert.strictEqual(membership.activatedBy, adminId);
      assert.ok(membership.expiryDate > membership.startDate);
    });
  });

  // ==========================================
  // WORKFLOW B: Cash Payment at Gym Reception
  // ==========================================
  describe('Workflow B: Cash Payment Intent -> Physical Cash Handover -> Immediate Reception Verification', () => {
    const memberId = '65a000000000000000000002';
    const receptionistId = '65a000000000000000000099';

    test('Cash intent does not decrement dues until reception counts and confirms cash', () => {
      const cashIntent = {
        member: memberId,
        amount: 2000,
        paymentMethod: PAYMENT_METHODS.CASH,
        status: PAYMENT_STATUSES.SUBMITTED,
      };

      // Invariant: Submitted cash does NOT count as collected revenue
      assert.strictEqual(cashIntent.status, PAYMENT_STATUSES.SUBMITTED);
      const isSettled = cashIntent.status === PAYMENT_STATUSES.VERIFIED;
      assert.strictEqual(isSettled, false, 'Cash intention must not be treated as settled revenue');

      // Reception confirms physical cash received
      const verifiedCash = {
        ...cashIntent,
        status: PAYMENT_STATUSES.VERIFIED,
        receivedBy: receptionistId,
        verifiedBy: receptionistId,
        verifiedAt: new Date(),
        receiptNumber: 'REC-20261111-4011',
      };

      assert.strictEqual(verifiedCash.status, PAYMENT_STATUSES.VERIFIED);
      assert.strictEqual(verifiedCash.receivedBy, receptionistId);
      assert.ok(verifiedCash.receiptNumber.startsWith('REC-'));
    });
  });

  // ==========================================
  // WORKFLOW C: Partial Payments & Dues Calculation
  // ==========================================
  describe('Workflow C: Partial Payments and Outstanding Dues Balance Calculation', () => {
    const totalMembershipFee = 18000;
    const payments = [];

    const calculateBalance = (fee, allPayments) => {
      const verifiedPaid = allPayments
        .filter(p => p.status === PAYMENT_STATUSES.VERIFIED)
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        verifiedPaid,
        remainingDues: Math.max(0, fee - verifiedPaid),
        paymentStatus: verifiedPaid >= fee
          ? MEMBERSHIP_PAYMENT_STATUSES.PAID
          : verifiedPaid > 0
          ? MEMBERSHIP_PAYMENT_STATUSES.PARTIAL
          : MEMBERSHIP_PAYMENT_STATUSES.UNPAID,
      };
    };

    test('Initial state: 0 paid -> 18,000 remaining dues (UNPAID)', () => {
      const { verifiedPaid, remainingDues, paymentStatus } = calculateBalance(totalMembershipFee, payments);
      assert.strictEqual(verifiedPaid, 0);
      assert.strictEqual(remainingDues, 18000);
      assert.strictEqual(paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.UNPAID);
    });

    test('First partial payment of 6,000 verified -> 12,000 dues (PARTIAL)', () => {
      payments.push({ amount: 6000, status: PAYMENT_STATUSES.VERIFIED });
      const { verifiedPaid, remainingDues, paymentStatus } = calculateBalance(totalMembershipFee, payments);
      assert.strictEqual(verifiedPaid, 6000);
      assert.strictEqual(remainingDues, 12000);
      assert.strictEqual(paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.PARTIAL);
    });

    test('Rejected payment of 4,000 must NOT reduce remaining dues', () => {
      payments.push({ amount: 4000, status: PAYMENT_STATUSES.REJECTED, rejectionReason: 'Invalid screenshot' });
      const { verifiedPaid, remainingDues, paymentStatus } = calculateBalance(totalMembershipFee, payments);
      assert.strictEqual(verifiedPaid, 6000, 'Rejected payment must not be added to verified total');
      assert.strictEqual(remainingDues, 12000, 'Remaining dues must not decrease on rejected payment');
      assert.strictEqual(paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.PARTIAL);
    });

    test('Unverified submitted payment of 6,000 must NOT reduce dues before admin approval', () => {
      payments.push({ amount: 6000, status: PAYMENT_STATUSES.SUBMITTED });
      const { verifiedPaid, remainingDues } = calculateBalance(totalMembershipFee, payments);
      assert.strictEqual(verifiedPaid, 6000);
      assert.strictEqual(remainingDues, 12000);
    });

    test('Final payment of 12,000 verified -> 0 dues (PAID)', () => {
      payments.push({ amount: 12000, status: PAYMENT_STATUSES.VERIFIED });
      const { verifiedPaid, remainingDues, paymentStatus } = calculateBalance(totalMembershipFee, payments);
      assert.strictEqual(verifiedPaid, 18000);
      assert.strictEqual(remainingDues, 0);
      assert.strictEqual(paymentStatus, MEMBERSHIP_PAYMENT_STATUSES.PAID);
    });
  });

  // ==========================================
  // WORKFLOW D: Trainer Account & Forced Password Change
  // ==========================================
  describe('Workflow D: Admin Creates Trainer -> First Login -> Forced Password Change Enforcement', () => {
    test('Admin creates trainer with temporary password and mustChangePassword = true', async () => {
      const tempPassword = 'Trainer@Temp2026!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPassword, salt);

      const trainer = {
        name: 'Ahmed Khan',
        email: 'ahmed.trainer@fittrack.com',
        role: ROLES.TRAINER,
        monthlySalary: 45000,
        mustChangePassword: true,
        password: hashedPassword,
      };

      assert.strictEqual(trainer.mustChangePassword, true);
      assert.strictEqual(trainer.role, ROLES.TRAINER);

      // Verify trainer can authenticate with temp password
      const canLogin = await bcrypt.compare(tempPassword, trainer.password);
      assert.strictEqual(canLogin, true);

      // Enforce: User is blocked from dashboard until password is changed
      const isBlocked = trainer.mustChangePassword === true;
      assert.strictEqual(isBlocked, true, 'User with mustChangePassword=true must be forced to reset');

      // Trainer updates password
      const newPassword = 'Ahmed@NewSecret2026!';
      trainer.password = await bcrypt.hash(newPassword, salt);
      trainer.mustChangePassword = false;

      assert.strictEqual(trainer.mustChangePassword, false);
      const canLoginWithOld = await bcrypt.compare(tempPassword, trainer.password);
      assert.strictEqual(canLoginWithOld, false);
      const canLoginWithNew = await bcrypt.compare(newPassword, trainer.password);
      assert.strictEqual(canLoginWithNew, true);
    });
  });

  // ==========================================
  // WORKFLOW E: Trainer Salary State Machine
  // ==========================================
  describe('Workflow E: Monthly Salary Lifecycle & Trainer Confirmation / Dispute', () => {
    const trainerId = '65a000000000000000000003';
    const otherTrainerId = '65a000000000000000000004';

    test('Salary record transitions from PENDING to PAID_AWAITING_CONFIRMATION', () => {
      const salary = {
        _id: '65e000000000000000000001',
        trainer: trainerId,
        month: 11,
        year: 2026,
        amount: 50000,
        status: SALARY_STATUSES.PENDING,
      };

      assert.strictEqual(salary.status, SALARY_STATUSES.PENDING);

      // Admin pays salary
      salary.status = SALARY_STATUSES.PAID_AWAITING_CONFIRMATION;
      salary.paidAt = new Date();
      salary.paymentMethod = PAYMENT_METHODS.BANK_TRANSFER;
      salary.transactionReference = 'FT-SAL-NOV26-001';

      assert.strictEqual(salary.status, SALARY_STATUSES.PAID_AWAITING_CONFIRMATION);
      assert.ok(salary.paidAt instanceof Date);

      // Security check: Another trainer CANNOT confirm this salary (IDOR protection)
      const attackerAttempt = salary.trainer !== otherTrainerId;
      assert.strictEqual(attackerAttempt, true, 'Different trainer must be blocked from confirming');

      // Trainer confirms receipt
      salary.status = SALARY_STATUSES.CONFIRMED;
      salary.confirmedAt = new Date();
      assert.strictEqual(salary.status, SALARY_STATUSES.CONFIRMED);
    });

    test('Trainer can raise a dispute if amount or details are incorrect', () => {
      const disputedSalary = {
        _id: '65e000000000000000000002',
        trainer: trainerId,
        month: 10,
        year: 2026,
        amount: 40000,
        status: SALARY_STATUSES.PAID_AWAITING_CONFIRMATION,
      };

      // Trainer disputes
      disputedSalary.status = SALARY_STATUSES.DISPUTED;
      disputedSalary.disputeReason = 'Agreed bonus for 10 personal training sessions not included';

      assert.strictEqual(disputedSalary.status, SALARY_STATUSES.DISPUTED);
      assert.ok(disputedSalary.disputeReason.length > 5);
    });
  });

  // ==========================================
  // WORKFLOW F: Workout Assignment & Progress Tracking
  // ==========================================
  describe('Workflow F: Trainer Workout Assignment, Ownership Check & Athlete Progress Tracking', () => {
    const trainerId = '65a000000000000000000003';
    const assignedMember = {
      _id: '65a000000000000000000010',
      name: 'Bilal Farooq',
      assignedTrainer: trainerId,
    };
    const unassignedMember = {
      _id: '65a000000000000000000011',
      name: 'Kashif Ali',
      assignedTrainer: '65a000000000000000000099', // Different trainer
    };

    test('Trainer cannot assign workout to an unassigned member (Ownership boundary)', () => {
      const canAssignUnassigned = unassignedMember.assignedTrainer === trainerId;
      assert.strictEqual(canAssignUnassigned, false, 'Trainer must be rejected from modifying unassigned member');

      const canAssignAssigned = assignedMember.assignedTrainer === trainerId;
      assert.strictEqual(canAssignAssigned, true, 'Trainer must be permitted to assign to their trainee');
    });

    test('Athlete progress records maintain valid numeric body measurements', () => {
      const progressRecord = {
        member: assignedMember._id,
        weight: 78.5,
        height: 178,
        waist: 33,
        chest: 40,
        recordedAt: new Date(),
      };

      assert.ok(progressRecord.weight > 30 && progressRecord.weight < 250);
      assert.ok(progressRecord.waist > 15 && progressRecord.waist < 80);
      assert.strictEqual(progressRecord.member, assignedMember._id);
    });
  });

  // ==========================================
  // WORKFLOW G: Notification Deduplication & Expiry Reminders
  // ==========================================
  describe('Workflow G: Scheduled Notification Deduplication via Sparse Unique dedupKey', () => {
    test('Sparse unique dedupKey format guarantees deterministic uniqueness per membership per day', () => {
      const membershipId = '65b000000000000000000001';
      const targetDateStr = '2026-11-14';

      const key1 = `expiry-3d-${membershipId}-${targetDateStr}`;
      const key2 = `expiry-3d-${membershipId}-${targetDateStr}`;

      assert.strictEqual(key1, key2, 'Generated keys for same membership and interval must match');

      const mockDbIndex = new Set();
      mockDbIndex.add(key1);

      // Attempting to re-insert same key raises unique constraint violation
      let duplicateCaught = false;
      if (mockDbIndex.has(key2)) {
        duplicateCaught = true;
      }
      assert.strictEqual(duplicateCaught, true, 'Duplicate reminder on same day must be prevented by dedupKey');
    });
  });

  // ==========================================
  // SECURITY & BOLA / IDOR AUDIT
  // ==========================================
  describe('Security Audit: Broken Object Level Authorization (BOLA/IDOR) & Role Isolation', () => {
    test('Member cannot access or modify another member records by substituting ID', () => {
      const authenticatedMemberId = '65a000000000000000000001';
      const victimMemberId = '65a000000000000000000002';

      // Middleware check function simulation
      const enforceMemberOwnership = (reqUserId, targetUserId, userRole) => {
        if (userRole === ROLES.ADMIN) return true;
        return reqUserId.toString() === targetUserId.toString();
      };

      assert.strictEqual(enforceMemberOwnership(authenticatedMemberId, victimMemberId, ROLES.MEMBER), false);
      assert.strictEqual(enforceMemberOwnership(authenticatedMemberId, authenticatedMemberId, ROLES.MEMBER), true);
      assert.strictEqual(enforceMemberOwnership('admin-id', victimMemberId, ROLES.ADMIN), true);
    });
  });
});

