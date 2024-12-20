const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "guest", immutable: true },
    hederaAccountId: { type: String, required: true, unique: true },
    encryptedPrivateKey: { type: String, required: true },
    iv: { type: String, required: true },
    publicKey: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Guest", guestSchema);
