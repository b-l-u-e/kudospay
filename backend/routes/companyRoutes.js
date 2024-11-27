const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", companyController.registerCompany);

router.get("/",protect, companyController.getAllCompanies);

router.get(
  "/:companyId",
  protect,
  authorize("admin", "teamPool"),
  companyController.getCompanyById
);

router.patch(
  "/:companyId",
  protect,
  authorize("admin"),
  companyController.updateCompany
);

router.patch(
  "/:companyId/activate",
  protect,
  authorize("admin"),
  companyController.activateCompany
);
router.patch(
  "/:companyId/deactivate",
  protect,
  authorize("admin"),
  companyController.deactivateCompany
);

// Get active staff for a company
router.get(
  "/:companyId/active-staff",
  protect,
  companyController.getActiveStaff
);

router.get("/:companyId/active-staff/count",protect, companyController.getActiveStaffCount);

module.exports = router;
