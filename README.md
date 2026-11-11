# FitTrack Pro – Smart Gym Management & Membership Subscription Platform

> **Manage Your Gym. Empower Your Fitness.**  
> A full-stack, production-minded gym management web application built with React, Node.js, Express, MongoDB, and Docker. Developed for academic Problem-Based Learning (PBL) excellence and professional portfolio demonstration.

---

## 🚀 Key Platform Capabilities

1. **Multi-Role Portals & RBAC**: Dedicated, secured interfaces for **Admin / Gym Owner**, **Certified Personal Trainer**, and **Gym Member / Athlete**.
2. **Public-Facing Website**: Polished gym landing page featuring facilities, live membership tiers, coach profiles, interactive contact messaging, and athlete registration.
3. **Dual Payment Workflows**:
   - **Method A (Manual Online)**: Direct transfers via Bank (Meezan/SCB), JazzCash, or Easypaisa with transaction references and screenshot proof uploads.
   - **Method B (Cash Desk)**: In-person cash collection at gym reception with immediate digital receipt generation (`REC-...`).
4. **Subscription Activation & Renewal Lifecycle**: Admin payment auditing, activation date calculation, and non-destructive historical renewals.
5. **Trainer Salary Confirmation Workflow**: Admin records monthly payroll → Trainer receives in-app push alert → Trainer audits account and clicks **"Confirm Received"** (or disputes with reason) with timestamped audit logs.
6. **Workout & Movement Management**: Exercise encyclopedia across 8 muscle categories, custom sets/reps programming, and training appointment scheduling.
7. **Attendance & Biometric Tracking**: Anti-duplicate turnstile check-in enforcement, historical attendance streaks, and interactive KaTeX / KaTeX-compatible Recharts biometrics trajectory tracking.
8. **Automated Cron Jobs**: Background membership expiry reminders (7 days, 3 days, 1 day, and on expiry) powered by `node-cron` with built-in alert deduplication.
9. **DevOps & Containerization**: Multi-stage Dockerfiles for backend and frontend (Nginx reverse proxy), Docker Compose, GitHub Actions CI/CD pipeline, and Linux deployment guides.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Recharts, Lucide React |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Helmet, Express Rate Limit, CORS, node-cron, Multer, Morgan |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose 8 (Indexes, Compound Constraints, Schemas) |
| **DevOps** | Docker, Docker Compose, Nginx (Alpine), GitHub Actions CI/CD |

---

## 📂 Repository Folder Structure

```text
fitTrack/
├── client/                     # React Vite Frontend SPA
│   ├── src/
│   │   ├── components/         # Reusable common UI (Button, Modal, Card, Badge, StatCard)
│   │   ├── context/            # AuthContext (JWT auth state & role helpers)
│   │   ├── layouts/            # PublicLayout, AdminLayout, TrainerLayout, MemberLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Plans, Trainers, Facilities, Contact, Login, Register
│   │   │   ├── admin/          # 17 Modules (Dashboard, Members, Trainers, Plans, Payments, etc.)
│   │   │   ├── trainer/        # Dashboard, Assigned Members, Workouts, Schedule, Salaries, Profile
│   │   │   └── member/         # Dashboard, Membership, Payments, Workouts, Calendar, Progress, Attendance
│   │   ├── services/           # Axios central API instance
│   │   └── App.jsx             # React Router route registry
│   ├── nginx.conf              # Production Nginx SPA & reverse proxy configuration
│   └── Dockerfile              # Multi-stage production build
│
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── config/             # MongoDB connection & domain constants
│   │   ├── controllers/        # Feature controllers (auth, member, payment, salary, etc.)
│   │   ├── jobs/               # node-cron scheduled background tasks
│   │   ├── middleware/         # auth (JWT), role (RBAC), upload (Multer), validator
│   │   ├── models/             # 12 Mongoose Schemas (User, Payment, Salary, Attendance, etc.)
│   │   ├── routes/             # Versioned REST route handlers (/api/v1)
│   │   ├── tests/              # Automated unit and business logic test suite
│   │   ├── utils/              # Seed script & token utilities
│   │   ├── app.js              # Express app configuration & middleware pipeline
│   │   └── server.js           # Server bootstrap & process lifecycle
│   └── Dockerfile              # Optimized Node.js production image
│
├── docs/                       # Technical Documentation
│   ├── ARCHITECTURE.md         # System architecture & Mermaid flow diagrams
│   ├── DATABASE_DESIGN.md      # Schemas, indexes & Mermaid ER diagram
│   ├── API_DOCUMENTATION.md    # Complete REST API reference
│   ├── USER_GUIDE.md           # Role-by-role user manual
│   ├── DEPLOYMENT_GUIDE.md     # Linux / Ubuntu / RHEL server setup & backups
│   └── TESTING_REPORT.md       # Quality assurance results & security audit
│
├── .github/workflows/ci.yml    # GitHub Actions automated CI/CD pipeline
├── docker-compose.yml          # Container orchestration (Mongo, Server, Client)
├── .env.example                # Global configuration environment template
├── README.md                   # Quick start & documentation index
└── PROJECT_REPORT.md           # 28-section academic PBL thesis report
```

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+
- **MongoDB** (Local instance on `localhost:27017` or free MongoDB Atlas URI)

### 2. Configure Environment Files
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fittrack_pro
JWT_SECRET=super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Database Seeding (Demo Accounts & Plans)
From the `server` directory, seed default administrators, plans, and exercises:
```bash
cd server
npm run seed
```

### 4. Running the Application
Open two terminal windows:

**Terminal 1 (Backend Server)**:
```bash
cd server
npm run dev
# Server listens at http://localhost:5000
# Health check available at http://localhost:5000/api/v1/health
```

**Terminal 2 (Frontend Client)**:
```bash
cd client
npm run dev
# Client starts at http://localhost:5173
```

---

## 🔑 Demonstration Credentials (1-Click Login Enabled)

For academic evaluation and quick testing, the login page (`/login`) includes **1-Click Demo Fast-Login Buttons**:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fittrack.com` | `Admin@FitTrack2026!` | Full Gym Administration (17 Modules, Verification, Payroll) |
| **Trainer** | `hamza.trainer@fittrack.com` | `Trainer@FitTrack2026!` | Assigned Athletes, Custom Workouts, Salary Confirmation |
| **Member** | `ali.member@fittrack.com` | `Member@FitTrack2026!` | Personal Workouts, Biometrics, Payment Proofs, Dues |

---

## 🐳 Docker Compose Deployment (Single Command)

To run the complete production stack (MongoDB 7.0 + Node Backend + Nginx Client) with a single command:

```bash
docker compose up -d --build
```
- Web Application: `http://localhost`
- Backend API: `http://localhost:5000/api/v1/health`
- MongoDB: `localhost:27017`

---

## 🧪 Automated Testing

Execute the backend test suite:
```bash
cd server
npm test
```
All 9 core security and business logic test suites run via Node's native test runner with 100% pass rates.

---

## 📖 In-Depth Documentation Links

- **[System Architecture](docs/ARCHITECTURE.md)**
- **[Database Schemas & ER Diagram](docs/DATABASE_DESIGN.md)**
- **[REST API Reference](docs/API_DOCUMENTATION.md)**
- **[User & Operations Guide](docs/USER_GUIDE.md)**
- **[Production Linux Deployment](docs/DEPLOYMENT_GUIDE.md)**
- **[QA Testing & Security Audit](docs/TESTING_REPORT.md)**
- **[Master Academic Project Report](PROJECT_REPORT.md)**
