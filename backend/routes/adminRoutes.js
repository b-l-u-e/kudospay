const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Self-register as admin (public access, allowed only if no admin exists)
router.post("/self-register", protect, authorize("admin"), adminController.selfRegisterAdmin);

// Get all users
router.get("/users", protect, authorize("admin"), adminController.getAllUsers);

// Get a specific user by ID
router.get(
  "/users/:id",
  protect,
  authorize("admin"),
  adminController.getUserById
);

// Create a new user with a specific role
router.post("/users", protect, authorize("admin"), adminController.createUser);

// Update a user's role
router.put(
  "/users/:id/role",
  protect,
  authorize("admin"),
  adminController.updateUserRole
);

// Delete a user
router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  adminController.deleteUser
);

// Generate registration links for specific roles
router.post(
  "/generate-registration-link",
  protect,
  authorize("admin"),
  adminController.createRegistrationLink
);

// Get staff members by company ID
router.get(
  "/company/:companyId/staff",
  protect,
  authorize("admin"),
  adminController.getStaffByCompany
);

module.exports = router;
