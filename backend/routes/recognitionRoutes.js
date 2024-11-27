const express = require("express");
const router = express.Router();
const recognitionController = require("../controllers/recognitionController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Route to add a recognition note
router.post("/add", protect, authorize("admin", "staff", "guest"), recognitionController.addRecognitionNote);

//  Route to get recognition notes
router.get("/:staffId", protect, authorize("admin", "staff", "teamPool"), recognitionController.getRecognitionNotes)

module.exports = router;
