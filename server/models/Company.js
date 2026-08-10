const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
      minlength: [2, "Job role must be at least 2 characters"],
      maxlength: [100, "Job role cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        2000,
        "Description cannot exceed 2000 characters",
      ],
      default: "",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [100, "Location cannot exceed 100 characters"],
    },

    package: {
      type: Number,
      required: [true, "Package is required"],
      min: [0, "Package cannot be negative"],
    },

    eligibilityCGPA: {
      type: Number,
      required: [true, "Eligibility CGPA is required"],
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot be greater than 10"],
    },

    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);