# FitTrack Pro – Database Design & Schema Specification

## 1. Database Architecture Overview

FitTrack Pro utilizes **MongoDB** with the **Mongoose ODM**. The schema design balances relational integrity with document document-store flexibility, featuring compound unique constraints, referential indexes, and audit timestamps across all collections.

---

## 2. Mermaid Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    User ||--o{ Membership : "subscribes"
    User ||--o{ Payment : "makes"
    User ||--o{ TrainerSalary : "receives"
    User ||--o{ Attendance : "logs"
    User ||--o{ ProgressRecord : "records"
    User ||--o{ Notification : "receives"
    User ||--o{ WorkoutPlan : "trained_by / belongs_to"
    User ||--o{ WorkoutSession : "conducts / attends"
    MembershipPlan ||--o{ Membership : "defines"
    Membership ||--o{ Payment : "settled_by"
    Exercise ||--o{ WorkoutPlan : "included_in"

    User {
        ObjectId _id PK
        string name
        string email UK
        string password
        string phone
        string role "admin | trainer | member"
        string specialization
        number monthlySalary
        ObjectId assignedTrainer FK
        boolean isActive
        boolean mustChangePassword
        date createdAt
    }

    MembershipPlan {
        ObjectId _id PK
        string name UK
        string description
        number price
        number durationMonths
        string_array features
        boolean isActive
    }

    Membership {
        ObjectId _id PK
        ObjectId member FK
        ObjectId plan FK
        date startDate
        date expiryDate
        number totalAmount
        string status "pending | active | expired | cancelled"
        string paymentStatus "unpaid | partial | paid"
        ObjectId activatedBy FK
        date activatedAt
    }

    Payment {
        ObjectId _id PK
        ObjectId member FK
        ObjectId membership FK
        number amount
        string paymentMethod "bank_transfer | jazzcash | easypaisa | cash"
        string transactionReference
        string proofImage
        string receiptNumber UK
        string status "submitted | verified | rejected | refunded"
        ObjectId verifiedBy FK
        date verifiedAt
    }

    TrainerSalary {
        ObjectId _id PK
        ObjectId trainer FK
        number month
        number year
        number amount
        string paymentMethod
        string status "pending | paid_awaiting_confirmation | confirmed | disputed"
        date paidAt
        ObjectId paidBy FK
        date confirmedAt
        string disputeReason
    }

    Exercise {
        ObjectId _id PK
        string name UK
        string category "chest | back | legs | shoulders | arms | core | cardio | full_body"
        string_array targetMuscles
        string equipment
        string difficulty "beginner | intermediate | advanced"
    }

    WorkoutPlan {
        ObjectId _id PK
        ObjectId trainer FK
        ObjectId member FK
        string title
        exercise_item exercises
        string_array scheduleDays
        string status "active | completed | archived"
    }

    Attendance {
        ObjectId _id PK
        ObjectId member FK
        string dateString "YYYY-MM-DD"
        date checkIn
        date checkOut
        string status "present | absent"
    }

    ProgressRecord {
        ObjectId _id PK
        ObjectId member FK
        number weightKg
        number heightCm
        number waistCm
        number chestCm
        date recordedDate
    }

    Notification {
        ObjectId _id PK
        ObjectId recipient FK
        string title
        string message
        string type
        boolean isRead
        string dedupKey UK
    }

    ContactMessage {
        ObjectId _id PK
        string name
        string email
        string message
        string status "new | read | replied"
    }
```

---

## 3. Database Indexes & Anti-Tamper Constraints

### 3.1 Composite Unique Constraints
1. **Attendance Deduplication**:
   - Index: `{ member: 1, dateString: 1 }` with `{ unique: true }`
   - Purpose: Strictly prevents multiple turnstile check-ins for the same athlete on the same calendar day.
2. **Trainer Salary Idempotence**:
   - Index: `{ trainer: 1, month: 1, year: 1 }` with `{ unique: true }`
   - Purpose: Physically enforces that only one monthly salary record can be created for any trainer per month/year.
3. **Notification Deduplication**:
   - Index: `{ dedupKey: 1 }` with `{ unique: true, sparse: true }`
   - Purpose: Eliminates duplicate scheduled expiry reminders.
4. **Receipt Number Uniqueness**:
   - Index: `{ receiptNumber: 1 }` with `{ unique: true, sparse: true }`
   - Purpose: Guarantees every verified payment receipt is globally distinct.
