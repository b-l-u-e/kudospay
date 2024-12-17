const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", companyController.registerCompany);

router.get("/", protect, companyController.getAllCompanies);

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

router.get(
  "/:companyId/active-staff/count",
  protect,
  companyController.getActiveStaffCount
);

router.get(
  "/:companyId/balance",
  protect,
  companyController.getCompanyBalance
);

router.get(
  "/:companyId/staff",
  protect,
  companyController.getCompanyStaff
);

router.post(
  "/:companyId/distribute",
  protect,
  companyController.distributeTips
);

router.get(
  "/:companyId/transactions",
  protect,
  companyController.getCompanyTransactions
);

router.get(
  "/:companyId/recognition-notes",
  protect,
  companyController.getRecognitionNotes
);

router.post(
  "/:companyId/staff",
  protect,
  companyController.addStaff
);

router.patch(
  "/:companyId/staff",
  protect,
  companyController.updateStaff
);

router.delete(
  "/:companyId/staff",
  protect,
  companyController.deleteStaff
);

router.post("/:hederaAccountId/distribute", companyController.distributeTips);



module.exports = router;
