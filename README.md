# FitTrack Pro — Smart Gym Management & Membership Subscription Platform

[![CI/CD Pipeline](https://github.com/sameer-khuhro/FitTrack/actions/workflows/ci.yml/badge.svg)](https://github.com/sameer-khuhro/FitTrack/actions/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/Tests-27%2F27%20Passing-brightgreen.svg)](docs/TESTING_GUIDE.md)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-blue.svg)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)](docs/DATABASE_DESIGN.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Manage Your Gym. Empower Your Athletes.**  
> A production-grade, full-stack gym management web application built with React 18, Vite 6, Tailwind CSS, Express.js, MongoDB Atlas, and Docker. Engineered for high-reliability commercial fitness operations, verifiable financial audit trails, and automated subscription lifecycles.

---

## 🌟 Key Platform Capabilities

1. **Multi-Role Portals & Strict RBAC**:
   - **Admin / Gym Owner Portal** (`/admin/dashboard`): 17 operational modules including real-time revenue analytics, member rosters, trainer contracts, payment verification, cash receipts, and attendance telemetry.
   - **Certified Personal Trainer Portal** (`/trainer/dashboard`): Assigned athlete rosters, custom periodized workout programming, training calendar, and a 4-stage salary review/confirmation workflow.
   - **Gym Member / Athlete Portal** (`/member/dashboard`): Tiered membership management, online payment proof uploads, assigned workouts, interactive Recharts biometrics trajectory, and attendance check-in history.
   - **Public Discovery Website**: High-energy athletic editorial website with dynamic membership plans, facility spec sheets, coach rosters, and front desk inquiry routing.

2. **Dual-Channel Payment Architecture**:
   - **Method A (Manual Online Transfers)**: Direct wire/wallet transfers via Bank, JazzCash, or Easypaisa with transaction references and screenshot proof uploads processed via Multer.
   - **Method B (Reception Cash Desk)**: Immediate in-person cash collection at gym reception with digital voucher generation (`REC-YYYYMMDD-XXXX`).
   - **Financial Invariant**: Only verified payments reduce dues; unverified submissions and rejected payments never decrement balance.

3. **Non-Destructive Subscription Lifecycle**:
   - Automated expiry calculation, pro-rated renewals, and status transitions (`pending` &rarr; `active` &rarr; `expired` &rarr; `cancelled`).

4. **Audited Trainer Payroll Workflow**:
   - State machine preventing duplicate salary payments (`PENDING` &rarr; `PAID_AWAITING_CONFIRMATION` &rarr; `CONFIRMED` / `DISPUTED`).

5. **Automated Cron Jobs & Alert Deduplication**:
   - Daily subscription expiration scanning (7-day, 3-day, 1-day, and on-expiry notifications) powered by `node-cron` with a sparse unique `dedupKey` constraint preventing duplicate alerts.

6. **MongoDB Atlas Cloud Persistence**:
   - Multi-node replica set integration with TLS 1.3 encryption and automated shard failover.

7. **DevOps & Containerization**:
   - Multi-stage Dockerfiles for backend and frontend (Nginx reverse proxy), Docker Compose orchestration, and automated GitHub Actions CI/CD pipeline.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router DOM v6, Axios, Recharts, Lucide Icons |
| **Backend** | Node.js (v20+ / v24), Express.js, JWT, bcryptjs, Helmet, Express Rate Limit, CORS, node-cron, Multer, Morgan |
| **Database** | MongoDB Atlas (Multi-Node Replica Set, database `fittrack`), Mongoose 8 (Indexes, Compound Constraints) |
| **DevOps & Tools** | Docker, Docker Compose, Nginx Alpine, GitHub Actions CI/CD |

---

## 📂 Repository Structure

```text
FitTrack/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI test, build, and Docker validation
├── client/                      # React Vite Frontend SPA
│   ├── src/
│   │   ├── components/          # Reusable UI widgets, badges, modals, and navbar/footer
│   │   ├── context/             # AuthContext (JWT auth state & role helpers)
│   │   ├── layouts/             # PublicLayout, AdminLayout, TrainerLayout, MemberLayout
│   │   ├── pages/
│   │   │   ├── public/          # Home, About, Plans, Trainers, Facilities, Contact, Login, Register
│   │   │   ├── admin/           # 17 Modules (Dashboard, Members, Trainers, Plans, Payments, etc.)
│   │   │   ├── trainer/         # Dashboard, Assigned Members, Workouts, Schedule, Salaries, Profile
│   │   │   └── member/          # Dashboard, Membership, Payments, Workouts, Calendar, Progress, Attendance
│   │   ├── services/            # Central Axios API client
│   │   └── App.jsx              # Application router registry
│   ├── nginx.conf               # Production Nginx reverse proxy configuration
│   └── Dockerfile               # Multi-stage production container build
├── server/                      # Express.js REST API Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection & domain constants
│   │   ├── controllers/         # REST feature controllers
│   │   ├── jobs/                # node-cron scheduled background alerts
│   │   ├── middleware/          # auth (JWT), role (RBAC), upload (Multer), validator
│   │   ├── models/              # 12 Mongoose Schemas (User, Payment, Salary, Attendance, etc.)
│   │   ├── routes/              # Versioned REST endpoints (/api/v1)
│   │   ├── tests/               # 27 automated unit & end-to-end workflow tests
│   │   ├── utils/               # Database seeder & JWT token utilities
│   │   ├── app.js               # Express application configuration & middleware pipeline
│   │   └── server.js            # Server bootstrap & process lifecycle
│   ├── scripts/                 # Live Atlas test utilities & connectivity probes
│   └── Dockerfile               # Production Node.js container build
├── docs/                        # Complete Technical Documentation
│   ├── ARCHITECTURE.md          # Architecture overview & Mermaid flow diagrams
│   ├── DATABASE_DESIGN.md       # Schemas, compound indexes & Atlas cloud specs
│   ├── API_DOCUMENTATION.md     # Complete REST API reference
│   ├── DEPLOYMENT_GUIDE.md      # Linux VM, Docker & Nginx production setup
│   ├── USER_GUIDE.md            # Role walkthroughs (Admin, Trainer, Member, Public)
│   └── TESTING_GUIDE.md         # QA methodology, workflows A-G & security audit
├── scripts/
│   └── dev.js                   # Dual-service concurrent runner
├── .env.example                 # Sanitized environment template
├── .gitignore                   # Production git ignore rules
├── docker-compose.yml           # Container orchestration
├── package.json                 # Monorepo scripts & metadata
└── README.md                    # Project documentation
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v20+ LTS
- **npm** v9+
- **MongoDB Atlas** account or local MongoDB instance

### 2. Clone and Configure Environment
```bash
git clone https://github.com/sameer-khuhro/FitTrack.git
cd FitTrack

# Copy environment template
cp .env.example server/.env
```

Edit `server/.env` with your MongoDB connection string and JWT secret:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/fittrack?retryWrites=true&w=majority&authSource=admin
JWT_SECRET=your_secure_random_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to root
cd ..
```

### 4. Seed Initial Data
Populate the database with initial plans, trainers, and an administrator account:
```bash
npm run seed
```

*Seed Accounts:*
Configured via `INITIAL_ADMIN_PASSWORD` and `INITIAL_ADMIN_EMAIL` in your `.env` file (defaults to `admin@fittrack.com`). Change all administrative passwords immediately upon initial installation.

### 5. Start Development Servers
From the root directory, start both the Express API and Vite frontend concurrently:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

---

## 🐳 Running with Docker

Run the entire stack (MongoDB, Express Server, and Nginx Client) with a single command:
```bash
docker compose up -d --build
```
- Web Application: [http://localhost](http://localhost)
- Backend API Health: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

To view service logs:
```bash
docker compose logs -f
```

To stop containers:
```bash
docker compose down
```

---

## 🧪 Testing & Verification

FitTrack Pro includes an automated test suite executed via the native Node.js test runner:

```bash
# Run backend test suite (27 tests across 15 suites)
npm test

# Verify remote MongoDB Atlas connectivity
npm run test:atlas

# Run live Atlas end-to-end workflow verification
npm run test:workflows

# Build frontend production bundle
npm run build
```

---

## 📚 Technical Documentation Index

For in-depth specifications, refer to the documentation in [`docs/`](docs/):
- **[System Architecture](docs/ARCHITECTURE.md)** — Architectural tiers, security layers, and Mermaid sequence diagrams.
- **[Database Design](docs/DATABASE_DESIGN.md)** — Mongoose schemas, compound unique constraints, ER diagram, and Atlas replica set specifications.
- **[REST API Reference](docs/API_DOCUMENTATION.md)** — Complete endpoint catalog with request/response schemas.
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** — Linux virtual machine, firewall, SSL/TLS, and Docker deployment guide.
- **[User & Operations Manual](docs/USER_GUIDE.md)** — Step-by-step persona walkthroughs.
- **[Testing & QA Guide](docs/TESTING_GUIDE.md)** — Business workflows A–G and BOLA/IDOR security audit.

---

## 👨‍💻 Developer & Attribution

Developed by **[Sameer Khuhro](https://www.linkedin.com/in/sameer-khuhro)**.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
