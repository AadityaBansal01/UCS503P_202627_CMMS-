---
title: Milestones, Timeline & Team
description: 12-week capstone development schedule, milestone achievements, and team role distribution for the College Mentorship Management System (CMMS).
---

# 📅 Project Milestones, Timeline & Team

The development of the College Mentorship Management System (CMMS) is executed over a structured **12-week academic timeline** divided into six strategic engineering phases.

---

## 🏆 Milestone Delivery Status

| Milestone | Phase Focus | Target Week | Deliverables & Verification | Status |
|:---:|:---|:---:|:---|:---:|
| **M1** | Problem Formulation & SRS | Week 02 | Formal proposal, stakeholder interviews, SRS documentation approved | <span class="badge-pass">Completed</span> |
| **M2** | System Architecture & Database | Week 04 | Use Cases, DFD Levels 0–2, Activity Diagram, MongoDB Schema | <span class="badge-pass">Completed</span> |
| **M3** | Core Engine & Scheduling | Week 07 | Concurrency-safe booking engine, JWT auth, intra-dept allocation | <span class="badge-pass">Completed</span> |
| **M4** | Prototype Integration Review | Week 10 | React 19 dashboards, 22 REST endpoints, 14/14 automated tests | <span class="badge-pass">Completed</span> |
| **M5** | Department Pilot Testing | Week 11 | CSE Department test run with faculty and student volunteers | <span class="badge-pill" style="color: #2563eb; background: rgba(37,99,235,0.1);">In Progress</span> |
| **M6** | Final Defense & Handover | Week 12 | Comprehensive report defense, code audit, deployment documentation | <span class="badge-pill">Scheduled</span> |

---

## 👥 Engineering Team & Division of Work

<div class="team-grid">
  <div class="team-card">
    <div class="team-avatar">AB</div>
    <div class="team-name">Aaditya Bansal</div>
    <div class="team-role">Backend & Integration Lead</div>
    <div class="team-roll">Roll No: 1024030768 · CSE</div>
    <p style="font-size: 0.85rem; color: var(--cmms-text-muted); margin-top: 0.75rem;">
      Engineered Express 5 server, JWT authentication pipeline, automated allocation service, and continuous integration.
    </p>
  </div>
  <div class="team-card">
    <div class="team-avatar">J</div>
    <div class="team-name">Jessica</div>
    <div class="team-role">Frontend UI/UX Lead</div>
    <div class="team-roll">Roll No: 1024030761 · CSE</div>
    <p style="font-size: 0.85rem; color: var(--cmms-text-muted); margin-top: 0.75rem;">
      Architected React 19 + Vite client, AuthContext session state, role-guarded portals, and responsive CSS systems.
    </p>
  </div>
  <div class="team-card">
    <div class="team-avatar">HS</div>
    <div class="team-name">Harshveer Singh</div>
    <div class="team-role">Database & Conflict Logic Lead</div>
    <div class="team-roll">Roll No: 1024030776 · CSE</div>
    <p style="font-size: 0.85rem; color: var(--cmms-text-muted); margin-top: 0.75rem;">
      Designed Mongoose schemas, compound concurrency indexes, double-booking prevention locks, and test suite scripts.
    </p>
  </div>
</div>

---

## 📖 Weekly Engineering Journals

Team members maintain chronological engineering logs documenting daily technical blockers, decisions, and commit histories:

- [**Aaditya Bansal — Weekly Progress Log (Weeks 01–06)**](../journals/1024030768-aaditya/week01-06.md)
- [**Jessica — Weekly Progress Log (Weeks 01–05)**](../journals/1024030768-jessica/week01-05.md)
- [**Harshveer Singh — Weekly Progress Log**](../journals/1024030776_harshveer.md)
