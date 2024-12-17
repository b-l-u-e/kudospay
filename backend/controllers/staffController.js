const staffService = require("../services/staffService");
const { authorize } = require("../middleware/authMiddleware");

exports.registerStaff = async (req, res) => {
  try {
    const staff = await staffService.createStaff(req.body);
    res
      .status(201)
      .json({ message: "Staff member registered successfully", staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await staffService.getAllStaff();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getStaffByCompany = async (req, res) => {
  try {
    const staffMembers = await staffService.getStaffByCompanyId(
      req.params.companyId
    );
    res.status(200).json(staffMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const staff = await staffService.deleteStaff(req.params.staffId);
    res
      .status(200)
      .json({ message: "Staff member deleted successfully", staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const updatedStaff = await staffService.updateStaff(
      req.params.staffId,
      req.body
    );
    res.status(200).json({
      message: "Staff member updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Activate a staff member
exports.activateStaff = async (req, res) => {
  authorize("admin", "teamPool")
  try {
    const updatedStaff = await staffService.updateStaffStatus(
      req.params.staffId,
      "active"
    );
    res
      .status(200)
      .json({
        message: "Staff member activated successfully",
        staff: updatedStaff,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deactivate a staff member
exports.deactivateStaff = async (req, res) => {
  authorize("admin", "teamPool")
  try {
    const updatedStaff = await staffService.updateStaffStatus(
      req.params.staffId,
      "inactive"
    );
    res
      .status(200)
      .json({
        message: "Staff member deactivated successfully",
        staff: updatedStaff,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStaffDetails = async (req, res) => {
  const { staffId } = req.params;

  try {
    if (!staffId) {
      return res.status(400).json({ error: "Staff ID is required." });
    }

    const staffDetails = await staffService.getStaffDetails(staffId);

    res.status(200).json({
      message: "Staff details retrieved successfully",
      staff: staffDetails,
    });
  } catch (error) {
    console.error("Error in staffController.getStaffDetails:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch staff details" });
  }
};
