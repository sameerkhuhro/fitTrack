# FitTrack Pro – Academic PBL Defense & Live Demonstration Guide

**Project Title:** FitTrack Pro – Smart Gym Management & Membership Subscription Platform  
**Target Course:** Problem-Based Learning (PBL) in Advanced Software Engineering  
**Prepared For:** Project Defense, Viva Examination & Portfolio Demonstration  

---

## 1. Project Pitch & Executive Summary (60-Second Opening)

> "Good morning, respected professors and evaluation committee members.  
> Today, I present **FitTrack Pro**, a centralized, production-grade gym management and membership subscription platform.  
> 
> Most independent gym facilities rely on fragmented tools: paper check-in sheets, unverified WhatsApp payment screenshots, and disorganized WhatsApp workout notes. This causes revenue leakage, unauthorized turnstile access, and delayed trainer salary confirmations.  
> 
> **FitTrack Pro solves this with an integrated, role-based web platform.** It features:
> 1. Dual payment processing with auditable digital receipt generation (supporting manual bank/wallet transfers and in-person reception cash).
> 2. Strict Role-Based Access Control and ownership boundaries across Admin, Certified Trainers, and Athletes.
> 3. An audited 4-stage trainer payroll confirmation lifecycle.
> 4. Compound database constraints preventing duplicate turnstile check-ins and payroll duplication.
> 5. Automated background cron jobs for membership expiry alerts.
> 6. Production containerization via Docker and automated CI testing via GitHub Actions.
> 
> Everything has been developed from scratch using the MERN stack with Tailwind CSS, secured by JWT and bcrypt, and verified through 27 automated tests with zero failures."

---

## 2. Five-Minute Live Viva Demonstration Script

### Act 1: Public Website & Member Registration (1 Minute)
1. **Open** `http://localhost:5173` in your browser.
2. **Showcase Landing Page**: Point out the dark luxury gym aesthetic (`#101312`, `#191F1C`, `#10B981`), hero section, interactive pricing cards, facilities showcase, certified trainer roster, and contact form.
3. **Navigate to `/register`**:
   * Register a new member (e.g. `zainab@example.com` / `Zainab@123456`).
   * Show that upon registration, the athlete is authenticated, given a JWT token, and routed to their member dashboard.

### Act 2: Membership Request & Dual Payment Workflow (1.5 Minutes)
1. **Request Plan**:
   * Go to **"My Membership"** -> Select **"Standard (3 Months – Rs. 5,000)"**.
   * Note the status is `pending` and `unpaid`.
2. **Submit Online Payment Proof**:
   * Go to **"Payments & Dues"** -> Click **"Submit Payment Proof"**.
   * Select **Bank Transfer / JazzCash**, enter amount `5,000`, transaction reference `TRX-998811`, and attach a receipt screenshot.
   * **Key Point to Explain**: Explain that the dues are **not** decremented yet. The payment status remains `submitted` until an administrator verifies the actual funds in the gym's bank account.
3. **Switch to Admin via 1-Click Fast Login**:
   * Logout and go to `/login` -> Click **"Admin Demo"** (logs in as `admin@fittrack.com`).
   * Navigate to **"Payments Audit"** (`/admin/payments`).
   * Review Zainab's submitted payment proof screenshot and transaction reference.
   * Click **"Verify Payment"**.
   * **Highlight**: Show the generated receipt number (`REC-20261111-XXXX`), timestamp, and that Zainab's dues are now marked `paid`.
4. **Activate Membership**:
   * Go to **"Memberships"** (`/admin/memberships`).
   * Click **"Activate"**. Show that the start date is set to today and the expiry date is calculated 3 months in the future.

### Act 3: Trainer Payroll Lifecycle & Dispute Handling (1 Minute)
1. **In Admin Portal**:
   * Go to **"Trainer Payroll"** (`/admin/salaries`).
   * Select Coach Hamza Khan for the current month -> Click **"Mark as Paid"** with transaction reference `SAL-NOV26-001`.
   * **Key Point to Explain**: In FitTrack Pro, salary does not immediately mark as finished. It transitions to `paid_awaiting_confirmation`.
2. **Switch to Trainer**:
   * Logout -> `/login` -> Click **"Trainer Demo"** (`hamza.trainer@fittrack.com`).
   * Notice the notification bell with an unread badge: *"Salary Payment Sent – Confirmation Required"*.
   * Go to **"My Salary History"** (`/trainer/salaries`).
   * Show the two action buttons: **"Confirm Received"** and **"Dispute Amount"**.
   * Click **"Confirm Received"**. The status becomes `confirmed` with an audit timestamp, visible to both trainer and admin.

### Act 4: Workout Assignment & Athlete Progress Tracking (1 Minute)
1. **Trainer Builds Workout**:
   * Go to **"Workout Builder"** (`/trainer/workouts`).
   * Select trainee Ali Raza -> Assign **Barbell Bench Press** (4 sets x 8 reps) and **Incline Dumbbell Press**.
2. **Member Reviews & Tracks Progress**:
   * Switch to Member (`ali.member@fittrack.com`).
   * Open **"Assigned Workouts"**: Show the prescribed exercises, target muscles, and trainer notes.
   * Open **"Fitness Progress"**: Show the interactive Recharts trajectory displaying weight and waist reductions over time.
   * Open **"Attendance"**: Show turnstile check-ins and streaks.

### Act 5: Automated Testing & Architecture (30 Seconds)
1. Open terminal in `C:\projects\FitTrack`.
2. Run `npm test`.
3. Point out that **27 automated test cases across 15 suites executed in ~1.5s with 100% pass rate**.

---

## 3. High-Yield Viva Questions & Examiner Defense Answers

### Q1: "Why did you choose MongoDB over a relational database like PostgreSQL for this gym platform?"
> **Examiner Defense:**  
> "We selected MongoDB for three key architectural reasons:  
> 1. **Semi-Structured Workout & Progress Data**: Workout routines have dynamic exercise arrays with nested sets, reps, and rest intervals. In a relational database, this requires 4-5 join tables (`plans`, `plan_exercises`, `sets`, `exercises`), increasing query complexity. MongoDB embeds exercise specifications cleanly while maintaining referential integrity to master exercise catalog IDs.  
> 2. **Schema Evolution**: Gym membership tiers and bodily measurements frequently change. MongoDB allows non-breaking field additions (e.g. body fat percentage, biometric device IDs) without locking large tables.  
> 3. **Compound Constraint Enforcement**: We strictly enforced relational-level invariants using MongoDB compound unique indexes: `{ member: 1, dateString: 1 }` on `Attendance` guarantees an athlete cannot scan in twice on the same day, and `{ trainer: 1, month: 1, year: 1 }` on `TrainerSalary` prevents duplicate monthly pay stubs."

---

### Q2: "How does your system prevent Broken Object Level Authorization (BOLA/IDOR) attacks?"
> **Examiner Defense:**  
> "In vulnerable systems, APIs accept an ID parameter (like `/api/memberships/:id` or `/api/progress/:id`) from the request body or URL and update the record without verifying ownership.  
> In FitTrack Pro:  
> 1. We **never** trust user IDs supplied by the client. The authenticated user's ID and role are derived exclusively from the cryptographically verified JWT token attached to `req.user`.  
> 2. For member-scoped resources, controllers verify `if (doc.member.toString() !== req.user._id.toString()) return res.status(403)`.  
> 3. For trainers, [workout.controller.js](file:///c:/projects/FitTrack/server/src/controllers/workout.controller.js) enforces that trainers can only program routines for members explicitly assigned to them via `member.assignedTrainer === req.user._id`.  
> We have automated test cases in `workflows.test.js` specifically verifying BOLA rejection."

---

### Q3: "What prevents a user from uploading a malicious PHP or JS script through the payment proof upload form?"
> **Examiner Defense:**  
> "File uploads are defended through a 3-layer security control in [upload.middleware.js](file:///c:/projects/FitTrack/server/src/middleware/upload.middleware.js):  
> 1. **MIME-Type Whitelisting**: Multer checks `file.mimetype`. Only `image/jpeg`, `image/png`, and `image/webp` are permitted. All executable formats (`.php`, `.sh`, `.exe`, `.js`, `.svg`) are rejected with a 400 Bad Request.  
> 2. **Filename Cryptographic Randomization**: Original user filenames are discarded. Files are renamed using `${fieldname}-${Date.now()}-${randomHash}${ext}`, preventing directory traversal (`../../`) and null-byte injection attacks.  
> 3. **Size Ceiling**: Enforced at 5MB via Multer buffer limits to prevent Denial of Service (DoS) through disk exhaustion."

---

### Q4: "How does your payment system handle financial integrity and cash payments without a fake third-party gateway?"
> **Examiner Defense:**  
> "Many student projects use fake client-side gateway simulations that blindly mark payments as 'Paid'. In production Pakistani gym operations, over 80% of transactions occur via manual Bank Transfer, JazzCash, Easypaisa, or Cash at the front desk.  
> FitTrack Pro implements real-world audited financial workflows:  
> 1. **Dual Workflows**: Method A supports manual online transfers with proof upload; Method B supports cash payments at reception.  
> 2. **Financial Invariant**: Online submissions and cash intentions enter a `submitted` status and have zero effect on collected gym revenue or remaining dues.  
> 3. **Verification Audit**: Only when an authorized Admin or Receptionist audits the bank portal or physically counts cash and clicks 'Verify', the status becomes `verified`, audit timestamps and reviewer IDs are locked, dues are decremented, and an immutable digital receipt (`REC-...`) is generated.  
> 4. **Partial Payment Math**: If a 1-year membership costs Rs. 18,000, paying Rs. 6,000 correctly transitions payment status to `partial` with Rs. 12,000 dues remaining, proven by our automated test suite."

---

### Q5: "How does your background cron job handle notification deduplication?"
> **Examiner Defense:**  
> "Our midnight cron job scans for memberships expiring in 7 days, 3 days, 1 day, and expired memberships.  
> In naive implementations, if the server restarts or the cron triggers twice, users receive duplicate spam notifications.  
> FitTrack Pro solves this with **deterministic idempotency keys**:  
> Each scheduled alert generates a key: `expiry-${days}d-${membershipId}-${targetDateStr}`.  
> The `Notification` Mongoose model enforces a **sparse unique index** on `dedupKey`. If an alert for that specific athlete, milestone, and date already exists, MongoDB rejects the duplicate insert and the catch block absorbs it safely."

---

### Q6: "Why did you use Nginx in Docker Compose instead of letting Node serve both frontend and backend?"
> **Examiner Defense:**  
> "Using Nginx as a reverse proxy follows the industry-standard Single-Page Application (SPA) production pattern:  
> 1. **Static File Performance**: Nginx serves static HTML, CSS, and JS chunks directly from disk using asynchronous event-driven I/O, freeing Node's single-threaded event loop to handle API business logic.  
> 2. **SPA Routing Fallback**: `try_files $uri $uri/ /index.html;` allows React Router DOM to manage client-side routing across page refreshes without 404 errors.  
> 3. **Network Isolation**: In our Docker Compose configuration, MongoDB port 27017 and Express port 5000 are not exposed to the public internet. External users connect solely to Nginx on port 80, which reverse-proxies `/api/` traffic to the backend over an isolated Docker network."

---

## 4. Evaluation Rubric & Software Engineering Mapping

| Academic PBL Criterion | System Implementation | Verified Evidence |
| :--- | :--- | :--- |
| **Requirements Analysis & Problem Modeling** | Modeled complete operations of an enterprise gym organization across 3 roles and public discovery. | [PROJECT_REPORT.md](file:///c:/projects/FitTrack/PROJECT_REPORT.md) Sections 1-6 |
| **System Architecture & Design** | C4 context, layered REST controllers, JWT middleware pipeline, and SPA reverse proxy. | [docs/ARCHITECTURE.md](file:///c:/projects/FitTrack/docs/ARCHITECTURE.md) |
| **Database Engineering** | 12 Mongoose models, compound unique indexes, referential integrity, and data dictionary. | [docs/DATABASE_DESIGN.md](file:///c:/projects/FitTrack/docs/DATABASE_DESIGN.md) |
| **Defensive Security & Authentication** | Salted bcrypt hashing, JWT validation, BOLA/IDOR prevention, rate limiting, and Helmet headers. | [AUDIT_REPORT.md](file:///c:/projects/FitTrack/AUDIT_REPORT.md) Section 2.4 |
| **Business Logic Invariants** | Dual payment verification, receipt generation, partial dues arithmetic, and 4-state salary workflow. | [server/src/tests/workflows.test.js](file:///c:/projects/FitTrack/server/src/tests/workflows.test.js) |
| **User Interface & Experience** | Luxury dark aesthetic, Recharts progress graphs, 1-click fast login, responsive sidebar layouts. | 40 React views across `client/src/pages/` |
| **DevOps & CI/CD** | Multi-stage Dockerfiles, Docker Compose, automated GitHub Actions workflow (`ci.yml`). | Root `docker-compose.yml` & `.github/` |
| **Automated Testing & QA** | 27 automated unit, business rule, and integration test cases with 100% pass rate. | [docs/TESTING_REPORT.md](file:///c:/projects/FitTrack/docs/TESTING_REPORT.md) |

