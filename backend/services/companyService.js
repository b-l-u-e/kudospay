const Company = require("../models/companyModel");
const Transaction = require("../models/transactionModel");
const RecognitionNote = require("../models/recognitionModel");
const Staff = require("../models/staffModel");
const bcrypt = require("bcrypt");
const { generateHederaAccount } = require("../utils/hederaUtils");
const { AccountBalanceQuery } = require("@hashgraph/sdk");
const { client } = require("../config/client");


exports.createCompany = async (data) => {
  const { name, email, password, address } = data;
  // Ensure the email is a valid business email
  if (!email.endsWith("@company.com")) {
    throw new Error(
      "Invalid email. A valid business email (@company.com) is required."
    );
  }

  // Check if the company already exists
  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    throw new Error("Company already exists.");
  }

  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate Hedera Account ID if not provided

  const { accountId, encryptedPrivateKey, publicKey, iv } =
    await generateHederaAccount(10);

  // Create the company
  const company = new Company({
    name,
    email,
    password: hashedPassword, // Hashing should happen in the model or middleware
    address,
    hederaAccountId: accountId,
    encryptedPrivateKey,
    publicKey,
    iv,
    role: "teamPool", // Ensures the default role is teamPool
    status: "inactive", // Default status is inactive
  });

  return await company.save();
};

// Get all companies
exports.getAllCompanies = async () => {
  return await Company.find()
    .select("-password") // Exclude sensitive data (e.g., password)
    .populate({
      path: "staff", // Populate the `staff` field
      match: { status: "active" }, // Only include active staff
      select: "username hederaAccountId status", // Only return specific fields
    });
};

// Get a company by ID
exports.getCompanyById = async (companyId) => {
  const company = await Company.findById(companyId).populate(
    "staff",
    "username email status"
  );
  if (!company) {
    throw new Error("Company not found.");
  }
  return company;
};

exports.updateCompany = async (companyId, data) => {
  const updatedCompany = await Company.findByIdAndUpdate(companyId, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedCompany) {
    throw new Error("Company not found");
  }
  return updatedCompany;
};

// Update company status (active/inactive)
exports.updateCompanyStatus = async (companyId, status) => {
  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid status.");
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    { status, isActive: status === "active" },
    { new: true }
  );

  if (!updatedCompany) {
    throw new Error("Company not found.");
  }
  return updatedCompany;
};

// Get active staff for a company
exports.getActiveStaff = async (companyId) => {
  const company = await Company.findById(companyId).populate(
    "staff",
    "username email status hederaAccountId"
  );
  if (!company) {
    throw new Error("Company not found.");
  }

  // Filter active staff
  const activeStaff = company.staff.filter(
    (member) => member.status === "active"
  );
  return activeStaff;
};

exports.getActiveStaffCount = async (companyId) => {
  try {
    const count = await Staff.countDocuments({ companyId, status: "active" });
    return count;
  } catch (error) {
    throw new Error(`Failed to fetch active staff count: ${error.message}`);
  }
};

exports.getCompanyBalance = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  // Query the balance from Hedera
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(company.hederaAccountId)
    .execute(client);

  return accountBalance.hbars.toString(); // Return balance in ℏ
};

exports.getCompanyStaff = async (companyId) => {
  const company = await Company.findById(companyId).populate("staff");
  if (!company) {
    throw new Error("Company not found");
  }

  return company.staff; // Return populated staff array
};


exports.getCompanyTransactions = async (companyId) => {
  return await Transaction.find({
    $or: [{ fromAccountId: companyId }, { toAccountId: companyId }],
  }).sort({ createdAt: -1 }); // Sort by most recent transactions
};

exports.getRecognitionNotes = async (companyId) => {
  return await RecognitionNote.find({ recipientId: companyId }).sort({
    timestamp: -1,
  });
};

exports.addStaff = async (companyId, staffData) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  const newStaff = new Staff({ ...staffData, companyId });
  await newStaff.save();

  company.staff.push(newStaff._id);
  await company.save();

  return newStaff;
};

exports.updateStaff = async (staffId, staffData) => {
  const updatedStaff = await Staff.findByIdAndUpdate(staffId, staffData, {
    new: true,
  });
  if (!updatedStaff) {
    throw new Error("Staff not found");
  }

  return updatedStaff;
};

exports.deleteStaff = async (staffId) => {
  const deletedStaff = await Staff.findByIdAndDelete(staffId);
  if (!deletedStaff) {
    throw new Error("Staff not found");
  }

  return deletedStaff;
};
