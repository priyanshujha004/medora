# Medora Backend

Express.js REST API with Prisma ORM and Supabase PostgreSQL.

## Setup

```bash
npm install
cp .env.example .env   # fill in values
npm run db:generate
npm run db:migrate
npm run dev
```

## API Base

`http://localhost:5000/api`

## Routes

| Prefix | Description |
|---|---|
| `/api/auth` | Register, Login |
| `/api/doctors` | Doctor listing, profile |
| `/api/slots` | Availability slot management |
| `/api/appointments` | Booking and workflow |
