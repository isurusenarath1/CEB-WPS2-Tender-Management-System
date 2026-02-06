# Tender Management System - Backend

Node + Express + MongoDB backend for the Tender Management System.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```

4. Seed sample data (optional):

```bash
npm run seed
```

APIs

Base: `/api`

- `POST /api/auth/register`
- `POST /api/auth/login`
- CRUD endpoints for categories, departments, staff, bidders, records, users.
