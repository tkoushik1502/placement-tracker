const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // =========================
    // STUDENT PROFILE
    // =========================

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    college: {
      type: String,
      trim: true,
      maxlength: [150, "College name cannot exceed 150 characters"],
      default: "",
    },

    branch: {
      type: String,
      trim: true,
      maxlength: [100, "Branch cannot exceed 100 characters"],
      default: "",
    },

    cgpa: {
      type: Number,
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot be greater than 10"],
      default: 0,
    },

    graduationYear: {
      type: Number,
      min: [2000, "Invalid graduation year"],
      max: [2100, "Invalid graduation year"],
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);