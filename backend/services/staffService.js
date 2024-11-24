const Company = require("../models/companyModel");
const Staff = require("../models/staffModel");
const bcrypt = require("bcrypt");
const { generateHederaAccount } = require("../utils/hederaUtils");

// Register a staff member
exports.createStaff = async (data) => {
  const { username, email, password, companyId } = data;

  // Ensure the company exists and is active
  const company = await Company.findOne({ _id: companyId, isActive: true });
  if (!company) {
    throw new Error("Company not found or is inactive");
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

   // Generate Hedera Account ID if not provided
   let hederaAccountId = data.hederaAccountId;
   if (!hederaAccountId) {
       const { accountId } = await generateHederaAccount(10);
       hederaAccountId = accountId;
   }

  // Create staff with hashed password and link to company
  const staff = new Staff({
    username,
    email,
    password: hashedPassword,
    companyId,
    hederaAccountId,
    isActive: false,
  });
  await staff.save();

  // Add the staff to the company's staff array
  company.staff.push(staff._id);
  await company.save();

  return staff;
};

exports.getAllStaff = async () => {
  return await Staff.find().select("-password"); // Exclude password for security
};

// Get all staff members for a specific company
exports.getStaffByCompanyId = async (companyId) => {
  return await Staff.find({ companyId }).populate("companyId", "name email");
};

// Delete a staff member
exports.deleteStaff = async (staffId) => {
  const staff = await Staff.findByIdAndDelete(staffId);
  if (!staff) {
    throw new Error("Staff member not found");
  }

  // Remove the staff member from the company's staff array
  await Company.findByIdAndUpdate(staff.companyId, {
    $pull: { staff: staff._id },
  });

  return staff;
};

// update staff details
exports.updateStaff = async (staffId, data) => {
  const { password, ...otherData } = data;

  // If there's a password update, hash the new password
  if (password) {
    const salt = await bcrypt.genSalt(10);
    otherData.password = await bcrypt.hash(password, salt);
  }

  const updatedStaff = await Staff.findByIdAndUpdate(
    staffId,
    { ...otherData },
    { new: true, runValidators: true }
  );
  if (!updatedStaff) {
    throw new Error("Staff member not found");
  }
  return updatedStaff;
};

// Update staff status (active/inactive)
exports.updateStaffStatus = async (staffId, status) => {
  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid status");
  }

  const updatedStaff = await Staff.findByIdAndUpdate(
    staffId,
    { status },
    { new: true, runValidators: true }
  );
  if (!updatedStaff) {
    throw new Error("Staff member not found");
  }
  return updatedStaff;
};
