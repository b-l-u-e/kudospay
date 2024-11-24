const express = require("express");
const router = express.Router();
const { generateHederaAccount } = require("../utils/hederaUtils");
const { protect, authorize } = require("../middleware/authMiddleware");

// Route for generating a Hedera account
router.post(
  "/generate-account",
  protect, // Protect the route (requires authentication)
  authorize("admin", "teamPool"), // Allow only admins or teamPool users to generate accounts
  async (req, res) => {
    try {
      const { initialBalance } = req.body;

      // Use the utility function to generate the Hedera account
      const accountData = await generateHederaAccount(initialBalance || 10); // Default balance is 10
      res.status(201).json({
        message: "Hedera account generated successfully",
        accountData,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
