const companyService = require("../services/companyService");
const { generateToken } = require("../utils/authUtils");
const { authorize } = require("../middleware/authMiddleware");
const transactionService = require("../services/transactionService")
const Company = require("../models/companyModel")
// Register a new company
exports.registerCompany = async (req, res) => {
  try {
    const company = await companyService.createCompany(req.body);
    const token = generateToken(company._id);

    const {
      _id,
      name,
      email,
      hederaAccountId,
      role,
      createdAt,
      status,
      address,
      staff,
    } = company;
    res.status(201).json({
      message: "Company registered successfully",
      token,
      company: {
        _id,
        name,
        email,
        hederaAccountId,
        role,
        createdAt,
        status,
        address,
        staff,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.companyId);
    const {
      _id,
      name,
      email,
      hederaAccountId,
      role,
      createdAt,
      status,
      address,
      staff,
    } = company;
    res.status(200).json({
      company: _id,
      name,
      email,
      hederaAccountId,
      role,
      createdAt,
      status,
      address,
      staff,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update company details
exports.updateCompany = async (req, res) => {
  try {
    const updatedCompany = await companyService.updateCompany(
      req.params.companyId,
      req.body
    );
    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activate a company
exports.activateCompany = async (req, res) => {
  authorize("admin");
  try {
    const updatedCompany = await companyService.updateCompanyStatus(
      req.params.companyId,
      "active"
    );
    res.status(200).json({
      message: "Company activated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate a company
exports.deactivateCompany = async (req, res) => {
  authorize("admin");
  try {
    const updatedCompany = await companyService.updateCompanyStatus(
      req.params.companyId,
      "inactive"
    );
    res.status(200).json({
      message: "Company deactivated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active staff for a company
exports.getActiveStaff = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Validate the companyId
    if (!companyId) {
      return res.status(400).json({ error: "Company ID is required." });
    }

    // Fetch active staff using the service
    const activeStaff = await companyService.getActiveStaff(companyId);

    // Respond with the active staff data
    res.status(200).json({
      message: `Active staff for company ${companyId} retrieved successfully.`,
      activeStaff,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveStaffCount = async (req, res) => {
  const { companyId } = req.params;

  try {
    const count = await companyService.getActiveStaffCount(companyId);
    res.status(200).json({ companyId, activeStaffCount: count });
  } catch (error) {
    console.error("Error fetching active staff count:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanyBalance = async (req, res) => {
  try {
    const { companyId } = req.params;
    const balance = await companyService.getCompanyBalance(companyId);

    res.status(200).json({ balance });
  } catch (error) {
    console.error("Error fetching company balance:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanyStaff = async (req, res) => {
  try {
    const { companyId } = req.params;
    const staff = await companyService.getCompanyStaff(companyId);

    res.status(200).json({ staff });
  } catch (error) {
    console.error("Error fetching company staff:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.distributeTips = async (req, res) => {
  const { companyId } = req.params; // This is the Hedera account ID, not MongoDB _id
  const { amount } = req.body;

  try {
    // Validate input
    if (!companyId || !amount) {
      return res
        .status(400)
        .json({ error: "Company ID and amount are required for distribution." });
    }

    // Fetch company details using the Hedera account ID
    const company = await Company.findOne({ hederaAccountId: companyId });
    if (!company) {
      return res.status(404).json({ error: "Company not found." });
    }

    if (!company.hederaAccountId) {
      return res
        .status(400)
        .json({ error: "Company Hedera account is not set." });
    }

    if (company.status !== "active") {
      return res
        .status(403)
        .json({ error: "Company is not active. Cannot distribute tips." });
    }

    // console.log("Initiating tip distribution for company:", company.name);

    // Call the distributeTeamTip service with the company's Hedera Account ID
    const distributedTransactions = await transactionService.distributeTeamTip(
      company.hederaAccountId,
      amount
    );

    return res.status(200).json({
      message: "Tips distributed successfully!",
      transactions: distributedTransactions,
    });
  } catch (error) {
    console.error("Error distributing tips:", error.message);
    return res.status(500).json({ error: "Failed to distribute tips." });
  }
};



exports.getCompanyTransactions = async (req, res) => {
  try {
    const { companyId } = req.params;
    const transactions = await companyService.getCompanyTransactions(companyId);

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error fetching company transactions:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecognitionNotes = async (req, res) => {
  try {
    const { companyId } = req.params;
    const recognitionNotes = await companyService.getRecognitionNotes(
      companyId
    );

    res.status(200).json({ recognitionNotes });
  } catch (error) {
    console.error("Error fetching recognition notes:", error.message);
    res.status(500).json({ error: error.message });
  }
};



exports.addStaff = async (req, res) => {
  try {
    const { companyId } = req.params;
    const staff = await companyService.addStaff(companyId, req.body);

    res.status(201).json({ message: "Staff added successfully", staff });
  } catch (error) {
    console.error("Error adding staff:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await companyService.updateStaff(staffId, req.body);

    res.status(200).json({ message: "Staff updated successfully", staff });
  } catch (error) {
    console.error("Error updating staff:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    await companyService.deleteStaff(staffId);

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error.message);
    res.status(500).json({ error: error.message });
  }
};
