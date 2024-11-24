const express = require("express");
const router = express.Router();
const recognitionController = require("../controllers/recognitionController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Route to add a recognition note
router.post("/add", protect, authorize("admin", "staff"), recognitionController.addRecognitionNote);

module.exports = router;
