const express = require("express");
const router = express.Router();
const recognitionController = require("../controllers/recognitionController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Route to add a recognition note
router.post(
  "/add",
  protect,
  authorize("admin", "staff", "guest"),
  recognitionController.addRecognitionNote
);

// Route to fetch recognition messages for a given topic
router.get(
  "/messages",
  recognitionController.getRecognitionMessages
);

// Route to fetch recognition messages by recipient
router.get(
  "/messages/:recipientId",
  recognitionController.getRecognitionMessagesByRecipient
);

module.exports = router;
