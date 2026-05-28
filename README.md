# Medora

A healthcare appointment booking platform for small clinics and healthcare centres.

## Overview

Medora replaces manual scheduling workflows with a structured digital appointment system featuring role-based dashboards for patients and doctors.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | JWT |
| Deploy | Vercel (frontend) + Railway (backend) |

## Monorepo Structure

```
medora/
├── apps/
│   ├── frontend/   # React + Vite
│   └── backend/    # Express.js + Prisma
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Setup

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend && npm install

# Install frontend dependencies
cd apps/frontend && npm install
```

### Environment Variables

**Backend** (`apps/backend/.env`):
```
PORT=5000
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
```

**Frontend** (`apps/frontend/.env`):
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Run Development

```bash
# Backend
cd apps/backend && npm run dev

# Frontend (new terminal)
cd apps/frontend && npm run dev
```

## Roles

- **Patient** — browse doctors, book appointments, track history
- **Doctor** — manage availability slots, approve/reject/reschedule appointments

## Appointment Status Flow

```
PENDING → APPROVED → COMPLETED
       ↘ REJECTED
```
