const bcrypt = require("bcrypt");
const { generateRegistrationLink, generateToken } = require("../utils/authUtils");
const Staff = require("../models/staffModel");
const Company = require("../models/companyModel");
const Guest = require("../models/guestModel");
const Admin = require("../models/adminModel");

// Self-register as admin
exports.selfRegisterAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ role: "admin" });
    if (existingAdmin) {
      return res
        .status(403)
        .json({
          error: "Admin already exists. Please contact the existing admin.",
        });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    // Generate a JWT token
    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users by role
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch users from each model based on role
    const staff = await Staff.find().select("-password");
    const companies = await Company.find().select("-password");
    const guests = await Guest.find().select("-password");

    res.status(200).json({ staff, companies, guests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID and role
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const { role } = req.query; // Use a query parameter to specify role

  try {
    let user;
    if (role === "staff") {
      user = await Staff.findById(id).select("-password");
    } else if (role === "teamPool") {
      user = await Company.findById(id).select("-password");
    } else if (role === "guest") {
      user = await Guest.findById(id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new user with a specific role
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validate role
  if (!["admin", "staff", "teamPool", "guest"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    let user;
    if (role === "staff") {
      user = await Staff.findOne({ email });
    } else if (role === "teamPool") {
      user = await Company.findOne({ email });
    } else if (role === "guest") {
      user = await Guest.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "staff") {
      user = new Staff({ username, email, password: hashedPassword });
    } else if (role === "teamPool") {
      user = new Company({ username, email, password: hashedPassword });
    } else {
      user = new Guest({ username, email, password: hashedPassword });
    }

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role (only works for staff members)
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  // Validate role
  if (!["admin", "staff", "teamPool", "guest"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  try {
    const user = await Staff.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user by role
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { role } = req.query; // Use a query parameter to specify role

  try {
    let user;
    if (role === "staff") {
      user = await Staff.findByIdAndDelete(id);
    } else if (role === "teamPool") {
      user = await Company.findByIdAndDelete(id);
    } else if (role === "guest") {
      user = await Guest.findByIdAndDelete(id);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create registration link
exports.createRegistrationLink = (req, res) => {
  const { role } = req.body;

  if (!["admin", "staff", "teamPool", "guest"].includes(role)) {
    return res.status(400).json({ error: "Invalid role specified" });
  }

  const link = generateRegistrationLink(role);
  res.status(200).json({ link });
};

// Get all staff members by company ID
exports.getStaffByCompany = async (req, res) => {
  const { companyId } = req.params;

  try {
    // Find all staff members with the specified companyId
    const staffMembers = await Staff.find({ companyId }).select("-password");

    res.status(200).json(staffMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
