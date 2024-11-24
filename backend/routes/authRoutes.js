const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Route for registration with token
router.post("/registerWithToken", authController.registerWithToken);

module.exports = router;
