const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  applyCompany,
  getMyApplications,
  getApplicationById,
  getAllApplications,
  getStudentApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

// ====================
// STUDENT ROUTES
// ====================

// Apply for a company
router.post(
  "/apply",
  protect,
  applyCompany
);

// Get logged-in student's applications
router.get(
  "/my-applications",
  protect,
  getMyApplications
);

// ====================
// ADMIN ROUTES
// ====================

// IMPORTANT:
// Keep specific routes BEFORE /:id

// Get all applications
router.get(
  "/all",
  protect,
  adminMiddleware,
  getAllApplications
);

// Get applications of a specific student
router.get(
  "/student/:studentId",
  protect,
  adminMiddleware,
  getStudentApplications
);

// Update application status
router.put(
  "/:id/status",
  protect,
  adminMiddleware,
  updateApplicationStatus
);

// ====================
// SINGLE APPLICATION
// ====================

// This MUST come after /all
router.get(
  "/:id",
  protect,
  getApplicationById
);

module.exports = router;