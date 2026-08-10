const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Test Route
router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected Profile Route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

module.exports = router;