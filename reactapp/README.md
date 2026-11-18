# Customer Support Task Management System - Frontend (React)

A responsive, high-performance web interface built with **React**, **HTML5**, and modern **CSS3** that seamlessly integrates with the Spring Boot REST backend.

---

## Features

- **Executive Dashboard**:
  - Live KPI statistics: Total Tasks, Open Tickets, In Progress, Resolved / Closed, High Priority SLA Alerts, Active Agents.
  - Visual status distribution breakdown bar.
  - Recent task feed with one-click quick view.
  - Quick-action shortcuts for dispatching tickets and managing agents.

- **Task & Ticket Management**:
  - Dual viewing modes: **Data Table** and interactive **Kanban Board** (drag/status-grouped columns: OPEN, IN_PROGRESS, RESOLVED, CLOSED).
  - Search by task title, description, or creator name.
  - Multidimensional filtering by Status, Priority (LOW, MEDIUM, HIGH), and Creator.
  - One-click instant status updates.
  - Comprehensive Task Modal:
    - View full task description and metadata.
    - Post and read chronological task comments (`/api/comments`).
    - View full audit history timeline of status transitions (`/api/status-logs/task/{id}`).
    - Assign/reassign agent to the task (`/api/assignments`).

- **User & Agent Directory**:
  - User list with role badges (`ADMIN`, `SUPPORT_AGENT`, `CUSTOMER`, `USER`).
  - Filter users by role (`/api/users/role/{role}`).
  - Add, update, and delete users.
  - Active user switcher in navbar for simulating different team roles.

- **Dispatch & Assignments**:
  - Assign any task to a support agent (`/api/assignments`).
  - Visual workload overview cards showing the count of assigned tickets per agent.
  - Filter assignments by specific support agent.

- **Audit & Status Transition Logs**:
  - Detailed audit trail tracking every ticket status change (`/api/status-logs`).
  - Records previous status, new status, timestamp, and changing user.
  - Filter audit logs by status or specific task.

- **Dual Mode Connectivity**:
  - Automatically connects to the live Spring Boot REST API (`http://localhost:8080/api`).
  - Includes smart fallback demo mode with local storage persistence so the UI remains fully functional even when the backend is offline.

---

## Getting Started

### 1. Run the Spring Boot Backend (Port 8080)
```bash
cd springapp
mvn spring-boot:run
```

### 2. Run the React Frontend (Port 3000)
```bash
cd reactapp
npm install
npm start
```
The application will launch at `http://localhost:3000`.
