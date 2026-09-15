# College Mentorship Management System (CMMS)

A full-stack MERN platform that replaces informal email/office-hours mentorship coordination with automated mentor allocation, conflict-free scheduling, meeting logging, and role-based dashboards for Students, Faculty, and Department Admins.

**Course:** UCS503P — Software Engineering Project, TIET Patiala
**Status:** Prototype Delivered (Week 10) · Pilot Testing (Week 11) · Final Defense (Week 12)

---

## 🚀 Features

- **Automated Mentor Allocation** — Matches students to faculty mentors by department/focus area (100% intra-department accuracy).
- **Conflict-Free Scheduling** — Faculty publish office-hour slots; server-side concurrency checks block double-booking.
- **Meeting Logging** — Immutable, timestamped notes and post-session feedback (1–5 star ratings).
- **Role-Based Dashboards** — Separate portals for Student, Faculty, and Department Admin, with live metrics.
- **Admin Reassignment Tools** — Manual mentee reassignment with workload visibility.
- **Secure Auth** — JWT-based sessions with bcrypt password hashing and role-guarded routes.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Context API |
| Backend | Node.js, Express 5, JWT, bcrypt |
| Database | MongoDB Atlas, Mongoose ODM |

---

## 👥 Team

| Name | Role | Roll No. |
|---|---|---|
| Aaditya Bansal | Backend & System Integration Lead | 1024030768 |
| Jessica | Frontend UI/UX Lead | 1024030761 |
| Harshveer Singh | Database & Conflict Logic Lead | 1024030776 |

**Supervisor:** Jeelani Asif

---

## 📁 Project Structure

```
cmms/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/   # Student, Faculty, Admin portals
│   │   ├── components/
│   │   └── context/ # AuthContext
├── server/          # Express backend
│   ├── models/      # User, Student, Mentor, Meeting, Note, Assignment, Feedback
│   ├── routes/
│   ├── controllers/
│   └── middleware/
└── docs/            # Gantt chart, prototype report, diagrams
```

---

## ⚙️ Setup

```bash
# Clone
git clone https://github.com/<org>/cmms.git
cd cmms

# Backend
cd server
npm install
npm run dev

# Frontend
cd ../client
npm install
npm run dev
```

Create a `.env` in `/server` with:
```
MONGO_URI=<your MongoDB Atlas URI>
JWT_SECRET=<your secret>
PORT=5000
```

---

## 🔌 API Overview

Base URL: `/api`

| Route | Auth | Purpose |
|---|---|---|
| `POST /users` | Public | Register |
| `POST /users/login` | Public | Login, returns JWT |
| `GET /mentors/:id/mentees` | Faculty | View advisee roster |
| `PUT /mentors/:id/availability` | Faculty | Publish office hours |
| `POST /meetings` | Student | Book conflict-free slot |
| `PUT /meetings/:id/notes` | Faculty | Add meeting notes |
| `POST /assignments` | Admin | Allocate mentor to student |
| `PUT /assignments/:id/reassign` | Admin | Reassign mentee |
| `POST /feedback` | Student | Submit session rating |

Full endpoint catalog (22 routes) is in `docs/Prototype_Report.pdf`.

---

## 📊 Project Timeline

12-week schedule across 6 phases (Planning → Auth & Allocation → Scheduling → Dashboards → Pilot → Final Defense). See [`docs/Gantt_Chart.pdf`](./docs/CMMS_Gantt_Chart.pdf) for the full breakdown and milestone tracker (M1–M6).

- ✅ M1 — Architecture & SRS Approved
- ✅ M2 — Allocation Engine Verified 
- ✅ M3 — Conflict-Free Scheduling 
- ✅ M4 — Prototype Review Complete 
- 🔄 M5 — Department Pilot 
- ⏳ M6 — Final Defense & Delivery 

---

## 🧪 Testing

14/14 functional test cases passing — covering auth, RBAC, allocation, booking, concurrency, notes, feedback, and dashboards. Details in `docs/Prototype_Report.pdf`, Section 9.

---

## 📄 Documentation

- [Prototype Stage Report](./docs/CMMS_Prototype_Report.pdf) — full architecture, DFDs, ER diagram, schema, API spec, test results.
- [Gantt Chart](./docs/CMMS_Gantt_Chart.pdf) — 12-week schedule and WBS.

---

## 🗺️ Roadmap (Final Release)

- SMTP email/SMS notifications
- Google Calendar / Outlook sync
- Automated workload-balancing heuristic (currently manual)

---

## 📜 License

Academic project — TIET CSE Department, UCS503P, 2026–27.
