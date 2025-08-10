Wundrsight Appointment Booking System
Overview
Wundrsight is a full-stack appointment booking app with patient and admin roles. Patients can register, login, view available slots, and book appointments. Admins can view all bookings. This project uses:

Backend: Node.js + Express + Prisma + PostgreSQL

Frontend: React (or your chosen frontend tech) deployed on Vercel

Authentication: JWT with Role-Based Access Control (RBAC)

Database: PostgreSQL (hosted separately, e.g., on Render)

Architecture Notes
Folder Structure Rationale
backend/ - Contains API code, Prisma schema, and database seed scripts

frontend/ - React app (or your chosen frontend framework)

Root contains shared configs like .gitignore, README.md

Auth + RBAC Approach
JWT tokens issued on login, signed with a secret

User roles (patient, admin) embedded in JWT payload

Middleware checks token validity and user role before granting access to protected routes

Concurrency / Atomicity for Booking
Booking slots use a unique constraint on slotId in the Booking model

Attempting to book an already booked slot results in a controlled error (SLOT_TAKEN)

This avoids race conditions and double bookings

Error Handling Strategy
Centralized error handling with meaningful HTTP status codes and JSON error messages

Catch blocks with logging for debugging

Graceful handling of invalid tokens, invalid input, and DB constraints

Setup & Running Locally
Prerequisites
Node.js (v16+ recommended)

PostgreSQL database

Git

Steps
Clone repo

bash
Copy
Edit
git clone https://github.com/Tanishq67m/wundrsight.git
cd wundrsight
Set environment variables (create .env in backend/):

ini
Copy
Edit
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret_here"
PORT=4000
Install dependencies and seed database for backend

bash
Copy
Edit
cd backend
npm install
npx prisma migrate deploy  # or prisma migrate dev if you want to create schema locally
node prisma/seed.js
Run backend

bash
Copy
Edit
npm start
Run frontend (in separate terminal)

bash
Copy
Edit
cd ../frontend
npm install
npm run dev  # or npm start depending on your frontend
API Endpoints
POST /api/register - Register new patient

POST /api/login - Login user, returns JWT

GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD - Get available slots

POST /api/book - Book a slot (patient role required)

GET /api/my-bookings - Get bookings for logged-in patient

GET /api/all-bookings - Get all bookings (admin only)

Submission Checklist
Frontend URL: [your-frontend-vercel-url]

API URL: [your-backend-render-url]

Patient: patient@example.com / Passw0rd!

Admin: admin@example.com / Passw0rd!

Repo URL: https://github.com/Tanishq67m/wundrsight

Run locally: README steps verified

Postman/curl steps included in docs/postman-collection.json (if applicable)

Security Hygiene
Passwords hashed with bcrypt

JWT secrets never logged or exposed

CORS restricted to frontend origin on production (adjust in backend index.js)

(Optional) Add rate limiting middleware to protect against brute-force attacks

Notes on Trade-offs & Next Steps
Currently, CORS allows all origins for dev convenience; restrict in production

No rate limiting implemented yet — can add express-rate-limit or similar

Testing is minimal; next step is adding unit & integration tests for API endpoints

Frontend uses simple state management; could improve with global state or React Query

Deployment scripts/configs can be automated with CI/CD pipelines
