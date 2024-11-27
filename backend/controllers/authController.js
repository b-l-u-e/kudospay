const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/authUtils");
const { jwtToken } = require("../config/env");

// Models
const Staff = require("../models/staffModel");
const Company = require("../models/companyModel");
const Guest = require("../models/guestModel");
const adminModel = require("../models/adminModel");

// Register a user
exports.register = async (req, res) => {
  const {
    username,
    email,
    password,
    role = "guest",
    hederaAccountId,
  } = req.body;

  try {
    let user;

    if (role === "teamPool") {
      if (!email.endsWith("@company.com")) {
        return res.status(400).json({
          error: "Valid business email required for teamPool registration",
        });
      }

      const existingCompany = await Company.findOne({ $or: [{ name }, { email }] });
      if (existingCompany)
        return res.status(400).json({ error: "Company already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Company({
        username,
        email,
        password: hashedPassword,
        hederaAccountId,
      });
    } else if (role === "staff") {
      const existingStaff = await Staff.findOne({ $or: [{ username }, { email }] });
      if (existingStaff)
        return res.status(400).json({ error: "Staff member already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Staff({
        username,
        email,
        password: hashedPassword,
        hederaAccountId,
      });
    } else {
      const existingGuest = await Guest.findOne({ $or: [{ username }, { email }] });
      if (existingGuest)
        return res.status(400).json({ error: "Guest already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new Guest({
        username,
        email,
        password: hashedPassword,
        hederaAccountId,
      });
    }

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, role: user.role, status: user.status, hederaAccountId: user.hederaAccountId },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user =
      (await adminModel.findOne({ email })) ||
      (await Staff.findOne({ email })) ||
      (await Company.findOne({ email })) ||
      (await Guest.findOne({ email }));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: { username: user.username, email: user.email, role: user.role, status: user.status, hederaAccountId: user.hederaAccountId },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register using a token
exports.registerWithToken = async (req, res) => {
  const { username, email, password } = req.body;
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, jwtToken);
    const role = decoded.role;

    let user;
    if (role === "teamPool") {
      user = new Company({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });
    } else if (role === "staff") {
      user = new Staff({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });
    } else {
      user = new Guest({
        username,
        email,
        password: await bcrypt.hash(password, 10),
      });
    }

    await user.save();

    const userToken = generateToken(user._id);
    res.status(201).json({
      token: userToken,
      user: { _id: user._id, username: user.username, email, role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
