---
title: System Requirements Specification (SRS)
description: Formal Functional and Non-Functional Requirements (SRS) for the College Mentorship Management System (CMMS).
---

# 📋 System Requirements Specification (SRS)

This document formalizes the engineering requirements for the **College Mentorship Management System (CMMS)** as specified for the **UCS503P** capstone evaluation.

---

## 🎯 Functional Requirements (FR)

### FR-1: Authentication & Identity Management
- **FR-1.1**: The system shall permit new users to register with an institutional email (`@thapar.edu`), full name, role (`STUDENT`, `FACULTY`, `ADMIN`), and academic department.
- **FR-1.2**: Passwords shall be cryptographically hashed using **bcrypt** with a minimum work factor of 10 rounds prior to database insertion.
- **FR-1.3**: Upon successful credential validation, the system shall issue a signed **JSON Web Token (JWT)** containing user ID, role, and department claims with an expiration window of 24 hours.
- **FR-1.4**: The system shall prevent duplicate registrations using the same email address, returning an explicit `HTTP 400 Bad Request`.

### FR-2: Mentor Allocation Engine
- **FR-2.1**: The system shall execute automated intra-department mentor allocation, matching students exclusively with faculty mentors belonging to the same academic department.
- **FR-2.2**: The allocation algorithm shall balance advisee counts across faculty, capping allocations at each mentor's predefined `maxCapacity`.
- **FR-2.3**: Department Administrators shall possess capabilities to execute batch allocations or perform individual manual mentee reassignments.

### FR-3: Office Hour Scheduling & Concurrency Control
- **FR-3.1**: Faculty mentors shall define and publish consultation time windows (date, start time, end time, venue/virtual link).
- **FR-3.2**: Students shall view unreserved consultation slots published by their assigned mentor and book an appointment with a stated agenda.
- **FR-3.3**: The scheduling engine shall guarantee conflict-free booking through atomic status locking, rejecting concurrent attempts to claim the same time slot with `HTTP 409 Conflict`.
- **FR-3.4**: Both student and mentor shall have capabilities to cancel an appointment up to 2 hours prior to scheduled start time, resetting slot availability.

### FR-4: Post-Meeting Logging & Action Items
- **FR-4.1**: Immediately following an appointment, the faculty mentor shall record comprehensive summary notes, discussion points, and action items.
- **FR-4.2**: Meeting notes shall be immutable once submitted, maintaining an audit trail with UTC timestamping.
- **FR-4.3**: Both mentor and the respective mentee shall retain permanent read access to chronological meeting history.

### FR-5: Session Feedback & Ratings
- **FR-5.1**: Upon completion of a meeting, the student shall be prompted to submit a quantitative rating (1 to 5 stars) and optional qualitative feedback.
- **FR-5.2**: The system shall restrict feedback submissions to one verified entry per completed meeting.

### FR-6: Departmental Analytics & Dashboards
- **FR-6.1**: The system shall provide distinct dashboard interfaces tailored to Student, Faculty Mentor, and Department Administrator personas.
- **FR-6.2**: The Admin portal shall compute and display live aggregate statistics: total active pairings, meetings conducted this term, faculty workload distribution, and department satisfaction averages.

---

## ⚡ Non-Functional Requirements (NFR)

### NFR-1: Performance & Response Latency
- The system shall respond to 95% of API requests within **200 milliseconds** under standard campus network conditions.
- Database read queries (such as roster queries and slot lookups) shall utilize indexed fields (`mentor_id`, `student_id`, `slotDateTime`) to avoid collection scans.

### NFR-2: Concurrency & Transaction Safety
- The system shall handle concurrent booking requests gracefully without data corruption, guaranteeing zero double-bookings under concurrent client load.

### NFR-3: Security & Data Privacy
- All external communication shall be enforced over **TLS/HTTPS**.
- Sensitive student academic logs and session notes shall only be accessible to the involved student, assigned mentor, and authorized department heads.
- Route-level security middleware shall block cross-role privilege escalation attempts with `HTTP 403 Forbidden`.

### NFR-4: Availability & Reliability
- The backend services and database cluster shall maintain target operational uptime of **99.5%** during the academic semester.

### NFR-5: Maintainability & Modularity
- Clean separation of concerns across Model-Route-Controller layers on the backend, and component-service patterns on the frontend.
- RESTful conventions adhered to for all resource URI paths and HTTP method verbs.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Resource / Action | Public / Guest | Student | Faculty Mentor | Dept Admin |
|:---|:---:|:---:|:---:|:---:|
| Register / Login | ✅ | ✅ | ✅ | ✅ |
| View Assigned Mentor | ❌ | ✅ | ❌ | ✅ |
| Book Office Hour Slot | ❌ | ✅ | ❌ | ❌ |
| Submit Session Feedback | ❌ | ✅ | ❌ | ❌ |
| Publish Availability Slots | ❌ | ❌ | ✅ | ❌ |
| View Advisee Roster | ❌ | ❌ | ✅ | ✅ |
| Record Meeting Notes | ❌ | ❌ | ✅ | ❌ |
| View Department Metrics | ❌ | ❌ | ❌ | ✅ |
| Trigger Batch Allocation | ❌ | ❌ | ❌ | ✅ |
| Manual Mentee Reassignment | ❌ | ❌ | ❌ | ✅ |
| System Health Check | ✅ | ✅ | ✅ | ✅ |
