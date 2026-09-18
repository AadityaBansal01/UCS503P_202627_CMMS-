---
title: REST API Reference
description: Complete endpoint specifications, authentication requirements, and payloads for the College Mentorship Management System (CMMS) API.
---

# 🔌 REST API Reference

The CMMS backend exposes a comprehensive RESTful API under the base prefix `/api`. All endpoints requiring authentication necessitate a valid **Bearer JWT** transmitted within the `Authorization` header.

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 📑 Complete Endpoint Catalog

| Method | Endpoint | Access Role | Description |
|:---|:---|:---|:---|
| `POST` | `/api/users` | Public | Register new user (Student, Faculty, Admin) |
| `POST` | `/api/users/login` | Public | Authenticate user credentials & return JWT |
| `GET` | `/api/users/profile` | Authenticated | Retrieve authenticated user profile |
| `GET` | `/api/students` | Admin, Faculty | List students with optional department filter |
| `GET` | `/api/students/:id` | Authenticated | Retrieve student record by ID |
| `PUT` | `/api/students/:id/focus` | Student | Update student academic focus area |
| `GET` | `/api/mentors` | Authenticated | List all active faculty mentors |
| `GET` | `/api/mentors/:id` | Authenticated | Retrieve specific mentor details |
| `GET` | `/api/mentors/:id/mentees` | Faculty, Admin | Fetch list of assigned advisees |
| `PUT` | `/api/mentors/:id/availability` | Faculty | Update available office hours |
| `GET` | `/api/meetings` | Authenticated | List user meetings (filtered by role) |
| `POST` | `/api/meetings` | Student | Book a conflict-free appointment slot |
| `GET` | `/api/meetings/:id` | Authenticated | Retrieve appointment details |
| `PUT` | `/api/meetings/:id/status` | Faculty, Student | Transition status (COMPLETED / CANCELLED) |
| `POST` | `/api/notes` | Faculty | Record post-meeting summary & action items |
| `GET` | `/api/notes/meeting/:id` | Faculty, Student | Fetch notes for a specific meeting |
| `POST` | `/api/assignments` | Admin | Allocate a mentor to an unassigned student |
| `POST` | `/api/assignments/batch` | Admin | Execute batch intra-department allocation |
| `PUT` | `/api/assignments/:id/reassign` | Admin | Reassign mentee to a new faculty mentor |
| `POST` | `/api/feedback` | Student | Submit 1–5 star rating and session review |
| `GET` | `/api/feedback/mentor/:id` | Faculty, Admin | Aggregate feedback telemetry for mentor |
| `GET` | `/api/health` | Public | System status, uptime, and DB connectivity |

---

## 🔑 Endpoint Details & Examples

### 1. User Authentication

#### Register User
```http
POST /api/users
Content-Type: application/json

{
  "name": "Aaditya Bansal",
  "email": "abansal_be24@thapar.edu",
  "password": "SecurePassword123!",
  "role": "STUDENT",
  "department": "Computer Science and Engineering"
}
```
**Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "673c2a1e8f9b4a2c1d0e5a10"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "abansal_be24@thapar.edu",
  "password": "SecurePassword123!"
}
```
**Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673c2a1e8f9b4a2c1d0e5a10",
    "name": "Aaditya Bansal",
    "role": "STUDENT",
    "department": "Computer Science and Engineering"
  }
}
```

---

### 2. Office Hour Scheduling

#### Book Appointment
```http
POST /api/meetings
Authorization: Bearer <STUDENT_JWT>
Content-Type: application/json

{
  "mentorId": "673c2b4e8f9b4a2c1d0e5b22",
  "slotDateTime": "2026-09-22T10:00:00.000Z",
  "durationMinutes": 30,
  "agenda": "Review semester 5 capstone architecture and research proposal",
  "mode": "IN_PERSON"
}
```
**Response (201 Created)**:
```json
{
  "success": true,
  "meeting": {
    "id": "673c301a8f9b4a2c1d0e5c45",
    "mentor": "673c2b4e8f9b4a2c1d0e5b22",
    "student": "673c2a1e8f9b4a2c1d0e5a10",
    "slotDateTime": "2026-09-22T10:00:00.000Z",
    "status": "SCHEDULED",
    "agenda": "Review semester 5 capstone architecture and research proposal"
  }
}
```

**Conflict Rejection (409 Conflict)**:
```json
{
  "success": false,
  "error": "Conflict: Requested slot has already been booked by another student."
}
```

---

### 3. Session Notes & Feedback

#### Submit Post-Meeting Notes
```http
POST /api/notes
Authorization: Bearer <FACULTY_JWT>
Content-Type: application/json

{
  "meetingId": "673c301a8f9b4a2c1d0e5c45",
  "content": "Discussed MERN architecture and MongoDB schema normalization. Approved prototype design.",
  "actionItems": [
    "Finalize DFD Level 2 diagrams",
    "Deploy API to test server",
    "Implement 14 automated unit tests"
  ]
}
```

#### Submit Session Rating
```http
POST /api/feedback
Authorization: Bearer <STUDENT_JWT>
Content-Type: application/json

{
  "meetingId": "673c301a8f9b4a2c1d0e5c45",
  "rating": 5,
  "comments": "Extremely constructive advising session. Received clear guidance on prototype milestones."
}
```
