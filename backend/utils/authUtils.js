const jwt = require("jsonwebtoken");
const { jwtToken } = require("../config/env");

// Function to generate a JWT token for a user
exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, jwtToken, { expiresIn: "1d" });
};

// Function to generate a registration link with a predefined role
// This link can be shared with users to allow them to register with a specific role
exports.generateRegistrationLink = (role) => {
    // Ensure role is valid before generating a link
    const allowedRoles = ["admin", "staff", "teamPool", "guest"];
    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role specified for registration link");
    }

    // Generate token with role embedded in payload
    const token = jwt.sign({ role }, jwtToken, { expiresIn: "1d" });
    return `http://yourdomain.com/register?token=${token}`;
};
