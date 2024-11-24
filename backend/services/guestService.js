const Guest = require("../models/guestModel");
const bcrypt = require("bcrypt");
const { generateHederaAccount } = require("../utils/hederaUtils");


// Create a new guest account
exports.createGuest = async (data) => {
  const { username, email, password } = data;

  // Check if the user already exists
  const existingGuest = await Guest.findOne({ email });
  if (existingGuest) {
    throw new Error("A user with this email already exists.");
  }

  // Hash the password if it exists
  let hashedPassword;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  // Generate Hedera Account ID if not provided
  let hederaAccountId = data.hederaAccountId;
  if (!hederaAccountId) {
    const { accountId } = await generateHederaAccount(10);
    hederaAccountId = accountId;
  }

  const guest = new Guest({
    username,
    email,
    password: hashedPassword,
    hederaAccountId,
  });
  return await guest.save();
};

// Retrieve guest by ID
exports.getGuestById = async (guestId) => {
  const guest = await Guest.findById(guestId).select("-password"); // Do not expose password
  if (!guest) {
    throw new Error("Guest not found");
  }
  return guest;
};

// Update guest details
exports.updateGuest = async (guestId, data) => {
  const { password, ...otherData } = data;

  // If password is being updated, hash it
  if (password) {
    const salt = await bcrypt.genSalt(10);
    otherData.password = await bcrypt.hash(password, salt);
  }

  const updatedGuest = await Guest.findByIdAndUpdate(
    guestId,
    { ...otherData },
    { new: true, runValidators: true }
  );
  if (!updatedGuest) {
    throw new Error("Guest not found");
  }
  return updatedGuest;
};

// Delete a guest by ID
exports.deleteGuest = async (guestId) => {
  const guest = await Guest.findByIdAndDelete(guestId);
  if (!guest) {
    throw new Error("Guest not found");
  }
  return guest;
};
