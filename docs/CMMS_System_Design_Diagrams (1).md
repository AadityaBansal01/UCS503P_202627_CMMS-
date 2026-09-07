# CMMS System Design Diagrams

This document contains the foundational system design diagrams for the **College Mentorship Management System (CMMS)**. You can use these diagrams in your final project report or presentation. 


## 1. Use-Case Diagram

This diagram maps out the primary actors (Student, Faculty Mentor, and Department Admin) and the specific actions they can perform within the system.

```mermaid
graph LR
    %% Actors
    Student((Student))
    Faculty((Faculty Mentor))
    Admin((Department Admin))

    %% System Boundary
    subgraph CMMS ["College Mentorship Management System (CMMS)"]
        %% Shared Use Cases
        UC_Auth([Login / Register])

        %% Student Use Cases
        UC_S1([Set Academic Focus])
        UC_S2([View Assigned Mentor])
        UC_S3([Book Office Hour Slot])
        UC_S4([View Meeting History & Notes])

        %% Faculty Use Cases
        UC_F1([Publish Availability / Slots])
        UC_F2([View Assigned Mentees])
        UC_F3([Approve / Reject Bookings])
        UC_F4([Add Post-Meeting Notes])

        %% Admin Use Cases
        UC_A1([View Department Mentorship Metrics])
        UC_A2([Monitor Faculty Workload])
        UC_A3([Manually Reassign Student])
    end

    %% Actor Connections to Auth
    Student --> UC_Auth
    Faculty --> UC_Auth
    Admin --> UC_Auth

    %% Student Connections
    Student --> UC_S1
    Student --> UC_S2
    Student --> UC_S3
    Student --> UC_S4

    %% Faculty Connections
    Faculty --> UC_F1
    Faculty --> UC_F2
    Faculty --> UC_F3
    Faculty --> UC_F4

    %% Admin Connections
    Admin --> UC_A1
    Admin --> UC_A2
    Admin --> UC_A3

    %% Include / Extend Relationships
    UC_S3 -.->|<<include>>| UC_Auth
    UC_F1 -.->|<<include>>| UC_Auth
```

---

## 2. Data Flow Diagrams (DFDs)

### Level 0 DFD (Context Diagram)

The Level 0 DFD shows the CMMS as a single, high-level process interacting with external entities (the users).

```mermaid
flowchart LR
    %% Entities
    Student[Student]
    Faculty[Faculty Mentor]
    Admin[Department Admin]

    %% Main System
    System(("0.0<br/>CMMS"))

    %% Student Flows
    Student -->|Profile Info, Booking Requests| System
    System -->|Mentor Details, Confirmations, Notes| Student

    %% Faculty Flows
    Faculty -->|Availability Slots, Meeting Notes| System
    System -->|Mentee List, Booking Notifications| Faculty

    %% Admin Flows
    Admin -->|Reassignment Actions, Filters| System
    System -->|Workload Stats, Engagement Reports| Admin
```

### Level 1 DFD (System Breakdown)

The Level 1 DFD breaks down the single CMMS node into the core functional modules outlined in your project proposal: Allocation, Scheduling, Meeting Logging, and Dashboards (Analytics).

```mermaid
flowchart TD
    %% Entities
    Student[Student]
    Faculty[Faculty Mentor]
    Admin[Department Admin]

    %% Processes
    P1(("1.0<br/>Mentee Allocation"))
    P2(("2.0<br/>Scheduling & Booking"))
    P3(("3.0<br/>Meeting Logging"))
    P4(("4.0<br/>Dashboards & Analytics"))

    %% Data Stores
    DB_Users[(D1: User & Profile DB)]
    DB_Sched[(D2: Scheduling DB)]
    DB_Notes[(D3: Meeting Notes DB)]
    DB_Alloc[(D4: Allocation DB)]

    %% Student Interactions
    Student -->|Focus Area Data| P1
    Student -->|Select Slot| P2
    Student -->|Read Notes| P3
    P2 -->|Confirmation| Student

    %% Faculty Interactions
    Faculty -->|Publish Slots| P2
    Faculty -->|Submit Notes| P3
    P1 -->|Assigned Mentees| Faculty

    %% Admin Interactions
    Admin -->|Reassign Student| P1
    P4 -->|Mentorship Metrics| Admin
    P4 -->|Workload Stats| Admin

    %% Internal Data Flows (Process to DB)
    P1 <-->|Read/Write Profile| DB_Users
    P1 <-->|Read/Write Assignments| DB_Alloc
    P2 <-->|Read/Write Slots & Bookings| DB_Sched
    P3 <-->|Read/Write Meeting Logs| DB_Notes
    
    %% Analytics reading from all DBs
    DB_Users --> P4
    DB_Alloc --> P4
    DB_Sched --> P4
    DB_Notes --> P4
```

### Level 2 DFD (Decomposition of "Scheduling & Booking")

This diagram zooms in on Process `2.0 Scheduling & Booking` to show the exact flow of data when a student attempts to book a mentor's office hours.

```mermaid
flowchart TD
    %% Entities
    Student[Student]
    Faculty[Faculty Mentor]

    %% Sub-Processes
    P2_1(("2.1<br/>Create Availability Slots"))
    P2_2(("2.2<br/>Fetch Available Slots"))
    P2_3(("2.3<br/>Validate Conflict-Free Booking"))
    P2_4(("2.4<br/>Generate Booking Log"))

    %% Data Store
    DB_Sched[(D2: Scheduling DB)]

    %% Faculty Flow
    Faculty -->|Date/Time Slots| P2_1
    P2_1 -->|Store Open Slots| DB_Sched

    %% Student Flow
    Student -->|Request Mentor Slots| P2_2
    DB_Sched -->|Return Open Slots| P2_2
    P2_2 -->|Display Slots| Student

    Student -->|Submit Booking Request| P2_3
    P2_3 <-->|Check for Conflicts| DB_Sched
    P2_3 -->|Valid Request| P2_4
    P2_4 -->|Save Confirmed Booking| DB_Sched

    %% Output
    P2_4 -->|Booking Confirmation| Student
    P2_4 -->|New Meeting Alert| Faculty
```
