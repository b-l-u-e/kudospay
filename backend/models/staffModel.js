const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "staff" },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    hederaAccountId: { type: String, required: true, unique: true },
    encryptedPrivateKey: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
