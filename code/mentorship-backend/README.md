# Mentorship Management System — Backend

MERN backend built with Node.js, Express and MongoDB/Mongoose.

## Structure

- `src/config/` — database and application configuration
- `src/controllers/` — request/business logic
- `src/middleware/` — reusable middleware
- `src/models/` — Mongoose schemas
- `src/routes/` — API routes
- `src/utils/` — helper utilities
- `src/server.js` — application entry point

## Setup

```bash
npm install
```

Create `.env` from `.env.example` and add your MongoDB Atlas connection string.

Run development server:

```bash
npm run dev
```

Run normally:

```bash
npm start
```

Health check:

`GET http://localhost:5000/api/health`
