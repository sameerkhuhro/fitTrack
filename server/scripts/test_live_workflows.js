require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const http = require('http');
const app = require('../src/app');

// Models for cleanup verification
const User = require('../src/models/User');
const Membership = require('../src/models/Membership');
const MembershipPlan = require('../src/models/MembershipPlan');
const Payment = require('../src/models/Payment');
const TrainerSalary = require('../src/models/TrainerSalary');
const WorkoutPlan = require('../src/models/WorkoutPlan');
const ProgressRecord = require('../src/models/ProgressRecord');
const Attendance = require('../src/models/Attendance');

async function runLiveWorkflows() {
  console.log('=== LIVE MONGODB ATLAS BUSINESS WORKFLOWS TEST ===\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[DB] Connected to MongoDB Atlas Database: "${mongoose.connection.name}"`);

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5098, resolve));
  const baseUrl = 'http://127.0.0.1:5098/api/v1';

  async function req(endpoint, options = {}) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...options,
    });
    const data = await res.json();
    return { status: res.status, ok: res.ok, data };
  }

  try {
    // 1. Authenticate Admin
    const adminLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@fittrack.com', password: 'Admin@FitTrack2026!' }),
    });
    const adminToken = adminLogin.data.token;
    console.log('✔ Authenticated Admin for workflow oversight.');

    // 2. Fetch available membership plans
    const plansRes = await req('/plans');
    const plans = plansRes.data.data;
    const standardPlan = plans.find(p => p.name.toLowerCase() === 'standard') || plans[0];
    console.log(`✔ Retrieved Plan: "${standardPlan.name}" (Fee: Rs. ${standardPlan.price}, Duration: ${standardPlan.durationMonths} months)`);

    // ----------------------------------------------------
    // WORKFLOW A: Member Online Payment & Admin Activation
    // ----------------------------------------------------
    console.log('\n--- WORKFLOW A: Online Transfer & Subscription Activation ---');
    const athleteEmail = `athlete.workflow.${Date.now()}@fittrack.com`;
    const regRes = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Tariq Mansoor',
        email: athleteEmail,
        password: 'Password@123456!',
        phone: '+923007654321',
      }),
    });
    const memberToken = regRes.data.token;
    const memberId = regRes.data.user.id;
    console.log(`✔ Step 1: Athlete registered: ${athleteEmail}`);

    // Step 2: Member requests membership
    const memReq = await req('/memberships/request', {
      method: 'POST',
      token: memberToken,
      body: JSON.stringify({ planId: standardPlan._id }),
    });
    const membershipId = memReq.data.data._id;
    console.log(`✔ Step 2: Membership requested. Status="${memReq.data.data.status}", PaymentStatus="${memReq.data.data.paymentStatus}"`);

    // Step 3: Member submits online payment proof
    const payRes = await req('/payments', {
      method: 'POST',
      token: memberToken,
      body: JSON.stringify({
        membershipId,
        amount: standardPlan.price,
        paymentMethod: 'bank_transfer',
        transactionReference: 'TRX-LIVE-ATLAS-9911',
        notes: 'Transferred via Meezan Bank mobile app',
      }),
    });
    const paymentId = payRes.data.data._id;
    console.log(`✔ Step 3: Payment submitted. Status="${payRes.data.data.status}", Amount=Rs. ${payRes.data.data.amount}`);

    // Step 4: Admin verifies payment
    const verifyRes = await req(`/payments/${paymentId}/verify`, {
      method: 'PATCH',
      token: adminToken,
      body: JSON.stringify({ adminNotes: 'Verified funds cleared in Meezan Bank account' }),
    });
    console.log(`✔ Step 4: Admin verified payment. Receipt="${verifyRes.data.data.receiptNumber}", Status="${verifyRes.data.data.status}"`);

    // Step 5: Admin activates membership
    const activateRes = await req(`/memberships/${membershipId}/activate`, {
      method: 'PATCH',
      token: adminToken,
    });
    console.log(`✔ Step 5: Admin activated membership. Status="${activateRes.data.data.status}", Expiry="${new Date(activateRes.data.data.expiryDate).toLocaleDateString()}"`);

    // ----------------------------------------------------
    // WORKFLOW B: Cash Payment at Reception
    // ----------------------------------------------------
    console.log('\n--- WORKFLOW B: Cash Payment Recorded by Admin/Reception ---');
    const cashPayRes = await req('/payments/cash-received', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        memberId,
        membershipId,
        amount: 1500,
        notes: 'Additional personal training registration cash fee',
      }),
    });
    console.log(`✔ Cash payment recorded at reception. Receipt="${cashPayRes.data.data.receiptNumber}", Amount=Rs. ${cashPayRes.data.data.amount}`);

    // ----------------------------------------------------
    // WORKFLOW D: Trainer Salary Confirmation
    // ----------------------------------------------------
    console.log('\n--- WORKFLOW D: Trainer Monthly Salary Lifecycle ---');
    const workflowCoachEmail = `coach.wf.${Date.now()}@fittrack.com`;
    const coachCreate = await req('/trainers', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        name: 'Kamran Akmal',
        email: workflowCoachEmail,
        phone: '+923019998888',
        specialization: 'Conditioning',
        monthlySalary: 75000,
        tempPassword: 'Trainer@123456!',
      }),
    });
    const wfTrainer = coachCreate.data.data;
    const wfTrainerId = wfTrainer.id;

    // Admin creates salary record
    const month = (new Date().getMonth() + 1);
    const year = 2026;

    const salRes = await req('/salaries', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        trainerId: wfTrainerId,
        month,
        year,
        amount: 75000,
        adminNotes: 'Regular monthly stipend',
      }),
    });

    const salaryId = salRes.data.data._id;
    console.log(`✔ Step 1: Admin created salary for ${wfTrainer.name}. Status="${salRes.data.data.status}"`);

    // Admin marks salary as paid
    const markPaid = await req(`/salaries/${salaryId}/mark-paid`, {
      method: 'PATCH',
      token: adminToken,
      body: JSON.stringify({
        paymentMethod: 'bank_transfer',
        transactionReference: `SAL-TRX-${Date.now()}`,
        adminNotes: 'Salary disbursed from company account',
      }),
    });
    console.log(`✔ Step 2: Admin marked salary paid. Status="${markPaid.data.data.status}"`);

    // Trainer logs in and confirms receipt
    const trainerLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: workflowCoachEmail, password: 'Trainer@123456!' }),
    });
    const trainerToken = trainerLogin.data.token;

    const confirmRes = await req(`/salaries/${salaryId}/confirm-received`, {
      method: 'PATCH',
      token: trainerToken,
    });
    console.log(`✔ Step 3: Trainer confirmed salary receipt. Status="${confirmRes.data.data.status}", ConfirmedAt="${confirmRes.data.data.confirmedAt}"`);

    // Cleanup workflow coach & salary
    await TrainerSalary.deleteMany({ trainer: wfTrainerId });
    await User.deleteOne({ _id: wfTrainerId });
    console.log('✔ Cleaned up temporary workflow trainer & salary from Atlas.');

    // ----------------------------------------------------
    // WORKFLOW E: Biometric Progress & Attendance
    // ----------------------------------------------------
    console.log('\n--- WORKFLOW E: Biometric Progress & Attendance Logging ---');
    const progRes = await req('/progress', {
      method: 'POST',
      token: memberToken,
      body: JSON.stringify({
        weight: 81.5,
        height: 177,
        waist: 34,
        chest: 41,
        bodyFatPercentage: 18.2,
        notes: 'Baseline check at start of month',
      }),
    });
    console.log(`✔ Logged athlete biometric progress in Atlas. Weight=${progRes.data.data.weightKg}kg, Waist=${progRes.data.data.waistCm}cm`);

    const attRes = await req('/attendance/check-in', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        memberId,
        checkInMethod: 'turnstile_qr',
        notes: 'Main gate entry',
      }),
    });
    console.log(`✔ Recorded turnstile attendance check-in. Date=${attRes.data.data.dateString}, InTime=${attRes.data.data.checkInTime}`);

    // Cleanup temporary test member and their child records
    await Payment.deleteMany({ member: memberId });
    await Membership.deleteMany({ member: memberId });
    await ProgressRecord.deleteMany({ member: memberId });
    await Attendance.deleteMany({ member: memberId });
    await User.deleteOne({ _id: memberId });
    console.log('\n✔ Cleaned up temporary test athlete data from Atlas fittrack.');

    console.log('\n======================================================');
    console.log('ALL LIVE BUSINESS WORKFLOWS COMPLETED IN ATLAS!');
    console.log('======================================================\n');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runLiveWorkflows().catch(e => {
  console.error('\n❌ WORKFLOW FAILED:', e);
  process.exit(1);
});
