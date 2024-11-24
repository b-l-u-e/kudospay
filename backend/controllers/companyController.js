const companyService = require("../services/companyService");
const { generateToken } = require("../utils/authUtils");
const { authorize } = require("../middleware/authMiddleware");

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
    res
      .status(200)
      .json({
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
  authorize("admin")
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
  authorize("admin")
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
