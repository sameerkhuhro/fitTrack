# FitTrack Pro – REST API Documentation

Base URI: `/api/v1`

All protected endpoints require an HTTP `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### 1.1 Register Member
- **Endpoint**: `POST /auth/register`
- **Access**: Public (Only creates accounts with `role: member`)
- **Body**:
```json
{
  "name": "Usman Tariq",
  "email": "usman@example.com",
  "password": "SecurePassword123!",
  "phone": "+923001234567",
  "emergencyContact": {
    "name": "Tariq Malik",
    "phone": "+923009876543"
  }
}
```
- **Response**: `201 Created` with JWT token and user profile.

### 1.2 User Login
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "admin@fittrack.com",
  "password": "<configured_password>"
}
```
- **Response**: `200 OK` with JWT token and role identifier (`admin`, `trainer`, `member`).

### 1.3 Get Current Profile
- **Endpoint**: `GET /auth/me`
- **Access**: Private (Authenticated)
- **Response**: `200 OK` with user details and assigned trainer populated.

### 1.4 Change Password
- **Endpoint**: `PATCH /auth/change-password`
- **Access**: Private (Authenticated)
- **Body**:
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPermanentPassword2026!"
}
```

---

## 2. Membership Plans

### 2.1 Get All Plans
- **Endpoint**: `GET /plans`
- **Access**: Public / Authenticated

### 2.2 Create Plan
- **Endpoint**: `POST /plans`
- **Access**: Admin only
- **Body**:
```json
{
  "name": "VIP Platinum",
  "description": "Full access with sauna and personal trainer",
  "price": 25000,
  "durationMonths": 12,
  "features": ["24/7 Access", "Dedicated Trainer", "Sauna & Steam Bath"]
}
```

---

## 3. Memberships & Subscriptions

### 3.1 Request Membership
- **Endpoint**: `POST /memberships/request`
- **Access**: Member only
- **Body**:
```json
{
  "planId": "65ab12cd34ef56...",
  "notes": "Prefer evening workouts"
}
```
- **Response**: `201 Created` with membership in `pending` status.

### 3.2 Activate Membership
- **Endpoint**: `PATCH /memberships/:id/activate`
- **Access**: Admin only
- **Behavior**: Calculates start and expiry dates from plan duration, marks status `active`, and dispatches notification to member.

### 3.3 Request Renewal
- **Endpoint**: `POST /memberships/:id/renew`
- **Access**: Member only
- **Behavior**: Creates a new historical pending membership without destroying past membership logs.

---

## 4. Payment Management & Verification

### 4.1 Submit Payment Proof (Online Transfer / Cash Intention)
- **Endpoint**: `POST /payments`
- **Access**: Member only
- **Content-Type**: `multipart/form-data`
- **Fields**: `membershipId`, `amount`, `paymentMethod` (`bank_transfer`, `jazzcash`, `easypaisa`, `cash`), `transactionReference`, `proofImage` (file).

### 4.2 Record Cash Received at Gym
- **Endpoint**: `POST /payments/cash-received`
- **Access**: Admin only
- **Body**:
```json
{
  "memberId": "65ab...",
  "membershipId": "65cd...",
  "amount": 5000,
  "notes": "Paid cash at reception counter"
}
```
- **Response**: Generates official receipt `REC-YYYYMMDD-XXXX` and marks status `verified` immediately.

### 4.3 Verify Payment Submission
- **Endpoint**: `PATCH /payments/:id/verify`
- **Access**: Admin only
- **Body**: `{ "adminNotes": "Funds verified in bank statement" }`

### 4.4 Reject Payment
- **Endpoint**: `PATCH /payments/:id/reject`
- **Access**: Admin only
- **Body**: `{ "reason": "Transaction reference not found" }`

---

## 5. Trainer Salaries & Confirmation

### 5.1 Create Monthly Salary Record
- **Endpoint**: `POST /salaries`
- **Access**: Admin only
- **Body**:
```json
{
  "trainerId": "65ef...",
  "month": 11,
  "year": 2026,
  "amount": 65000,
  "adminNotes": "Standard monthly coaching retainer"
}
```

### 5.2 Mark Salary Paid
- **Endpoint**: `PATCH /salaries/:id/mark-paid`
- **Access**: Admin only
- **Body**:
```json
{
  "paymentMethod": "bank_transfer",
  "transactionReference": "SAL-2026-NOV-01"
}
```
- **Behavior**: Sets status to `paid_awaiting_confirmation` and notifies trainer.

### 5.3 Confirm Salary Received
- **Endpoint**: `PATCH /salaries/:id/confirm-received`
- **Access**: Trainer (own salary only)
- **Behavior**: Verifies status is `paid_awaiting_confirmation`, transitions to `confirmed`, and timestamps `confirmedAt`.

### 5.4 Dispute Salary
- **Endpoint**: `PATCH /salaries/:id/dispute`
- **Access**: Trainer (own salary only)
- **Body**: `{ "disputeReason": "Payment has not credited to bank account" }`

---

## 6. Attendance & Turnstiles

### 6.1 Check-In Member
- **Endpoint**: `POST /attendance/check-in`
- **Access**: Admin only
- **Body**: `{ "memberId": "65ab..." }`
- **Rule**: Rejects if member is already marked present for the current date (`code 11000` duplicate key).

### 6.2 Check-Out Member
- **Endpoint**: `PATCH /attendance/:id/check-out`
- **Access**: Admin only

---

## 7. Fitness Biometrics & Progress

### 7.1 Log Progress Entry
- **Endpoint**: `POST /progress`
- **Access**: Member, Trainer (if assigned), Admin
- **Body**:
```json
{
  "weightKg": 78.5,
  "heightCm": 178,
  "waistCm": 82,
  "chestCm": 102,
  "armsCm": 38,
  "bodyFatPercentage": 14.5,
  "notes": "Consistent energy during squat split"
}
```

---

## 8. System Health
- **Endpoint**: `GET /health`
- **Access**: Public
- **Response**:
```json
{
  "status": "ok",
  "service": "FitTrack Pro Backend API",
  "version": "1.0.0",
  "uptimeSeconds": 1420,
  "database": {
    "state": "connected",
    "connected": true
  }
}
```

