const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Register a staff member
router.post(
  "/register",
  staffController.registerStaff
);

// Get staff details by ID
router.get("/:staffId/details",protect,  staffController.getStaffDetails);

router.get("/", staffController.getAllStaff)

// Get staff by company
router.get(
  "/company/:companyId",
  protect,
  authorize("admin", "teamPool", "guest"),
  staffController.getStaffByCompany
);

// Update staff details
router.patch(
  "/:staffId",
  protect,
  authorize("admin", "teamPool"),
  staffController.updateStaff
);

// Delete a staff member
router.delete(
  "/:staffId",
  protect,
  authorize("admin", "teamPool"),
  staffController.deleteStaff
);

// Activate a staff member
router.patch(
  "/:staffId/activate",
  protect,
  authorize("admin", "teamPool"),
  staffController.activateStaff
);

// Deactivate a staff member
router.patch(
  "/:staffId/deactivate",
  protect,
  authorize("admin", "teamPool"),
  staffController.deactivateStaff
);

module.exports = router;
