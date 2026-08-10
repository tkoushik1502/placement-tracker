const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getStudents,
  getStudentById,
} = require("../controllers/studentController");

// Admin - Get all students
router.get(
  "/",
  protect,
  adminMiddleware,
  getStudents
);

// Admin - Get single student
router.get(
  "/:id",
  protect,
  adminMiddleware,
  getStudentById
);

module.exports = router;