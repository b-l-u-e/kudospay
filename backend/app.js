const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");


require("dotenv").config();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the favicon.ico explicitly
app.use(
  "/favicon.ico",
  express.static(path.join(__dirname, "public/favicon.ico"))
);

// Middleware for parsing JSON bodies
app.use(express.json());

// Enable CORS for frontend-backend communication
app.use(cors({
  origin: "https://old-shoe-crashing.on-fleek.app", // Allow requests from your frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  credentials: true, // Allow cookies or authentication headers
}));

// Enhance security with HTTP headers
app.use(helmet());

// Log HTTP requests
app.use(morgan("dev"));

const transactionRoutes = require("./routes/transactionRoutes");
const recognitionRoutes = require("./routes/recognitionRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const companyRoutes = require("./routes/companyRoutes");
const guestRoutes = require("./routes/guestRoutes");
const staffRoutes = require("./routes/staffRoutes");
const hederaRoutes = require("./routes/hederaRoutes");

app.use("/api/v1/transactions", transactionRoutes);

app.use("/api/v1/recognition", recognitionRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/companies", companyRoutes);

app.use("/api/v1/guests", guestRoutes);

app.use("/api/v1/staff", staffRoutes);

app.use("/api/v1/hedera", hederaRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running...",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
