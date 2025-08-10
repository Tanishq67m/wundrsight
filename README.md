Wundrsight Appointment Booking System
Overview
Wundrsight is a full-stack appointment booking application designed for patients and admins. Patients can register, login, browse available appointment slots, and book them. Admins have access to all bookings.

Tech Stack
Backend: Node.js, Express, Prisma, PostgreSQL

Frontend: React (or your chosen frontend framework)

Auth: JWT-based with Role-Based Access Control (RBAC)

Database: PostgreSQL

Architecture Notes
Folder Structure Rationale
/backend — API code, Prisma schema, database seeds

/frontend — Frontend app code

Root contains shared configuration and documentation files

Authentication & RBAC
JWT tokens issued at login with user role embedded (patient or admin)

Middleware verifies JWT token and restricts access based on role

Booking Concurrency & Atomicity
Unique constraint on slotId in the Booking model to prevent double booking

Booking attempts on already booked slots return a clear error response

Error Handling
Centralized error responses with appropriate HTTP status codes

Logging for debugging errors like invalid tokens or booking conflicts

Getting Started — Running Locally
Prerequisites
Node.js (v16+)

PostgreSQL database

Git

Setup Instructions
Clone the repository

bash
Copy
Edit
git clone https://github.com/Tanishq67m/wundrsight.git
cd wundrsight
Setup environment variables for backend (create .env in /backend)

ini
Copy
Edit
DATABASE_URL="postgresql://neondb_owner:npg_2kjOu6XeTPbZ@ep-winter-rice-ad89h7ap-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET=R2xwF6f1T2k9o5F2s9dFJf1aUhzxw9o0tueA43q0hs
PORT=5001
Install backend dependencies, migrate database, and seed slots

bash
Copy
Edit
cd backend
npm install
npx prisma migrate deploy
node prisma/seed.js
npm start
In a separate terminal, setup and run frontend

bash
Copy
Edit
cd ../frontend
npm install
npm run dev
API Endpoints
Method	Endpoint	Description	Auth Required	Role
POST	/api/register	Register new user	No	-
POST	/api/login	Login and receive JWT	No	-
GET	/api/slots	Get available slots (filter by date range)	No	-
POST	/api/book	Book a slot	Yes	patient
GET	/api/my-bookings	Get bookings for logged-in user	Yes	patient
GET	/api/all-bookings	Get all bookings (admin only)	Yes	admin

Security Measures
Passwords hashed using bcrypt

JWT secrets never logged or exposed

CORS configured (adjust origin in backend for production)

Unique slot bookings prevent race conditions

Submission Checklist
Frontend URL: [wundrsight-ten.vercel.app](https://wundrsight-7bjn.vercel.app/)

API URL: https://wundrsight.onrender.com/

Patient: tan1@123.com / 123!

Admin: admin@example.com / Passw0rd!

Repo URL: https://github.com/Tanishq67m/wundrsight

Verified local setup instructions in README

Postman/cURL scripts for API calls included in /docs (optional)

Next Steps & Trade-offs
Add rate limiting middleware to prevent brute-force login attempts

Expand backend test coverage with unit and integration tests

Refine frontend state management and add user feedback on actions

Improve CORS configuration to only allow trusted origins in production


### Screenshots

![Screenshot 1](public/Screenshot%202025-08-10%20at%206.09.18%20PM.png)
![Screenshot 2](frontend/public/Screenshot%202025-08-10%20at%206.10.15%20PM.png)
![Screenshot 3](frontend/public/Screenshot%202025-08-10%20at%206.10.22%20PM.png)
![Screenshot 4](frontend/public/Screenshot%202025-08-10%20at%206.10.41%20PM.png)
