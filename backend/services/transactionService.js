const { TransferTransaction, Hbar } = require("@hashgraph/sdk");
const { client, teamPoolClient } = require("../config/client");
const Transaction = require("../models/transactionModel");

// Send individual tip
exports.sendIndividualTip = async (guestId, staffId, amount) => {
  const transaction = await new TransferTransaction()
    .addHbarTransfer(guestId, new Hbar(-amount))
    .addHbarTransfer(staffId, new Hbar(amount))
    .execute(client);

  const receipt = await transaction.getReceipt(client);

  if (receipt.status.toString() === "SUCCESS") {
    // Save transaction to MongoDB
    const tipTransaction = new Transaction({
      fromAccountId: guestId,
      toAccountId: staffId,
      amount,
      type: "TIP_INDIVIDUAL",
      transactionId: transaction.transactionId.toString(),
      status: "SUCCESS",
    });
    await tipTransaction.save();
  } else {
    throw new Error("Failed to process individual tip transaction.");
  }

  return receipt.status;
};

// Send team tip
exports.sendTeamTip = async (guestId, teamPoolId, amount) => {
  const transaction = await new TransferTransaction()
    .addHbarTransfer(guestId, new Hbar(-amount))
    .addHbarTransfer(teamPoolId, new Hbar(amount))
    .execute(client);

  const receipt = await transaction.getReceipt(client);

  if (receipt.status.toString() === "SUCCESS") {
    // Save team tip in MongoDB
    const teamTipTransaction = new Transaction({
      fromAccountId: guestId,
      toAccountId: teamPoolId,
      amount,
      type: "TIP_TEAM",
      transactionId: transaction.transactionId.toString(),
      status: "SUCCESS",
    });
    await teamTipTransaction.save();
  } else {
    throw new Error("Failed to process team tip transaction.");
  }

  return receipt.status;
};

// Distribute team tip among members
exports.distributeTeamTip = async (teamPoolId, teamMembers, totalAmount) => {
  const uniqueTeamMembers = [...new Set(teamMembers)];
  const individualAmount = Math.floor(totalAmount / uniqueTeamMembers.length);
  const totalDistributed = individualAmount * uniqueTeamMembers.length;
  const remainder = totalAmount - totalDistributed;

  for (let i = 0; i < uniqueTeamMembers.length; i++) {
    const member = uniqueTeamMembers[i];
    let amountToTransfer = individualAmount;

    if (i === uniqueTeamMembers.length - 1) {
      amountToTransfer += remainder;
    }

    const transaction = await new TransferTransaction()
      .addHbarTransfer(teamPoolId, new Hbar(-amountToTransfer))
      .addHbarTransfer(member, new Hbar(amountToTransfer))
      .execute(teamPoolClient);

    const receipt = await transaction.getReceipt(teamPoolClient);

    if (receipt.status.toString() !== "SUCCESS") {
      throw new Error(`Failed to distribute to team member ${member}`);
    }

    // Save distribution transaction
    const distributionTransaction = new Transaction({
      fromAccountId: teamPoolId,
      toAccountId: member,
      amount: amountToTransfer,
      type: "TIP_DISTRIBUTION",
      transactionId: transaction.transactionId.toString(),
      status: "SUCCESS",
    });
    await distributionTransaction.save();
  }

  return "SUCCESS";
};

// Create a transaction
exports.createTransaction = async ({
  fromAccountId,
  toAccountId,
  amount,
  type,
  memo,
}) => {
  try {
    // Save a pending transaction in the database
    const newTransaction = new Transaction({
      fromAccountId,
      toAccountId,
      amount,
      type,
      memo,
      status: "PENDING",
    });

    await newTransaction.save();

    return {
      message: "Transaction created successfully",
      transaction: newTransaction,
    };
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

// Submit a transaction
exports.submitTransaction = async (transactionId) => {
  try {
    // Fetch the transaction from the database
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.status !== "PENDING") {
      throw new Error("Only pending transactions can be submitted");
    }

    // Execute the transaction using Hedera SDK
    const hTransaction = await new TransferTransaction()
      .addHbarTransfer(transaction.fromAccountId, new Hbar(-transaction.amount))
      .addHbarTransfer(transaction.toAccountId, new Hbar(transaction.amount))
      .execute(client);

    const receipt = await hTransaction.getReceipt(client);

    if (receipt.status.toString() === "SUCCESS") {
      // Update the transaction status in the database
      transaction.status = "SUCCESS";
      transaction.transactionId = hTransaction.transactionId.toString();
      transaction.updatedAt = new Date();
      await transaction.save();

      return {
        message: "Transaction submitted successfully",
        receipt,
        transaction,
      };
    } else {
      // If the transaction fails, update the status
      transaction.status = "FAILED";
      transaction.updatedAt = new Date();
      await transaction.save();

      throw new Error("Transaction submission failed");
    }
  } catch (error) {
    throw new Error(`Failed to submit transaction: ${error.message}`);
  }
};

// List transactions for a user
exports.listUserTransactions = async (accountId) => {
  try {
    // Fetch all transactions where the user is a sender or receiver
    const transactions = await Transaction.find({
      $or: [{ fromAccountId: accountId }, { toAccountId: accountId }],
    }).sort({ createdAt: -1 });

    return transactions;
  } catch (error) {
    throw new Error(`Failed to fetch user transactions: ${error.message}`);
  }
};

// Fetch transaction status by transactionId
exports.getTransactionStatus = async (transactionId) => {
  try {
    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return transaction;
  } catch (error) {
    throw new Error(`Failed to fetch transaction status: ${error.message}`);
  }
};
