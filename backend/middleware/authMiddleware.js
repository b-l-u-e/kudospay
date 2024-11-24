const jwt = require("jsonwebtoken");
const { jwtToken } = require("../config/env");
const Staff = require("../models/staffModel");
const Company = require("../models/companyModel");
const Guest = require("../models/guestModel");
const Admin = require("../models/adminModel");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, jwtToken);

      // Look for user in Admin model
      const admin = await Admin.findById(decoded.id).select("-password");
      if (admin) {
        req.user = admin;
        req.userRole = admin.role;
        return next();
      }

      const user =
        (await Staff.findById(decoded.id).select("-password")) ||
        (await Company.findById(decoded.id).select("-password")) ||
        (await Guest.findById(decoded.id).select("-password"));

      if (!user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }

      req.user = user;
      req.userRole = user.role;
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token invalid" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

// Role-based authorization
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient privileges" });
    }
    next();
  };


module.exports = { protect, authorize };
