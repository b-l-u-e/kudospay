const transactionService = require("../services/transactionService");
const mirrorNodeService = require("../services/mirrorNodeService");

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
    console.error("Error in sendIndividualTip:", error.message);

    if (error.message.includes("INSUFFICIENT_PAYER_BALANCE")) {
      // Return specific error message for insufficient balance
      return res
        .status(400)
        .json({ error: "You have insufficient HBAR balance to send the tip." });
    }

    res.status(500).json({ error: error.message });
  }
};

// Handle team tip
exports.tipTeam = async (req, res) => {
  const { guestId, teamPoolId, amount } = req.body;

  try {
    // Validate request inputs
    if (!guestId || !teamPoolId || !amount || amount <= 0) {
      console.error("Validation failed for input:", req.body);
      return res.status(400).json({
        error:
          "Invalid input: Guest ID, Team Pool ID, and a positive amount are required.",
      });
    }

    console.log("Initiating team tipping process...");
    console.log(
      `Guest ID: ${guestId}, Team Pool ID: ${teamPoolId}, Amount: ${amount}`
    );

    // Step 1: Send the tip to the team pool
    console.log("Sending tip to the team pool...");
    const tipStatus = await transactionService.sendTeamTip(
      guestId,
      teamPoolId,
      amount
    );

    console.log("Tip Status:", tipStatus);
    if (tipStatus !== "SUCCESS") {
      console.error("Failed to send team tip to the pool.");
      return res
        .status(500)
        .json({
          error: `Failed to send team tip to the pool. Hedera status: ${tipStatus}`,
        });
    }

    console.log(
      "Team tip successfully sent to the pool. Proceeding with distribution..."
    );

    // Step 2: Distribute the tip among active team members
    console.log("Calling distributeTeamTip...");
    const distributedTransactions = await transactionService.distributeTeamTip(
      teamPoolId,
      amount
    );

    console.log("Distributed Transactions:", distributedTransactions);

    res.status(200).json({
      message: "Team tip sent and distributed successfully.",
      transactions: distributedTransactions,
    });
  } catch (error) {
    console.error("Error in tipTeam controller:", error.message);
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

// Fetch PENDING transactions for admin review
exports.getPendingTransactions = async (req, res) => {
  try {
    const pendingTransactions =
      await transactionService.getPendingTransactions();
    res.status(200).json(pendingTransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve or reject a PENDING transaction (Admin)
exports.updateTransactionStatus = async (req, res) => {
  const { transactionId, status } = req.body;

  try {
    const updatedTransaction = await transactionService.updateTransactionStatus(
      transactionId,
      status
    );
    res.status(200).json({
      message: "Transaction status updated successfully",
      updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAccountDetails = async (req, res) => {
  const { accountId } = req.params;

  try {
    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required." });
    }

    const accountDetails = await mirrorNodeService.getAccountDetails(accountId);

    // Extract balance and convert to HBAR
    const tinybarBalance = accountDetails.balance.balance;
    const hbarBalance = tinybarBalance / 100_000_000;

    // Extract recent transactions
    const transactions = accountDetails.transactions.map((tx) => ({
      id: tx.transaction_id,
      type: tx.name,
      result: tx.result,
      fee: tx.charged_tx_fee,
      timestamp: tx.consensus_timestamp,
      transfers: tx.transfers, // Include transfer details
    }));

    res.status(200).json({
      message: `Account details retrieved successfully for account ID: ${accountId}`,
      accountId,
      balance: {
        hbarBalance,
        tinybarBalance,
      },
      transactions,
    });
  } catch (error) {
    console.error("Error fetching account details:", error.message);
    // Handle the case where the account does not exist or has no transactions
    if (error.response?.status === 404) {
      return res.status(200).json({
        message: `Account details retrieved successfully for account ID: ${accountId}`,
        accountId,
        balance: {
          hbarBalance: 0,
          tinybarBalance: 0,
        },
        transactions: [],
      });
    }
    res.status(500).json({ error: "Failed to fetch account details." });
  }
};
