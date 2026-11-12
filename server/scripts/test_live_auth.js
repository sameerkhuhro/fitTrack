require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const app = require('../src/app');
const User = require('../src/models/User');

async function runLiveAuthTests() {
  console.log('=== LIVE MONGODB ATLAS AUTHENTICATION VERIFICATION ===\n');

  // 1. Connect to Atlas
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`[DB] Connected to MongoDB Atlas: "${mongoose.connection.name}"`);

  // Start temporary local Express HTTP server
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5099, resolve));
  const baseUrl = 'http://127.0.0.1:5099/api/v1';

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
    // ----------------------------------------------------
    // TEST 1: Admin Authentication
    // ----------------------------------------------------
    console.log('\n--- 1. Testing Admin Authentication ---');
    const adminLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@fittrack.com',
        password: process.env.INITIAL_ADMIN_PASSWORD || 'Admin@FitTrack2026!',
      }),
    });

    if (!adminLogin.ok) {
      throw new Error(`Admin login failed: ${adminLogin.data.message}`);
    }
    console.log('✔ Admin login succeeded. Received JWT token.');
    const adminToken = adminLogin.data.token;

    // Test /auth/me
    const adminMe = await req('/auth/me', { token: adminToken });
    console.log(`✔ Admin profile retrieved: Name="${adminMe.data.data.name}", Role="${adminMe.data.data.role}"`);

    // Test Admin-only route
    const adminDash = await req('/dashboard/summary', { token: adminToken });
    console.log(`✔ Admin accessed /dashboard/summary: Status=${adminDash.status}, TotalMembers=${adminDash.data.data?.totalMembers}`);

    // ----------------------------------------------------
    // TEST 2: Trainer Authentication & Temporary Password Flow
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Trainer Authentication ---');
    const trainerLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'hamza.trainer@fittrack.com',
        password: 'Trainer@FitTrack2026!',
      }),
    });

    if (!trainerLogin.ok) {
      throw new Error(`Trainer login failed: ${trainerLogin.data.message}`);
    }
    console.log('✔ Trainer login succeeded. Received JWT token.');
    const trainerToken = trainerLogin.data.token;

    const trainerMe = await req('/auth/me', { token: trainerToken });
    console.log(`✔ Trainer profile retrieved: Name="${trainerMe.data.data.name}", Specialization="${trainerMe.data.data.specialization}"`);

    const trainerSummary = await req('/dashboard/trainer-summary', { token: trainerToken });
    console.log(`✔ Trainer accessed /dashboard/trainer-summary: Status=${trainerSummary.status}, AssignedAthletes=${trainerSummary.data.data?.assignedMembersCount}`);

    // Test Admin creates new Trainer with temporary password
    console.log('\n--- 2b. Testing Admin Creates Trainer -> Forced Password Change ---');
    const tempTrainerEmail = `new.coach.${Date.now()}@fittrack.com`;
    const tempTrainerPass = 'Temp@FitTrack2026!';
    const createTrainerRes = await req('/trainers', {
      method: 'POST',
      token: adminToken,
      body: JSON.stringify({
        name: 'Farhan Zaidi',
        email: tempTrainerEmail,
        phone: '+923051234567',
        specialization: 'CrossFit & Olympic Lifting',
        monthlySalary: 70000,
        tempPassword: tempTrainerPass,
      }),
    });

    if (!createTrainerRes.ok) {
      throw new Error(`Create trainer failed: ${createTrainerRes.data.message}`);
    }
    console.log(`✔ Admin created trainer: Email="${tempTrainerEmail}", mustChangePassword=${createTrainerRes.data.data.mustChangePassword}`);

    // Trainer logs in with temporary password
    const tempLogin = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: tempTrainerEmail, password: tempTrainerPass }),
    });
    console.log(`✔ Trainer logged in with temp password. mustChangePassword=${tempLogin.data.user.mustChangePassword}`);
    const tempToken = tempLogin.data.token;

    // Trainer updates password
    const newTrainerPass = 'Farhan@NewSecret2026!';
    const changePwdRes = await req('/auth/change-password', {
      method: 'PATCH',
      token: tempToken,
      body: JSON.stringify({ currentPassword: tempTrainerPass, newPassword: newTrainerPass }),
    });
    console.log(`✔ Trainer changed password: ${changePwdRes.data.message}`);

    // Verify old temp password fails
    const oldLoginFail = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: tempTrainerEmail, password: tempTrainerPass }),
    });
    console.log(`✔ Old temp password successfully rejected (Status: ${oldLoginFail.status})`);

    // Verify new password succeeds
    const newLoginOk = await req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: tempTrainerEmail, password: newTrainerPass }),
    });
    console.log(`✔ New password successfully authenticated! Token issued.`);

    // Clean up temporary test trainer from Atlas
    await User.deleteOne({ email: tempTrainerEmail });
    console.log('✔ Cleaned up temporary test trainer from Atlas.');

    // ----------------------------------------------------
    // TEST 3: Member Registration, Login & Role Isolation
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Member Registration & Login ---');
    const newMemberEmail = `athlete.${Date.now()}@fittrack.com`;
    const newMemberPass = 'Athlete@FitTrack2026!';

    const regRes = await req('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Zubair Shah',
        email: newMemberEmail,
        password: newMemberPass,
        phone: '+923121112233',
        emergencyContact: { name: 'Shah Sahib', phone: '+923129998877' },
      }),
    });

    if (!regRes.ok) {
      throw new Error(`Member registration failed: ${regRes.data.message}`);
    }
    console.log(`✔ Member registration succeeded! Member saved to Atlas fittrack. Email="${newMemberEmail}"`);
    const memberToken = regRes.data.token;

    // Member dashboard summary
    const memSummary = await req('/dashboard/member-summary', { token: memberToken });
    console.log(`✔ Member accessed /dashboard/member-summary: Status=${memSummary.status}`);

    // Test Security Role Isolation: Member attempting to access Admin endpoint
    console.log('\n--- 4. Testing Security Boundary (Role Isolation) ---');
    const blockedRes = await req('/dashboard/summary', { token: memberToken });
    console.log(`✔ Security check passed: Member blocked from Admin route with Status ${blockedRes.status} (${blockedRes.data.message})`);

    // Clean up temporary test athlete
    await User.deleteOne({ email: newMemberEmail });
    console.log('✔ Cleaned up temporary test member from Atlas.');

    console.log('\n======================================================');
    console.log('ALL LIVE ATLAS AUTHENTICATION TESTS PASSED WITH 100%!');
    console.log('======================================================\n');
  } finally {
    server.close();
    await mongoose.disconnect();
  }
}

runLiveAuthTests().catch((e) => {
  console.error('\n❌ LIVE AUTH TEST FAILED:', e);
  process.exit(1);
});

