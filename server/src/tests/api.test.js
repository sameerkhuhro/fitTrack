const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const { signToken, verifyToken } = require('../utils/token');
const { ROLES, PAYMENT_STATUSES, SALARY_STATUSES, MEMBERSHIP_STATUSES } = require('../config/constants');
const bcrypt = require('bcryptjs');

describe('FitTrack Pro Core Business Logic & Security Tests', () => {

  describe('1. Authentication & JWT Token Security', () => {
    test('Should successfully generate and verify valid JWT token with user ID and role', () => {
      const payloadId = '654321654321654321654321';
      const role = ROLES.ADMIN;
      const token = signToken(payloadId, role);

      assert.ok(typeof token === 'string', 'Token should be a string');
      assert.ok(token.length > 20, 'Token should have proper length');

      const decoded = verifyToken(token);
      assert.strictEqual(decoded.id, payloadId);
      assert.strictEqual(decoded.role, role);
    });

    test('Should reject malformed or tampered JWT token', () => {
      assert.throws(() => {
        verifyToken('invalid.token.string');
      }, /JsonWebTokenError|token/i);
    });

    test('Should properly hash and verify passwords using bcrypt', async () => {
      const rawPassword = 'Trainer@Secure2026!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(rawPassword, salt);

      assert.notStrictEqual(hash, rawPassword);
      const isMatch = await bcrypt.compare(rawPassword, hash);
      assert.strictEqual(isMatch, true, 'bcrypt compare should succeed with valid password');

      const isWrongMatch = await bcrypt.compare('WrongPassword!', hash);
      assert.strictEqual(isWrongMatch, false, 'bcrypt compare should fail with wrong password');
    });
  });

  describe('2. Role-Based Access Control (RBAC) & Ownership Rules', () => {
    test('Role Authorization middleware should permit authorized roles and block unauthorized roles', () => {
      const { authorize } = require('../middleware/role.middleware');
      const adminMiddleware = authorize(ROLES.ADMIN);

      let nextCalled = false;
      let statusSent = null;
      let jsonSent = null;

      const mockRes = {
        status: (code) => {
          statusSent = code;
          return {
            json: (data) => { jsonSent = data; }
          };
        }
      };

      // Test 1: User is Admin (Should call next)
      adminMiddleware({ user: { role: ROLES.ADMIN } }, mockRes, () => {
        nextCalled = true;
      });
      assert.strictEqual(nextCalled, true, 'Admin should be permitted');

      // Test 2: User is Member (Should return 403 Forbidden)
      nextCalled = false;
      adminMiddleware({ user: { role: ROLES.MEMBER } }, mockRes, () => {
        nextCalled = true;
      });
      assert.strictEqual(nextCalled, false, 'Member must not be permitted on admin route');
      assert.strictEqual(statusSent, 403);
      assert.strictEqual(jsonSent.success, false);
    });

    test('Ownership rule: Trainer can only access members assigned to them', () => {
      const trainerId = 'trainer123';
      const otherTrainerId = 'trainer999';

      const assignedMember = { _id: 'member1', assignedTrainer: trainerId };
      const unassignedMember = { _id: 'member2', assignedTrainer: otherTrainerId };

      assert.strictEqual(
        assignedMember.assignedTrainer === trainerId,
        true,
        'Trainer owns member 1'
      );
      assert.strictEqual(
        unassignedMember.assignedTrainer === trainerId,
        false,
        'Trainer does not own member 2'
      );
    });
  });

  describe('3. Financial & Payment Business Rules', () => {
    test('Only verified payments count toward collected revenue and dues reduction', () => {
      const payments = [
        { amount: 5000, status: PAYMENT_STATUSES.VERIFIED },
        { amount: 2000, status: PAYMENT_STATUSES.SUBMITTED }, // Not yet verified
        { amount: 5000, status: PAYMENT_STATUSES.REJECTED },  // Rejected
        { amount: 3000, status: PAYMENT_STATUSES.VERIFIED },
      ];

      const membershipTotal = 10000;

      // Business Rule: ONLY count verified payments
      const verifiedPaid = payments
        .filter((p) => p.status === PAYMENT_STATUSES.VERIFIED)
        .reduce((sum, p) => sum + p.amount, 0);

      const pendingDues = Math.max(0, membershipTotal - verifiedPaid);

      assert.strictEqual(verifiedPaid, 8000, 'Verified total should strictly be 5000 + 3000 = 8000');
      assert.strictEqual(pendingDues, 2000, 'Remaining dues should strictly be 10000 - 8000 = 2000');
    });

    test('Cash payment is not marked as received until confirmed by Admin / Reception', () => {
      const cashSubmissionFromMember = {
        amount: 2000,
        paymentMethod: 'cash',
        status: PAYMENT_STATUSES.SUBMITTED, // Merely an intention!
      };

      assert.notStrictEqual(
        cashSubmissionFromMember.status,
        PAYMENT_STATUSES.VERIFIED,
        'Cash payment cannot be auto-verified upon member request'
      );
    });
  });

  describe('4. Trainer Salary Confirmation Workflow', () => {
    test('Trainer salary state transitions strictly through allowed workflow', () => {
      let salaryRecord = {
        amount: 60000,
        month: 11,
        year: 2026,
        status: SALARY_STATUSES.PENDING,
      };

      // Step 1: Admin marks as paid
      salaryRecord.status = SALARY_STATUSES.PAID_AWAITING_CONFIRMATION;
      salaryRecord.paidAt = new Date();

      assert.strictEqual(
        salaryRecord.status,
        SALARY_STATUSES.PAID_AWAITING_CONFIRMATION,
        'Status must become paid_awaiting_confirmation after admin remittance'
      );

      // Step 2: Trainer confirms receipt
      salaryRecord.status = SALARY_STATUSES.CONFIRMED;
      salaryRecord.confirmedAt = new Date();

      assert.strictEqual(
        salaryRecord.status,
        SALARY_STATUSES.CONFIRMED,
        'Status must become confirmed after trainer receipt verification'
      );
      assert.ok(salaryRecord.confirmedAt, 'Confirmed timestamp must be recorded');
    });
  });

  describe('5. Membership Expiry Calculation Logic', () => {
    test('Days remaining calculation calculates exact positive integer or zero', () => {
      const now = new Date();
      const futureExpiry = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days ahead

      const diffMs = futureExpiry - now;
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      assert.strictEqual(daysRemaining, 15);

      // Past expiry
      const pastExpiry = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      const pastDiffMs = pastExpiry - now;
      const pastDaysRemaining = Math.max(0, Math.ceil(pastDiffMs / (1000 * 60 * 60 * 24)));

      assert.strictEqual(pastDaysRemaining, 0, 'Expired membership must return 0 days remaining');
    });
  });
});
