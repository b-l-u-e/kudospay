const guestService = require("../services/guestService");
const { generateToken } = require("../utils/authUtils");

exports.registerGuest = async (req, res) => {
    try {
        const guest = await guestService.createGuest(req.body);
        // Generate a JWT token for the registered guest
        const token = generateToken(guest._id);

        // Exclude sensitive fields like password in the response
        const { _id, username, email, hederaAccountId, role, createdAt } = guest;

        res.status(201).json({
            message: "Guest registered successfully",
            token,
            guest: { _id, username, email, hederaAccountId, role, createdAt },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGuest = async (req, res) => {
    try {
        const guest = await guestService.getGuestById(req.params.guestId);

        // Exclude sensitive fields like password in the response
        const { _id, username, email, hederaAccountId, role, createdAt } = guest;

        res.status(200).json({ _id, username, email, hederaAccountId, role, createdAt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGuest = async (req, res) => {
    try {
        const updatedGuest = await guestService.updateGuest(req.params.guestId, req.body);

        // Exclude sensitive fields like password in the response
        const { _id, username, email, hederaAccountId, role, updatedAt } = updatedGuest;

        res.status(200).json({
            message: "Guest updated successfully",
            guest: { _id, username, email, hederaAccountId, role, updatedAt },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGuest = async (req, res) => {
    try {
        const deletedGuest = await guestService.deleteGuest(req.params.guestId);

        // Exclude sensitive fields like password in the response
        const { _id, username, email, hederaAccountId, role } = deletedGuest;

        res.status(200).json({
            message: "Guest deleted successfully",
            guest: { _id, username, email, hederaAccountId, role },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
