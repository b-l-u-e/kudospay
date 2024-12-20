const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  fromAccountId: {
    type: String,
    required: true, // The wallet ID of the sender (e.g., guest or team pool)
  },
  toAccountId: {
    type: String,
    required: true, // The wallet ID of the receiver (e.g., staff or team pool)
  },
  amount: {
    type: Number,
    required: true, // The transaction amount in tinybars or HBAR
    min: 1, // Minimum amount validation
    max: 10000,
  },
  type: {
    type: String,
    enum: ["TIP_INDIVIDUAL", "TIP_TEAM", "TIP_DISTRIBUTION", "OTHER"], // Transaction types
    required: true,
  },
  teamPoolId: {
    type: String,
  },
  memo: {
    type: String, // Optional memo for transaction notes
    default: "",
    maxlength: 100,
  },
  transactionId: {
    type: String, // Unique Hedera transaction ID
    unique: true,
    sparse: true, // Allows null for PENDING transactions
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING", // Default status for newly created transactions
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the timestamp for the transaction
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
