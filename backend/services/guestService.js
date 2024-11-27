const Guest = require("../models/guestModel");
const bcrypt = require("bcrypt");
const { generateHederaAccount } = require("../utils/hederaUtils");

// Create a new guest account
exports.createGuest = async (data) => {
  const { username, email, password } = data;

  try {
    // Check if the user already exists
    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
      throw new Error("A user with this email already exists.");
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Hedera account
    const { accountId, encryptedPrivateKey, publicKey, iv } =
      await generateHederaAccount(10);

    // Create the guest object
    const guest = new Guest({
      username,
      email,
      password: hashedPassword,
      hederaAccountId: accountId,
      encryptedPrivateKey, // Save encrypted key
      publicKey,
      iv, // Save IV
    });

    // Save the guest to the database
    return await guest.save();
  } catch (error) {
    console.log("Error creating guest: ", error.message);
    throw new Error("Failed to create guest account.");
  }
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
