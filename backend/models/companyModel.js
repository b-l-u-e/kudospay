const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "teamPool" },
    address: { type: String },
    hederaAccountId: { type: String, required: true, unique: true },
    encryptedPrivateKey: { type: String, required: true },
    publicKey: { type: String, required: true },
    iv: { type: String, required: true },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    isActive: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
