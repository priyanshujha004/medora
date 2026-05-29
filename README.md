# Medora — Healthcare Appointment Platform

A full-stack MVP for managing healthcare appointments between patients and doctors. Built with a modern monorepo architecture, production-grade REST API, and a clean React frontend.

**Live:** [https://healthcare-medora.vercel.app](https://healthcare-medora.vercel.app)

## Overview

Medora is a healthcare appointment scheduling system that allows patients to discover doctors, book appointments with urgency flags, and track their appointment history. Doctors can manage their availability slots, review incoming appointment requests, and approve, reject, reschedule, or complete them — with changes reflected in real time on both dashboards.

The system uses role-based access control (PATIENT / DOCTOR), JWT authentication, and a PostgreSQL database hosted on Supabase.


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v3, Axios, React Router DOM v7 |
| Backend | Node.js, Express 5 |
| ORM | Prisma v5 |
| Database | PostgreSQL via Supabase |
| Auth | JWT stored in localStorage |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |


## Features

### Authentication
- Register as Patient or Doctor with role-specific profile fields
- Speciality dropdown with 15+ options and custom "Other" entry for doctors
- JWT-based login with role-based redirect (patient → `/patient/dashboard`, doctor → `/doctor/dashboard`)
- Session persistence via localStorage — stays logged in on refresh
- Protected routes — unauthenticated users redirected to `/login`
- Role guards — patients cannot access doctor routes and vice versa
- Logout clears token and redirects to login

### Patient Features
- **Find Doctors** — browse all registered doctors in a card grid
- **Search** — filter by name or speciality via search bar
- **Sort by Fees** — sort doctors low-to-high or high-to-low
- **Filter by Speciality** — dropdown filter synced dynamically from DB
- **Doctor Detail Page** — view full profile (speciality, experience, fees, timings, clinic address)
- **Book Appointment** — select an available slot, describe the reason, flag urgency (Normal / Important / Urgent)
- **Appointment History** — tabbed view (All / Pending / Approved / Rejected / Completed) with manual refresh
- **RESCHEDULED badge** — purple badge shown when doctor has rescheduled the appointment
- **Patient Profile** — displays PAT-XXXX readable ID, age, blood group, phone, address

### Doctor Features
- **Dashboard** — appointment stats (Total / Pending / Approved / Completed) with two tabs:
  - **Pending Requests** — approve or reject incoming appointments inline
  - **Today's Appointments** — filtered to only APPROVED appointments scheduled on today's date, with Complete action
- **Appointments Page** — full table with search by patient name, urgency filter, and status tabs
- **Approve / Reject / Reschedule / Complete** — full appointment lifecycle management
- **Reschedule Modal** — pick a new available slot; old slot freed, new slot booked atomically
- **Manage Slots** — create and delete availability slots with date + time range picker
- **Doctor Profile** — view and edit speciality (dropdown), clinic address, experience, fees, age, timings; displays DOC-XXXX readable ID
- **refreshUser** — profile edits update AuthContext without requiring re-login

### Shared
- **Readable IDs** — PAT-XXXX for patients, DOC-XXXX for doctors derived from UUID prefix; shown on profiles, doctor cards, and appointment rows
- **Dynamic Speciality List** — fetched live from DB so newly registered specialities appear in filters automatically
- **RESCHEDULED status** — tracked via `isRescheduled` boolean flag on the Appointment model; displayed in Status column (not Urgency)
- **Footer** — copyright notice, brand tagline, placeholder links

---

## Database Schema

```
User
  id, name, email, password (hashed), role (PATIENT | DOCTOR), createdAt

PatientProfile           (1:1 with User, patientId = User.id)
  patientId, age, contactInfo, bloodGroup, address

DoctorProfile            (1:1 with User, doctorId = User.id)
  doctorId, age, experience, speciality, clinicAddress, fees, timings

AvailabilitySlot         (many:1 with DoctorProfile)
  id, doctorId, date, startTime, endTime, isBooked

Appointment              (many:1 with PatientProfile and DoctorProfile, 1:1 with AvailabilitySlot)
  id, patientId, doctorId, slotId, reason, urgency (NORMAL|IMPORTANT|URGENT),
  status (PENDING|APPROVED|REJECTED|COMPLETED), isRescheduled, createdAt
```
---

## Local Setup

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL database (Supabase recommended)

### 1. Clone the repository

```bash
git clone https://github.com/priyanshujha/medora.git
cd medora
```

### 2. Install backend dependencies

```bash
cd apps/backend
npm install
```

### 3. Install frontend dependencies

```bash
cd apps/frontend
npm install
```
### 4. Configure environment variables

### 5. Run Prisma migrations

```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
```

### 6. Start the development servers

```bash
# Terminal 1 — Backend
cd apps/backend
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd apps/frontend
npm run dev
# → http://localhost:5173
```
