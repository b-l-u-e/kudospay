const {
  TransferTransaction,
  Hbar,
  PrivateKey,
  AccountBalanceQuery,
} = require("@hashgraph/sdk");
const { client, setOperator } = require("../config/client");
const Transaction = require("../models/transactionModel");
const Guest = require("../models/guestModel");
const Staff = require("../models/staffModel");
const Company = require("../models/companyModel");
const { decryptPrivateKey } = require("../utils/hederaUtils");

// helper function to fetch the encrypted private key and decrypt it
const getDecryptedPrivateKey = async (accountId) => {
  let user;

  // Find the user based on the account ID
  user =
    (await Guest.findOne({ hederaAccountId: accountId })) ||
    (await Staff.findOne({ hederaAccountId: accountId })) ||
    (await Company.findOne({ hederaAccountId: accountId }));

  if (!user || !user.encryptedPrivateKey || !user.iv) {
    throw new Error("User or private key or IV not found for account ID");
  }

  return decryptPrivateKey(user.encryptedPrivateKey, user.iv);
};

// Send individual tip
exports.sendIndividualTip = async (guestId, staffId, amount) => {
  try {
    console.log("Starting sendIndividualTip...");

    // Fetch and decrypt the guest's private key
    const guestPrivateKeyDecrypted = await getDecryptedPrivateKey(guestId);

    if (!guestPrivateKeyDecrypted) {
      throw new Error("Guest private key decryption failed");
    } else {
      console.log("Decrypted Key:", guestPrivateKeyDecrypted);
    }

    // Convert the decrypted key into a PrivateKey object
    const guestPrivateKey = PrivateKey.fromString(guestPrivateKeyDecrypted);

    console.log("PrivateKey object created.");
    setOperator(guestId, guestPrivateKey);

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
  } catch (error) {
    console.error("Error in sendIndividualTip:", error.message);
    throw new Error("Failed to send individual tip");
  }
};

// Send team tip
exports.sendTeamTip = async (guestId, teamPoolId, amount) => {
  try {
    // Validate inputs
    if (!guestId || !teamPoolId || !amount || amount <= 0) {
      throw new Error(
        "Invalid input: Guest ID, Team Pool ID, and a positive amount are required."
      );
    }

    console.log("Initiating team tip transfer...");
    // console.log(
    //   `Guest ID: ${guestId}, Team Pool ID: ${teamPoolId}, Amount: ${amount}`
    // );

    // if (!/^0\.0\.\d+$/.test(guestId)) {
    //   throw new Error(`Invalid guestId format: ${guestId}`);
    // }
    // if (!/^0\.0\.\d+$/.test(teamPoolId)) {
    //   throw new Error(`Invalid teamPoolId format: ${teamPoolId}`);
    // }
    // Fetch and decrypt the guest's private key
    const guestPrivateKeyDecrypted = await getDecryptedPrivateKey(guestId);

    // if (!guestPrivateKeyDecrypted) {
    //   throw new Error("Guest private key decryption failed");
    // } else {
    //   console.log("Decrypted Key:", guestPrivateKeyDecrypted);
    // }

    // Convert the decrypted key into a PrivateKey object
    const guestPrivateKey = PrivateKey.fromString(guestPrivateKeyDecrypted);

    console.log("PrivateKey object created.");
    setOperator(guestId, guestPrivateKey);

    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(guestId)
      .execute(client);

    console.log("Guest account HBAR balance:", accountBalance.hbars.toString());

    // Validate sufficient balance (including estimated transaction fees)
    const transactionFeeEstimate = 0.0001; // Example fee in HBAR
    const totalRequired = amount + transactionFeeEstimate;

    if (
      accountBalance.hbars.toTinybars() < Hbar.from(totalRequired).toTinybars()
    ) {
      throw new Error(
        `Insufficient balance: Guest balance is ${accountBalance.hbars.toString()}, required is ${totalRequired} HBAR.`
      );
    }

    console.log("Executing transfer...");
    const transaction = await new TransferTransaction()
      .addHbarTransfer(guestId, new Hbar(-amount))
      .addHbarTransfer(teamPoolId, new Hbar(amount))
      .execute(client);

    console.log("Transaction details:", transaction.toString());

    const receipt = await transaction.getReceipt(client);

    if (receipt.status.toString() !== "SUCCESS") {
      console.error(
        "Transaction failed with status:",
        receipt.status.toString()
      );
      throw new Error("Transaction failed.");
    }

    console.log("Saving transaction to database...");

    const teamTipTransaction = new Transaction({
      fromAccountId: guestId,
      toAccountId: teamPoolId,
      amount,
      type: "TIP_TEAM",
      transactionId: transaction.transactionId.toString(),
      status: "SUCCESS",
    });
    await teamTipTransaction.save();

    return receipt.status.toString();
  } catch (error) {
    console.error("Error in sendTeamTip:", error.message);
    throw new Error("Failed to send team tip");
  }
};

// Distribute team tip among members
exports.distributeTeamTip = async (teamPoolId, totalAmount) => {
  try {
    console.log("Starting tip distribution process for team pool:", teamPoolId);

    // Fetch and decrypt the guest's private key
    const poolPrivateKeyDecrypted = await getDecryptedPrivateKey(teamPoolId);

    if (!poolPrivateKeyDecrypted) {
      throw new Error("pool private key decryption failed");
    } else {
      console.log("Decrypted Key:", poolPrivateKeyDecrypted);
    }

    // Convert the decrypted key into a PrivateKey object
    const poolPrivateKey = PrivateKey.fromString(poolPrivateKeyDecrypted);
    setOperator(teamPoolId, poolPrivateKey);

    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(teamPoolId)
      .execute(client);

    console.log("Pool account HBAR balance:", accountBalance.hbars.toString());

    const company = await Company.findOne({ hederaAccountId: teamPoolId });
    if (!company) {
      throw new Error("Company not found for the provided team pool ID.");
    }

    console.log("Company found:", company.name);

    // Fetch active staff members dynamically
    const activeStaff = await Staff.find({
      companyId: company._id,
      status: "active",
    });

    console.log(`Active staff count: ${activeStaff.length}`);

    if (activeStaff.length === 0) {
      throw new Error("No active staff members found for distribution.");
    }

    console.log("Active staff found:", activeStaff.length);

    const invalidStaff = activeStaff.filter((staff) => !staff.hederaAccountId);
    if (invalidStaff.length > 0) {
      throw new Error(
        `Invalid staff members found without Hedera Account IDs: ${invalidStaff
          .map((s) => s.username)
          .join(", ")}`
      );
    }

    const individualAmount = Math.floor(totalAmount / activeStaff.length);
    const totalDistributed = individualAmount * activeStaff.length;
    const remainder = totalAmount - totalDistributed;
    console.log(
      `Individual amount: ${individualAmount}, Remainder: ${remainder}`
    );

    const distributedTransactions = [];

    for (let i = 0; i < activeStaff.length; i++) {
      const member = activeStaff[i];
      let amountToTransfer = individualAmount;

      if (i === activeStaff.length - 1) {
        amountToTransfer += remainder;
      }

      console.log(
        `Transferring ${amountToTransfer} HBAR to ${member.username} (${member.hederaAccountId}).`
      );

      const transaction = await new TransferTransaction()
        .addHbarTransfer(teamPoolId, new Hbar(-amountToTransfer))
        .addHbarTransfer(member.hederaAccountId, new Hbar(amountToTransfer))
        .execute(client)

      const receipt = await transaction.getReceipt(client);

      if (receipt.status.toString() !== "SUCCESS") {
        throw new Error(
          `Failed to distribute to team member ${member.username}`
        );
      }

      // Save distribution transaction
      const distributionTransaction = new Transaction({
        fromAccountId: teamPoolId,
        toAccountId: member.hederaAccountId,
        amount: amountToTransfer,
        type: "TIP_DISTRIBUTION",
        transactionId: transaction.transactionId.toString(),
        status: "SUCCESS",
      });

      await distributionTransaction.save();
      console.log("Saving transaction for:", member.username);

      distributedTransactions.push(distributionTransaction);
    }

    return distributedTransactions;
  } catch (error) {
    console.error("Error in distributeTeamTip:", error.message);
    throw new Error("Failed to distribute team tip.");
  }
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

    const senderPrivateKey = await decryptPrivateKey(transaction.fromAccountId);

    // Set the operator for the sender
    setOperator(transaction.fromAccountId, senderPrivateKey);

    // Execute the transaction using Hedera SDK
    const hTransaction = await new TransferTransaction()
      .addHbarTransfer(transaction.fromAccountId, new Hbar(-transaction.amount))
      .addHbarTransfer(transaction.toAccountId, new Hbar(transaction.amount))
      .freezeWith(client)
      .sign(senderPrivateKey);

    const receipt = await hTransaction.execute(client).getReceipt(client);

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

// Fetch PENDING transactions for admin review
exports.getPendingTransactions = async () => {
  try {
    const transactions = await Transaction.find({ status: "PENDING" });
    return transactions;
  } catch (error) {
    throw new Error(`Failed to fetch pending transactions: ${error.message}`);
  }
};

// Approve or reject a transaction
exports.updateTransactionStatus = async (transactionId, status) => {
  try {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    transaction.status = status;
    transaction.updatedAt = new Date();
    await transaction.save();

    return transaction;
  } catch (error) {
    throw new Error(`Failed to update transaction status: ${error.message}`);
  }
};
