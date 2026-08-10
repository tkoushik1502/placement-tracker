const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

// Admin - Create Company
router.post(
  "/",
  protect,
  adminMiddleware,
  createCompany
);

// Authenticated users - View All Companies
router.get(
  "/",
  protect,
  getCompanies
);

// Authenticated users - View Single Company
router.get(
  "/:id",
  protect,
  getCompanyById
);

// Admin - Update Company
router.put(
  "/:id",
  protect,
  adminMiddleware,
  updateCompany
);

// Admin - Delete Company
router.delete(
  "/:id",
  protect,
  adminMiddleware,
  deleteCompany
);

module.exports = router;