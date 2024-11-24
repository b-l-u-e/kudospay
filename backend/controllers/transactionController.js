const transactionService = require("../services/transactionService");
const Transaction = require("../models/transactionModel");
// Handle individual tip
exports.tipIndividual = async (req, res) => {
  const { guestId, staffId, amount } = req.body;

  try {
    const status = await transactionService.sendIndividualTip(
      guestId,
      staffId,
      amount
    );
    res.status(200).json({ message: "Tip sent successfully", status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle team tip
exports.tipTeam = async (req, res) => {
  const { guestId, teamPoolId, amount, teamMembers } = req.body;

  try {
    // Send tip to team pool
    const status = await transactionService.sendTeamTip(
      guestId,
      teamPoolId,
      amount
    );

    if (status === "SUCCESS") {
      // Distribute tip among team members
      await transactionService.distributeTeamTip(
        teamPoolId,
        teamMembers,
        amount
      );
      res
        .status(200)
        .json({ message: "Team tip sent and distributed successfully" });
    } else {
      res.status(500).json({ error: "Failed to send team tip" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch transaction status
exports.getTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await transactionService.getTransactionStatus(
      transactionId
    );
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a transaction
exports.createTransaction = async (req, res) => {
  const { fromAccountId, toAccountId, amount, type, memo } = req.body;

  try {
    const result = await transactionService.createTransaction({
      fromAccountId,
      toAccountId,
      amount,
      type,
      memo,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit a transaction
exports.submitTransaction = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const result = await transactionService.submitTransaction(transactionId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List user transactions
exports.listUserTransactions = async (req, res) => {
  const { accountId } = req.params;

  try {
    const transactions = await transactionService.listUserTransactions(
      accountId
    );

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
