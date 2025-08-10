// --- Global error logging ---
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

// Load environment variables from .env
dotenv.config();

// Check required env vars
if (!process.env.JWT_SECRET) {
  console.error("⚠️  Missing JWT_SECRET in .env");
  process.exit(1);
}
if (!process.env.PORT) {
  console.error("⚠️  Missing PORT in .env");
  process.exit(1);
}

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Auth Middleware to protect routes by roles
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient rights" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

// Public Routes
app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

app.post("/api/register", async (req, res) => {
  console.log("➡️ Register hit:", req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashed, role: "patient" },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: "Email already in use" });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("➡️ Login hit:", req.body);
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Protected Routes

app.get("/api/slots", async (req, res) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    if (isNaN(from) || isNaN(to)) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const slots = await prisma.slot.findMany({
      where: { startAt: { gte: from, lte: to } },
      include: { booking: true },
    });

    const available = slots.filter((s) => !s.booking);
    res.json(available);
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ error: "Failed to fetch slots" });
  }
});

app.post("/api/book", authMiddleware(["patient"]), async (req, res) => {
  const { slotId } = req.body;

  if (!slotId) {
    return res.status(400).json({ error: "slotId is required" });
  }

  try {
    const booking = await prisma.booking.create({
      data: { userId: req.user.id, slotId },
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(400).json({ error: { code: "SLOT_TAKEN", message: "Slot already booked or invalid" } });
  }
});

app.get("/api/my-bookings", authMiddleware(["patient"]), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { slot: true },
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching my bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.get("/api/all-bookings", authMiddleware(["admin"]), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { slot: true, user: true },
    });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Start server with error handling
try {
  const server = app.listen(process.env.PORT, () => {
    console.log(`🚀 API running on port ${process.env.PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
  });
} catch (err) {
  console.error("Error starting server:", err);
}
