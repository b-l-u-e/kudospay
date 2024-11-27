const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");

// Create a transaction (initialize in a pending state)
router.post("/create", protect, transactionController.createTransaction);

// Submit a transaction (execute it on Hedera network)
router.post("/submit/:transactionId", protect, transactionController.submitTransaction);

// Get transaction status by transactionId
router.get("/:transactionId/status", protect, transactionController.getTransactionStatus);

router.get("/pending", protect, transactionController.getPendingTransactions);
router.patch("/:transactionId/status",protect, transactionController.updateTransactionStatus);


// List transactions for a specific user
router.get("/user/:accountId", protect, transactionController.listUserTransactions);

// Individual tipping (guest to staff)
router.post("/tip/individual", protect, transactionController.tipIndividual);

// Team tipping (guest to team pool, then distribution to team members)
router.post("/tip/team", protect, transactionController.tipTeam);

module.exports = router;
