const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", guestController.registerGuest); // Public registration route for guests
router.get("/:guestId", protect, guestController.getGuest); // Admin-only access to view a guest
router.patch(
  "/:guestId",
  protect,
  authorize("admin"),
  guestController.updateGuest
); // Admin-only access to update a guest
router.delete(
  "/:guestId",
  protect,
  authorize("admin"),
  guestController.deleteGuest
); // Admin-only access to delete a guest



module.exports = router;
