const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Middleware for parsing JSON bodies
app.use(express.json());

// Enable CORS for frontend-backend communication
app.use(cors());

// Enhance security with HTTP headers
app.use(helmet());

// Log HTTP requests
app.use(morgan("dev")); 

// importing and use tipping routes
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/v1/transactions", transactionRoutes);

const recognitionRoutes = require("./routes/recognitionRoutes");
app.use("/api/v1/recognition", recognitionRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/v1/admin", adminRoutes);

const companyRoutes = require("./routes/companyRoutes");
app.use("/api/v1/companies", companyRoutes);

const guestRoutes = require("./routes/guestRoutes");
app.use("/api/v1/guests", guestRoutes);

const staffRoutes = require("./routes/staffRoutes");
app.use("/api/v1/staff", staffRoutes);

const hederaRoutes = require("./routes/hederaRoutes");
app.use("/api/v1/hedera", hederaRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

// Handle 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
