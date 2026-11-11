# FitTrack Pro – Comprehensive User & Operations Manual

This guide provides operational walkthroughs for all four user personas within FitTrack Pro: Public Visitors, Registered Members, Certified Trainers, and Gym Administrators.

---

## 1. Public Visitors & Registration

### 1.1 Exploring the Gym
1. Navigate to the landing page at `http://localhost:5173` or production domain.
2. Review the **Membership Plans** section (Basic, Standard, Premium), **Facilities**, and **Certified Coaches**.
3. Use the **Contact Us** form to submit inquiries directly to the front desk.

### 1.2 Creating an Athlete Account
1. Click **Join Now** on the top navigation bar.
2. Enter your Full Name, Email, Password (min 6 characters), Phone Number, and Optional Emergency Contact.
3. Click **Complete Registration**. You will be logged in immediately and directed to your Athlete Portal.

---

## 2. Member Portal Walkthrough

### 2.1 Subscribing to a Plan
1. In your Member sidebar, click **My Membership**.
2. If you do not have an active subscription, review the available tiers and click **Choose Plan**.
3. Confirm the request. Your membership will transition to `pending` status.

### 2.2 Submitting Payments & Dues Clearance
FitTrack Pro supports dual payment channels:

#### Method A: Manual Online Transfer (Bank, JazzCash, Easypaisa)
1. Go to **Payments & Dues**.
2. Note the gym's bank account (Meezan Bank), JazzCash, or Easypaisa account details shown on screen.
3. Transfer the fee through your banking app or wallet.
4. Click **Submit Payment**, enter the transaction ID (TID), and attach your screenshot.
5. Once the administrator verifies funds in the club bank statement, an official digital receipt (`REC-...`) will be issued and your membership activated.

#### Method B: Cash Payment at Gym Desk
1. On the **Submit Payment** form, select **Cash at Gym Desk**.
2. Hand the cash to gym reception upon your visit.
3. The receptionist enters the cash payment in the Admin console, immediately issuing your verified voucher and clearing your balance.

### 2.3 Accessing Workouts & Logging Biometrics
- **Workouts**: View your coach's prescribed sets, reps, rest intervals, and exercise cues.
- **Biometrics**: Log your bodyweight (kg), waist, chest, and arms circumference. Watch your physical transformation trajectory graphed dynamically on the progress chart.
- **Attendance**: Review your biometric check-in log and monthly attendance streaks.

---

## 3. Trainer Portal Walkthrough

### 3.1 First Login & Password Security
1. When your account is provisioned by gym management, you will be provided a temporary password.
2. Log in at `/login`.
3. The platform will automatically prompt you to configure your permanent personal password before accessing client data.

### 3.2 Managing Assigned Athletes & Workout Splits
1. Click **Assigned Members** to view only the athletes assigned to your coaching roster.
2. Click **Biometrics** on any athlete to inspect their historical weight and measurement trends.
3. Click **Plan Workout** to construct a customized lifting split: select movements from the library, set target sets/reps, specify rest intervals, and designate training days.

### 3.3 Salary Disbursement & Confirmation Workflow
1. When gym management marks your monthly compensation as paid, you will receive an in-app alert.
2. Navigate to **Salary & Confirmation**.
3. Locate the row with status `paid_awaiting_confirmation`.
4. Verify that the funds have cleared in your bank account or mobile wallet.
5. Click **Confirm Received**. The platform records your confirmation timestamp, and the status transitions permanently to `confirmed`.
6. If the funds have not arrived, click **Dispute** and enter the discrepancy details for admin investigation.

---

## 4. Admin Portal Walkthrough

### 4.1 Dashboard Telemetry
- Monitor real-time KPIs: Total Members, Active Members, Verified Revenue (counted strictly from verified receipts), and Outstanding Dues.
- Inspect Recharts visualizations for monthly revenue realization, membership distribution, and 7-day attendance footfall.

### 4.2 Member & Trainer Administration
- **Members**: Register new athletes, assign personal trainers, edit profiles, or deactivate inactive accounts.
- **Trainers**: Provision certified coaches with monthly salaries, contact details, and secure temporary passwords.

### 4.3 Payment Verification & Cash Desk
- Review submitted online payment screenshots and transaction IDs.
- Click **Verify** to clear funds and automatically generate an official tax receipt.
- Use **Record Cash Received** to process walk-in cash payments directly at the front desk.

### 4.4 Turnstile Attendance Enforcement
- On the **Daily Attendance** screen, record athlete check-ins.
- The system automatically blocks duplicate check-in entries on the same day for the same member.
- Click **Check-Out** when the member completes their workout.
